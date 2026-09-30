import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CUSTOM_CARDS, type CustomCardProduct, customCard } from '../../core/data/cards.data';
import {
  CARD_NETWORKS,
  CARD_THEMES,
  CARD_LIMITS,
  MAX_LINKS,
  MAX_PHOTOS,
  type CardNetwork,
} from '../../core/cards/card-draft.model';
import { CardDraftService } from '../../core/cards/card-draft.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { SeoService } from '../../core/seo/seo.service';
import { CartService, MAX_QTY } from '../../core/shop/cart.service';
import { ShopStatus } from '../../core/shop/shop-status.service';
import { CardPreviewComponent } from '../../shared/card-preview/card-preview.component';
import { CardPrintComponent } from '../../shared/card-print/card-print.component';
import { ImageFieldComponent } from '../../shared/image-field/image-field.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { SHOP_CONTENT } from '../shop/shop.content';
import { PRODUCT_CONTENT } from '../produkt/produkt.content';
import { CARDS_CONTENT } from '../karten/karten.content';
import { CARD_DESIGNER_CONTENT } from './karte-gestalten.content';

/**
 * Der Kartengestalter: /karte-gestalten/digitale-visitenkarte und
 * /karte-gestalten/geschenkkarte.
 *
 * Bis hierher war die Reihenfolge: bestellen, bezahlen, warten, per E-Mail
 * Inhalte nachreichen, die fertige Karte zum ersten Mal sehen. Wer nicht
 * wusste, was ihn erwartet, bestellte lieber nicht. Hier ist es umgekehrt —
 * der Kunde sieht seine Karte, bevor er bezahlt, und was er eingegeben hat,
 * fährt mit der Bestellung mit (`cardDesigns` in /api/checkout).
 *
 * Nichts an diesem Bogen prüft: ein halb getippter Entwurf ist nicht falsch,
 * sondern halb fertig. Geprüft wird auf dem Server (`cardData`), und die
 * Vorschau zeigt, was davon übrig bleibt — das ist die ehrlichere Rückmeldung
 * als eine rote Zeile unter einem Feld.
 *
 * Welche Art gemeint ist, sagt `data.slug` der Route — dieselbe Regelung wie
 * bei den zwei Produktseiten (KartenComponent).
 */
