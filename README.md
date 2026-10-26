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

## Preview sandbox

Use the sandbox to check exactly what will be deployed *before* pushing. It
builds the production output and serves it from `dist/` on **port 4322**, so it
can run at the same time as `npm run dev` (4321) for side-by-side comparison.

```bash
npm run sandbox         # build, then start the preview server in the background
npm run sandbox:status  # check whether it is running
npm run sandbox:logs    # follow the server logs (Ctrl+C to detach)
npm run sandbox:stop    # stop the background server
```

Open http://localhost:4322/ after `npm run sandbox`. Unlike the dev server,
this serves the real built HTML, CSS, and JS — so broken imports, missing
assets, and build-time failures show up here rather than in production. The
sandbox leaves no tracked files behind: `dist/`, `.astro/`, and
`node_modules/` are all git-ignored.

## Editing content

All copy and links live in `src/data/site.ts`. Components do not contain copy.

The `/features` page lists every app feature. Its copy lives in
`featuresPage` in `site.ts`.

The app icon lives in `src/assets/icon.png`. It renders as the header and
footer logo, and the favicon plus apple-touch-icon are generated from it at
build time.

The Windows installer is served from `public/download/`. To publish a new
version, add the new `*-setup.exe` there and update `links.download` in
`site.ts` to match.

The interactive prototype is built from `src/components/Prototype.astro` and
`src/scripts/prototype.ts`. It is a dependency-free port of the desktop app's
React UI (Tauri + React + Tailwind), so the markup and behaviour mirror the
real window. Update both files together when the app's UI changes. It runs
entirely in memory and resets when the page reloads.

The hero window shows `src/screenshots/main-window.png`, optimized by Astro at
build time, with its description in `hero.screenshot.alt` in `site.ts`.
Replace that file to update the screenshot.

## Remaining placeholders

Search the project for `TODO` to find what still needs a real value:

1. The optional Open Graph image in `src/layouts/Layout.astro`
2. The Windows version requirement, after verifying it for the current release

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
