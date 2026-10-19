import { Ornament } from './invite-themes';

/**
 * Trennornamente der Gestaltungen (240 × 40, Linien in currentColor).
 * Statische Konstanten — sie dürfen deshalb als HTML eingesetzt werden.
 */
const DIVIDERS: Record<Ornament, string> = {
  flourish:
    '<path d="M8 20h52c14 0 18-10 30-10 9 0 13 6 13 10s-4 6-8 6-6-3-6-6"/><path d="M232 20h-52c-14 0-18-10-30-10-9 0-13 6-13 10s4 6 8 6 6-3 6-6"/><path d="M120 11l7 9-7 9-7-9z" fill="currentColor" stroke="none"/>',
  leaves:
    '<path d="M20 22c40-4 80-6 200 0"/><path d="M60 21c4-9 13-12 22-11-3 8-12 12-22 11zM100 20c4-9 13-12 22-11-3 8-12 12-22 11zM140 20c-4-9-13-12-22-11 3 8 12 12 22 11zM180 21c-4-9-13-12-22-11 3 8 12 12 22 11z" fill="currentColor" fill-opacity=".25"/><path d="M80 21c3 7 10 10 18 9M160 21c-3 7-10 10-18 9"/>',
  line: '<path d="M30 20h80M130 20h80"/><circle cx="120" cy="20" r="3"/>',
  tulip:
    '<path d="M20 20h70M150 20h70"/><circle cx="100" cy="20" r="2" fill="currentColor"/><circle cx="140" cy="20" r="2" fill="currentColor"/><path d="M120 34V22"/><path d="M120 22c-9-3-12-11-9-18 3 3 6 5 9 5s6-2 9-5c3 7 0 15-9 18z" fill="currentColor" fill-opacity=".3"/><path d="M120 30c-5-1-9-4-11-8M120 30c5-1 9-4 11-8"/>',
  star:
    '<path d="M20 20h78M142 20h78"/><path d="M120 8l3.5 8.5L132 20l-8.5 3.5L120 32l-3.5-8.5L108 20l8.5-3.5z" fill="currentColor" fill-opacity=".35"/><rect x="113" y="13" width="14" height="14" transform="rotate(45 120 20)"/><rect x="111" y="11" width="18" height="18"/>',
  blossom:
    '<path d="M24 20h70M146 20h70"/><g fill="currentColor" fill-opacity=".3"><circle cx="120" cy="13" r="5"/><circle cx="127" cy="18" r="5"/><circle cx="124" cy="26" r="5"/><circle cx="116" cy="26" r="5"/><circle cx="113" cy="18" r="5"/></g><circle cx="120" cy="20" r="2.5" fill="currentColor"/><circle cx="100" cy="20" r="2.5"/><circle cx="140" cy="20" r="2.5"/>',
  twine:
    '<path d="M14 20c8-5 12 5 20 0s12 5 20 0 12 5 20 0 12 5 20 0 12 5 20 0M126 20c8-5 12 5 20 0s12 5 20 0 12 5 20 0 12 5 20 0 12 5 20 0"/><path d="M120 20c-10-10-18-6-14 0 4 6 14 0 14 0zm0 0c10-10 18-6 14 0-4 6-14 0-14 0zm0 0l-6 12m6-12l6 12"/>',
  waves: '<path d="M10 16c12-8 24 8 36 0s24 8 36 0 24 8 36 0 24 8 36 0 24 8 36 0 24 8 36 0"/><path d="M28 26c12-8 24 8 36 0s24 8 36 0 24 8 36 0 24 8 36 0 24 8 36 0" opacity=".5"/>',
  deco:
    '<path d="M20 20h70M150 20h70M30 25h60M150 25h60"/><path d="M120 34L100 14M120 34l-10-22M120 34V10M120 34l10-22M120 34l20-20"/><path d="M98 34h44"/>',
  grid: '<path d="M40 20h60M140 20h60"/><rect x="112" y="12" width="16" height="16" rx="3"/><rect x="117" y="17" width="6" height="6" fill="currentColor"/>',
};

export function dividerSvg(o: Ornament): string {
  return (
    '<svg viewBox="0 0 240 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    DIVIDERS[o] +
    '</svg>'
  );
}

/** Kleine Symbole im Ablauf. */
export const SCHEDULE_ICONS: Record<string, string> = {
  ring: '<circle cx="12" cy="14" r="6"/><path d="M9 5l3-2 3 2-3 3z"/>',
  glass: '<path d="M7 3h10l-1 7a4 4 0 0 1-8 0zM12 14v6M8.5 20.5h7"/>',
  dinner: '<path d="M6 3v7a2 2 0 0 0 2 2v9M10 3v7a2 2 0 0 1-2 2M8 3v6"/><path d="M17 21V3c-2 1-3 4-3 8h3"/>',
  music: '<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2.2"/><circle cx="17" cy="16" r="2.2"/>',
  camera: '<path d="M4 8h3l1.6-2.5h6.8L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',
  cake: '<path d="M4 20h16v-7H4zM4 15c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 4 0M12 13V9M12 6.5a1.5 1.5 0 0 0 0-3"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
  henna: '<path d="M8 21v-7l-2-5a1.5 1.5 0 0 1 2.6-1.4L10 10V4.5a1.5 1.5 0 0 1 3 0V10V3.5a1.5 1.5 0 0 1 3 0V11l1-2a1.5 1.5 0 0 1 2.6 1.4L17 16v5"/><circle cx="12.5" cy="15" r="1.2"/>',
  coffee: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16"/>',
};

export function scheduleIcon(name: string | undefined): string {
  return (
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    (SCHEDULE_ICONS[name ?? 'heart'] ?? SCHEDULE_ICONS['heart']) +
    '</svg>'
  );
}
