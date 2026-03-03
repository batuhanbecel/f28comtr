# System Patterns: f/28 Website Architecture

## Architecture Overview
Next.js 16.1 App Router architecture with static generation for optimal performance.

## Key Technical Decisions

### 1. App Router Structure
```
app/
├── layout.tsx          # Root layout with Menu
├── page.tsx            # Homepage
├── portfolios/page.tsx # Portfolios listing
├── portfolio/[id]/     # Dynamic portfolio pages
└── about/page.tsx      # About page
```

### 2. Data Management
- **Static Data**: Photographer information in `/lib/data.ts`
- **File System**: Portfolio images read from `/public/portfolios/`
- **Server-Side**: Image lists generated at build time using `fs` module

### 3. Image Optimization Strategy
- **Next.js Image Component**: Automatic optimization and responsive images
- **WebP Format**: All images stored/converted to WebP
- **Lazy Loading**: Images below fold loaded on demand
- **Priority Loading**: First homepage section and hero images loaded with priority
- **Responsive Sizes**: Configured sizes for different viewport widths

### 4. Component Relationships
```
RootLayout
├── PageLoader (transition animations)
├── Menu (global navigation with blur effect)
├── BackToTop (scroll utility)
└── Page Content
    ├── Homepage: ParallaxSection components
    ├── Portfolios: Grid of photographers
    ├── Portfolio/[id]: Hero + MasonryGrid
    └── About: Company info + brand logos
```

## Design Patterns

### 1. Server Components (Default)
- All pages are Server Components by default
- Fetch data at build time
- Generate static paths for portfolio pages

### 2. Client Components
- `Menu.tsx`: Interactive hamburger menu with scroll detection and blur effect
- `MasonryGrid.tsx`: Interactive image gallery with lightbox
- `ParallaxSection.tsx`: Parallax scrolling effect with scroll event listeners
- `PageLoader.tsx`: Page transition animations with pathname detection
- `BackToTop.tsx`: Scroll-to-top button with visibility state

### 3. Dynamic Routing
- `/portfolio/[id]`: Dynamic routes for each photographer
- `generateStaticParams()`: Pre-render all portfolio pages at build time

### 4. Utility Functions
- `getPortfolioImages()`: Read portfolio images from file system
- `getBrandLogos()`: Read brand logos from file system

## Critical Implementation Paths

### Homepage Flow
1. Import photographer data from `/lib/data.ts` (ordered array)
2. Map over photographers array
3. Render ParallaxSection for each (66vh height)
4. ParallaxSection sets up scroll event listener
5. On scroll, calculate progress and translate image
6. Display title (PHOTOGRAPHER/RETOUCHER), name, and SEE ALL link
7. Animated dash on hover for SEE ALL

### Portfolio Page Flow
1. Receive `id` parameter from URL
2. Find photographer in data array
3. Call `getPortfolioImages()` to get image list
4. Render hero section with bold photographer name
5. Pass images to MasonryGrid component
6. MasonryGrid renders full-width 3-column layout (gap-2)
7. Click handler opens lightbox overlay

### Menu Flow
1. useState manages open/closed state
2. useEffect monitors scroll position
3. Apply blur effect when scrollY > 50px
4. Toggle button in fixed header
5. Fullscreen overlay with menubg.webp background
6. Navigation links close menu on click
7. Contact info displayed at bottom

### Page Transition Flow
1. PageLoader monitors pathname changes with usePathname
2. On route change, show loader with scale-fade animation
3. Display f28 logo with ping effect
4. After 600ms, trigger exit animation
5. After 1000ms, hide loader completely

### Parallax Effect Implementation
1. ParallaxSection creates refs for section and image container
2. useEffect sets up scroll event listener (passive)
3. On scroll, calculate section position relative to viewport
4. Compute scroll progress (0 to 1)
5. Translate image based on progress: (progress - 0.5) * 200px
6. Image container is 120% height to allow movement without gaps

## Performance Optimizations
1. **Static Generation**: All pages pre-rendered at build time
2. **Image Optimization**: Next.js automatic optimization
3. **Code Splitting**: Automatic per-route code splitting
4. **Lazy Loading**: Images loaded as needed
5. **CSS-in-JS**: Tailwind CSS for minimal runtime overhead
6. **Turbopack**: Fast development builds

## State Management
- Minimal state usage (only Menu component)
- No global state management needed
- Server-side data fetching at build time
