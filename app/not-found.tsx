import type { Metadata } from 'next';
import { NotFoundContent } from '@/components/NotFoundContent';
import { buildPageMetadata, getMetadataLang } from '@/lib/seo';
import { translations } from '@/lib/translations';

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getMetadataLang();
  const copy = translations[lang].seo.notFound;
  const meta = buildPageMetadata({
    path: '/',
    title: copy.title,
    description: copy.description,
    lang,
    noIndex: true,
  });
  return { ...meta, title: { absolute: copy.title } };
}

export default function NotFound() {
  return <NotFoundContent />;
}
