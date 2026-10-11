export const locales = ['en', 'es'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const routes = {
  home: { en: '/', es: '/es/' },
  productImages: { en: '/product-images', es: '/es/imagenes-de-producto' },
  adVideos: { en: '/ad-videos', es: '/es/videos-publicitarios' },
  ugcVideos: { en: '/ugc-videos', es: '/es/videos-ugc' },
  pricing: { en: '/pricing', es: '/es/precios' },
  quote: { en: '/quote', es: '/es/presupuesto' },
  thanks: { en: '/thanks', es: '/es/gracias' },
  legalNotice: { en: '/legal-notice', es: '/es/aviso-legal' },
  privacy: { en: '/privacy', es: '/es/privacidad' },
  cookies: { en: '/cookies', es: '/es/cookies' },
} as const;

export type PageKey = keyof typeof routes;
