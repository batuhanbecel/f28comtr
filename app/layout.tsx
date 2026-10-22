import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import { ViewTransition } from "@/lib/ViewTransition";
import { translations } from "@/lib/translations";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { SiteHeader } from "@/components/SiteHeader";
import type { NavPhotographer } from "@/components/Menu";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/context/LanguageContext";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { SanityVisualEditing } from "@/components/SanityVisualEditing";
import { parseLang, parseTheme } from "@/lib/prefs";
import { getSiteUrl } from "@/lib/siteUrl";
import { SITE_NAME } from "@/lib/seo";
import { getContactInfo, getPhotographers } from "@/lib/cms";
import { getOrganizationStructuredData, getWebsiteStructuredData } from "@/lib/structuredData";

// latin-ext carries ş ğ ı İ — without it Turkish letters fall back to a system font.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

// Mono for `.mono-label` / `.caption-text` etc. (wires up the long-referenced
// but previously-undefined --font-mono, which had been falling back to the
// device's system monospace).
const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
});

// Display grotesk for headings (`.heading-*`) — confident, no italics.
const geistDisplay = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "f/2.8 Production Agency | Photography & Retouching",
    template: "%s | f/2.8 Production Agency",
  },
  description:
    "Professional photography, video, CGI, and AI-powered production agency in Istanbul since 2008.",
  keywords: [
    "photography",
    "retouching",
    "production agency",
    "Istanbul",
    "commercial photography",
    "AI-powered production",
    "videography",
    "CGI",
    "f28",
    "f/2.8 Production",
  ],
  authors: [{ name: "f/2.8 Production" }],
  creator: "f/2.8 Production",
  publisher: "f/2.8 Production",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLang = parseLang(cookieStore.get("f28_lang")?.value);
  const initialTheme = parseTheme(cookieStore.get("f28_theme")?.value);
  const siteUrl = getSiteUrl();

  const [photographers, initialContactInfo] = await Promise.all([
    getPhotographers(),
    getContactInfo(initialLang),
  ]);
  const navPhotographers: NavPhotographer[] = photographers.map((p) => ({
    id: p.id,
    fullName: p.fullName,
    title: p.title,
  }));

  const organizationLd = getOrganizationStructuredData(siteUrl, initialContactInfo, initialLang);
  const websiteLd = getWebsiteStructuredData(
    siteUrl,
    photographers.map((p) => p.id),
  );

  return (
    <html lang={initialLang} className={`${inter.variable} ${geistMono.variable} ${geistDisplay.variable}`} data-theme={initialTheme}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className="antialiased bg-th-bg text-th-fg">
        <ThemeProvider initialTheme={initialTheme}>
          <LanguageProvider initialLang={initialLang} initialContactInfo={initialContactInfo}>
            <SmoothScrollProvider>
              <a href="#main-content" className="skip-link">
                {translations[initialLang].a11y.skipToContent}
              </a>
              <SiteHeader photographers={navPhotographers} lang={initialLang} />
              <SiteChrome />
              <div id="main-content" tabIndex={-1} className="outline-none">
                <ViewTransition>{children}</ViewTransition>
              </div>
              <SpeedInsights />
              <Analytics />
              <ServiceWorkerRegister />
              <SanityVisualEditing />
            </SmoothScrollProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
