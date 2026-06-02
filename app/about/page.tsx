import type { Metadata } from 'next';
import { getPartnerLogos, getClientLogos } from '@/lib/utils';
import { getPhotographers } from '@/lib/db';
import { Footer } from '@/components/Footer';
import { EditorialPageHero } from '@/components/EditorialPageHero';
import { LocalizedAboutBrands } from '@/components/LocalizedAboutBrands';
import { AboutStats } from '@/components/AboutStats';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('about', '/about');
}

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
