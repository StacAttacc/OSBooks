import { Injectable, computed, signal } from '@angular/core';
import { EN } from '../i18n/en';
import { FR } from '../i18n/fr';

export type Lang = 'en' | 'fr';

@Injectable({ providedIn: 'root' })
export class I18nService {
  lang = signal<Lang>((localStorage.getItem('lang') as Lang) ?? 'fr');
  t = computed(() => (this.lang() === 'en' ? EN : FR));

  setLang(l: Lang) {
    localStorage.setItem('lang', l);
    this.lang.set(l);
  }
}
