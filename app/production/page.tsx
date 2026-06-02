import type { Metadata } from 'next';

import { Footer } from '@/components/Footer';

import { EditorialPageHero } from '@/components/EditorialPageHero';

import { ProductionStats } from '@/components/ProductionStats';

import { getProductionMarqueeItems } from '@/lib/productionMarquee';

import { getPageCopy } from '@/lib/pageCopy';

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

    <main className="min-h-screen bg-th-bg text-th-fg">

      <EditorialPageHero page="production" lang={lang} heroCopy={heroCopy}>

        <ProductionStats copy={copy} inHero />

      </EditorialPageHero>



      <ProductionSections copy={copy} />



      <ProductionMarquee items={marqueeItems} copy={copy} />



      <Footer />

    </main>

  );

}

