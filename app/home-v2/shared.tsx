import {
  getPhotographers,
  getHomeV2SelectedWorks,
  getHomeV2Copy,
  getHomeAiSceneImages,
  getClientLogos,
  getLandingImages,
  getProductionMarqueeItems,
} from '@/lib/cms';
import type { HomeSelectedWork, HomeV2HeroSlide } from '@/lib/homeV2.shared';
import { getServerLang } from '@/lib/serverLang';
import { HomeV2PageContent } from './components/HomeV2PageContent';

/** Featured works in the numbered hero reel. */
const HERO_REEL_COUNT = 6;
/** Home mosaic — 10 closes the 6-column rhythm exactly (wide+narrow, three equal ×2). */
const MOSAIC_COUNT = 10;

export default async function HomeV2Page() {
  const lang = await getServerLang();
  const copy = await getHomeV2Copy(lang);

  const [photographers, clientLogos, selectedWorks, sceneImages, heroImages, productionWorks] = await Promise.all([
    getPhotographers(),
    getClientLogos(),
    getHomeV2SelectedWorks(12, copy.workTitleFallback),
    getHomeAiSceneImages(lang),
    getLandingImages(),
    // Same pool as Production's "Seçilmiş prodüksiyon çalışmaları" strip
    getProductionMarqueeItems(MOSAIC_COUNT + HERO_REEL_COUNT),
  ]);

  // AI scene: the AI Portfolio images picked in Studio ("Anasayfa" → AI Sahnesi).
  const aiImages = sceneImages.map((img, i) => {
    const caption = img.tags.join(' · ');
    return {
      src: img.src,
      caption,
      alt: caption ? `${copy.aiSplitLabel} — ${caption}` : `${copy.aiSplitLabel} ${i + 1}`,
    };
  });

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

  // Selected work = the production pool, minus anything already in the hero reel
  const inHero = new Set(heroSlides.map((s) => s.src));
  const titles = new Map(photographers.map((p) => [p.id, p.title]));
  const mosaicWorks: HomeSelectedWork[] = productionWorks
    .filter((item) => !inHero.has(item.src))
    .slice(0, MOSAIC_COUNT)
    .map((item) => ({
      imageSrc: item.src,
      workTitle: '',
      artistName: item.photographerName,
      role: (titles.get(item.photographerId) ?? '').toUpperCase() === 'RETOUCHER' ? 'retoucher' : 'photographer',
      href: `/${item.photographerId}`,
    }));

  return (
    <HomeV2PageContent
      copy={copy}
      heroSlides={heroSlides}
      selectedWorks={mosaicWorks}
      photographers={photographers}
      aiImages={aiImages}
      clientLogos={clientLogos}
    />
  );
}
