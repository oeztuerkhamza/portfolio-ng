/**
 * Was auf einer eigenen NFC-Karte steht — die Sicht des Browsers.
 *
 * Die Felder sind dieselben wie in src/server/cards.ts, bewusst noch einmal
 * aufgeschrieben statt importiert: der Browser darf nichts aus src/server
 * ziehen (dort hängen Datenbank und Node dran). Wer hier ein Feld ergänzt,
 * muss es auch dort ergänzen — sonst wirft `cardData` es wieder weg, und der
 * Kunde sieht in der Vorschau nicht, was er eingegeben hat.
 *
 * Geprüft wird ausschließlich auf dem Server. Was hier steht, ist Entwurf:
 * unfertig, zu lang, mit halb getippter Adresse — alles erlaubt, solange der
 * Kunde noch tippt.
 */

export const CARD_KINDS = ['business', 'gift'] as const;
export type CardKind = (typeof CARD_KINDS)[number];

export const CARD_THEMES = ['brand', 'dark', 'warm'] as const;
export type CardTheme = (typeof CARD_THEMES)[number];

/** Netzwerke, die der Server kennt (NETWORKS in src/server/cards.ts). */
export const CARD_NETWORKS = [
  'instagram',
  'facebook',
  'linkedin',
  'x',
  'tiktok',
  'youtube',
  'whatsapp',
  'spotify',
  'google',
  'web',
] as const;
export type CardNetwork = (typeof CARD_NETWORKS)[number];

export interface CardLinkDraft {
  /** Netzwerk oder '' für einen freien Link. */
  net: CardNetwork | '';
  label: string;
  url: string;
}

export interface BusinessCardDraft {
  /** Pflichtfeld: ohne Firmennamen zeichnet der Server keine Vorschau. */
  company: string;
  tagline: string;
  logoUrl: string;
  avatarUrl: string;
  phone: string;
  email: string;
  web: string;
  address: string;
  links: CardLinkDraft[];
  /** Kontaktbogen auf der Karte — muss ausdrücklich gewollt sein. */
  leads: boolean;
}

export interface GiftCardDraft {
  /** Pflichtfeld: ohne Überschrift zeichnet der Server keine Vorschau. */
  headline: string;
  to: string;
  from: string;
  message: string;
  photos: string[];
  songUrl: string;
  songLabel: string;
}

/** Ein Entwurf je Art, mit seinem Farbschema. */
export interface CardDraft {
  theme: CardTheme;
  business: BusinessCardDraft;
  gift: GiftCardDraft;
}

/** Grenzen des Servers — hier nur, damit der Bogen sie vorher anzeigt. */
export const MAX_LINKS = 8;
export const MAX_PHOTOS = 8;

/** Längen wie in `cardData`; der Bogen bremst, statt später zu kürzen. */
export const CARD_LIMITS = {
  company: 120,
  tagline: 160,
  phone: 40,
  email: 200,
  address: 200,
  url: 1000,
  linkLabel: 60,
  headline: 120,
  name: 80,
  message: 1200,
  songLabel: 120,
} as const;

export const emptyBusiness = (): BusinessCardDraft => ({
  company: '',
  tagline: '',
  logoUrl: '',
  avatarUrl: '',
  phone: '',
  email: '',
  web: '',
  address: '',
  links: [],
  leads: false,
});

export const emptyGift = (): GiftCardDraft => ({
  headline: '',
  to: '',
  from: '',
  message: '',
  photos: [],
  songUrl: '',
  songLabel: '',
});

export const emptyDraft = (): CardDraft => ({
  theme: 'brand',
  business: emptyBusiness(),
  gift: emptyGift(),
});

/**
 * Was der Server als `data` erwartet: leere Felder weg, damit die Vorschau
 * nicht an einer leeren Zeichenkette hängen bleibt, wo eine Adresse stehen
 * müsste. Gekürzt und geprüft wird trotzdem erst dort.
 */
export function cardPayload(kind: CardKind, draft: CardDraft): Record<string, unknown> {
  const keep = (o: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v !== false && v !== undefined));

  if (kind === 'business') {
    const b = draft.business;
    return keep({
      company: b.company.trim(),
      tagline: b.tagline.trim(),
      logoUrl: b.logoUrl.trim(),
      avatarUrl: b.avatarUrl.trim(),
      phone: b.phone.trim(),
      email: b.email.trim(),
      web: b.web.trim(),
      address: b.address.trim(),
      leads: b.leads,
      // Eine Zeile ohne Adresse ist eine leere Zeile im Bogen, kein Link.
      links: b.links
        .filter((l) => l.url.trim())
        .slice(0, MAX_LINKS)
        .map((l) => keep({ net: l.net, label: l.label.trim(), url: l.url.trim() })),
    });
  }

  const g = draft.gift;
  return keep({
    headline: g.headline.trim(),
    to: g.to.trim(),
    from: g.from.trim(),
    message: g.message.trim(),
    songUrl: g.songUrl.trim(),
    songLabel: g.songLabel.trim(),
    photos: g.photos.map((p) => p.trim()).filter(Boolean).slice(0, MAX_PHOTOS),
  });
}

/**
 * Das eine Feld, ohne das `cardData` auf dem Server `null` zurückgibt. Solange
 * es leer ist, hat die Vorschau nichts zu zeigen — dann zeigt der Bogen einen
 * Hinweis, statt eine Anfrage loszuschicken, die nur 422 zurückbringt.
 */
export const REQUIRED_FIELD: Record<CardKind, 'company' | 'headline'> = {
  business: 'company',
  gift: 'headline',
};

/** Reicht der Entwurf für eine Vorschau? */
export const draftReady = (kind: CardKind, draft: CardDraft): boolean =>
  kind === 'business' ? !!draft.business.company.trim() : !!draft.gift.headline.trim();

/** Dasselbe, aber am fertigen `data` — was die Vorschau in der Hand hat. */
export const payloadReady = (kind: CardKind, data: Record<string, unknown>): boolean => {
  const v = data[REQUIRED_FIELD[kind]];
  return typeof v === 'string' && v.trim() !== '';
};
