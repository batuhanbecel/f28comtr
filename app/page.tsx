import type { Metadata } from 'next';
import { LandingPanels } from '@/components/LandingPanels';
import { getLandingImages } from '@/lib/cms';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('home', '/');
}

export default async function Home() {
  const landingImages = await getLandingImages();
  return <LandingPanels initialImages={landingImages} />;
}
