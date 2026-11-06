export const locales = ['en', 'es'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** The site is one landing page per language. */
export const routes = {
  home: { en: '/', es: '/es/' },
} as const;

export type PageKey = keyof typeof routes;
