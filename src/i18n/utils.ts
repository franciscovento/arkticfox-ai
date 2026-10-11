import { defaultLocale, routes, type Locale, type PageKey } from './routes';
import { en, type UiKey } from './ui/en';
import { es } from './ui/es';

const dictionaries = { en, es } as const;

export function t(locale: Locale, key: UiKey): string {
  return dictionaries[locale][key];
}

export function getPath(locale: Locale, pageKey: PageKey): string {
  return routes[pageKey][locale];
}

export type Alternate = {
  hreflang: 'en' | 'es' | 'x-default';
  path: string;
};

/** Language switcher and hreflang tags. x-default follows English. */
export function getAlternates(pageKey: PageKey): Alternate[] {
  const enPath = getPath('en', pageKey);
  const esPath = getPath('es', pageKey);

  return [
    { hreflang: 'en', path: enPath },
    { hreflang: 'es', path: esPath },
    { hreflang: 'x-default', path: getPath(defaultLocale, pageKey) },
  ];
}
