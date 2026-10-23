import {
  getPhotographers,
  getHomeV2SelectedWorks,
  getHomeV2Copy,
  getAiPoweredWorks,
  getClientLogos,
  getLandingImages,
  getPageCopy,
} from '@/lib/cms';
import type { HomeV2HeroSlide } from '@/lib/homeV2.shared';
import { getServerLang } from '@/lib/serverLang';
import { HomeV2PageContent } from './components/HomeV2PageContent';

/** Works shown in the home AI scene. */
const AI_SCENE_COUNT = 4;
/** Featured works in the numbered hero reel. */
const HERO_REEL_COUNT = 6;

export default async function HomeV2Page() {
  const lang = await getServerLang();
  const copy = await getHomeV2Copy(lang);

  const [photographers, clientLogos, selectedWorks, aiWorks, heroImages, aiCopy] = await Promise.all([
    getPhotographers(),
    getClientLogos(),
    getHomeV2SelectedWorks(12, copy.workTitleFallback),
    getAiPoweredWorks(),
    getLandingImages(),
    getPageCopy('aiPowered', lang),
  ]);

  // AI scene: the first works in the Studio "Çalışma Galerisi" order.
  const categoryLabel: Record<string, string> = { fullAi: aiCopy.filters.fullAi, hybrid: aiCopy.filters.hybrid };
  const aiSceneWorks = aiWorks.slice(0, AI_SCENE_COUNT).map((w) => ({
    slug: w.slug,
    brand: w.brand,
    title: w.title,
    category: categoryLabel[w.category] ?? w.category,
    imageSrc: w.imageSrc,
    imageAlt: w.imageAlt,
  }));

  // Hero reel: the first curated "Öne Çıkan İşler"; landing images only when none exist.
  const heroSlides: HomeV2HeroSlide[] =
    selectedWorks.length > 0
      ? selectedWorks.slice(0, HERO_REEL_COUNT).map((w) => ({
          src: w.imageSrc,
          alt: w.workTitle ? `${w.workTitle} — ${w.artistName}` : w.artistName,
          title: w.workTitle || w.artistName,
          credit: w.workTitle ? w.artistName : undefined,
          href: w.href,
        }))
      : heroImages.map((src, i) => ({ src, alt: `f/2.8 Production — selected work ${i + 1}` }));

  return (
    <HomeV2PageContent
      copy={copy}
      heroSlides={heroSlides}
      selectedWorks={selectedWorks}
      photographers={photographers}
      aiWorks={aiSceneWorks}
      clientLogos={clientLogos}
    />
  );
}
