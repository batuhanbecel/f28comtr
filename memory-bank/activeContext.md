# Active Context: f/28 Website Development

## Current Work Focus
f/28 website is LIVE at https://www.f28.com.tr (Vercel). Full admin panel, Redis backend, AI Based section, Download Portfolio PDF, and mouse-interactive production page are all working in production.

## Recent Changes (Current Session)
1. **Landing Page Redesign**
   - `'use client'` component with cross-panel hover dimming (useState)
   - Hovering one side dims opposite to bg-black/75
   - Section numbers 01/02, expanding thin rules, always-visible labels
   - Enter CTA slides up on hover with horizontal line prefix
   - Bottom strip: `Istanbul — f28.com.tr`

2. **Production Page Hero + Mouse Parallax**
   - Full-screen hero section with description text
   - Each ParallaxSection now has mouse-tracking parallax
   - RAF lerp loop: image drifts ±28px X / ±14px Y opposite to cursor
   - Scroll Y and mouse Y combined on single translate3d

3. **AI Based Page Hero + Body Text**
   - min-h-screen hero with label, heading, body text, works count
   - Animated bounce scroll arrow at bottom

4. **Admin Panel**
   - Stats bar (photographer count, quick links)
   - ★ Set as Preview button on image hover overlay
   - Drag-to-reorder images, move ±1 arrows, remove button

5. **Download Portfolio PDF (jsPDF)**
   - Cover: preview image (58%), centered text, centered f/2.8 logo
   - Per-photo pages with page counter
   - End page: THANK YOU + photographer name + centered logo
   - Turkish character slug: ç→c, ğ→g, ı→i, ö→o, ş→s, ü→u

6. **MasonryGrid**
   - All images eager loaded
   - Removed custom opacity loading state; Next.js blur placeholder used

## Next Steps
1. Visual polish: custom cursor, portfolios listing redesign, micro-animations
2. Contact info completion
3. Mobile testing

## Active Decisions and Considerations

### Font Strategy
- Using system fonts instead of custom Geist fonts
- Fallback: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto
- Can be upgraded to custom fonts later if needed

### Image Handling
- All portfolio images served from `/public/portfolios/`
- Preview images in `/portfolios/previews/` subfolder
- Next.js Image component handles optimization automatically
- Lazy loading for portfolio grids, priority for hero images

### Routing Structure
- Static generation for all pages
- Dynamic routes for individual portfolios
- Pre-rendering at build time for optimal performance

## Important Patterns and Preferences

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Server Components by default, Client Components when needed
- Tailwind for all styling (no CSS modules)

### Performance Priorities
1. Fast initial load
2. Smooth scrolling
3. Optimized images
4. No layout shifts
5. Mobile-first responsive design

### Component Organization
- Keep components focused and single-purpose
- Use composition over inheritance
- Separate client and server components clearly
- Minimal prop drilling

## Learnings and Project Insights

### Next.js 16.1 Specifics
- Requires ESLint 9+ (not 8)
- App Router is default and preferred
- Turbopack enabled for faster dev builds
- React 19 compatibility

### Image Optimization
- Sharp handles automatic WebP conversion
- Next.js Image component requires explicit sizes or fill
- Priority prop crucial for above-fold images
- Responsive sizes improve performance significantly

### Portfolio Structure
- 7 photographers with varying portfolio sizes
- Yonca Muslubaş: 363 images (largest)
- Ömür Temel: 180 images
- Doğu Biricik: 122 images
- Others: 35-74 images each

### Asset Formats
- Preview images: Mixed (webp, jpg, png)
- Brand logos: All PNG format
- Menu background: WebP format
- Portfolio images: Mixed formats (to be optimized)

## Design Decisions

### Homepage Layout
- **Section Height**: 66vh (shows 1.5 sections for visual interest)
- **Parallax Effect**: Images move 200px range with 120% container height
- **Typography Hierarchy**:
  - Title (PHOTOGRAPHER/RETOUCHER): text-3xl, font-black, wide tracking
  - Name: text-7xl, font-bold
  - SEE ALL: text-lg, font-bold with animated dash
- **Overlay**: 60% black opacity for text readability

### Animations & Interactions
- **Page Transitions**: 1s loader with scale-fade animation
- **Parallax**: Smooth scroll-based image movement
- **SEE ALL Hover**: Animated SVG dash sliding left to right
- **Header Blur**: Activates on scroll with smooth transition
- **Back to Top**: Fades in after 500px scroll

### Performance Optimizations
- Full-width masonry grid (no max-width constraints)
- Object-center positioning for consistent image cropping
- Priority loading for first section images
- Lazy loading for portfolio grids

## Known Issues
- Font files are placeholders (using system fonts)
- Contact phone number uses placeholder ("+90 XXX XXX XX XX")
- npm audit shows 1 high severity vulnerability (to be reviewed)
- Some preview images in mixed formats (jpg, png, webp)

## Current Status
✅ Project structure complete
✅ All pages implemented and refined
✅ Modern UI/UX with animations
✅ Parallax effects working
✅ Page loader implemented
✅ Back to top functionality
✅ Header blur on scroll
✅ Full-width portfolio grids
✅ Development server running
✅ Photographer order finalized
⏳ Deployment to Vercel pending
⏳ Contact info needs completion
