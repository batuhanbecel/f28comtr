import {
  getPhotographers,
  getHomeV2SelectedWorks,
  getHomeV2Copy,
  getAiPoweredWorks,
  getClientLogos,
  getLandingImages,
} from '@/lib/cms';
import { getServerLang } from '@/lib/serverLang';
import { HomeV2PageContent } from './components/HomeV2PageContent';

/** AI works shown as the home teaser. */
const AI_TEASER_COUNT = 6;

export default async function HomeV2Page() {
  const lang = await getServerLang();
  const copy = await getHomeV2Copy(lang);

  const [photographers, clientLogos, selectedWorks, aiWorks, heroImages] = await Promise.all([
    getPhotographers(),
    getClientLogos(),
    getHomeV2SelectedWorks(12, copy.workTitleFallback),
    getAiPoweredWorks(),
    getLandingImages(),
  ]);

  const aiTeaser = aiWorks.slice(0, AI_TEASER_COUNT).map((w) => ({
    slug: w.slug,
    brand: w.brand,
    title: w.title,
    imageSrc: w.imageSrc,
    imageAlt: w.imageAlt,
  }));

  return (
    <HomeV2PageContent
      copy={copy}
      heroImages={heroImages}
      selectedWorks={selectedWorks}
      photographers={photographers}
      aiWorks={aiTeaser}
      clientLogos={clientLogos}
    />
  );
}
