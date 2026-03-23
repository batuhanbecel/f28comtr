import type { Metadata } from 'next';
import { getPartnerLogos, getClientLogos } from '@/lib/utils';
import { getPhotographers } from '@/lib/db';
import { Footer } from '@/components/Footer';
import { LocalizedHero } from '@/components/LocalizedHero';
import { LocalizedAboutBrands } from '@/components/LocalizedAboutBrands';
import { AboutStats } from '@/components/AboutStats';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';

export const metadata: Metadata = {
  title: 'About Us | f/2.8 Production Agency',
  description: 'Istanbul-based photography and production agency since 2008. Photography, video, CGI, animation, editing, and motion graphics.',
};

export const revalidate = 60;

const SERVICES = ['Photography', 'Videography', 'CGI', 'Animation', 'Editing', 'Motion Graphics'];

export default async function AboutPage() {
  const [partnerLogos, clientLogos] = await Promise.all([
    getPartnerLogos(),
    getClientLogos()
  ]);
  const photographers = await getPhotographers();

  return (
    <ProductionSnapContainer snapMode="heroSnap">
      {/* Hero — snap point */}
      <section
        className="h-screen flex flex-col items-center justify-center px-6 md:px-12 text-center relative overflow-hidden"
        style={{ scrollSnapAlign: 'start' }}
      >
        <div className="max-w-4xl mx-auto">
          <LocalizedHero page="about" />
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-10 fade-in-up" style={{ animationDelay: '0.35s' }}>
            {SERVICES.map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span className="text-white/20 font-mono text-[9px]">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-white/45 text-[10px] tracking-[0.35em] uppercase">{s}</span>
              </span>
            ))}
          </div>
        </div>
        {/* Scroll arrow */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white/20 text-[9px] tracking-[0.45em] uppercase">Scroll</span>
            <svg className="w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="square" d="M12 5v14M5 13l7 7 7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Content — snap point (scrolls freely after snap) */}
      <div style={{ scrollSnapAlign: 'start' }}>
        {/* Stats strip */}
        <AboutStats
          photographerCount={photographers.length}
          clientCount={clientLogos.length}
          partnerCount={partnerLogos.length}
        />

        {/* Brands & Clients */}
        <LocalizedAboutBrands partnerLogos={partnerLogos} clientLogos={clientLogos} />
        <Footer />
      </div>
    </ProductionSnapContainer>
  );
}
