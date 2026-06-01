import type { Metadata } from 'next';
import { getPhotographers } from '@/lib/db';
import { ParallaxSection } from '@/components/ParallaxSection';
import { Footer } from '@/components/Footer';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { EditorialPageHero } from '@/components/EditorialPageHero';
import { ProductionStats } from '@/components/ProductionStats';

export const metadata: Metadata = {
  title: 'Production | f/2.8 Production Agency',
  description: 'Professional photography and retouching by top photographers. Based in Istanbul since 2008.',
  openGraph: {
    title: 'Production | f/2.8 Production Agency',
    description: 'Professional photography and retouching by top photographers. Based in Istanbul since 2008.',
    url: 'https://www.f28.com.tr/production',
  },
};

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
