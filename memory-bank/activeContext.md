# Active Context: f/28 Website Development

## Current Work Focus
f/28 website is LIVE at https://www.f28.com.tr (Vercel). Full admin panel, Redis backend, AI Based section, Download Portfolio PDF, and mouse-interactive production page are all working in production.

## Recent Changes (March 5, 2026 Session)
1. **Grid System Audit & Fix**
   - MasonryGrid updated to 4 columns desktop / 2 columns mobile (was 3/2/1)
   - Round-robin distribution preserves admin panel ordering
   - Gap reduced to 1px for gapless look
   - `shouldSkipOptimization()` was disabling Next.js Image optimization for ALL local images — fixed

2. **Title i18n Bug Fix**
   - `data.ts` titles are UPPERCASE (`'PHOTOGRAPHER'`) but `titleMap` keys were Title Case (`'Photographer'`)
   - Added uppercase keys to titleMap so translation lookup works

3. **BackToTop snap-container awareness**
   - BackToTop now detects `[data-snap-container]` scrollTop instead of only `window.scrollY`

4. **Unused dependencies flagged**
   - `react-xmasonry` and `zustand` in package.json but never imported

5. **Grain z-index conflict resolved**
   - Grain was z-[9998], same as cursor-ring — lowered to z-[9990]

## Architecture Snapshot
- **Landing** (`/`): Two-panel split (Production / AI Based) with mouse parallax
- **Production** (`/production`): Hero + snap-scroll photographer sections (ParallaxSection)
- **AI Based** (`/ai-based`): Hero + MasonryGrid of AI images
- **Portfolio** (`/[id]`): Hero + MasonryGrid of photographer images
- **Portfolios** (`/portfolios`): List with right-panel preview (desktop)
- **About** (`/about`): Hero + partner/client logo grids
- **Admin** (`/admin`): Dashboard, photographer editor, AI image manager, settings

## Active Decisions and Considerations

### Font Strategy
- Inter font via `next/font/google`
- Fallback: system fonts

### Image Handling
- Portfolio images: `/public/portfolios/{photographer-id}/`
- Preview images: `/portfolios/previews/`
- Next.js Image optimization ON for local paths (fixed)
- Blob images via Vercel Blob + `/api/blob` proxy
- Image manifest for Vercel serverless (no fs.readdirSync)

### Data Flow
- Redis (Upstash) stores photographer list + per-photographer image order + AI images
- Fallback to static `data.ts` + `image-manifest.ts` when Redis unavailable
- `revalidate = 60` on dynamic pages for ISR

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

## Known Issues
- Unused deps: `react-xmasonry`, `zustand` (should remove)
- npm audit: 1 high severity vulnerability
- `BackgroundPreloader` hits `/api/admin/photographers` without auth (silent fail OK but wasteful)

## Current Status
✅ Site LIVE at f28.com.tr on Vercel
✅ Admin panel fully functional
✅ Grid system: 4 cols desktop, 2 cols mobile, order-compatible
✅ i18n: EN/TR with LanguageContext
✅ PDF download working
✅ All pages with metadata
⏳ CDN image strategy (not yet implemented)
