import {
  getPhotographers,
  getHomeV2SelectedWorks,
  getHomeV2Copy,
  getPageCopy,
  getAiPoweredWorks,
  getClientLogos,
  getPartnerLogos,
  getLandingImages,
} from '@/lib/cms';
import { getServerLang } from '@/lib/serverLang';
import { HomeV2PageContent } from './components/HomeV2PageContent';

export default async function HomeV2Page() {
  const lang = await getServerLang();
  const copy = await getHomeV2Copy(lang);

  const [
    productionCopy,
    photographers,
    partnerLogos,
    clientLogos,
    selectedWorks,
    aiWorks,
    heroImages,
  ] = await Promise.all([
    getPageCopy('production', lang),
    getPhotographers(),
    getPartnerLogos(),
    getClientLogos(),
    getHomeV2SelectedWorks(6, copy.workTitleFallback),
    getAiPoweredWorks(),
    getLandingImages(),
  ]);

  const aiBrands = aiWorks.map((w) => w.brand).filter(Boolean);

  return (
    <HomeV2PageContent
      copy={copy}
      heroImages={heroImages}
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
