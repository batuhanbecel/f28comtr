# f/28 Production Agency Website

A modern Next.js 16.1 website for f/28 production agency, showcasing photographer and retoucher portfolios.

## Features

- **Homepage**: 7 full-screen sections featuring each photographer with background images
- **Portfolios Page**: Grid view of all photographers
- **Individual Portfolio Pages**: Masonry grid layout (3 columns) displaying each photographer's work
- **About Us Page**: Company information and brand logos
- **Fullscreen Hamburger Menu**: With background image and contact information
- **Optimized Performance**: WebP images, lazy loading, and Next.js Image optimization

## Tech Stack

- Next.js 16.1
- React 19
- TypeScript
- Tailwind CSS
- Sharp (image optimization)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
f28comtr/
├── app/
│   ├── about/          # About Us page
│   ├── portfolio/[id]/ # Dynamic portfolio pages
│   ├── portfolios/     # Portfolios listing page
│   ├── fonts/          # Custom fonts
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Homepage
│   └── globals.css     # Global styles
├── components/
│   ├── Menu.tsx        # Hamburger menu component
│   └── MasonryGrid.tsx # Masonry grid for portfolios
├── lib/
│   ├── data.ts         # Photographer data
│   └── utils.ts        # Utility functions
├── public/
│   ├── portfolios/     # Portfolio images
│   ├── logos/          # Brand and f/28 logos
│   └── menubg.webp     # Menu background
└── package.json
```

## Deployment

This project is configured for deployment on Vercel:

```bash
npm run build
```

## Photographers

- Yonca Muslubaş
- Berkin Metin
- Doğu Biricik
- Emre Yunusoğlu
- Kerem Çakmak
- Ömür Temel
- Ozan Çakmak

## Environment variables

Copy `.env.example` to `.env.local` and fill in values before running locally or deploying.

Required for full functionality:

- `ADMIN_PASSWORD` — admin panel login
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — editable page copy, SEO, portfolios
- `BLOB_READ_WRITE_TOKEN` — image uploads (Vercel Blob)
- `CONTACT_SMTP_USER` / `CONTACT_SMTP_PASS` — contact form email (Gmail app password)
- `CONTACT_TO` — recipient (defaults to `info@f28.com.tr`)
- `NEXT_PUBLIC_SITE_URL` — production URL for metadata and sitemap

## Contact

- Instagram: @f28production
- Email: info@f28.com.tr
- Location: Istanbul, Turkey
