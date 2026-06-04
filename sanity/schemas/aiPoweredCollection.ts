import { defineField, defineType } from 'sanity';

export const aiPoweredCollection = defineType({
  name: 'aiPoweredCollection',
  title: 'AI Powered Çalışmalar',
  type: 'document',
  fields: [
    defineField({
      name: 'works',
      title: 'Çalışmalar',
      description:
        '/ai-powered sayfasında gösterilen AI destekli işler. Sıralamayı sürükleyerek değiştirebilirsin.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'aiPoweredWork',
          title: 'Çalışma',
          fields: [
            defineField({
              name: 'brand',
              title: 'Marka',
              type: 'string',
              description: 'Marka adı, örn. "PUMA"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'brandKey',
              title: 'Marka Anahtarı',
              type: 'string',
              description: 'Filtre için URL-uyumlu kısa ad (boş bırak; otomatik).',
            }),
            defineField({
              name: 'title',
              title: 'Başlık',
              type: 'string',
            }),
            defineField({
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
              name: 'instagramUrl',
              title: 'Instagram Post URL',
              type: 'url',
              description: "Bu işin Instagram'daki post linki (opsiyonel).",
            }),
            defineField({
              name: 'agency',
              title: 'Ajans',
              type: 'string',
              description: 'Hangi ajansla çalışıldı? (opsiyonel)',
            }),
            defineField({
              name: 'credits',
              title: 'Künye',
              type: 'object',
              description: 'Bu işte yer alan kişiler (opsiyonel).',
              options: { collapsible: true, collapsed: false },
              fields: [
                defineField({
                  name: 'photographers',
                  title: 'Fotoğrafçılar',
                  type: 'array',
                  description:
                    'Sitede portfolyosu olanları referans olarak seç; isim portfolyoya link verir.',
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
            defineField({
              name: 'description',
              title: 'Açıklama',
              type: 'text',
              rows: 3,
            }),
            defineField({
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
              name: 'image',
              title: 'Görsel',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'imageAlt',
              title: 'Görsel Alt Metni',
              type: 'string',
            }),
            defineField({
              name: 'year',
              title: 'Yıl',
              type: 'number',
              validation: (Rule) => Rule.integer().min(2000).max(2100),
            }),
            defineField({
              name: 'tags',
              title: 'Etiketler',
              type: 'array',
              of: [{ type: 'string' }],
              options: { layout: 'tags' },
            }),
          ],
          preview: {
            select: {
              brand: 'brand',
              title: 'title',
              category: 'category',
              year: 'year',
              media: 'image',
            },
            prepare({ brand, title, category, year, media }) {
              const meta = [category, year].filter(Boolean).join(' · ');
              return {
                title: brand || 'İsimsiz',
                subtitle: [title, meta].filter(Boolean).join('  —  ') || undefined,
                media,
              };
            },
          },
        },
      ],
      options: { layout: 'grid' },
    }),
  ],
  preview: {
    prepare() {
      return { title: 'AI Powered Çalışmalar' };
    },
  },
});
