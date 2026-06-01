import { LandingPanels } from '@/components/LandingPanels';
import { getLandingImages } from '@/lib/db';

export default async function Home() {
  const landingImages = await getLandingImages();
  return <LandingPanels initialImages={landingImages} />;
}
