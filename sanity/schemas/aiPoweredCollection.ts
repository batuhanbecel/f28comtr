import { defineField, defineType } from 'sanity';

export const aiPoweredCollection = defineType({
  name: 'aiPoweredCollection',
  title: 'AI Powered Works',
  type: 'document',
  fields: [
    defineField({
      name: 'works',
      title: 'Works',
      description:
        '/ai-powered sayfasında gösterilen AI-destekli işler. Sıralamayı sürükleyerek değiştir.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'aiPoweredWork',
          title: 'Work',
          fields: [
            defineField({
              name: 'brand',
              title: 'Brand',
              type: 'string',
              description: 'Marka adı, e.g. "PUMA"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'brandKey',
              title: 'Brand Key',
              type: 'string',
              description: 'URL-safe slug (filtre için).',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'slug',
              title: 'Slug (detay sayfası URL)',
              type: 'slug',
              description: '/ai-powered/works/<slug> — title veya brand\'den otomatik üretilir.',
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
                // Array içindeki slug için Sanity tarafından otomatik uniqueness
                // kontrolü yapılamaz; uyarıyı bastırıyoruz.
                disableArrayWarning: true,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'instagramUrl',
              title: 'Instagram Post URL',
              type: 'url',
              description: 'Bu işin Instagram\'daki post linki (opsiyonel).',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  { title: 'Visual', value: 'visual' },
                  { title: 'Video', value: 'video' },
                  { title: 'Hybrid', value: 'hybrid' },
                ],
                layout: 'radio',
              },
              initialValue: 'visual',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'imageAlt',
              title: 'Image Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'year',
              title: 'Year',
              type: 'number',
              validation: (Rule) => Rule.integer().min(2000).max(2100),
            }),
            defineField({
              name: 'tags',
              title: 'Tags',
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
                title: brand || 'Untitled',
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
      return { title: 'AI Powered Works' };
    },
  },
});
