# Active Context: f/28 Website Development

## Current Work Focus
f/28 website is LIVE at https://www.f28.com.tr (Vercel). Full admin panel, Redis backend, AI Based section, Download Portfolio PDF with multi-image layouts, and mouse-interactive production page are all working in production. Now 9 photographers including Haldun Kırkbir.

## Recent Changes (March 23, 2026 Session)
1. **New Photographer: Haldun Kırkbir**
   - Added to `lib/data.ts` with id `haldun-kirkbir`, tags: commercial, portrait
   - 149 portfolio images across 6 categorized subfolders

2. **Subfolder Support for Image Manifest**
   - `scripts/generate-image-manifest.js` now supports subfolders within photographer directories
   - If subfolders exist, images are collected in subfolder sort order (alphabetic/numeric prefix)
   - Loose root files appended after subfolder images
   - Photographers without subfolders continue to work in flat mode (backward compatible)
   - Haldun's subfolders: `01_PEOPLE`, `02_KOZMETIK`, `03_STILLIFE`, `04_FOOD_CHOCLATE`, `05_MUCEVHER_SAAT`, `06_TEKSTIL_AYAKKABI_AKSESUAR`

3. **Portfolios Page: Filters Removed**
   - Removed tag filter pills from `/portfolios` page (`PortfoliosList.tsx`)
   - Removed unused imports: `PhotographerTag`, `AVAILABLE_TAGS`
   - All photographers shown without filtering

4. **AI Based Description Updated**
   - Updated EN/TR translations for AI Based section description
   - New copy emphasizes hybrid production process blending traditional retouching with generative AI

## Previous Changes (March 6, 2026 Session)
1. **PDF Download Fix & Redesign** — manual blob download, CORS fallback, multi-image layouts
2. **About Page Redesign** — AboutStats + refined logo grids
3. **Portfolios Page Redesign** — Visual photographer cards + text index
4. **Image Manifest Update** — Extended for partner/client logos

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
- ~~Unused deps: `react-xmasonry`, `zustand` (should remove)~~ — Verified: not in package.json
- ~~npm audit: 1 high severity vulnerability~~ — Now multiple; run `npm audit fix` on Vercel build env
- `BackgroundPreloader` hits `/api/admin/photographers` without auth (silent fail OK but wasteful)
- Redis may hold references to deleted images (404s) — admin panel cleanup button available
- Vercel Git auto-deploy may need branch verification (user deploys via CLI `vercel --prod`)
- ~~Haldun's images stored in Redis may need re-seeding after subfolder restructure~~ — Verified working
- **Windows local build**: Turbopack fails with sharp symlink error; build script now uses `--no-turbopack`

## Current Status
✅ Site LIVE at f28.com.tr on Vercel
✅ 9 photographers including Haldun Kırkbir
✅ Admin panel fully functional
✅ Grid system: 4 cols desktop, 2 cols mobile, order-compatible
✅ i18n: EN/TR with LanguageContext
✅ PDF download working with multi-image layouts
✅ All pages with metadata + viewport properly separated
✅ About page with stats + logo grids
✅ Portfolios page with visual photographer cards (filters removed)
✅ Image manifest covers portfolios (with subfolder support), AI, partner/client logos
✅ Admin panel design unified: no rounded corners, consistent with public site aesthetic
✅ Duplicate `robots.txt` removed (only `robots.ts` remains)
✅ `dotenv` version corrected from invalid `^17.3.1` to `^16.4.5`
✅ `page_new.tsx` dead code deleted
