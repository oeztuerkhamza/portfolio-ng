import { InviteEvent, InviteLocation } from './invite.model';

/** Routen-Links: ein Tipp öffnet die Navigation zur Adresse. */
export function mapsLinks(loc: InviteLocation): { google: string; apple: string; waze: string } {
  const q = encodeURIComponent(`${loc.name}, ${loc.address}`);
  const ll = loc.lat != null && loc.lng != null ? `${loc.lat},${loc.lng}` : null;
  return {
    google: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
    apple: `https://maps.apple.com/?daddr=${q}${ll ? `&ll=${ll}` : ''}`,
    waze: ll ? `https://waze.com/ul?ll=${ll}&navigate=yes` : `https://waze.com/ul?q=${q}&navigate=yes`,
  };
}

/** Kalenderzeit in UTC ohne Trennzeichen: 20270612T120000Z */
function calStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Dauer, die wir annehmen, weil eine Einladung selten ein Ende nennt. */
const DEFAULT_HOURS = 8;

export function googleCalendarUrl(e: InviteEvent, title: string, details: string): string {
  const start = new Date(e.date);
  const end = new Date(start.getTime() + DEFAULT_HOURS * 36e5);
  const loc = e.locations[0];
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${calStamp(start)}/${calStamp(end)}`,
    details,
    location: loc ? `${loc.name}, ${loc.address}` : '',
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

/** .ics-Datei für Apple-Kalender, Outlook und alle anderen. */
export function icsFile(e: InviteEvent, title: string, details: string, url: string): string {
  const start = new Date(e.date);
  const end = new Date(start.getTime() + DEFAULT_HOURS * 36e5);
  const loc = e.locations[0];
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (m) => `\\${m}`);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Breisgau Digital//Digitale Einladung//DE',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${e.slug}@breisgau-digital.de`,
    `DTSTAMP:${calStamp(new Date())}`,
    `DTSTART:${calStamp(start)}`,
    `DTEND:${calStamp(end)}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(details)}`,
    loc ? `LOCATION:${esc(`${loc.name}, ${loc.address}`)}` : '',
    `URL:${url}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}

export function download(name: string, content: string | Blob, type = 'text/plain'): void {
  const blob = typeof content === 'string' ? new Blob([content], { type }) : content;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Ältere Browser oder ohne HTTPS: über ein unsichtbares Textfeld.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

/** Telefonnummer für tel: und wa.me. */
export function phoneDigits(phone: string): string {
  return phone.replace(/[^\d+]/g, '').replace(/^00/, '+');
}

export function whatsappLink(phone: string, text = ''): string {
  const n = phoneDigits(phone).replace(/^\+/, '');
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

/** Fügt die Schriftdatei der Einladungen einmal in den <head> ein. */
export function ensureInviteFonts(doc: Document): void {
  if (doc.head.querySelector('link[data-invite-fonts]')) return;
  const link = doc.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', '/invite-fonts.css');
  link.setAttribute('data-invite-fonts', '');
  doc.head.appendChild(link);
}
