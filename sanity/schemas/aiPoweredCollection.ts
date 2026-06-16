import { defineArrayMember, defineField, defineType } from 'sanity';
import { RobotIcon } from '@sanity/icons';
import { AiPoweredWorksInput } from '../components/AiPoweredWorksInput';
import { PortfolioImagesInput } from '../components/PortfolioImagesInput';

export const aiPoweredCollection = defineType({
  name: 'aiPoweredCollection',
  title: 'AI Powered Çalışmalar',
  type: 'document',
  icon: RobotIcon,
  fields: [
    defineField({
      name: 'works',
      title: 'Çalışmalar',
      description:
        '/ai-powered sayfasında gösterilen AI destekli işler. Sıralamayı sürükleyerek değiştirebilirsin.',
      type: 'array',
      options: {
        layout: 'grid',
        modal: { type: 'dialog', width: 960 },
      },
      of: [
        defineArrayMember({
          type: 'object',
          name: 'aiPoweredWork',
          title: 'Çalışma',
          groups: [
            { name: 'basic', title: 'Temel', default: true },
            { name: 'content', title: 'İçerik' },
            { name: 'credits', title: 'Künye & Sosyal' },
          ],
          fields: [
            defineField({
              group: 'basic',
              name: 'brand',
              title: 'Marka',
              type: 'string',
              description: 'Marka adı, örn. "PUMA"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              group: 'basic',
              name: 'title',
              title: 'Başlık',
              type: 'string',
            }),
            defineField({
              group: 'basic',
              name: 'images',
              title: 'Görseller',
              description:
                'Projeye ait tüm görseller (ör. 5 fotoğraf). İlk sıradaki görsel liste ve kapakta kullanılır.',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true } }],
              components: {
                input: PortfolioImagesInput,
              },
              validation: (Rule) =>
                Rule.custom((images, context) => {
                  const parent = (context.parent ?? {}) as { image?: unknown };
                  if (Array.isArray(images) && images.length > 0) return true;
                  if (parent.image) return true;
                  return 'En az bir görsel ekleyin';
                }),
            }),
            defineField({
              group: 'basic',
              name: 'image',
              title: 'Görsel (eski — gizli)',
              type: 'image',
              options: { hotspot: true },
              hidden: true,
            }),
            defineField({
              group: 'basic',
              name: 'category',
              title: 'Tür',
              type: 'string',
              options: {
                list: [
                  { title: 'Görsel', value: 'visual' },
                  { title: 'Video', value: 'video' },
                  { title: 'Hibrit', value: 'hybrid' },
                ],
                layout: 'radio',
              },
              initialValue: 'visual',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              group: 'basic',
              name: 'slug',
              title: 'Slug (detay sayfası URL)',
              type: 'slug',
              description: '/ai-powered/works/<slug> — başlık veya markadan otomatik üretilir.',
              options: {
                source: (doc, ctx) => {
                  const parent = (ctx.parent ?? {}) as { title?: string; brand?: string };
                  return parent.title || parent.brand || 'work';
                },
                maxLength: 80,
                slugify: (input) =>
                  input
                    .toLowerCase()
                    .replace(/ı/g, 'i')
                    .replace(/ş/g, 's')
                    .replace(/ç/g, 'c')
                    .replace(/ğ/g, 'g')
                    .replace(/ü/g, 'u')
                    .replace(/ö/g, 'o')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, ''),
                disableArrayWarning: true,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              group: 'content',
              name: 'description',
              title: 'Açıklama',
              type: 'text',
              rows: 3,
            }),
            defineField({
              group: 'content',
              name: 'year',
              title: 'Yıl',
              type: 'number',
              validation: (Rule) => Rule.integer().min(2000).max(2100),
            }),
            defineField({
              group: 'content',
              name: 'agency',
              title: 'Ajans',
              type: 'string',
              description: 'Hangi ajansla çalışıldı? (opsiyonel)',
            }),
            defineField({
              group: 'content',
              name: 'tags',
              title: 'Etiketler',
              type: 'array',
              of: [{ type: 'string' }],
              options: { layout: 'tags' },
            }),
            defineField({
              group: 'content',
              name: 'imageAlt',
              title: 'Görsel Alt Metni',
              type: 'string',
            }),
            defineField({
              group: 'credits',
              name: 'instagramUrl',
              title: 'Instagram Post URL',
              type: 'url',
              description: "Bu işin Instagram'daki post linki (opsiyonel).",
            }),
            defineField({
              group: 'credits',
              name: 'brandKey',
              title: 'Marka Anahtarı (otomatik)',
              type: 'string',
              // The site derives the filter key from the brand name, so works
              // that share a brand always group together. This manual field is
              // no longer read — hidden to avoid confusion.
              hidden: true,
              description: 'Filtre anahtarı marka adından otomatik üretilir.',
            }),
            defineField({
              group: 'credits',
              name: 'credits',
              title: 'Künye',
              type: 'object',
              description: 'Bu işte yer alan kişiler (opsiyonel).',
              options: { collapsible: true, collapsed: false },
              fields: [
                defineField({
                  name: 'photographers',
                  title: 'Fotoğrafçı',
                  type: 'array',
                  description:
                    'Bu iş için tek fotoğrafçı. Portfolyosu olanları referans olarak seçin.',
                  validation: (Rule) => Rule.max(1),
                  of: [
                    {
                      type: 'reference',
                      to: [{ type: 'photographer' }],
                      options: { filter: 'title == "PHOTOGRAPHER"' },
                    },
                  ],
                }),
                defineField({
                  name: 'aiArtists',
                  title: 'AI Sanatçıları',
                  type: 'array',
                  description: 'AI sanatçıları (genelde freelance — isim yeterli).',
                  of: [{ type: 'string' }],
                  options: { layout: 'tags' },
                }),
                defineField({
                  name: 'retouchers',
                  title: "Retoucher'lar",
                  type: 'array',
                  description: 'Sitede portfolyosu olanları referans olarak seç.',
                  of: [
                    {
                      type: 'reference',
                      to: [{ type: 'photographer' }],
                      options: { filter: 'title == "RETOUCHER"' },
                    },
                  ],
                }),
              ],
            }),
          ],
          preview: {
            select: {
              brand: 'brand',
              title: 'title',
              category: 'category',
              year: 'year',
              cover: 'images.0',
              legacy: 'image',
            },
            prepare({ brand, title, category, year, cover, legacy }) {
              const meta = [category, year].filter(Boolean).join(' · ');
              return {
                title: brand || 'İsimsiz',
                subtitle: [title, meta].filter(Boolean).join('  —  ') || undefined,
                media: cover ?? legacy,
              };
            },
          },
        }),
      ],
      components: {
        input: AiPoweredWorksInput,
      },
    }),
  ],
  preview: {
    prepare() {
      return { title: 'AI Powered Çalışmalar' };
    },
  },
});
