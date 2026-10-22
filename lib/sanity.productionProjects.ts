import { sanityFetch } from '@/lib/sanity.fetch';
import { toNameCase } from '@/lib/displayCase';
import type { CreditPerson, AiPoweredWorkImage } from '@/lib/aiPoweredWorks';
import type { Lang } from '@/lib/translations';

export interface ProductionProject {
  id: string;
  slug: string;
  brand: string;
  title: string;
  year?: number;
  agency?: string;
  description: Partial<Record<Lang, string>>;
  images: AiPoweredWorkImage[];
  /** First image — list cover and OG image. */
  imageSrc: string;
  imageAlt: string;
  photographers: CreditPerson[];
  retouchers: CreditPerson[];
}

const PROJECTS_QUERY = `*[_type == "productionProject" && defined(slug.current)] | order(orderRank asc) {
  "id": _id,
  "slug": slug.current,
  brand,
  title,
  year,
  agency,
  description,
  imageAlt,
  "images": images[defined(asset)]{
    "src": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  "photographers": photographers[]->{ "slug": slug.current, fullName },
  "retouchers": retouchers[]->{ "slug": slug.current, fullName }
}`;

type RawPerson = { slug?: string | null; fullName?: string | null } | null;
type RawProject = Omit<ProductionProject, 'imageSrc' | 'photographers' | 'retouchers' | 'description' | 'imageAlt'> & {
  description?: Partial<Record<Lang, string>> | null;
  imageAlt?: string | null;
  photographers?: RawPerson[] | null;
  retouchers?: RawPerson[] | null;
};

function people(list: RawPerson[] | null | undefined): CreditPerson[] {
  return (list ?? [])
    .filter((p): p is { slug?: string | null; fullName: string } => Boolean(p?.fullName))
    .map((p) => ({ slug: p.slug ?? undefined, fullName: toNameCase(p.fullName) }));
}

export async function getProductionProjectsFromSanity(): Promise<ProductionProject[]> {
  const raw = await sanityFetch<RawProject[] | null>(PROJECTS_QUERY);
  return (raw ?? [])
    .filter((p) => p.slug && p.images?.length)
    .map((p) => ({
      ...p,
      description: p.description ?? {},
      imageSrc: p.images[0].src,
      imageAlt: p.imageAlt?.trim() || [p.brand, p.title].filter(Boolean).join(' — '),
      photographers: people(p.photographers),
      retouchers: people(p.retouchers),
    }));
}
