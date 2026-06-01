<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, read the relevant documentation. Training data is outdated — the docs are the source of truth.

**Documentation sources (Next.js 16.2.6):**

- Index: https://nextjs.org/docs/llms.txt
- Image: https://nextjs.org/docs/app/api-reference/components/image
- Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Proxy (formerly Middleware): https://nextjs.org/docs/messages/middleware-to-proxy

> Note: `node_modules/next/dist/docs/` is not shipped in this version. Use the URLs above.

## Image checklist

- Never use deprecated `priority` — use `loading="eager"` and/or `fetchPriority="high"` for LCP candidates only (one per viewport)
- Every `fill` image must have a correct `sizes` prop — use constants from `lib/imageSizes.ts`
- Lightbox/modal images: `LIGHTBOX_IMAGE_SIZES`, not `100vw`
- Below-fold images: `loading="lazy"`, no `fetchPriority="high"`
- Meaningful `alt` text required

## App Router checklist

- Pages/layouts: async `params: Promise<{ id: string }>` with `await params`
- Prefer Server Components; push `'use client'` to leaf components only
- `error.tsx` exports `Error`; root failures use `global-error.tsx` with `<html>`/`<body>`
- Metadata: `metadata` / `generateMetadata`, file-based `opengraph-image.tsx` per route
- Route handlers that use Node APIs (`sharp`, file I/O): `export const runtime = 'nodejs'`

## Project patterns

- **i18n:** cookie `f28_lang` (set in `proxy.ts`, read in `app/layout.tsx`, mirrored in `LanguageContext`)
- **Theme:** cookie `f28_theme` (same flow via `ThemeContext`)
- **Images:** shared sizes in `lib/imageSizes.ts`, blob proxy via `shouldSkipOptimization()`
- **AI gallery:** client-state lightbox in `AIBasedGallery` (no per-work URLs)
- **View transitions:** `lib/ViewTransition.tsx` + `experimental.viewTransition` in `next.config.ts` — photographer card→detail morph only; root crossfade is opacity-only (no blur)

## Design & Motion

- **Tokens:** CSS vars in `app/globals.css` (`--ease-brand`, `--ease-morph`, `--ease-snappy`, `--duration-reveal/hover/ui`); mirrored in `lib/motion.ts` and Tailwind `duration-*` / `ease-*` extends
- **Editorial layout:** `.page-heading-stack` (label + title always vertical), `.page-section`, `.editorial-panel`, `.editorial-grid`, `.heading-section`, `.editorial-chip`, `.section-label` (block; pill variant `section-label--pill`)
- **Public primitives:** `components/PageHeader.tsx` (rule + label + title + desc; `SectionHeader` for in-page sections), `components/PageSection.tsx`, `components/EditorialButton.tsx` (`btn-editorial` variants)
- **Hero:** `components/PageHero.tsx` wraps `PageHeader` with `variant="hero"`; `LocalizedHero` re-exports from `components/LocalizedHero.tsx`. Custom hero slots (e.g. AI stats) use `PageHeader` directly.
- **Admin primitives:** `components/admin/AdminPageLayout.tsx`, `AdminPanel.tsx`, `AdminFormField.tsx` (+ `AdminInput`/`AdminTextarea`/`AdminSelect`), `AdminButton.tsx`, `AdminDropzone.tsx` — same editorial tokens as public (`admin-input`, `admin-label`, `btn-editorial`)
- **Reveal:** above-fold `fade-in-up`; below-fold `ScrollReveal` + `hooks/useScrollReveal.ts` (`.scroll-reveal.in-view`)
- **Lightbox:** single `components/Lightbox.tsx` — used by `MasonryGrid` and AI gallery wrapper `app/ai-based/components/Lightbox.tsx`
- **Parallax:** `hooks/useDirectParallax.ts` + shared scroll bus `lib/parallaxScrollBus.ts` — event-driven, no perpetual RAF; mouse parallax off on mobile / `prefers-reduced-motion`
- **Hover scale:** grid thumbs use `.thumb-hover-scale` (1.04, `--duration-hover`)
- **Grain:** `isPerfHeavyPage()` in `lib/galleryPaths.ts` — off on landing, production, galleries
- **Custom cursor:** kept on fine pointer; disabled under `prefers-reduced-motion`
- **No styled-jsx** for AI filter/process — styles in `globals.css` (`.filter-*`, `.process-*`)

<!-- END:nextjs-agent-rules -->
