import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { ViewTransition } from "@/lib/ViewTransition";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { CustomCursor } from "@/components/CustomCursor";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/context/LanguageContext";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { parseLang, parseTheme } from "@/lib/prefs";
import { getSiteUrl, absoluteUrl } from "@/lib/siteUrl";
import { SITE_NAME } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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
    "Professional photography and retouching production agency in Istanbul. Featuring top photographers and retouchers for commercial and creative projects.",
  keywords: ["photography", "retouching", "production agency", "Istanbul", "commercial photography", "f28"],
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

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    logo: absoluteUrl('/icon'),
    description: 'Professional photography and retouching production agency in Istanbul.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mecidiyeköy, Kuştepe Mahallesi, Yoncalı Sokak, No: 1',
      addressLocality: 'Şişli',
      addressRegion: 'İstanbul',
      postalCode: '34387',
      addressCountry: 'TR',
    },
    sameAs: [
      'https://www.instagram.com/f28production',
      'https://linkedin.com/company/f-2-8-production/',
    ],
    foundingDate: '2008',
    knowsAbout: ['Photography', 'Retouching', 'AI-Powered Production', 'Commercial Photography'],
  };

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: siteUrl },
  };

  return (
    <html lang={initialLang} className={inter.variable} data-theme={initialTheme}>
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
          <LanguageProvider initialLang={initialLang}>
            <SmoothScrollProvider>
              <CustomCursor />
              <SiteChrome />
              <ViewTransition>{children}</ViewTransition>
              <SpeedInsights />
              <Analytics />
              <ServiceWorkerRegister />
            </SmoothScrollProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