@Component({
  selector: 'app-karte-gestalten',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent, CardPreviewComponent, CardPrintComponent, ImageFieldComponent],
  styleUrl: './karte-gestalten.component.scss',
  template: `
    @let p = product();
    @let d = drafts.draft();

    <header class="page-hero">
      <div class="container">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a [routerLink]="'/' | localize">{{ i18n.t('nav.home') }}</a>
          <span class="sep" aria-hidden="true">/</span>
          <a [routerLink]="('/' + p.slug) | localize">{{ i18n.t('shop.card.' + p.id) }}</a>
          <span class="sep" aria-hidden="true">/</span>
          <span aria-current="page">{{ i18n.t('cg.label') }}</span>
        </nav>

        <p class="section-label">{{ i18n.t('cg.label') }}</p>
        <h1 class="section-title">{{ i18n.t('cg.' + p.id + '.title') }}</h1>
        <p class="section-subtitle cg-intro">{{ i18n.t('cg.intro') }}</p>
      </div>
    </header>

    <section class="section section-white">
      <div class="container cg-grid">
        <!-- ── Bogen ─────────────────────────────────────── -->
        <form class="cg-form" (submit)="$event.preventDefault()">
          <fieldset class="card cg-block">
            <legend class="cg-legend">{{ i18n.t('cg.sec.look') }}</legend>
            <div class="cg-themes" role="group" [attr.aria-label]="i18n.t('cg.sec.look')">
              @for (t of themes; track t) {
                <button
                  type="button"
                  class="cg-theme"
                  [class.is-on]="d.theme === t"
                  [attr.aria-pressed]="d.theme === t"
                  (click)="drafts.setTheme(t)"
                >
                  <span class="cg-swatch" [attr.data-theme]="t" aria-hidden="true"></span>
                  {{ i18n.t('cg.theme.' + t) }}
                </button>
              }
            </div>
          </fieldset>

          @if (p.id === 'business') {
            <fieldset class="card cg-block">
              <legend class="cg-legend">{{ i18n.t('cg.sec.basics') }}</legend>

              <label class="cg-field">
                <span class="cg-label">{{ i18n.t('cg.f.company') }} *</span>
                <input
                  type="text"
                  [value]="d.business.company"
                  [attr.maxlength]="limits.company"
                  autocomplete="organization"
                  required
                  (input)="drafts.setBusiness('company', value($event))"
                />
              </label>

              <label class="cg-field">
                <span class="cg-label">{{ i18n.t('cg.f.tagline') }}</span>
                <input
                  type="text"
                  [value]="d.business.tagline"
                  [attr.maxlength]="limits.tagline"
                  (input)="drafts.setBusiness('tagline', value($event))"
                />
              </label>

              <app-image-field
                [label]="i18n.t('cg.f.logo')"
                [url]="d.business.logoUrl"
                (urlChange)="drafts.setBusiness('logoUrl', $event)"
              />

              <app-image-field
                [label]="i18n.t('cg.f.avatar')"
                [url]="d.business.avatarUrl"
                (urlChange)="drafts.setBusiness('avatarUrl', $event)"
              />

              <p class="cg-hint">{{ i18n.t('cg.hint.img') }}</p>
            </fieldset>

            <fieldset class="card cg-block">
              <legend class="cg-legend">{{ i18n.t('cg.sec.contact') }}</legend>

              <label class="cg-field">
                <span class="cg-label">{{ i18n.t('cg.f.phone') }}</span>
                <input
                  type="tel"
                  [value]="d.business.phone"
                  [attr.maxlength]="limits.phone"
                  autocomplete="tel"
                  (input)="drafts.setBusiness('phone', value($event))"
                />
              </label>

              <label class="cg-field">
                <span class="cg-label">{{ i18n.t('cg.f.email') }}</span>
                <input
                  type="email"
                  [value]="d.business.email"
                  [attr.maxlength]="limits.email"
                  autocomplete="email"
                  (input)="drafts.setBusiness('email', value($event))"
                />
              </label>

              <label class="cg-field">
                <span class="cg-label">{{ i18n.t('cg.f.web') }}</span>
                <input
                  type="url"
                  inputmode="url"
                  placeholder="https://"
                  [value]="d.business.web"
                  [attr.maxlength]="limits.url"
                  (input)="drafts.setBusiness('web', value($event))"
                />
              </label>

              <label class="cg-field">
                <span class="cg-label">{{ i18n.t('cg.f.address') }}</span>
                <input
                  type="text"
                  [value]="d.business.address"
                  [attr.maxlength]="limits.address"
                  autocomplete="street-address"
                  (input)="drafts.setBusiness('address', value($event))"
                />
              </label>

              <label class="cg-check">
                <input
                  type="checkbox"
                  [checked]="d.business.leads"
                  (change)="drafts.setBusiness('leads', checked($event))"
                />
                <span>
                  {{ i18n.t('cg.f.leads') }}
                  <small>{{ i18n.t('cg.f.leads.hint') }}</small>
                </span>
              </label>
            </fieldset>

            <fieldset class="card cg-block">
              <legend class="cg-legend">{{ i18n.t('cg.sec.links') }}</legend>

              @for (l of d.business.links; track $index) {
                <div class="cg-row">
                  <label class="cg-field cg-narrow">
                    <span class="cg-label">{{ i18n.t('cg.link.net') }}</span>
                    <select [value]="l.net" (change)="drafts.setLink($index, { net: net($event) })">
                      <option value="">{{ i18n.t('cg.link.own') }}</option>
                      @for (n of networks; track n) {
                        <option [value]="n">{{ netName(n) }}</option>
                      }
                    </select>
                  </label>

                  <label class="cg-field">
                    <span class="cg-label">{{ i18n.t('cg.link.label') }}</span>
                    <input
                      type="text"
                      [value]="l.label"
                      [attr.maxlength]="limits.linkLabel"
                      (input)="drafts.setLink($index, { label: value($event) })"
                    />
                  </label>

                  <label class="cg-field">
                    <span class="cg-label">{{ i18n.t('cg.link.url') }}</span>
                    <input
                      type="url"
                      inputmode="url"
                      placeholder="https://"
                      [value]="l.url"
                      [attr.maxlength]="limits.url"
                      (input)="drafts.setLink($index, { url: value($event) })"
                    />
                  </label>

                  <button type="button" class="cg-drop" (click)="drafts.removeLink($index)">
                    {{ i18n.t('cg.remove') }}
                  </button>
                </div>
              } @empty {
                <p class="cg-hint">{{ i18n.t('cg.link.none') }}</p>
              }

              <button
                type="button"
                class="btn btn-secondary cg-add"
                [disabled]="d.business.links.length >= maxLinks"
                (click)="drafts.addLink()"
              >
                {{ i18n.t('cg.link.add') }}
              </button>
            </fieldset>
          } @else {
            <fieldset class="card cg-block">
              <legend class="cg-legend">{{ i18n.t('cg.sec.basics') }}</legend>

              <label class="cg-field">
                <span class="cg-label">{{ i18n.t('cg.f.headline') }} *</span>
                <input
                  type="text"
                  [value]="d.gift.headline"
                  [attr.maxlength]="limits.headline"
                  required
                  (input)="drafts.setGift('headline', value($event))"
                />
              </label>

              <div class="cg-row">
                <label class="cg-field">
                  <span class="cg-label">{{ i18n.t('cg.f.to') }}</span>
                  <input
                    type="text"
                    [value]="d.gift.to"
                    [attr.maxlength]="limits.name"
                    (input)="drafts.setGift('to', value($event))"
                  />
                </label>

                <label class="cg-field">
                  <span class="cg-label">{{ i18n.t('cg.f.from') }}</span>
                  <input
                    type="text"
                    [value]="d.gift.from"
                    [attr.maxlength]="limits.name"
                    (input)="drafts.setGift('from', value($event))"
                  />
                </label>
              </div>

              <label class="cg-field">
                <span class="cg-label">{{ i18n.t('cg.f.message') }}</span>
                <textarea
                  rows="6"
                  [value]="d.gift.message"
                  [attr.maxlength]="limits.message"
                  (input)="drafts.setGift('message', value($event))"
                ></textarea>
              </label>
            </fieldset>

            <fieldset class="card cg-block">
              <legend class="cg-legend">{{ i18n.t('cg.sec.photos') }}</legend>

              @for (photo of d.gift.photos; track $index) {
                <div class="cg-photo">
                  <app-image-field
                    [label]="i18n.t('cg.photo.n') + ' ' + ($index + 1)"
                    [url]="photo"
                    (urlChange)="setPhoto($index, $event)"
                  />
                </div>
              } @empty {
                <p class="cg-hint">{{ i18n.t('cg.photo.none') }}</p>
              }

              <button
                type="button"
                class="btn btn-secondary cg-add"
                [disabled]="d.gift.photos.length >= maxPhotos"
                (click)="drafts.addPhoto()"
              >
                {{ i18n.t('cg.photo.add') }}
              </button>
              <p class="cg-hint">{{ i18n.t('cg.hint.img') }}</p>
            </fieldset>

            <fieldset class="card cg-block">
              <legend class="cg-legend">{{ i18n.t('cg.sec.extras') }}</legend>

              <label class="cg-field">
                <span class="cg-label">{{ i18n.t('cg.f.songUrl') }}</span>
                <input
                  type="url"
                  inputmode="url"
                  placeholder="https://"
                  [value]="d.gift.songUrl"
                  [attr.maxlength]="limits.url"
                  (input)="drafts.setGift('songUrl', value($event))"
                />
              </label>

              <label class="cg-field">
                <span class="cg-label">{{ i18n.t('cg.f.songLabel') }}</span>
                <input
                  type="text"
                  [value]="d.gift.songLabel"
                  [attr.maxlength]="limits.songLabel"
                  (input)="drafts.setGift('songLabel', value($event))"
                />
              </label>
            </fieldset>
          }

          <p class="cg-hint">{{ i18n.t('cg.hint.saved') }}</p>
          <p class="cg-hint">{{ i18n.t('cg.hint.later') }}</p>
        </form>

        <!-- ── Vorschau ──────────────────────────────────── -->
        <aside class="cg-side">
          <!-- Zwei Blicke auf dasselbe: die Seite, die aufgeht, und das
               Stück Plastik, das ankommt. Das zweite hatte der Kunde bis
               hierher nie gesehen — er bestellte eine Karte und bekam ein
               Foto vom Beispielprodukt. -->
          <div class="cg-views" role="tablist" [attr.aria-label]="i18n.t('cg.view.label')">
            @for (v of views; track v) {
              <button
                type="button"
                role="tab"
                class="cg-view"
                [class.is-on]="view() === v"
                [attr.aria-selected]="view() === v"
                (click)="view.set(v)"
              >
                {{ i18n.t('cg.view.' + v) }}
              </button>
            }
          </div>

          @if (view() === 'screen') {
            <app-card-preview [kind]="p.id" [theme]="d.theme" [data]="data()" />
          } @else {
            <app-card-print [kind]="p.id" [theme]="d.theme" [data]="data()" />
          }

          <div class="cg-buy">
            <p class="cg-price"><strong>{{ p.price }} €</strong></p>

            @if (buyable()) {
              @if (cart.qtyOf(key()) === 0) {
                <button type="button" class="btn btn-primary btn-large cg-wide" (click)="cart.add(key(), 1)">
                  <app-icon name="bag" /> {{ i18n.t('shop.cart.add') }}
                </button>
              } @else {
                <div class="stepper cg-stepper" role="group" [attr.aria-label]="i18n.t('shop.card.' + p.id)">
                  <button type="button" (click)="cart.add(key(), -1)" [attr.aria-label]="i18n.t('shop.minus')">−</button>
                  <output>{{ cart.qtyOf(key()) }}</output>
                  <button
                    type="button"
                    (click)="cart.add(key(), 1)"
                    [disabled]="cart.qtyOf(key()) >= maxQty"
                    [attr.aria-label]="i18n.t('shop.plus')"
                  >+</button>
                </div>
                <a [routerLink]="'/bestellen' | localize" class="btn btn-secondary cg-wide">
                  {{ i18n.t('cg.toCart') }}@if (cart.count()) { <span class="rc-badge">{{ cart.count() }}</span> }
                </a>
              }
            } @else {
              <p class="cg-hint">{{ i18n.t('pd.closed') }}</p>
            }

            <p class="cg-small">{{ i18n.t('shop.vat') }}</p>
            <button type="button" class="cg-drop cg-reset" (click)="drafts.reset(p.id)">
              {{ i18n.t('cg.reset') }}
            </button>
          </div>
        </aside>
      </div>
    </section>
  `,
})
export class KarteGestaltenComponent implements OnInit {
  readonly i18n = inject(I18nService);
  readonly cart = inject(CartService);
  readonly shop = inject(ShopStatus);
  readonly drafts = inject(CardDraftService);
  private readonly seo = inject(SeoService);

