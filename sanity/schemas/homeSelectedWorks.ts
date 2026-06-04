import { defineField, defineType } from 'sanity';

export const homeSelectedWorks = defineType({
  name: 'homeSelectedWorks',
  title: 'Anasayfa Öne Çıkan İşler',
  type: 'document',
  fields: [
    defineField({
      name: 'works',
      title: 'Öne Çıkan İşler',
      description:
        'Anasayfada gösterilen öne çıkan işler (maksimum 6). Sıralamayı sürükleyerek değiştirebilirsin.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'homeSelectedWork',
          title: 'Öne Çıkan İş',
          fields: [
            defineField({
              name: 'image',
              title: 'Görsel',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'workTitle',
              title: 'İş Başlığı',
              description: 'Boş bırakırsan yedek (fallback) başlık kullanılır.',
              type: 'string',
            }),
            defineField({
              name: 'photographer',
              title: 'Fotoğrafçı',
              type: 'reference',
              to: [{ type: 'photographer' }],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              media: 'image',
              workTitle: 'workTitle',
              name: 'photographer.fullName',
              role: 'photographer.title',
            },
            prepare({ media, workTitle, name, role }) {
              return {
                media,
                title: workTitle || name || 'İsimsiz',
                subtitle: [name, role].filter(Boolean).join('  —  ') || undefined,
              };
            },
          },
        },
      ],
      options: { layout: 'grid' },
      validation: (Rule) => Rule.max(6),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Anasayfa Öne Çıkan İşler' };
    },
  },
});
