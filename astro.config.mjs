// @ts-check
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://arkticfox.ai',
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
        !page.includes('/styleguide') &&
        !page.includes('/v2') &&
        !page.includes('/hero-3d') &&
        !page.includes('/work') &&
        !page.includes('/trabajo'),
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
