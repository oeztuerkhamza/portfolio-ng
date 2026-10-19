import { Injectable, NgZone, inject, signal } from '@angular/core';
import { MusicId } from './invite.model';

/**
 * Hintergrundmusik der Einladungen.
 *
 * Die Stücke werden im Browser erzeugt (Web Audio) statt als MP3
 * ausgeliefert: keine Lizenzfrage, kein Megabyte-Download, und jedes Stück
 * spielt endlos, ohne hörbare Schleife. Wer ein eigenes Lied will, hinterlegt
 * eine MP3-Adresse — die spielt dann ein <audio>-Element.
 *
 * Browser erlauben Ton erst nach einer Berührung. Darum startet die Musik
 * mit dem Öffnen des Umschlags, nie von selbst.
 */

interface Style {
  bpm: number;
  /** Akkorde als MIDI-Noten, ein Akkord pro Takt. */
  chords: number[][];
  /** Tonleiter für die Melodie (MIDI). */
  scale: number[];
  voice: 'piano' | 'pad' | 'pluck' | 'keys' | 'bell';
  pattern: 'arp' | 'pad' | 'pick' | 'comp' | 'drift' | 'taqsim';
  drums?: 'soft' | 'frame';
  melody: number; // Wahrscheinlichkeit einer Melodienote je Achtel
}

const C = (root: number, ...iv: number[]) => [root, ...iv.map((i) => root + i)];

const STYLES: Record<Exclude<MusicId, 'none'>, Style> = {
  // F – C – Dm – B♭: das Pachelbel-nahe Hochzeitsmuster.
  piano: {
    bpm: 72,
    chords: [C(53, 7, 12, 16), C(48, 7, 12, 16), C(50, 7, 12, 15), C(46, 7, 12, 16)],
    scale: [65, 67, 69, 70, 72, 74, 76, 77],
    voice: 'piano',
    pattern: 'arp',
    melody: 0.35,
  },
  strings: {
    bpm: 60,
    chords: [C(50, 7, 12, 15), C(46, 7, 12, 16), C(53, 7, 12, 16), C(48, 7, 12, 16)],
    scale: [62, 64, 65, 67, 69, 70, 72, 74],
    voice: 'pad',
    pattern: 'pad',
    melody: 0.25,
  },
  // D-Hicaz: D E♭ F♯ G A B♭ C D.
  oud: {
    bpm: 96,
    chords: [[50, 57], [50, 57], [55, 62], [50, 57]],
    scale: [62, 63, 66, 67, 69, 70, 72, 74],
    voice: 'pluck',
    pattern: 'taqsim',
    drums: 'frame',
    melody: 0.6,
  },
  // G – D – Em – C, gezupft.
  guitar: {
    bpm: 84,
    chords: [C(43, 7, 12, 16, 19), C(50, 7, 12, 16), C(52, 7, 12, 15), C(48, 7, 12, 16)],
    scale: [67, 69, 71, 74, 76, 79],
    voice: 'pluck',
    pattern: 'pick',
    melody: 0.2,
  },
  // Dm7 – G7 – Cmaj7 – Am7.
  lounge: {
    bpm: 92,
    chords: [C(50, 3, 7, 10), C(43, 4, 7, 10), C(48, 4, 7, 11), C(45, 3, 7, 10)],
    scale: [69, 71, 72, 74, 76, 77, 79],
    voice: 'keys',
    pattern: 'comp',
    drums: 'soft',
    melody: 0.3,
  },
  ambient: {
    bpm: 50,
    chords: [C(48, 7, 14, 16), C(45, 7, 12, 15), C(41, 7, 14, 16), C(43, 7, 14, 17)],
    scale: [72, 74, 76, 79, 81, 84],
    voice: 'bell',
    pattern: 'drift',
    melody: 0.3,
  },
};

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

@Injectable({ providedIn: 'root' })
export class MusicService {
  private readonly zone = inject(NgZone);

  readonly playing = signal(false);
  readonly current = signal<MusicId | 'custom'>('none');

  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private audio: HTMLAudioElement | null = null;
  private step = 0;
  private nextTime = 0;
  private style: Style | null = null;
  private lastMelody = 0;
  private readonly plucks = new Map<number, AudioBuffer>();
  private noise: AudioBuffer | null = null;

