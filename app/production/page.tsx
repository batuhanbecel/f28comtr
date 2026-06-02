import type { Metadata } from 'next';
import { getPhotographers } from '@/lib/db';
import { ParallaxSection } from '@/components/ParallaxSection';
import { Footer } from '@/components/Footer';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { EditorialPageHero } from '@/components/EditorialPageHero';
import { ProductionStats } from '@/components/ProductionStats';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('production', '/production');
}

export const revalidate = 60;

export default async function ProductionPage() {
  const photographers = await getPhotographers();

  return (
    <ProductionSnapContainer snapMode="heroSnap">
      <EditorialPageHero page="production" scrollSnap>
        <ProductionStats projectCount={1000} brandCount={150} inHero />
      </EditorialPageHero>

      {photographers.map((photographer, index) => (
        <ParallaxSection
          key={photographer.id}
          photographer={photographer}
          index={index}
          total={photographers.length}
          fullscreen
        />
      ))}

      <div style={{ scrollSnapAlign: 'start' }}>
        <Footer />
      </div>
    </ProductionSnapContainer>
  );
}
