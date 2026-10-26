// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Deployment configuration
 *
 * This project is deployed on Vercel, which serves the site from the domain
 * root. No adapter is needed because the site is fully static.
 *
 * If you add a custom domain later, update `site` to that domain.
 */
export default defineConfig({
  site: 'https://v0-irl-promptpad2026.vercel.app',
  // Vercel serves the site from the root, so no base path is needed.
  base: '/',

  // Fully static HTML output — no server runtime required.
  output: 'static',

  // Keep spaces between inline elements (Astro 7 defaults to JSX whitespace handling).
  compressHTML: true,

  integrations: [sitemap()],
});
