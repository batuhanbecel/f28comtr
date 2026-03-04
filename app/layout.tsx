import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { CustomCursor } from "@/components/CustomCursor";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/context/LanguageContext";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

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
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
      </head>
      <body className="antialiased bg-black text-white">
        <LanguageProvider>
          <SmoothScrollProvider>
            <CustomCursor />
            <SiteChrome />
            {children}
            <SpeedInsights />
            <Analytics />
          </SmoothScrollProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
