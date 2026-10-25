// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Deployment configuration
 *
 * This project is set up for Vercel, which serves the site from the domain
 * root. No adapter is needed because the site is fully static.
 *
 * TODO: After the first deploy, set `site` to your production URL
 * (for example "https://your-project.vercel.app") so the canonical URL,
 * Open Graph tags, and sitemap use the correct domain.
 */
export default defineConfig({
  // TODO: Replace with your Vercel production URL.
  site: 'https://your-project.vercel.app',
  // Vercel serves the site from the root, so no base path is needed.
  base: '/',

  // Fully static HTML output — no server runtime required.
  output: 'static',

  // Keep spaces between inline elements (Astro 7 defaults to JSX whitespace handling).
  compressHTML: true,

  integrations: [sitemap()],
});
