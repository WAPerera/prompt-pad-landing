# Prompt Pad — landing page

A single-page Astro landing page for Prompt Pad, a free desktop prompt manager
for Windows. Static output, no UI framework, no Tailwind, no external fonts or
tracking.

## Requirements

- Node.js 24.x (pinned in `package.json`; Astro 7 requires 22.23.4 or newer)

## Commands

```bash
npm install        # install dependencies
npm run dev        # local dev server at http://localhost:4321/
npm run check      # TypeScript / Astro diagnostics
npm run build      # static build in dist/
npm run preview    # preview the production build
```

## Editing content

All copy and links live in `src/data/site.ts`. Components do not contain copy.

The interactive prototype is built from `src/components/Prototype.astro` and
`src/scripts/prototype.ts`. It runs entirely in memory, demonstrates the core
workflow, and resets when the page reloads.

## Remaining placeholders

Search the project for `TODO` to find what still needs a real value:

1. The screenshot: add a real image to `src/screenshots/`, import it in
   `src/components/Hero.astro`, and pass it to `WindowFrame` as `src`
2. The optional Open Graph image in `src/layouts/Layout.astro`
3. The Windows version requirement, after verifying it for the current release

If you add a custom domain, update `site` in `astro.config.mjs` as well.

## Deploying to Vercel

This site is fully static, so **no Astro adapter is required**. Vercel detects
Astro automatically.

### Option A — Git integration (recommended)

1. Push this project to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Deploy.
5. Copy the production URL, update `site` in `astro.config.mjs`, and redeploy so
   the canonical URL, Open Graph tags, and sitemap point to the right domain.
6. Optional: add a custom domain under **Project → Settings → Domains** and use
   that URL for `site`.

Every push to the production branch will deploy automatically.

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel          # create a preview deployment
vercel --prod   # deploy to production
```

The CLI writes local metadata to `.vercel/`, which is git-ignored.

## Deployment configuration

- `vercel.json` adds long-lived caching for hashed assets in `/_astro/` and a
  small set of security headers. It does not change the build.
- Node.js is pinned to `24.x` through `package.json` so Vercel uses a version
  compatible with Astro 7.
