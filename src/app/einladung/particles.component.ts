import { Component, DestroyRef, ElementRef, NgZone, PLATFORM_ID, afterNextRender, effect, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  rot: number;
  vr: number;
  phase: number;
  alpha: number;
}

/**
 * Schwebende Blütenblätter oder Goldfunken im Kopf der Einladung.
 *
 * Ein einziges <canvas>, gezeichnet außerhalb der Angular-Zone, angehalten,
 * sobald der Kopf aus dem Bild ist oder der Tab im Hintergrund liegt. Bei
 * „Bewegung reduzieren" bleibt das Canvas leer.
 */
@Component({
  selector: 'app-particles',
  standalone: true,
  template: '<canvas aria-hidden="true"></canvas>',
  styles: `
    :host { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
    canvas { width: 100%; height: 100%; display: block; }
  `,
})
export class ParticlesComponent {
  readonly kind = input<'petals' | 'sparkle' | 'none'>('none');
  readonly color = input('#d6b46a');
  readonly color2 = input('#ffffff');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private particles: Particle[] = [];
  private frame = 0;
  private running = false;
  private visible = true;
  private ctx: CanvasRenderingContext2D | null = null;
  private w = 0;
  private h = 0;

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const canvas = this.host.nativeElement.querySelector('canvas')!;
      this.ctx = canvas.getContext('2d');
      const resize = () => {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        this.w = this.host.nativeElement.clientWidth;
        this.h = this.host.nativeElement.clientHeight;
        canvas.width = this.w * dpr;
        canvas.height = this.h * dpr;
        this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      const io = new IntersectionObserver(([e]) => {
        this.visible = e.isIntersecting;
        this.toggle();
      });
      io.observe(this.host.nativeElement);
      const onVis = () => this.toggle();
      document.addEventListener('visibilitychange', onVis);
      window.addEventListener('resize', resize);
      destroyRef.onDestroy(() => {
        io.disconnect();
        document.removeEventListener('visibilitychange', onVis);
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(this.frame);
      });
      this.seed();
      this.toggle();
    });

    // Gestaltung gewechselt: neue Teilchen, gleiche Leinwand.
    effect(() => {
      this.kind();
      if (this.ctx) {
        this.seed();
        this.toggle();
      }
    });
  }

  private seed(): void {
    const n = this.kind() === 'none' ? 0 : this.w < 600 ? 18 : 34;
    this.particles = Array.from({ length: n }, () => this.make(true));
    if (!n) this.ctx?.clearRect(0, 0, this.w, this.h);
  }

  private make(anywhere: boolean): Particle {
    const petal = this.kind() === 'petals';
    return {
      x: Math.random() * this.w,
      y: anywhere ? Math.random() * this.h : -20,
      r: petal ? 5 + Math.random() * 6 : 0.8 + Math.random() * 2.2,
      vy: petal ? 0.35 + Math.random() * 0.55 : 0.12 + Math.random() * 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.02,
      phase: Math.random() * Math.PI * 2,
      alpha: petal ? 0.45 + Math.random() * 0.4 : 0.4 + Math.random() * 0.6,
    };
  }

  private toggle(): void {
    const should = this.visible && !document.hidden && this.particles.length > 0;
    if (should && !this.running) {
      this.running = true;
      this.zone.runOutsideAngular(() => (this.frame = requestAnimationFrame(() => this.tick())));
    } else if (!should && this.running) {
      this.running = false;
      cancelAnimationFrame(this.frame);
    }
  }

  private tick(): void {
    if (!this.running || !this.ctx) return;
    const ctx = this.ctx;
    const petal = this.kind() === 'petals';
    ctx.clearRect(0, 0, this.w, this.h);
    const t = performance.now() / 1000;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.y += p.vy;
      p.x += p.vx + Math.sin(t + p.phase) * (petal ? 0.4 : 0.15);
      p.rot += p.vr;
      if (p.y > this.h + 20 || p.x < -30 || p.x > this.w + 30) this.particles[i] = this.make(false);
      ctx.save();
      ctx.translate(p.x, p.y);
      if (petal) {
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = i % 3 === 0 ? this.color2() : this.color();
        ctx.beginPath();
        // Blütenblatt: zwei Bögen, leicht gekippt
        ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const twinkle = 0.5 + 0.5 * Math.sin(t * 2 + p.phase);
        ctx.globalAlpha = p.alpha * twinkle;
        ctx.fillStyle = i % 4 === 0 ? this.color2() : this.color();
        ctx.shadowColor = this.color();
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.r > 2) {
          // Kleiner Stern für die größeren Funken
          ctx.globalAlpha *= 0.6;
          ctx.fillRect(-p.r * 2.4, -0.4, p.r * 4.8, 0.8);
          ctx.fillRect(-0.4, -p.r * 2.4, 0.8, p.r * 4.8);
        }
      }
      ctx.restore();
    }
    this.frame = requestAnimationFrame(() => this.tick());
  }
}