  /** Startet die Musik (nach einer Benutzeraktion aufrufen). */
  play(id: MusicId, url?: string): void {
    this.stop(false);
    if (url) return this.playUrl(url);
    if (id === 'none') return;
    const style = STYLES[id];
    if (!style || typeof window === 'undefined') return;
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;

    this.ctx ??= new AC();
    void this.ctx.resume();
    this.ensureGraph();
    this.style = style;
    this.step = 0;
    this.nextTime = this.ctx.currentTime + 0.15;
    this.master!.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master!.gain.setValueAtTime(0, this.ctx.currentTime);
    this.master!.gain.linearRampToValueAtTime(0.32, this.ctx.currentTime + 2.5);

    // Außerhalb der Zone: der Takt soll keine Änderungserkennung auslösen.
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => this.schedule(), 60);
    });
    this.current.set(id);
    this.playing.set(true);
  }

  stop(fade = true): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    if (this.ctx && this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(this.master.gain.value, t);
      this.master.gain.linearRampToValueAtTime(0, t + (fade ? 0.8 : 0.05));
    }
    this.playing.set(false);
  }

  toggle(id: MusicId, url?: string): void {
    if (this.playing()) this.stop();
    else this.play(id, url);
  }

  private playUrl(url: string): void {
    const a = new Audio(url);
    a.loop = true;
    a.volume = 0.5;
    a.play().then(
      () => {
        this.audio = a;
        this.current.set('custom');
        this.playing.set(true);
      },
      () => this.playing.set(false),
    );
  }

  private ensureGraph(): void {
    const ctx = this.ctx!;
    if (this.master) return;
    this.master = ctx.createGain();
    this.master.gain.value = 0;

    // Etwas Raum: Echo mit Tiefpass im Rückweg, dazu ein sanfter Kompressor.
    this.bus = ctx.createGain();
    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.33;
    const fb = ctx.createGain();
    fb.gain.value = 0.32;
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 2400;
    const wet = ctx.createGain();
    wet.gain.value = 0.28;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;

    this.bus.connect(comp);
    this.bus.connect(delay);
    delay.connect(tone);
    tone.connect(fb);
    fb.connect(delay);
    tone.connect(wet);
    wet.connect(comp);
    comp.connect(this.master);
    this.master.connect(ctx.destination);
  }

  /** Plant die Noten der nächsten ~200 ms (Vorausschau gegen Aussetzer). */
  private schedule(): void {
    const ctx = this.ctx;
    const s = this.style;
    if (!ctx || !s) return;
    const eighth = 60 / s.bpm / 2;
    while (this.nextTime < ctx.currentTime + 0.2) {
      this.playStep(s, this.step, this.nextTime, eighth);
      this.nextTime += eighth;
      this.step++;
    }
  }

  private playStep(s: Style, step: number, t: number, eighth: number): void {
    const pos = step % 8; // Achtel im Takt
    const chord = s.chords[Math.floor(step / 8) % s.chords.length];
    const rnd = Math.random();

    switch (s.pattern) {
      case 'arp': {
        const order = [0, 1, 2, 3, 2, 1, 2, 3];
        if (pos === 0) this.note(s.voice, chord[0] - 12, t, eighth * 8, 0.45);
        this.note(s.voice, chord[order[pos] % chord.length], t, eighth * 3, 0.28);
        break;
      }
      case 'pad':
        if (pos === 0) chord.forEach((n) => this.note('pad', n, t, eighth * 8.5, 0.16));
        break;
      case 'pick': {
        const order = [0, 2, 1, 3, 0, 2, 4, 3];
        this.note('pluck', chord[order[pos] % chord.length], t, eighth * 4, pos === 0 ? 0.55 : 0.35);
        break;
      }
      case 'comp':
        if (pos === 0 || pos === 3 || pos === 6) chord.slice(1).forEach((n) => this.note('keys', n + 12, t, eighth * 2.5, 0.14));
        if (pos === 0 || pos === 4) this.note('keys', chord[0], t, eighth * 4, 0.3);
        break;
      case 'drift':
        if (pos === 0 && (step / 8) % 2 === 0) chord.forEach((n) => this.note('pad', n, t, eighth * 16, 0.1));
        break;
      case 'taqsim':
        if (pos === 0 || pos === 4) this.note('pluck', chord[0], t, eighth * 4, 0.45);
        break;
    }

    // Melodie: Zufallsweg in kleinen Schritten über die Tonleiter.
    if (rnd < s.melody && (s.pattern !== 'pad' || pos % 2 === 0)) {
      const move = Math.round((Math.random() - 0.5) * 3);
      this.lastMelody = Math.max(0, Math.min(s.scale.length - 1, this.lastMelody + move));
      const voice = s.voice === 'pad' ? 'piano' : s.voice;
      this.note(voice, s.scale[this.lastMelody], t, eighth * (s.pattern === 'taqsim' ? 1.5 : 3), 0.22);
    }

    if (s.drums === 'frame') {
      // Darbuka-artig: Dum auf 1 und 4, Tek dazwischen.
      if (pos === 0 || pos === 3) this.drum(t, 'dum');
      else if (pos === 5 || pos === 6 || (pos === 7 && rnd < 0.4)) this.drum(t, 'tek');
    } else if (s.drums === 'soft') {
      if (pos === 0 || pos === 4) this.drum(t, 'kick');
      if (pos % 2 === 1) this.drum(t, 'hat');
    }
  }

  private note(voice: Style['voice'], midi: number, t: number, dur: number, vel: number): void {
    const ctx = this.ctx!;
    const out = ctx.createGain();
    out.connect(this.bus!);
    const f = hz(midi);

    if (voice === 'pluck') {
      const src = ctx.createBufferSource();
      src.buffer = this.pluck(midi);
      src.connect(out);
      out.gain.value = vel;
      src.start(t);
      src.stop(t + Math.min(3, dur + 1.2));
      return;
    }

    const g = out.gain;
    const attack = voice === 'pad' ? Math.min(1.2, dur / 3) : voice === 'bell' ? 0.01 : 0.008;
    const release = voice === 'pad' ? dur : voice === 'bell' ? 3 : dur * 1.6;
    g.setValueAtTime(0, t);
    g.linearRampToValueAtTime(vel, t + attack);
    if (voice === 'pad') {
      g.setValueAtTime(vel, t + dur - 0.6);
      g.linearRampToValueAtTime(0.0001, t + dur + 0.6);
    } else {
      g.exponentialRampToValueAtTime(0.0001, t + attack + release);
    }

    const parts: [OscillatorType, number, number][] =
      voice === 'piano'
        ? [['triangle', 1, 1], ['sine', 2, 0.35], ['sine', 3, 0.12]]
        : voice === 'pad'
          ? [['sawtooth', 1, 0.5], ['sawtooth', 1.004, 0.5], ['sine', 0.5, 0.4]]
          : voice === 'keys'
            ? [['sine', 1, 1], ['sine', 2, 0.25], ['triangle', 4, 0.05]]
            : [['sine', 1, 1], ['sine', 2.76, 0.25], ['sine', 5.4, 0.08]];

    let target: AudioNode = out;
    if (voice === 'pad') {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1100;
      lp.connect(out);
      target = lp;
    }
    const end = t + attack + release + 0.7;
    for (const [type, mult, amp] of parts) {
      const o = ctx.createOscillator();
      const a = ctx.createGain();
      o.type = type;
      o.frequency.value = f * mult;
      a.gain.value = amp * (voice === 'pad' ? 0.35 : 0.6);
      o.connect(a);
      a.connect(target);
      o.start(t);
      o.stop(end);
    }
  }

  /** Gezupfte Saite nach Karplus-Strong, einmal je Ton berechnet. */
  private pluck(midi: number): AudioBuffer {
    const hit = this.plucks.get(midi);
    if (hit) return hit;
    const ctx = this.ctx!;
    const sr = ctx.sampleRate;
    const len = Math.floor(sr * 2.5);
    const buf = ctx.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    const period = Math.max(2, Math.round(sr / hz(midi)));
    for (let i = 0; i < period; i++) d[i] = Math.random() * 2 - 1;
    const decay = 0.996;
    // Jeder Wert ist der gedämpfte Mittelwert der zwei Werte eine Periode früher.
    for (let i = period; i < len; i++) d[i] = decay * 0.5 * (d[i - period] + d[i - period + 1]);
    this.plucks.set(midi, buf);
    return buf;
  }

  private drum(t: number, kind: 'dum' | 'tek' | 'kick' | 'hat'): void {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.connect(this.bus!);
    if (kind === 'dum' || kind === 'kick') {
      const o = ctx.createOscillator();
      o.frequency.setValueAtTime(kind === 'dum' ? 110 : 90, t);
      o.frequency.exponentialRampToValueAtTime(45, t + 0.25);
      g.gain.setValueAtTime(kind === 'dum' ? 0.5 : 0.35, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.4);
      return;
    }
    if (!this.noise) {
      this.noise = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const hp = ctx.createBiquadFilter();
    hp.type = kind === 'hat' ? 'highpass' : 'bandpass';
    hp.frequency.value = kind === 'hat' ? 7000 : 2500;
    src.connect(hp);
    hp.connect(g);
    const v = kind === 'hat' ? 0.05 : 0.18;
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (kind === 'hat' ? 0.05 : 0.09));
    src.start(t);
    src.stop(t + 0.12);
  }
}
