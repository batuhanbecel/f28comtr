# Active Context: f/28 Website Development

## Current Work Focus
f/28 website is LIVE at https://www.f28.com.tr (Vercel). Full admin panel, Redis backend, AI Based section, Download Portfolio PDF with multi-image layouts, and mouse-interactive production page are all working in production.

## Recent Changes (March 6, 2026 Session)
1. **PDF Download Fix & Redesign**
   - Fixed PDF not downloading: replaced `pdf.save()` with manual blob + anchor download (browser was blocking after long async)
   - Added CORS fallback in `loadImg`: tries `crossOrigin='anonymous'` first, retries without on canvas taint error
   - Added error state UI: "Failed — try again" with red X icon
   - Skip 404/broken images instead of crashing entire PDF generation
   - **Multi-image layouts**: 2 (side-by-side or stacked), 3 (1+2 or 2+1), 4 (2×2 grid) images per page
   - Smart grouping: first image = hero, then groups of 4, occasional solo "feature" pages for breathing room
   - Orientation-aware layouts: portrait pairs → side by side, landscapes → stacked, mixed 3s → adaptive
   - Refined cover page: preview image top 55%, separator line, title label, bold name, image count, f/2.8 logo + URL
   - Refined end page: separator, "THANK YOU", name, logo, URL
   - Fixed `charSpace` misalignment: removed `charSpace` from all `pdf.text()` calls (breaks `align:'center'` in jsPDF)

2. **About Page Redesign**
   - Added `AboutStats` component (6 stats: established year, artists, clients, partners, services, location)
   - Redesigned `LocalizedAboutBrands`: max-width container, section headers with count, refined logo grids

3. **Portfolios Page Redesign**
   - Visual photographer grid with cards (aspect 3:4, hover effects, index numbers)
   - Text index list below grid
   - Hero section replaced with simple heading above grid

4. **Image Manifest Update**
   - Extended `generate-image-manifest.js` to include partner logos (`__partners__`) and client logos (`__clients__`)
   - Updated `getPartnerLogos()` and `getClientLogos()` in `lib/utils.ts` to use manifest fallback for Vercel serverless

## Architecture Snapshot
- **Landing** (`/`): Two-panel split (Production / AI Based) with mouse parallax
- **Production** (`/production`): Hero + snap-scroll photographer sections (ParallaxSection)
- **AI Based** (`/ai-based`): Hero + MasonryGrid of AI images
- **Portfolio** (`/[id]`): Hero + MasonryGrid + DownloadPortfolio button
- **Portfolios** (`/portfolios`): Visual grid of photographer cards + text index list
- **About** (`/about`): Hero + AboutStats + partner/client logo grids
- **Admin** (`/admin`): Dashboard, photographer editor, AI image manager, settings

## Active Decisions and Considerations

### Font Strategy
- Inter font via `next/font/google`
- Fallback: system fonts

### Image Handling
- Portfolio images: `/public/portfolios/{photographer-id}/`
- Preview images: `/portfolios/previews/`
- Next.js Image optimization ON for local paths
- Blob images via Vercel Blob + `/api/blob` proxy
- Image manifest for Vercel serverless (portfolios, AI, partner logos, client logos)

### Data Flow
- Redis (Upstash) stores photographer list + per-photographer image order + AI images
- Fallback to static `data.ts` + `image-manifest.ts` when Redis unavailable
- `revalidate = 60` on dynamic pages for ISR
- **Note**: Redis may hold stale image URLs for deleted files — admin panel should be used to clean up

### PDF Generation
- jsPDF dynamically imported (client-side only)
- Pre-loads all images, groups by orientation, renders multi-image pages
- Manual blob download (not `pdf.save()`) for browser compatibility
- Skips failed/404 images gracefully

## Important Patterns

### Code Style
- TypeScript strict, functional components with hooks
- Server Components by default, `'use client'` when needed
- Tailwind for all styling, no CSS modules
- React 19: `use()` for context, `useDeferredValue`, `useTransition`

### Component Organization
- `SiteChrome` wraps Menu + PageLoader + BackToTop + BackgroundPreloader + Grain
- `ProductionSnapContainer` provides custom scroll-snap with wheel interception
- `MasonryGrid` is shared by portfolio pages and AI Based page
- `DownloadPortfolio` handles PDF generation with multi-image layouts

## Known Issues
- Unused deps: `react-xmasonry`, `zustand` (should remove)
- npm audit: 1 high severity vulnerability
- `BackgroundPreloader` hits `/api/admin/photographers` without auth (silent fail OK but wasteful)
- Redis may hold references to deleted images (404s) — needs admin panel cleanup
- Vercel Git auto-deploy may need branch verification (user deploys via CLI `vercel --prod`)

## Current Status
✅ Site LIVE at f28.com.tr on Vercel
✅ Admin panel fully functional
✅ Grid system: 4 cols desktop, 2 cols mobile, order-compatible
✅ i18n: EN/TR with LanguageContext
✅ PDF download working with multi-image layouts
✅ All pages with metadata + viewport properly separated
✅ About page with stats + logo grids
✅ Portfolios page with visual photographer cards
✅ Image manifest covers portfolios, AI, partner/client logos
