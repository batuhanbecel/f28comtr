# Technical Context

## Technology Stack

### Core Framework
- **Next.js**: 16.1.0 with Turbopack
- **React**: 19
- **TypeScript**: Strict mode enabled
- **Node.js**: Compatible with latest LTS

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Global styles in `app/globals.css`
- **Fonts**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Icons**: Lucide icons (via Image components for social)

### Build & Development
- **Build Tool**: Turbopack (Next.js 16)
- **Package Manager**: npm
- **Development Server**: `npm run dev` (port 3000/3001)
- **Production Build**: `npm run build` (static export)

### Image Handling
- **Optimization**: Next.js Image component
- **Formats**: WebP, JPG, PNG
- **Loading**: Priority for above-fold, lazy for below-fold
- **Responsive**: Automatic srcset generation

## Development Setup

### Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

### Key Dependencies
- `next`: 16.1.0
- `react`: 19
- `react-dom`: 19
- `typescript`: Latest
- `tailwindcss`: Latest
- `@types/node`, `@types/react`, `@types/react-dom`

### Dev Dependencies (Type Definitions)
- `@types/estree`
- `@types/json-schema`
- `@types/json5`

## Configuration Files

### `next.config.ts`
- TypeScript configuration
- Image optimization settings
- Build optimizations

### `tailwind.config.ts`
- Custom color schemes
- Responsive breakpoints
- Plugin configurations

### `tsconfig.json`
- Strict type checking
- Path aliases (@/...)
- Module resolution

## Build Output
- **Type**: Static Site Generation (SSG)
- **Routes**: 15 pages total
- **Dynamic Routes**: `/portfolio/[id]` with 7 photographers
- **Static Routes**: `/`, `/production`, `/ai-based`, `/about`, `/portfolios`

## Performance Optimizations
- Turbopack for faster builds
- Image optimization with Next.js Image
- CSS optimization experiments enabled
- Package import optimization
- RequestAnimationFrame for scroll effects
- Passive event listeners for scroll

## Known Warnings
- Metadata viewport warnings (can be ignored or migrated to viewport export)
- These don't affect functionality or build success

## File System Structure
```
public/
├── ai-images/          # AI-generated images (dynamically loaded)
├── logos/
│   ├── f28/           # Brand logos
│   └── social/        # Social media icons
├── menubg.webp        # Menu background
├── landing-1.webp     # Landing page backgrounds
└── landing-2.jpg

app/
├── globals.css        # Global styles and typography
├── layout.tsx         # Root layout
└── [routes]/          # Page routes

components/            # Reusable React components
lib/                  # Utilities and data
```

## Browser Support
- Modern browsers with ES6+ support
- Safari (WebKit backdrop filters)
- Chrome/Edge (Chromium)
- Firefox
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment Considerations
- Static export ready
- No server-side runtime required
- Can be deployed to any static hosting (Vercel, Netlify, etc.)
- All images must be in public folder
- Environment variables not currently used
