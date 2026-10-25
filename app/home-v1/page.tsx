import type { Metadata } from 'next';
import { LandingPanels } from '@/components/LandingPanels';
import { getLandingImages } from '@/lib/cms';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  // Legacy home kept for reference — keep it out of the index (duplicate of /)
  return generatePageMetadata('home', '/home-v1', { noIndex: true });
}

export default async function HomeV1() {
  const landingImages = await getLandingImages();
  return <LandingPanels initialImages={landingImages} />;
}
