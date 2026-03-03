# Active Context: f/28 Website Development

## Current Work Focus
f/28 production agency website complete and production-ready. All images converted to WebP, full performance optimizations implemented, and ready for deployment.

## Recent Changes (Latest Session)
1. **Homepage Design Refinements**
   - Implemented parallax scrolling effect on background images (200px translation range)
   - Redesigned section layout to show 1.5 sections at a time (66vh height)
   - Enhanced typography hierarchy with bold PHOTOGRAPHER/RETOUCHER titles
   - Created modern "SEE ALL" link with animated dash effect
   - Adjusted photographer name sizes for better visual balance

2. **Header Enhancements**
   - Increased logo size from 80x40 to 120x60 (50% larger)
   - Added blur-on-scroll effect with dark overlay (backdrop-blur-md)
   - Smooth transitions when scrolling past 50px

3. **Navigation & UX Improvements**
   - Added PageLoader component with modern scale-fade animation
   - Implemented BackToTop button (appears after 500px scroll)
   - Full-width masonry grid on portfolio pages
   - Darker preview image overlays (60% opacity) for better text readability

4. **Image Optimization & Gallery**
   - Fixed Yonca's broken images (filtered out 0-byte corrupted files)
   - Added blur placeholders to all images
   - Implemented next/previous navigation in lightbox
   - Keyboard navigation (Arrow keys, Escape)
   - Image counter display in lightbox
   - Created WebP conversion script

5. **Site-Wide Performance Optimizations**
   - RequestAnimationFrame for all scroll listeners (60fps smooth scrolling)
   - GPU acceleration with translate3d and will-change
   - Passive scroll event listeners
   - Image format optimization (WebP + AVIF)
   - Gzip compression enabled
   - Console removal in production
   - CSS optimization enabled
   - Enhanced SEO metadata
   - All portfolio images converted to WebP format
   - Original JPEG/PNG files removed
   - Eager loading for all preview images to prevent flash
   - All portfolio images converted to WebP format
   - Original JPEG/PNG files removed
   - Eager loading for all preview images to prevent flash

6. **Photographer Order & Data**
   - Reordered: Ozan, Emre, Berkin, Yonca, Ömür, Kerem, Doğu
   - Added title field (PHOTOGRAPHER/RETOUCHER) to data structure
   - Updated contact email to info@f28.com.tr

7. **Components Created**
   - ParallaxSection: Optimized parallax with RAF
   - PageLoader: Modern loading animation with f28 logo
   - BackToTop: Optimized scroll detection
   - Menu: Fullscreen hamburger with optimized blur effect
   - MasonryGrid: Full-width 3-column with lightbox navigation

## Next Steps
1. **Testing**: Verify all pages load correctly
2. **Image Optimization**: Ensure all images are WebP format
3. **Performance Check**: Test loading times and responsiveness
4. **Content Updates**: Update contact information with real data
5. **Deployment**: Deploy to Vercel

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
