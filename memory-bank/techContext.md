# Technical Context: f/28 Website

## Technologies Used

### Core Framework
- **Next.js 16.1**: React framework with App Router
- **React 19**: UI library
- **TypeScript 5**: Type-safe development

### Styling
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Autoprefixer**: Browser compatibility

### Image Processing
- **Sharp 0.33**: High-performance image optimization
- **Next.js Image**: Built-in image optimization component

### Data & Storage
- **Upstash Redis** (`@upstash/redis`): Photographer data, image ordering
- **Vercel Blob** (`@vercel/blob`): Image uploads (private store)
- **Image manifest** (`lib/image-manifest.ts`): Build-time static list for Vercel

### PDF Generation
- **jsPDF**: Client-side PDF generation (dynamically imported)

### Development Tools
- **ESLint 9**: Code linting
- **eslint-config-next**: Next.js-specific linting rules

## Development Setup

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
# Runs on http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Technical Constraints

### Image Requirements
- **Format**: WebP preferred for performance
- **Sizes**: Various sizes for responsive loading
- **Quality**: High quality maintained (90-95%)
- **Loading**: Lazy loading except priority images

### Browser Support
- Modern browsers (ES2017+)
- Mobile responsive design
- Touch-friendly interactions

### Performance Targets
- Fast initial page load
- Smooth scrolling
- No image loading freezes
- Optimized for Vercel deployment

## File Structure
```
f28comtr/
├── app/
│   ├── about/              # About page
│   ├── admin/              # Admin dashboard + login + photographers/[id] + ai-based
│   ├── ai-based/           # AI images gallery
│   ├── api/admin/          # Auth + CRUD API routes
│   ├── api/blob/           # Private blob proxy GET
│   ├── portfolio/[id]/     # Dynamic portfolio pages
│   ├── portfolios/         # Portfolios listing
│   ├── production/         # Production page (ParallaxSections)
│   ├── globals.css         # Global styles + animations
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page (client, cross-panel hover)
├── components/
│   ├── Menu.tsx            # Fullscreen nav overlay
│   ├── MasonryGrid.tsx     # Portfolio grid + lightbox
│   ├── ParallaxSection.tsx # Scroll + mouse parallax sections
│   ├── DownloadPortfolio.tsx # jsPDF portfolio generator
│   ├── BackgroundPreloader.tsx
│   ├── PageLoader.tsx
│   ├── Footer.tsx
│   └── BackToTop.tsx
├── lib/
│   ├── auth.ts             # JWT admin auth
│   ├── data.ts             # Static photographer data (fallback)
│   ├── db.ts               # Redis CRUD + getAIImages
│   ├── image-manifest.ts   # Build-time image list
│   └── utils.ts            # getPortfolioImages, getAIImages (manifest)
├── scripts/
│   └── generate-image-manifest.js
├── public/
│   ├── logos/f28/          # f28_white.png
│   ├── portfolios/         # Portfolio images + previews
│   ├── ai-images/          # AI gallery images
│   ├── landing-1.webp
│   └── landing-2.jpg
└── memory-bank/
```

## Deployment Configuration

### Vercel Deployment
- Automatic deployments from Git
- Environment: Node.js
- Build command: `npm run build`
- Output directory: `.next`
- Framework preset: Next.js

### Environment Variables
- `ADMIN_PASSWORD` — admin panel login
- `REDIS_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN` — Upstash Redis
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob private store

## Tool Usage Patterns

### Next.js Image Component
```tsx
<Image
  src="/path/to/image.webp"
  alt="Description"
  fill // or width/height
  className="object-cover"
  priority={isAboveFold}
  sizes="(max-width: 768px) 100vw, 50vw"
  quality={90}
/>
```

### Dynamic Routes
```tsx
// generateStaticParams for static generation
export async function generateStaticParams() {
  return photographers.map((p) => ({ id: p.id }));
}
```

### Server-Side File Reading
```tsx
// Only in Server Components
import fs from 'fs';
const files = fs.readdirSync(path);
```

## Dependencies Summary
- **Production**: next, react, react-dom, sharp, @upstash/redis, @vercel/blob, @vercel/analytics, @vercel/speed-insights, jspdf, dnd-kit, react-hot-toast
- **Development**: TypeScript, Tailwind, ESLint, PostCSS
- **Unused** (should remove): react-xmasonry, zustand
- **Total packages**: ~389 packages

## Key Commands
- `node scripts/generate-image-manifest.js` — regenerate image manifest before deploy
- `vercel --prod` — deploy to production via CLI
- `npx tsc --noEmit` — type check
- `git push origin master` — push to GitHub (Vercel may auto-deploy)
