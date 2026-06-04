import type { Metadata } from 'next';
import {
  getPhotographers,
  getHomeV2SelectedWorks,
  getPageCopy,
  getAiPoweredWorks,
  getClientLogos,
  getPartnerLogos,
} from '@/lib/cms';
import { getServerLang } from '@/lib/serverLang';
import { translations } from '@/lib/translations';
import { HomeV2PageContent } from './components/HomeV2PageContent';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Home preview — f/2.8 Production',
  robots: { index: false, follow: false },
};

export default async function HomeV2Page() {
  const lang = await getServerLang();
  const copy = translations[lang].homeV2;

  const [
    productionCopy,
    photographers,
    partnerLogos,
    clientLogos,
    selectedWorks,
    aiWorks,
  ] = await Promise.all([
    getPageCopy('production', lang),
    getPhotographers(),
    getPartnerLogos(),
    getClientLogos(),
    getHomeV2SelectedWorks(6, copy.workTitleFallback),
    getAiPoweredWorks(),
  ]);

  const aiBrands = aiWorks.map((w) => w.brand).filter(Boolean);

  return (
    <HomeV2PageContent
      copy={copy}
      productionCopy={{
        stats: productionCopy.stats,
        statsValues: productionCopy.statsValues,
        services: productionCopy.services,
      }}
      selectedWorks={selectedWorks}
      photographers={photographers}
      photographerCount={photographers.length}
      clientCount={clientLogos.length}
      partnerCount={partnerLogos.length}
      aiWorkCount={aiWorks.length}
      aiBrands={aiBrands}
      clientLogos={clientLogos}
    />
  );
}
