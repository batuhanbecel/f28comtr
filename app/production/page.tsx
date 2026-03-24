import type { Metadata } from 'next';
import { getPhotographers } from '@/lib/db';
import { ParallaxSection } from '@/components/ParallaxSection';
import { Footer } from '@/components/Footer';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { LocalizedHero } from '@/components/LocalizedHero';
import { ScrollIndicator } from '@/components/ScrollIndicator';

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
    <ProductionSnapContainer>
      {/* Hero — snap point 1 */}
      <section
        className="h-screen flex flex-col items-center justify-center px-6 md:px-12 relative overflow-hidden"
        style={{ scrollSnapAlign: 'start' }}
      >
        <LocalizedHero page="production" />
        <ScrollIndicator />
      </section>

      {/* One snap point per photographer */}
      {photographers.map((photographer, index) => (
        <ParallaxSection
          key={photographer.id}
          photographer={photographer}
          index={index}
          total={photographers.length}
          fullscreen
        />
      ))}

      {/* Footer — final snap point */}
      <div style={{ scrollSnapAlign: 'start' }}>
        <Footer />
      </div>
    </ProductionSnapContainer>
  );
}
