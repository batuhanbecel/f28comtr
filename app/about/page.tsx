import type { Metadata } from 'next';
import { getPartnerLogos, getClientLogos, getPhotographers } from '@/lib/cms';
import { getServerLang } from '@/lib/serverLang';
import { Footer } from '@/components/Footer';
import { EditorialPageHero } from '@/components/EditorialPageHero';
import { LocalizedAboutBrands } from '@/components/LocalizedAboutBrands';
import { AboutStats } from '@/components/AboutStats';
import { HeroSnapBody } from '@/components/HeroSnapBody';
import { HeroSnapTarget } from '@/components/HeroSnapTarget';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('about', '/about');
}

export const revalidate = 60;

const SERVICES = ['Photography', 'Videography', 'CGI', 'Animation', 'Editing', 'Motion Graphics'];

export default async function AboutPage() {
  const lang = await getServerLang();
  const [partnerLogos, clientLogos] = await Promise.all([
    getPartnerLogos(),
    getClientLogos(),
  ]);
  const photographers = await getPhotographers();

  return (
    <ProductionSnapContainer snapMode="heroSnap">
      <EditorialPageHero page="about" lang={lang}>
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-3xl">
          {SERVICES.map((s, i) => (
            <span key={s} className="editorial-chip">
              <span className="mono-label">{String(i + 1).padStart(2, '0')}</span>
              {s}
            </span>
          ))}
        </div>
      </EditorialPageHero>

      <HeroSnapBody>
        <HeroSnapTarget className="hero-snap-target--pad">
        <AboutStats
          photographerCount={photographers.length}
          clientCount={clientLogos.length}
          partnerCount={partnerLogos.length}
        />
        </HeroSnapTarget>

        <LocalizedAboutBrands partnerLogos={partnerLogos} clientLogos={clientLogos} />
        <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  );
}
