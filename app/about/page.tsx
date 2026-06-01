import type { Metadata } from 'next';
import { getPartnerLogos, getClientLogos } from '@/lib/utils';
import { getPhotographers } from '@/lib/db';
import { Footer } from '@/components/Footer';
import { EditorialPageHero } from '@/components/EditorialPageHero';
import { LocalizedAboutBrands } from '@/components/LocalizedAboutBrands';
import { AboutStats } from '@/components/AboutStats';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';

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
    getClientLogos(),
  ]);
  const photographers = await getPhotographers();

  return (
    <ProductionSnapContainer snapMode="heroSnap">
      <EditorialPageHero page="about" scrollSnap>
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-3xl">
          {SERVICES.map((s, i) => (
            <span key={s} className="editorial-chip">
              <span className="mono-label">{String(i + 1).padStart(2, '0')}</span>
              {s}
            </span>
          ))}
        </div>
      </EditorialPageHero>

      <div style={{ scrollSnapAlign: 'start' }}>
        <AboutStats
          photographerCount={photographers.length}
          clientCount={clientLogos.length}
          partnerCount={partnerLogos.length}
        />

        <LocalizedAboutBrands partnerLogos={partnerLogos} clientLogos={clientLogos} />
        <Footer />
      </div>
    </ProductionSnapContainer>
  );
}
