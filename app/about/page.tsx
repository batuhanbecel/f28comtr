import type { Metadata } from 'next';
import { getPartnerLogos, getClientLogos } from '@/lib/utils';
import { getPhotographers } from '@/lib/db';
import { Footer } from '@/components/Footer';
import { PageSection } from '@/components/PageSection';
import { LocalizedHero } from '@/components/LocalizedHero';
import { LocalizedAboutBrands } from '@/components/LocalizedAboutBrands';
import { AboutStats } from '@/components/AboutStats';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { ScrollIndicator } from '@/components/ScrollIndicator';

export const metadata: Metadata = {
  title: 'About Us | f/2.8 Production Agency',
  description: 'Istanbul-based photography and production agency since 2008. Photography, video, CGI, animation, editing, and motion graphics.',
  openGraph: {
    title: 'About Us | f/2.8 Production Agency',
    description: 'Istanbul-based photography and production agency since 2008.',
    type: 'website',
    url: 'https://www.f28.com.tr/about',
    siteName: 'f/2.8 Production Agency',
  },
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
        className="hero-screen h-screen flex flex-col items-center justify-center px-6 md:px-12 text-center relative overflow-hidden"
        style={{ scrollSnapAlign: 'start' }}
      >
        <div className="max-w-4xl mx-auto">
          <LocalizedHero page="about" />
          <PageSection className="!py-0 !px-0 mt-10">
            <div className="flex flex-wrap justify-center gap-3 fade-in-up" style={{ animationDelay: '0.35s' }}>
              {SERVICES.map((s, i) => (
                <span key={s} className="editorial-chip">
                  <span className="mono-label">{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </span>
              ))}
            </div>
          </PageSection>
        </div>
        <ScrollIndicator />
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
