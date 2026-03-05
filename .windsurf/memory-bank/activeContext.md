# Active Context

## Current Work Focus
Completed full Next.js 16.1 / React 19 modernization of all components and pages. Site is LIVE at https://www.f28.com.tr (Vercel).

## Recent Changes (March 5, 2026)

### Next.js 16.1 / React 19 Modernization
1. **View Transitions API** — Enabled `viewTransition: true` in `next.config.ts`, added `::view-transition-*` CSS animations for smooth cross-page fade+blur transitions
2. **React 19 `use()` hook** — Replaced `useContext()` with `use()` in `LanguageContext.tsx`
3. **React 19 `useDeferredValue`** — Applied to MasonryGrid for large image lists (smoother transitions)
4. **React 19 `useTransition`** — Applied to PageLoader for transition-aware progress bar
5. **`useCallback` everywhere** — Menu (toggleMenu, closeMenu), BackToTop, ProductionSnapContainer (handleWheel), LanguageProvider (setLang)
6. **MutationObserver** — Replaced interval polling in Menu.tsx scroll detection
7. **useEffect cleanup** — Fixed missing deps in ParallaxSection (fullscreen), proper alive flag in RAF loops
8. **Metadata API** — Added static `metadata` exports to all pages (about, ai-based, production, portfolios) and dynamic `generateMetadata` for `[id]` pages
9. **PageLoader** — Simplified with CSS `@keyframes page-load` animation instead of manual setTimeout chain
10. **CSS animations** — Added `page-load` keyframe, `vt-fade-in/out` for View Transitions

### Masonry Grid Fix (earlier same session)
- Fixed broken layout: CSS Grid → manual flex columns with round-robin distribution
- Preserves admin panel sort order (row-first visual order)
- Uses `useDeferredValue` for large image sets

### Navigation Structure
Current menu items:
- HOME (/)
- PRODUCTION (/production)
- AI BASED (/ai-based)
- PORTFOLIOS (/portfolios)
- ABOUT US (/about)

## Next Steps
- Deploy updated code to Vercel
- Visual polish: micro-animations
- Mobile testing

## Important Patterns
- **MasonryGrid**: Manual flex columns with round-robin distribution (not CSS columns/grid) — preserves admin sort order
- **View Transitions**: `viewTransition: true` in config + CSS `::view-transition-*` pseudo-elements
- **React 19**: `use()` for context, `useDeferredValue` for large lists, `useTransition` for navigation awareness
- **All handlers**: Wrapped in `useCallback` for referential stability
- **Menu scroll detection**: Uses MutationObserver (not setInterval) to detect snap container mount
- **Typography system**: utility classes (heading-hero, body-text, label-text)
- **All pages**: Have proper `metadata` or `generateMetadata` exports