  readonly maxQty = MAX_QTY;
  readonly maxLinks = MAX_LINKS;
  readonly maxPhotos = MAX_PHOTOS;
  readonly limits = CARD_LIMITS;
  readonly themes = CARD_THEMES;

  /** Welcher der zwei Blicke gezeigt wird. */
  readonly views = ['screen', 'print'] as const;
  readonly view = signal<(typeof this.views)[number]>('screen');
  readonly networks = CARD_NETWORKS;

  /** Welche Karte gestaltet wird — wie bei KartenComponent aus der Route. */
  readonly product = signal<CustomCardProduct>(
    customCard(String(inject(ActivatedRoute).snapshot.data['slug'] ?? '')) ?? CUSTOM_CARDS[0],
  );

  readonly key = computed(() => `card.${this.product().id}`);

  /** Was die Vorschau schickt — neu berechnet, sobald sich der Entwurf ändert. */
  readonly data = computed(() => this.drafts.payloadFor(this.product().id));

  /** Wie auf den Produktseiten: bis die Antwort da ist, ist der Shop offen. */
  readonly buyable = computed(() => this.shop.enabled() || !this.shop.checked());

  constructor() {
    this.i18n.register(SHOP_CONTENT);
    // `pd.closed` steht im Bestellkasten, wenn der Shop zu ist — derselbe
    // Satz wie auf den Produktseiten, und er kommt aus derselben Tabelle.
    this.i18n.register(PRODUCT_CONTENT);
    this.i18n.register(CARDS_CONTENT);
    this.i18n.register(CARD_DESIGNER_CONTENT);
  }

