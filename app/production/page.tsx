import { getPhotographers } from '@/lib/db';
import { ParallaxSection } from '@/components/ParallaxSection';
import { Footer } from '@/components/Footer';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { LocalizedHero } from '@/components/LocalizedHero';

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
        {/* Scroll arrow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 fade-in-up" style={{animationDelay: '0.5s'}}>
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white/20 text-[9px] tracking-[0.45em] uppercase">Scroll</span>
            <svg className="w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" d="M12 5v14M5 13l7 7 7-7" />
            </svg>
          </div>
        </div>
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
