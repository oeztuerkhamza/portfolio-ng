import { Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import qrcode from 'qrcode-generator';
import { EMPTY_PROFILE, Invoice, InvoiceProfile, addDays, deDate, ibanText, isoDay, money, qtyText, totals } from './invoice.model';

/**
 * Die Rechnung als DIN-A4-Seite (DIN 5008, Form B): Logo, Absenderzeile,
 * Anschriftfeld für Fensterumschläge, Positionen, Summen, GiroCode und
 * Fußzeile mit Steuernummer und Bankverbindung. Dieselbe Seite dient als
 * Vorschau und als Druckvorlage (Drucken → „Als PDF speichern").
 */
@Component({
  selector: 'adm-invoice-doc',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './invoice-doc.component.scss',
  template: `
    @let inv = invoice();
    @let s = sender();
    <article class="inv-sheet" [class.is-draft]="inv.status === 'entwurf'" [class.is-void]="inv.status === 'storniert' && inv.kind === 'rechnung'">
      <div class="inv-bar"></div>

      <header class="inv-head">
        <div class="inv-brand">
          <img src="/assets/images/logo/breisgau-digital.svg" alt="Breisgau Digital" />
          <div>
            <strong>{{ s.company }}</strong>
            <span>Webdesign · Google-Bewertungen · Smart Home</span>
          </div>
        </div>
      </header>

      <div class="inv-window">
        <p class="inv-return">{{ s.company }} · {{ s.street }} · {{ s.city }}</p>
        <address class="inv-address">
          @if (inv.recipient_business) { <span>{{ inv.recipient_business }}</span> }
          <span>{{ inv.recipient_name || 'Empfänger' }}</span>
          @if (inv.recipient_street) { <span>{{ inv.recipient_street }}</span> }
          @if (inv.recipient_city) { <span>{{ inv.recipient_city }}</span> }
        </address>
      </div>

      <dl class="inv-meta">
        <div><dt>{{ inv.kind === 'storno' ? 'Storno-Nr.' : 'Rechnungs-Nr.' }}</dt><dd>{{ inv.number ?? 'wird vergeben' }}</dd></div>
        <div><dt>Datum</dt><dd>{{ d(inv.issue_date) }}</dd></div>
        @if (inv.service_period) { <div><dt>Leistungszeitraum</dt><dd>{{ inv.service_period }}</dd></div> }
        @else { <div><dt>Leistungsdatum</dt><dd>entspricht Rechnungsdatum</dd></div> }
        @if (inv.kind === 'rechnung') { <div><dt>Fällig am</dt><dd>{{ due() }}</dd></div> }
        @if (s.tax_number) { <div><dt>Steuernummer</dt><dd>{{ s.tax_number }}</dd></div> }
      </dl>

      <main class="inv-body">
        <h1 class="inv-title">
          {{ inv.kind === 'storno' ? 'Stornorechnung' : 'Rechnung' }}
          @if (inv.number) { <span>{{ inv.number }}</span> }
        </h1>

        <p>Sehr geehrte Damen und Herren,</p>
        <p class="inv-intro">{{ inv.intro || s.intro }}</p>

        <table class="inv-table">
          <thead>
            <tr><th class="pos">Pos.</th><th>Beschreibung</th><th class="num">Menge</th><th class="num">Einzelpreis</th><th class="num">Gesamt</th></tr>
          </thead>
          <tbody>
            @for (it of inv.items; track $index) {
              <tr>
                <td class="pos">{{ $index + 1 }}</td>
                <td class="desc">{{ it.description }}</td>
                <td class="num">{{ qty(it.qty) }}@if (it.unit) { {{ it.unit }} }</td>
                <td class="num">{{ money(it.unit_price) }}</td>
                <td class="num">{{ money(line(it.qty, it.unit_price)) }}</td>
              </tr>
            } @empty {
              <tr><td colspan="5" class="inv-empty">Noch keine Positionen</td></tr>
            }
          </tbody>
        </table>

        <div class="inv-sums">
          @if (!inv.small_business) {
            <div><span>Nettobetrag</span><span>{{ money(sum().net) }}</span></div>
            <div><span>Umsatzsteuer {{ inv.vat_rate }} %</span><span>{{ money(sum().vat) }}</span></div>
          }
          <div class="total"><span>{{ sum().gross < 0 ? 'Gutschrift' : 'Rechnungsbetrag' }}</span><span>{{ money(sum().gross) }}</span></div>
        </div>

        @if (inv.small_business) {
          <p class="inv-tax-note">Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).</p>
        }

        <div class="inv-pay">
          <div>
            @if (inv.kind === 'storno') {
              <p>Bereits gezahlte Beträge erstatte ich auf Ihr Konto.</p>
            } @else if (inv.status === 'bezahlt') {
              <p>Der Rechnungsbetrag wurde am {{ d(inv.paid_at) }} dankend erhalten.</p>
            } @else {
              <p>
                Bitte überweisen Sie den Betrag von <strong>{{ money(sum().gross) }}</strong> bis zum <strong>{{ due() }}</strong>
                unter Angabe der Rechnungsnummer@if (s.iban) { auf das unten genannte Konto}.
              </p>
            }
            @if (inv.notes) { <p class="inv-notes">{{ inv.notes }}</p> }
            <p class="inv-closing">{{ s.closing || 'Mit freundlichen Grüßen' }}<br /><span>{{ s.owner || s.company }}</span></p>
          </div>
          @if (qr()) {
            <figure class="inv-qr">
              <div [innerHTML]="qr()"></div>
              <figcaption>Mit Banking-App scannen<br />(GiroCode)</figcaption>
            </figure>
          }
        </div>
      </main>

      <footer class="inv-foot">
        <div>
          <strong>{{ s.company }}</strong>
          @if (s.owner) { <span>Inh. {{ s.owner }}</span> }
          <span>{{ s.street }}</span>
          <span>{{ s.city }}</span>
        </div>
        <div>
          @if (s.phone) { <span>Tel. {{ s.phone }}</span> }
          @if (s.email) { <span>{{ s.email }}</span> }
          @if (s.web) { <span>{{ s.web }}</span> }
        </div>
        <div>
          @if (s.tax_number) { <span>Steuernummer {{ s.tax_number }}</span> }
          @if (s.vat_id) { <span>USt-IdNr. {{ s.vat_id }}</span> }
          @if (!s.tax_number && !s.vat_id) { <span class="inv-missing">Steuernummer fehlt</span> }
        </div>
        <div>
          @if (s.iban) {
            @if (s.bank) { <span>{{ s.bank }}</span> }
            <span class="nowrap">IBAN {{ iban(s.iban) }}</span>
            @if (s.bic) { <span>BIC {{ s.bic }}</span> }
          } @else {
            <span class="inv-missing">Bankverbindung fehlt</span>
          }
        </div>
      </footer>
    </article>
  `,
})
export class InvoiceDocComponent {
  readonly invoice = input.required<Invoice>();
  /** Aktuelle Absenderdaten; festgeschriebene Rechnungen nutzen ihre eigene Kopie. */
  readonly profile = input<InvoiceProfile | null>(null);

  readonly sender = computed<InvoiceProfile>(() => ({ ...EMPTY_PROFILE, ...(this.invoice().sender ?? this.profile() ?? {}) }));
  readonly sum = computed(() => {
    const i = this.invoice();
    return totals(i.items, Number(i.vat_rate), i.small_business);
  });
  readonly due = computed(() => {
    const d = addDays(this.invoice().issue_date, Number(this.invoice().due_days));
    return d ? deDate(isoDay(d)) : '—';
  });

  /** EPC-QR-Code („GiroCode"): Banking-Apps füllen die Überweisung damit aus. */
  private readonly sanitizer = inject(DomSanitizer);
  readonly qr = computed<SafeHtml | ''>(() => {
    const i = this.invoice();
    const s = this.sender();
    const amount = this.sum().gross;
    if (!s.iban || amount <= 0 || i.kind !== 'rechnung' || i.status === 'bezahlt' || i.status === 'storniert') return '';
    const payload = [
      'BCD',
      '002',
      '1',
      'SCT',
      s.bic,
      (s.owner ? `${s.owner}` : s.company).slice(0, 70),
      s.iban,
      `EUR${amount.toFixed(2)}`,
      '',
      '',
      `${i.number ?? 'Rechnung'} ${i.recipient_business || i.recipient_name}`.slice(0, 140),
    ].join('\n');
    qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
    const code = qrcode(0, 'M');
    code.addData(payload, 'Byte');
    code.make();
    // Das SVG stammt vollständig aus qrcode-generator; die Nutzdaten stecken nur im Punktmuster.
    return this.sanitizer.bypassSecurityTrustHtml(code.createSvgTag({ cellSize: 3, margin: 0, scalable: true }));
  });

  readonly money = money;
  readonly qty = qtyText;
  readonly iban = ibanText;
  d(v: unknown) {
    return deDate(v);
  }
  line(q: unknown, p: unknown) {
    return Math.round((Number(q) || 0) * (Number(p) || 0) * 100) / 100;
  }
}