  /** Netzwerkname wie auf der Karte — steht in keiner Übersetzung, das sind Eigennamen. */
  netName(net: CardNetwork): string {
    return net === 'web' ? 'Website' : net === 'x' ? 'X' : net[0].toUpperCase() + net.slice(1);
  }

  /**
   * Ein Bild der Geschenkkarte setzen. Das Bildfeld meldet beim Entfernen
   * eine leere Adresse — dann soll die Zeile verschwinden und nicht als
   * leerer Platz stehen bleiben.
   */
  setPhoto(index: number, url: string): void {
    if (url) this.drafts.setPhoto(index, url);
    else this.drafts.removePhoto(index);
  }

  value(e: Event): string {
    return (e.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  checked(e: Event): boolean {
    return (e.target as HTMLInputElement).checked;
  }

  net(e: Event): CardNetwork | '' {
    const v = (e.target as HTMLSelectElement).value;
    return CARD_NETWORKS.find((n) => n === v) ?? '';
  }

  ngOnInit(): void {
    this.shop.check();
    const p = this.product();

    // Kein Eintrag im Index: der Gestalter ist ein Werkzeug, kein Inhalt. Was
    // zu diesen Produkten zu lesen ist, steht auf den Produktseiten — die
    // sollen ranken, nicht ein leerer Bogen.
    this.seo.update({
      title: this.i18n.t(`seo.cg.${p.id}.title`),
      description: this.i18n.t('cg.intro').slice(0, 300),
      path: `/karte-gestalten/${p.slug}`,
      image: this.seo.absolute(p.image),
      noIndex: true,
    });
  }
}
