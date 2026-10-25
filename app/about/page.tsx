import type { Metadata } from 'next';
import { getPartnerLogos, getClientLogos, getPhotographers, getPageCopy, getSelectedWorks } from '@/lib/cms';
import { ProductionMarquee } from '@/app/production/components/ProductionMarquee';
import { getServerLang } from '@/lib/serverLang';
import { Footer } from '@/components/Footer';
import { EditorialPageHero } from '@/components/EditorialPageHero';
import { LocalizedAboutBrands } from '@/components/LocalizedAboutBrands';
import { AboutStats } from '@/components/AboutStats';
import { HeroSnapBody } from '@/components/HeroSnapBody';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('about', '/about');
}

export const revalidate = 60;

export default async function AboutPage() {
  const lang = await getServerLang();
  const [partnerLogos, clientLogos, photographers, productionCopy, selectedWorks] = await Promise.all([
    getPartnerLogos(),
    getClientLogos(),
    getPhotographers(),
    getPageCopy('production', lang),
    getSelectedWorks(),
  ]);

  return (
    <ProductionSnapContainer>
      <EditorialPageHero page="about" lang={lang} />

      <HeroSnapBody>
        {/* The work leads — the page would otherwise be text and logos only */}
        <ProductionMarquee items={selectedWorks} copy={productionCopy} />
        <AboutStats
          photographerCount={photographers.length}
          production={{ stats: productionCopy.stats, statsValues: productionCopy.statsValues }}
        />

        <LocalizedAboutBrands partnerLogos={partnerLogos} clientLogos={clientLogos} />
        <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  );
}
