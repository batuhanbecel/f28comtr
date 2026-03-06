# Product Context: f/28 Production Agency Website

## Purpose
The f/28 website serves as a digital portfolio and showcase platform for a production agency specializing in photography, retouching, and AI-based visual content. It presents the work of 8 photographers/retouchers and the agency's AI capabilities.

## Problems It Solves
1. **Portfolio Presentation**: Centralized platform to showcase high-quality photography and AI-generated work
2. **Client Discovery**: Explore different photographers' styles, download portfolio PDFs
3. **Brand Credibility**: Partner agency logos + client brand logos on About page
4. **Contact Facilitation**: Menu + About page with contact details
5. **Content Management**: Admin panel for photographer/image CRUD without code changes

## How It Works

### User Journey
1. **Landing**: Two-panel split — "Production" (left) and "AI Based" (right) with mouse parallax
2. **Production**: Snap-scroll through photographer sections with parallax backgrounds
3. **Portfolios**: Visual grid of photographer cards with hover effects
4. **Portfolio Detail**: Hero image + masonry grid + PDF download button
5. **AI Based**: Masonry grid of AI-generated images
6. **About**: Agency stats + partner/client logo grids
7. **Contact**: Fullscreen menu overlay with Instagram, email, phone, address

### User Experience Goals
1. **Visual Impact**: Large imagery, film grain overlay, custom cursor, parallax effects
2. **Smooth Performance**: ISR, eager loading with blur placeholders, background preloading
3. **Easy Navigation**: Fullscreen menu, snap-scroll sections, back-to-top
4. **Professional Feel**: Black & white palette, minimal typography, editorial layout
5. **Bilingual**: EN/TR language toggle stored in localStorage

### Key Interactions
- **Two-panel landing**: Cross-panel hover dimming effect
- **Snap-scroll**: Custom wheel interception for Production/AI pages
- **PDF Download**: Multi-image layouts (2, 3, 4 per page) with cover/end pages
- **Masonry Grid**: 4-col desktop / 2-col mobile, lightbox on click
- **Mouse Parallax**: ParallaxSections respond to cursor movement
- **Admin Panel**: Drag-and-drop image reordering, photographer CRUD

## Target Audience
- Potential clients seeking photography/retouching/AI visual services
- Brands looking for production partnerships
- Industry professionals exploring talent
- Photography enthusiasts

## Brand Identity
- **Name**: f/2.8 (photography aperture reference)
- **URL**: https://www.f28.com.tr
- **Style**: Modern, minimalist, editorial, dark
- **Color Scheme**: Black background, white text, subtle gray accents
- **Typography**: Inter font, generous letter-spacing, uppercase labels
- **Visual Language**: Large imagery, bold typography, film grain, thin separator lines
