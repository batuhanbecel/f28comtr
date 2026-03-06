# System Patterns: f/28 Website Architecture

## Architecture Overview
Next.js 16.1 App Router with ISR (revalidate=60), Redis backend, Vercel Blob storage, and image manifest for serverless compatibility.

## Key Technical Decisions

### 1. App Router Structure
```
app/
├── layout.tsx              # Root layout (SiteChrome, CustomCursor, providers)
├── page.tsx                # Landing (two-panel split)
├── production/page.tsx     # Production page (snap-scroll ParallaxSections)
├── ai-based/page.tsx       # AI gallery (MasonryGrid)
├── [id]/page.tsx           # Dynamic portfolio (hero + MasonryGrid + DownloadPortfolio)
├── portfolios/             # Photographer card grid + text index
├── about/page.tsx          # Stats + partner/client logo grids
├── admin/                  # Dashboard, photographer CRUD, AI image manager
├── api/admin/              # Auth + CRUD API routes
└── api/blob/               # Private blob proxy
```

### 2. Data Management
- **Redis (Upstash)**: Primary store for photographer list, image ordering, AI images
- **Static Fallback**: `lib/data.ts` + `lib/image-manifest.ts` when Redis unavailable
- **Image Manifest**: Build-time generated list of all images/logos for Vercel serverless (no `fs.readdirSync`)
- **ISR**: `revalidate = 60` on dynamic pages

### 3. Image Optimization Strategy
- Next.js Image component with optimization ON for local paths
- `shouldSkipOptimization()` only skips blob proxy URLs
- Blob images proxied via `/api/blob?u=<url>` for private Vercel Blob
- Image manifest includes: portfolios, AI images, partner logos, client logos

### 4. Component Relationships
```
RootLayout
├── SiteChrome
│   ├── Menu (fullscreen nav overlay)
│   ├── PageLoader (route transition)
│   ├── BackToTop (snap-container aware)
│   ├── BackgroundPreloader
│   └── Grain (film grain overlay, z-9990)
├── CustomCursor
└── Page Content
    ├── Landing: Two-panel split with mouse parallax
    ├── Production: ProductionSnapContainer + ParallaxSections
    ├── AI Based: ProductionSnapContainer + MasonryGrid
    ├── Portfolio/[id]: Hero + DownloadPortfolio + MasonryGrid
    ├── Portfolios: Photographer card grid + text index
    └── About: AboutStats + LocalizedAboutBrands
```

## Design Patterns

### Server vs Client Components
- **Server**: All pages, data fetching, static generation
- **Client** (`'use client'`): Menu, MasonryGrid, ParallaxSection, DownloadPortfolio, PageLoader, BackToTop, CustomCursor, AboutStats, LanguageProvider

### PDF Generation Pattern (DownloadPortfolio)
1. Dynamic import `jspdf` (client-side only)
2. Load all images with CORS fallback (`crossOrigin` → retry without)
3. Skip failed/404 images (don't crash)
4. Group images by orientation into multi-image pages (1, 2, 3, or 4 per page)
5. Render cover → portfolio pages → end page
6. Download via manual blob + anchor (not `pdf.save()` — browser blocks after long async)

### Scroll Snap Pattern (ProductionSnapContainer)
- Custom wheel event interception for controlled snap-scroll
- `[data-snap-container]` attribute for BackToTop detection
- `snapMode="heroSnap"` for portfolio pages (hero snaps, grid scrolls freely)

### i18n Pattern
- `LanguageContext` with `lang` ('en'|'tr') + `setLang`
- `lib/translations.ts` with `titleMap` (both Title Case and UPPERCASE keys)
- Stored in `localStorage`

## Critical Implementation Paths

### Image Manifest Generation
1. `scripts/generate-image-manifest.js` scans `/public/portfolios/`, `/public/ai-images/`, `/public/logos/brands/`
2. Writes `lib/image-manifest.ts` with all file paths
3. Must be run before deploy: `node scripts/generate-image-manifest.js`
4. `lib/utils.ts` uses manifest as primary source, `fs.readdirSync` as fallback

### Admin Panel Flow
1. Login via `/api/admin/login` → JWT cookie
2. All write routes check `checkAuth()` middleware
3. CRUD operations update Redis
4. Image reorder via drag-and-drop (dnd-kit)

## Performance Optimizations
1. **ISR**: Pages revalidate every 60s
2. **Image Optimization**: Next.js automatic + responsive sizes
3. **Code Splitting**: Per-route + dynamic imports (jsPDF)
4. **BackgroundPreloader**: Pre-fetches photographer data
5. **Eager Loading**: MasonryGrid images loaded eagerly with blur placeholder
6. **Vercel Analytics + SpeedInsights**: Integrated
