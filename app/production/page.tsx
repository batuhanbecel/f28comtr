import type { Metadata } from 'next';

import { Footer } from '@/components/Footer';

import { EditorialPageHero } from '@/components/EditorialPageHero';
import { HeroSnapBody } from '@/components/HeroSnapBody';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';

import { ProductionStats } from '@/components/ProductionStats';

import { getProductionMarqueeItems, getPageCopy } from '@/lib/cms';

import { getServerLang } from '@/lib/serverLang';

import { generatePageMetadata } from '@/lib/seo';

import { ProductionMarquee } from './components/ProductionMarquee';

import { ProductionSections } from './components/ProductionSections';



export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('production', '/production');
}



export const revalidate = 60;



export default async function ProductionPage() {

  const lang = await getServerLang();

  const [copy, marqueeItems] = await Promise.all([

    getPageCopy('production', lang),

    getProductionMarqueeItems(100),

  ]);



  const heroCopy = {

    label: copy.sectionLabel,

    title: copy.heading,

    description: copy.description,

  };



  return (
    <ProductionSnapContainer snapMode="heroSnap">
      <EditorialPageHero page="production" lang={lang} heroCopy={heroCopy}>
        <ProductionStats copy={copy} inHero />
      </EditorialPageHero>

      <HeroSnapBody className="bg-th-bg text-th-fg">
        <ProductionSections copy={copy} />
        <ProductionMarquee items={marqueeItems} copy={copy} />
        <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  );

}

