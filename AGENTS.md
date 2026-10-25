<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, read the relevant documentation. Training data is outdated — the docs are the source of truth.

**Documentation sources (Next.js 16.4.2):**

- Index: https://nextjs.org/docs/llms.txt
- Image: https://nextjs.org/docs/app/api-reference/components/image
- Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Proxy (formerly Middleware): https://nextjs.org/docs/messages/middleware-to-proxy

> Note: Next 16.4 ships its docs in `node_modules/next/dist/docs/` (01-app, 02-pages, 03-architecture) — prefer those local files; the URLs above are the fallback.

## Image checklist

- Import `Image` from `@/components/Image`, never `next/image` directly — it routes Sanity CDN URLs through Sanity's own resizer (`lib/sanityImageLoader.ts`) instead of `/_next/image` (Sanity originals can be 10k+ px and time out)
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
- **AI gallery:** `/ai-powered` grid + per-work URLs at `/ai-powered/works/[slug]` + client-state lightbox
- **CMS & Studio:** Embedded Sanity Studio at `/studio` (`sanity.config.ts`, custom UI via `sanity/studio.css`), Visual Editing via `/api/draft-mode` and ISR via `/api/revalidate`
- **View transitions:** `lib/ViewTransition.tsx` + React 19.3 stable `ViewTransition` (no config flag needed) — photographer card→detail morph only; root crossfade is opacity-only (no blur)

## Design & Motion

One "gallery" language across every page — reuse these, don't invent per-page variants:

- **Type:** Geist (`--font-display`, weight 600, tight tracking) for headings, Inter for body. No serif, no italics, no glow/gradient text. CMS headings typed in caps are sentence-cased at render via `components/DisplayCase.tsx` / `lib/displayCase.ts`; person names via `toNameCase`. Nav labels are Title Case in `lib/translations.ts`. Display scale is large: `.heading-hero` clamp(3rem, 10vw, 10rem), `.heading-section` clamp(2rem, 5vw, 4.5rem) — page titles carry the page. Section labels never repeat their title ("Portföy" over "Seçili işler", not "Seçili iş").
- **Sections:** `.g-section` (hairline top, shared rhythm; `--flush` when an edge-to-edge grid closes it) + `components/gallery/BlockHead.tsx` (label + title left, intro/actions right). Never name a class `.block` — it collides with Tailwind's `block`.
- **Imagery:** edge-to-edge and gapless. `components/gallery/Tile.tsx` (credit bottom-left, shown on hover/focus, always on touch), `.bleed-grid` with `--cols-sm/md/lg`, `components/gallery/WorkStrip.tsx` (sideways strip + 44px arrows), `components/gallery/WorkMosaic.tsx` (home selected work: 6-col rhythm wide+narrow / three equal, short last row stretches; phones 2 cols). Work detail pages (AI + Production) share the case-study layout: `.editorial-hero` title + `.project-meta`, then the gallery, then text prev/next. Brand logo walls crop each mark to its artwork (`lib/logoTrim.ts`, Sanity `rect`) and take alt text from `lib/logoNames.ts`.
- **Selected works — one list:** `getSelectedWorks()` (`lib/cms.ts`) feeds the home mosaic, the Production strip and About. Source: Studio → Production Sayfası → "Seçili İşler" (max 24). Empty: one work per artist, picked with a seed of the Istanbul date (same picks on every page, changes daily), skipping hero-reel images. The hero reel stays separate (Anasayfa → "Öne Çıkan İşler").
- **Image sharpness:** a `sizes` value must never be smaller than the rendered width at any breakpoint — and for `object-cover` boxes the rendered width is the crop: box height × image aspect when the photo is wider than the box. Use `coverSizes(src, slots)` / `coverSizesInBox` / `coverImageSizes` (`lib/imageSizes.ts`), never a bare box width (audit 390/820/1024/1220/1920). No "1px when hidden" tricks — lazy images in `display:none` never load anyway. Sanity images default to quality 85; `deviceSizes` go to 3840 for retina heroes. Index pages (/portfolios) keep credits visible (`showCredit`). Photo galleries (MasonryGrid, AI WorkGrid) use 3 columns from 768px up, 2 on phones. No dark hover overlays on photographs.
- **Text lists:** `.index-list` (numbered hairline rows) for services/process; `.contact-rows` for channels; `.tag-list` for short items; `.index-list--steps` lays a process out side by side from 900px. No cards/panels/chips.
- **Logos:** `components/gallery/LogoWall.tsx` (edge-to-edge hairline grid, monochrome).
- **Studio numbers** live only on About (`components/AboutStats.tsx`).
- **Home** (`app/home-v2/`): cinematic numbered reel hero (`.home-v2-hero--cine` clip-path opening + `.reel-*`; slides = first 6 Studio "Öne Çıkan İşler", landing images only as fallback; the active number's fill animation advances the reel) → `HomeAiScene` (pinned scroll scene; scroll writes `--open`; AI Portfolio images picked in "Anasayfa" → `aiSceneItems`, max 6; first 4 portfolio images when empty) → selected-work mosaic → `HomeArtistRoster` → clients wall. Every visible string maps to a field in the Sanity "Anasayfa" document (`lib/sanity.homeV2.ts`, translation fallbacks in `lib/translations.ts`); footer CTA comes from "İletişim Sayfası". When adding copy, add the Sanity field + mapping too — editors expect to change it in Studio.
- **Tokens:** CSS vars in `app/globals.css` (`--ease-*`, `--duration-*`, `--text-*`, `--opacity-*`); mirrored in `lib/motion.ts` and Tailwind extends (incl. extra opacity steps 12/52/58/62/68/72/78/82/88).
- **Motion:** above-fold `.hero-reveal`; below-fold `ScrollReveal` (`as="li"` inside lists). Native scrolling only — no scroll-jacking, no custom cursor, no grain. Respect `prefers-reduced-motion`.
- **Header & menu:** `.site-header` (transparent → frosted when scrolled, hides on scroll down / returns on scroll up). From `lg`: `.site-nav` — numbered index (`01 Prodüksiyon · 02 AI-Powered ⌄ · 03 Portföyler · 04 Hakkımızda`, mono numbers, hairline under the current page; AI-Powered opens a hairline list `02.1/02.2`, no box), then one language toggle (shows the other language) and the "Proje başlat →" call (`nav.cta`) to /contact. No "Ana Sayfa" (the logo is home), no artist dropdown (Portföyler is its index), no theme button in the header — theme lives in the footer legal row and the sheet. Below `lg` only logo + "Menu" — the `.menu-sheet` repeats the index as large display rows (`05 İletişim` added) with the email at display size, then language/theme and socials. Write `backdrop-filter` unprefixed — the CSS pipeline drops the whole declaration pair otherwise.
- **Lightbox:** single `components/Lightbox.tsx` (focus trap, swipe, scroll lock).
- **Accessibility floor:** visible `:focus-visible` ring, skip link, 4.5:1 text contrast, 44px touch targets, labels on icon buttons.
