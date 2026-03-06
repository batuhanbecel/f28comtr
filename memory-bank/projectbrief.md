# Project Brief: f/28 Production Agency Website

## Project Overview
Create a modern, high-performance website for f/28, a production agency specializing in photography and retouching services.

## Core Requirements

### Technology Stack
- Next.js 16.1
- React 19
- TypeScript
- Tailwind CSS
- Deployment: Vercel

### Site Structure
The website consists of 3 main pages:
1. **Homepage** - Showcase all 7 photographers with full-screen sections
2. **Portfolios** - Grid view of all photographers
3. **About Us** - Company information and brand partnerships

### Photographers
Eight photographers/retouchers featured:
- Batuhan Becel
- Yonca Muslubaş
- Berkin Metin
- Doğu Biricik
- Emre Yunusoğlu
- Kerem Çakmak
- Ömür Temel
- Ozan Çakmak

### Key Features
1. **Homepage Sections**: 7 full-screen sections, each featuring one photographer with:
   - Background image from their portfolio preview
   - Photographer's full name in large typography
   - "SEE ALL PORTFOLIO" call-to-action button

2. **Individual Portfolio Pages**: Dynamic pages for each photographer with:
   - Hero section with photographer name and background image
   - 3-column masonry grid displaying all portfolio images
   - Click to view full-size images

3. **Fullscreen Hamburger Menu**:
   - Uses menubg.webp as background
   - Shows navigation links
   - Displays Instagram, email, phone, and address
   - Smooth transitions

4. **About Us Page**:
   - Company description
   - Brand logos grid (26 brands)
   - Contact information

### Performance Requirements
- **Critical**: Site must be very fast despite large image volumes
- No freezing or lag
- Optimized image loading with Next.js Image component
- WebP format for all images
- Lazy loading for portfolio images
- Responsive design for all devices

### Asset Structure
- Portfolio images: `/public/portfolios/{photographer-folder}/`
- Preview images: `/public/portfolios/previews/{photographer-name}.{ext}`
- Brand logos: `/public/logos/brands/`
- f/28 logos: `/public/logos/f28/`
- Menu background: `/public/menubg.webp`

## Success Criteria
- Modern, professional design
- Fast loading times with no performance issues
- Smooth navigation and transitions
- Mobile-responsive layout
- Successfully deployed to Vercel
