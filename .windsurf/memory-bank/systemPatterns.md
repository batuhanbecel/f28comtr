# System Patterns

## Architecture Overview
Next.js App Router application with static site generation for optimal performance.

## Key Components

### Menu Component (`components/Menu.tsx`)
- **Type**: Client component ('use client')
- **State Management**: 
  - `isOpen`: Controls menu visibility
  - `isScrolled`: Triggers navbar background on scroll
- **Scroll Lock**: Prevents body scroll when menu is open
- **Animation Pattern**: Slide-in from right with staggered item entrance
- **Visibility Control**: Uses `translate-x-full`, `opacity-0`, and `pointer-events-none` when closed

### MasonryGrid Component (`components/MasonryGrid.tsx`)
- **Layout**: Responsive columns (1 → 2 → 3 → 4 based on screen size)
- **Fullwidth Mode**: Edge-to-edge layout for AI-based page
- **Image Loading**: Client-side state management for loaded images
- **Props**: `images[]`, `photographerName`

### ParallaxSection Component (`components/ParallaxSection.tsx`)
- **Scroll Effect**: Dynamic translateY based on scroll position
- **Performance**: Uses requestAnimationFrame for smooth animations
- **Image Optimization**: Priority loading for first section
- **Typography**: Standardized heading classes

## File Structure
```
app/
├── page.tsx                    # Split landing page (Production/AI Based)
├── production/page.tsx         # Production homepage with photographer sections
├── ai-based/page.tsx          # AI-based work showcase
├── about/page.tsx             # Company information
├── portfolio/[id]/page.tsx    # Individual photographer portfolios
└── portfolios/page.tsx        # All portfolios overview

components/
├── Menu.tsx                   # Navigation with hamburger menu
├── MasonryGrid.tsx           # Image grid layout
└── ParallaxSection.tsx       # Photographer showcase sections

lib/
├── data.ts                   # Photographer data and contact info
└── utils.ts                  # Utility functions (getAIImages, etc.)

public/
├── ai-images/                # AI-generated images
├── menubg.webp              # Hamburger menu background
├── landing-1.webp           # Production section background
└── landing-2.jpg            # AI-based section background
```

## Design Patterns

### Typography System
Utility classes defined in `globals.css`:
- `.heading-hero`: 2.5rem → 6rem, weight 900, tight spacing
- `.heading-xl`: 2rem → 4rem, weight 300, uppercase
- `.heading-lg`: 1.5rem → 2.5rem, weight 300
- `.body-text`: 1rem → 1.125rem, weight 400
- `.label-text`: 0.75rem → 0.875rem, weight 600, uppercase

### Animation Patterns
- **Menu Opening**: 700ms ease-out slide + fade
- **Menu Items**: Staggered 100ms delays
- **Hover Effects**: 500ms smooth transitions
- **Scroll Effects**: requestAnimationFrame for 60fps

### Image Optimization
- Next.js Image component with `fill` and `object-cover`
- Priority loading for above-fold content
- Quality settings: 85-90 for backgrounds
- Responsive `sizes` attribute for proper loading

## Critical Implementation Details

### Menu Visibility Fix
Must use all three properties together:
```tsx
className={isOpen 
  ? 'translate-x-0 pointer-events-auto opacity-100' 
  : 'translate-x-full pointer-events-none opacity-0'
}
```

### AI Images Loading
Server component pattern:
```tsx
import { getAIImages } from '@/lib/utils';
const aiImages = getAIImages();
```

### Scroll Lock Pattern
```tsx
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
}, [isOpen]);
```
