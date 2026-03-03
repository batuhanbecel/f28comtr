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
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── fonts/             # Font files (placeholder)
│   ├── portfolio/[id]/    # Dynamic portfolio routes
│   ├── portfolios/        # Portfolios listing
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── Menu.tsx          # Navigation menu
│   └── MasonryGrid.tsx   # Portfolio grid
├── lib/                  # Utilities and data
│   ├── data.ts          # Photographer data
│   └── utils.ts         # Helper functions
├── public/              # Static assets
│   ├── logos/          # Brand and f/28 logos
│   ├── portfolios/     # Portfolio images
│   └── menubg.webp     # Menu background
├── memory-bank/        # Project documentation
├── next.config.ts      # Next.js configuration
├── tailwind.config.ts  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```

## Deployment Configuration

### Vercel Deployment
- Automatic deployments from Git
- Environment: Node.js
- Build command: `npm run build`
- Output directory: `.next`
- Framework preset: Next.js

### Environment Variables
None required for basic deployment

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
- **Production**: next, react, react-dom, sharp
- **Development**: TypeScript, Tailwind, ESLint, PostCSS
- **Total packages**: ~389 packages
