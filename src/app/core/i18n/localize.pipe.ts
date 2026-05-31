import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from './i18n.service';

/**
 * Prefixes a routerLink target with the active locale.
 *
 *   [routerLink]="'/projects' | localize"            → ['/de','projects']
 *   [routerLink]="['/projects', slug] | localize"    → ['/de','projects',slug]
 *
 * Impure so it re-evaluates when the language (and thus the URL prefix)
 * changes — keeps every in-app link pointing at the current locale.
 */
@Pipe({ name: 'localize', standalone: true, pure: false })
export class LocalizePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(path: string | any[]): any[] {
    const lang = this.i18n.lang();
    if (Array.isArray(path)) {
      const [first, ...rest] = path;
      const segs = String(first ?? '/')
        .split('/')
        .filter(Boolean);
      return ['/' + lang, ...segs, ...rest];
    }
    const segs = String(path).split('/').filter(Boolean);
    return ['/' + lang, ...segs];
  }
}
