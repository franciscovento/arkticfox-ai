// @ts-check
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { routes } from './src/i18n/routes.ts';

const site = 'https://arkticfox.ai';

/** @param {string} pathname */
function normalize(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/'))
    return pathname.slice(0, -1);
  return pathname;
}

const hidden = new Set([
  '/styleguide',
  '/v2',
  '/es/v2',
  '/work',
  '/es/trabajo',
  '/thanks',
  '/es/gracias',
]);

/** @type {Map<string, keyof typeof routes>} */
const byPath = new Map();
for (const [key, locs] of Object.entries(routes)) {
  byPath.set(normalize(locs.en), /** @type {keyof typeof routes} */ (key));
  byPath.set(normalize(locs.es), /** @type {keyof typeof routes} */ (key));
}

// https://astro.build/config
export default defineConfig({
  site,
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !hidden.has(normalize(page.replace(/^https?:\/\/[^/]+/, ''))),
      serialize(item) {
        const key = byPath.get(
          normalize(item.url.replace(/^https?:\/\/[^/]+/, '')),
        );
        if (!key) return item;
        const locs = routes[key];
        /** @param {string} path */
        const join = (path) => `${site}${path === '/' ? '/' : path}`;
        item.links = [
          { lang: 'en', url: join(locs.en) },
          { lang: 'es', url: join(locs.es) },
          { lang: 'x-default', url: join(locs.en) },
        ];
        return item;
      },
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          es: 'es',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
