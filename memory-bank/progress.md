# Progress: f/28 Website Development

## What Works

### ✅ Core Infrastructure
- [x] Next.js 16.1 project initialized
- [x] TypeScript configuration
- [x] Tailwind CSS setup
- [x] ESLint 9 configured
- [x] Dependencies installed (389 packages)
- [x] Development server running on localhost:3000

### ✅ Pages Implemented
- [x] Homepage (`/`)
  - 7 photographer sections (66vh each, shows 1.5 sections)
  - Parallax scrolling background images (200px range)
  - Bold PHOTOGRAPHER/RETOUCHER titles
  - Large photographer names (text-7xl)
  - Modern "SEE ALL" links with animated dash effect
  - Reordered: Ozan, Emre, Berkin, Yonca, Ömür, Kerem, Doğu

- [x] Portfolios Page (`/portfolios`)
  - Grid layout with aspect-[4/5] cards
  - Preview images with titles and names
  - Hover scale effects
  - Links to individual portfolios

- [x] Dynamic Portfolio Pages (`/portfolio/[id]`)
  - Hero section with bold photographer name
  - Background preview image
  - Full-width 3-column masonry grid (no padding)
  - Lightbox for full-size viewing
  - Static generation for all 7 photographers

- [x] About Us Page (`/about`)
  - Company information
  - Brand logos grid (26 brands)
  - Contact information section

### ✅ Components Built
- [x] Menu Component
  - Larger logo (120x60)
  - Blur-on-scroll effect (activates at 50px)
  - Hamburger icon animation
  - Fullscreen overlay with menubg.webp
  - Navigation links
  - Contact information display

- [x] ParallaxSection Component
  - Parallax image movement on scroll
  - 120% height container for smooth effect
  - Typography hierarchy (title, name, SEE ALL)
  - Animated dash on hover

- [x] PageLoader Component
  - Modern scale-fade animation
  - f28 logo with ping effect
  - Dark gray background (#1a1a1a)
  - 1s duration with smooth exit

- [x] BackToTop Component
  - Appears after 500px scroll
  - Smooth scroll to top
  - White circular button with arrow
  - Fade in/out transitions

- [x] MasonryGrid Component
  - Full-width 3-column responsive layout
  - Click-to-expand functionality
  - Lightbox overlay
  - Minimal gaps (gap-2)

### ✅ Data & Utilities
- [x] Photographer data structure
- [x] Contact information
- [x] File system utilities for images
- [x] Brand logo reading function

### ✅ Asset Organization
- [x] Portfolios moved to `/public/portfolios/`
- [x] Logos moved to `/public/logos/`
- [x] Menu background in `/public/`
- [x] Preview images accessible

## What's Left to Build / Potential Improvements

### 🔄 Cleanup
- [ ] Remove unused deps: `react-xmasonry`, `zustand`
- [ ] Review npm audit vulnerability
- [ ] Clean stale image references from Redis via admin panel
- [ ] Delete redundant `app/portfolio/[id]/page.tsx` (redirect handles this route)

### 🔄 Performance
- [ ] CDN image optimization strategy
- [ ] Lighthouse audit + Core Web Vitals optimization
- [ ] Mobile performance testing

### 🔄 Content
- [ ] Verify contact info is current (phone, address)

## Current Status

**Phase**: LIVE IN PRODUCTION ✅  
**URL**: https://www.f28.com.tr  
**Hosting**: Vercel (CLI deploy via `vercel --prod`)  
**Git**: github.com/batuhanbecel/f28comtr (master branch)

### Latest Achievements (March 6, 2026)
- ✅ PDF download fixed: manual blob download, CORS fallback, skip 404 images
- ✅ PDF multi-image layouts: 2, 3, 4 images per page with orientation-aware grouping
- ✅ PDF cover/end pages redesigned to match site style
- ✅ About page redesigned with stats section + refined logo grids
- ✅ Portfolios page redesigned with visual photographer cards
- ✅ Image manifest extended for partner/client logos (Vercel serverless)
- ✅ `charSpace` alignment bug fixed in jsPDF

### Previous Achievements
- ✅ Site LIVE at f28.com.tr on Vercel
- ✅ Redis/Upstash backend for dynamic photographer data
- ✅ Admin panel (/admin) with login, photographer management, image ordering
- ✅ AI Based page with admin sorting
- ✅ Landing page with cross-panel hover dimming
- ✅ Production page hero + full-screen height + scroll arrow
- ✅ Mouse-tracking parallax on all ParallaxSection components
- ✅ MasonryGrid: 4 cols desktop, 2 cols mobile, eager loaded, blur placeholder
- ✅ BackgroundPreloader for instant portfolio loads
- ✅ Vercel Blob storage + /api/blob proxy for uploaded images
- ✅ i18n: EN/TR with LanguageContext

## Known Issues

1. **Unused deps**: `react-xmasonry`, `zustand` still in package.json
2. **npm audit**: 1 high severity vulnerability
3. **Stale Redis data**: Deleted images may still be referenced in Redis
4. **BackgroundPreloader**: Hits `/api/admin/photographers` without auth
5. **Vercel Git deploy**: May need branch config verification — user deploys via CLI

## Evolution of Project Decisions

### Initial Approach
- Planned to use Geist fonts from Next.js
- Decided to use system fonts for faster setup

### Asset Management
- Originally assets in root directory
- Moved to `/public/` for Next.js static serving

### ESLint Version
- Started with ESLint 8
- Updated to ESLint 9 for Next.js 16.1 compatibility

### Image Strategy
- Will rely on Next.js Image component for optimization
- Manual WebP conversion may be needed for some images
- Sharp handles automatic optimization at build time

## Performance Metrics (To Be Measured)
- Initial page load time: TBD
- Time to interactive: TBD
- Largest contentful paint: TBD
- Cumulative layout shift: TBD
- First input delay: TBD

## Environment Variables (Vercel)
- `ADMIN_PASSWORD` — admin panel login
- `REDIS_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN` — Upstash Redis
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob (private store `srzew0qzegvhjbvh`)

## API Routes
- `POST /api/admin/login` — session auth
- `GET/POST /api/admin/photographers` — list / create
- `GET/PUT/DELETE /api/admin/photographers/[id]` — single photographer
- `GET/PUT /api/admin/photographers/[id]/images` — image list / reorder
- `GET/PUT /api/admin/ai-images` — AI image list
- `PUT /api/admin/reorder` — photographer display order
- `POST /api/admin/seed` — seed Redis from static files
- `GET /api/blob?u=<url>` — private blob proxy
