import { defineField, defineType } from 'sanity';
import { CaseIcon } from '@sanity/icons';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { PortfolioImagesInput } from '../components/PortfolioImagesInput';
import { slugifyTr } from '../lib/slugify';

/**
 * A production case study — /production/works/[slug].
 * Listed on /production in the order set by drag & drop in Studio.
 */
export const productionProject = defineType({
  name: 'productionProject',
  title: 'Prodüksiyon Projesi',
  type: 'document',
  icon: CaseIcon,
  groups: [
    { name: 'basic', title: 'Temel', default: true },
    { name: 'images', title: 'Görseller' },
    { name: 'credits', title: 'Künye' },
  ],
  fields: [
    orderRankField({ type: 'productionProject' }),

    defineField({
      group: 'basic',
      name: 'brand',
      title: 'Marka / Müşteri',
      description: 'Örn. "Galatasaray", "PUMA". Listelerde başlığın üstünde görünür.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      group: 'basic',
      name: 'title',
      title: 'Proje Başlığı',
      description: 'Örn. "2026 Sezon Forma Lansmanı". Cümle düzeninde yazın (yalnızca ilk harf büyük).',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      group: 'basic',
      name: 'slug',
      title: 'URL (Slug)',
      description: 'Sayfanın adresi: f28.com.tr/production/works/[slug] — "Oluştur" ile başlıktan üretilir.',
      type: 'slug',
      options: {
        source: (doc) => {
          const d = doc as { brand?: string; title?: string };
          return [d.brand, d.title].filter(Boolean).join(' ');
        },
        maxLength: 80,
        slugify: slugifyTr,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      group: 'basic',
      name: 'year',
      title: 'Yıl',
      type: 'number',
      validation: (Rule) => Rule.integer().min(2000).max(2100),
    }),
    defineField({
      group: 'basic',
      name: 'agency',
      title: 'Ajans',
      description: 'İsteğe bağlı — projeyi getiren kreatif ajans.',
      type: 'string',
    }),
    defineField({
      group: 'basic',
      name: 'description',
      title: 'Kısa Açıklama',
      description: '2–3 cümle. Detay sayfasında başlığın yanında görünür.',
      type: 'localizedText',
    }),

    defineField({
      group: 'images',
      name: 'images',
      title: 'Proje Görselleri',
      description:
        'İlk görsel kapak olarak kullanılır (liste ve sosyal medya). Sıralama için sürükleyin, kırpma/hotspot için görsele tıklayın.',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      components: { input: PortfolioImagesInput },
      validation: (Rule) => Rule.required().min(1).error('En az bir görsel ekleyin'),
    }),
    defineField({
      group: 'images',
      name: 'imageAlt',
      title: 'Görsel Alt Metni',
      description:
        'Ekran okuyucular ve Google için kısa açıklama. Boş bırakılırsa "Marka — Başlık" kullanılır.',
      type: 'string',
      validation: (Rule) => Rule.max(160).warning('Alt metin 160 karakteri geçmesin.'),
    }),

    defineField({
      group: 'credits',
      name: 'photographers',
      title: 'Fotoğrafçılar',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'photographer' }] }],
    }),
    defineField({
      group: 'credits',
      name: 'retouchers',
      title: 'Retoucherlar',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'photographer' }] }],
    }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { brand: 'brand', title: 'title', year: 'year', media: 'images.0' },
    prepare({ brand, title, year, media }) {
      return {
        title: title || 'Başlıksız proje',
        subtitle: [brand, year].filter(Boolean).join('  ·  '),
        media,
      };
    },
  },
});
