import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { CustomCursor } from "@/components/CustomCursor";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/context/LanguageContext";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "f/2.8 Production Agency | Photography & Retouching",
  description: "Professional photography and retouching production agency in Istanbul. Featuring top photographers and retouchers for commercial and creative projects.",
  keywords: ["photography", "retouching", "production agency", "Istanbul", "commercial photography", "f28"],
  authors: [{ name: "f/2.8 Production" }],
  creator: "f/2.8 Production",
  publisher: "f/2.8 Production",
  icons: {
    icon: "/logos/f28/favicon.jpg",
  },
  openGraph: {
    title: "f/2.8 Production Agency",
    description: "Professional photography and retouching production agency",
    type: "website",
    locale: "en_US",
    url: "https://www.f28.com.tr",
    siteName: "f/2.8 Production Agency",
  },
  alternates: {
    canonical: "https://www.f28.com.tr",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'f/2.8 Production Agency',
              url: 'https://www.f28.com.tr',
              logo: 'https://www.f28.com.tr/logos/f28/f28_white.png',
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
              knowsAbout: ['Photography', 'Retouching', 'AI Visual Content', 'Commercial Photography'],
            }),
          }}
        />
      </head>
      <body className="antialiased bg-th-bg text-th-fg">
        <ThemeProvider>
          <LanguageProvider>
            <SmoothScrollProvider>
              <CustomCursor />
              <SiteChrome />
              {children}
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
