# f/28 Production Agency Website

A modern Next.js 16 website for f/28 production agency, showcasing photographer and retoucher portfolios.

## Features

- **Homepage**: Modern hero slides, selected campaign works, studio stats, and brand partners
- **Portfolios Page**: Grid view of all photographers & retouchers with text index
- **Individual Portfolio Pages**: Masonry grid layout displaying each artist's work with client-side PDF portfolio download
- **AI Powered Gallery**: Showcase for generative and hybrid AI retouching works with category & brand filtering
- **Production Showcase**: Snap-scroll showcase of production team and service statistics
- **About Us Page**: Agency statement, metrics, and curated client/partner logo grids
- **Contact Page**: Inquiries and booking form powered by Nodemailer
- **Sanity Studio v5**: Embedded Headless CMS at `/studio` with live visual editing and ISR revalidation

## Tech Stack

- Next.js 16 (App Router, Proxy, View Transitions)
- React 19
- TypeScript 5
- Tailwind CSS & Editorial Design Tokens
- Sanity Studio v5 (`next-sanity`, Visual Editing)
- Framer Motion

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (see below).

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) for the website or [http://localhost:3000/studio](http://localhost:3000/studio) for Sanity Studio.

## Deployment

Configured for deployment on Vercel:
```bash
npm run build
```

## Photographers & Retouchers

- Yonca Muslubaş (Photographer)
- Berkin Metin (Photographer)
- Doğu Biricik (Retoucher)
- Emre Yunusoğlu (Photographer)
- Haldun Kırkbir (Photographer)
- Kerem Çakmak (Retoucher)
- Ömür Temel (Photographer)
- Ozan Çakmak (Photographer)
- Batuhan Becel (Retoucher)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values before running locally or deploying.

Required for full functionality:

- `NEXT_PUBLIC_SITE_URL` — production URL for metadata, sitemap, and canonical links
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` — Sanity dataset (e.g. `production`)
- `SANITY_API_READ_TOKEN` — Viewer token for Visual Editing / draft mode
- `SANITY_API_WRITE_TOKEN` — Editor token for migration scripts
- `SANITY_REVALIDATE_SECRET` — Webhook secret for ISR on-demand revalidation
- `CONTACT_SMTP_USER` / `CONTACT_SMTP_PASS` — contact form SMTP credentials
- `CONTACT_TO` — recipient email address (defaults to `info@f28.com.tr`)

## Contact

- Instagram: @f28production
- Email: info@f28.com.tr
- Location: Istanbul, Turkey

