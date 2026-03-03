import type { Metadata } from "next";
import "./globals.css";
import { Menu } from "@/components/Menu";
import { PageLoader } from "@/components/PageLoader";
import { BackToTop } from "@/components/BackToTop";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  other: {
    'theme-color': '#000000',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        <PageLoader />
        <Menu />
        <BackToTop />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
