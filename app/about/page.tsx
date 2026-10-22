import type { Metadata } from 'next';
import { getPartnerLogos, getClientLogos, getPhotographers, getPageCopy } from '@/lib/cms';
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

export default async function AboutPage() {
  const lang = await getServerLang();
  const [partnerLogos, clientLogos, photographers, productionCopy] = await Promise.all([
    getPartnerLogos(),
    getClientLogos(),
    getPhotographers(),
    getPageCopy('production', lang),
  ]);

  return (
    <ProductionSnapContainer snapMode="heroSnap">
      <EditorialPageHero page="about" lang={lang} />

      <HeroSnapBody>
        <HeroSnapTarget>
        <AboutStats
          photographerCount={photographers.length}
          clientCount={clientLogos.length}
          partnerCount={partnerLogos.length}
          production={{ stats: productionCopy.stats, statsValues: productionCopy.statsValues }}
        />
        </HeroSnapTarget>

        <LocalizedAboutBrands partnerLogos={partnerLogos} clientLogos={clientLogos} />
        <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  );
}
