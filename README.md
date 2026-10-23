<div align="center">

# f/2.8 Production

**Photography, retouch and hybrid AI production — Istanbul, since 2008.**

The website of [f/2.8 Production Agency](https://www.f28.com.tr): artist portfolios, production case studies and an AI-powered work gallery, edited entirely from an embedded Sanity Studio.

[![Next.js](https://img.shields.io/badge/Next.js-16.4-000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.3-000?logo=react&logoColor=61DAFB)](https://react.dev)
[![Sanity](https://img.shields.io/badge/Sanity_Studio-v5-000?logo=sanity&logoColor=F03E2F)](https://www.sanity.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-000?logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel&logoColor=white)](https://vercel.com)

[Website](https://www.f28.com.tr) · [Instagram](https://www.instagram.com/f28production) · [LinkedIn](https://linkedin.com/company/f-2-8-production/)

</div>

---

## What's inside

| Page | Route | What it does |
| --- | --- | --- |
| **Home** | `/` | A cinematic opening (a small frame grows to full screen) leading into a numbered reel of featured work, then a pinned AI scroll scene, a strip of selected work, the artist roster and the client wall |
| **Production** | `/production` | Services, process, deliverables and production case studies (`/production/works/[slug]`) |
| **AI-Powered** | `/ai-powered` | Filterable gallery of generative and hybrid AI work, with a page for each work at `/ai-powered/works/[slug]`, plus a curated portfolio at `/ai-powered/portfolio` |
| **Portfolios** | `/portfolios` · `/[artist]` | Index of the photographers and retouchers; each artist gets a masonry gallery, a lightbox and a client-side PDF portfolio download |
| **About Us** | `/about` | Studio statement, studio numbers and the client/partner logo wall |
| **Contact** | `/contact` | Contact channels and a rate-limited enquiry form (Nodemailer) |
| **Studio** | `/studio` | Embedded Sanity Studio (Turkish UI) with Visual Editing |

Everything visible on the site — copy in both languages, images, ordering, SEO — is editable in Studio. Each string falls back to `lib/translations.ts`, so the site still renders when a Studio field is left empty.

## Design language

The whole site uses one design language, which we call "gallery". The full rules are in [`AGENTS.md`](AGENTS.md):

- **Type:** Geist for headings (600, tight tracking) and Inter for body text, with no serif or italics. Headings typed in ALL CAPS in the CMS are converted to sentence case when the page renders.
- **Imagery:** photographs run edge to edge with no gaps between them. Galleries show 3 columns on tablets and desktops and 2 on phones, with no dark overlays on hover.
- **Structure:** sections are separated by hairlines, lists are numbered index rows, and the logo wall is monochrome. There are no cards or panels.
- **Motion:** a short reveal above the fold and scroll-triggered reveals below it, using native scrolling only. Everything respects `prefers-reduced-motion`.
- **Themes:** light and dark themes, stored in a cookie and rendered on the server, so the page never flashes the wrong theme on load. The mobile menu sheet follows the active theme.

## Tech stack

- **Framework:** Next.js 16 (App Router, `proxy.ts`, React 19 `ViewTransition`), TypeScript 5
- **CMS:** Sanity Studio v5 via `next-sanity`, with Visual Editing, draft mode and on-demand ISR (`/api/revalidate`)
- **Images:** a custom loader in `lib/sanityImageLoader.ts` resizes images on Sanity's CDN, so the originals (some over 10,000 px wide) never pass through `/_next/image`
- **Styling:** Tailwind CSS 3 plus CSS design tokens (`--ease-*`, `--duration-*`, `--text-*`) in `app/globals.css`
- **Testing & quality:** Vitest and ESLint
- **Hosting:** Vercel, with Analytics and Speed Insights

## Project structure

```
app/                 Routes (App Router), global styles, metadata, sitemap, OG images
  home-v2/           Home page sections (hero reel, AI scene, roster, logo wall)
  ai-powered/        AI gallery, filters, lightbox, per-work pages
  production/        Production page and case studies
  api/               contact · draft-mode · revalidate
components/          Shared UI (Menu, Footer, Lightbox, MasonryGrid, gallery/*)
lib/                 CMS queries (sanity.*.ts), SEO, structured data, translations, image sizes
sanity/              Studio schemas, desk structure, theme and custom components
scripts/             One-off migrations and content fixes (Sanity)
tests/               Vitest unit tests
```

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

- Site: <http://localhost:3000>
- Studio: <http://localhost:3000/studio>

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production URL, used for metadata, the sitemap and canonical links |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` | Sanity project and dataset |
| `SANITY_API_READ_TOKEN` | Viewer token for Visual Editing and draft mode |
| `SANITY_API_WRITE_TOKEN` | Editor token for scripts in `scripts/` |
| `SANITY_REVALIDATE_SECRET` | Webhook secret for on-demand ISR |
| `CONTACT_SMTP_USER` / `CONTACT_SMTP_PASS` | SMTP credentials for the contact form |
| `CONTACT_TO` | Contact form recipient (defaults to `info@f28.com.tr`) |
| `GOOGLE_SITE_VERIFICATION` | Optional Search Console verification |

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` / `npm start` | Make a production build and serve it |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Vitest suite |
| `npx sanity schema validate` | Validate the Studio schemas |
| `npm run fix:production-tr` | Push the Turkish Production page copy to Sanity (pass `--dry-run` to preview) |
| `npm run migrate:*` | One-off content migrations into Sanity |

## SEO

- Every page sets its title and description from Studio (or from the fallback copy), with canonical links and EN/TR alternate links.
- `Organization` and `WebSite` structured data (JSON-LD), including the alternate site names Google uses as the site name.
- A dynamic `sitemap.xml` covering every artist, AI work and production project, plus `robots.txt` and generated Open Graph images.

## Artists

**Photographers:** Ozan Çakmak · Emre Yunusoğlu · Berkin Metin · Selçuk Danyıldız · Yonca Muslubaş · Haldun Kırkbir · Ömür Temel
**Retouchers:** Kerem Çakmak · Doğu Biricik · Batuhan Becel

## Contact

**f/2.8 Production Agency**: Mecidiyeköy, Şişli, Istanbul · [info@f28.com.tr](mailto:info@f28.com.tr)

<sub>© f/2.8 Production. All imagery belongs to its respective artists and clients and may not be reused without permission.</sub>
