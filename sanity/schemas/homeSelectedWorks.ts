import { defineField, defineType } from 'sanity';

export const homeSelectedWorks = defineType({
  name: 'homeSelectedWorks',
  title: 'Home Selected Works',
  type: 'document',
  fields: [
    defineField({
      name: 'works',
      title: 'Selected Works',
      description:
        'Anasayfada öne çıkan işler (maksimum 6). Sıralamayı sürükleyerek değiştir.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'homeSelectedWork',
          title: 'Selected Work',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'workTitle',
              title: 'Work Title',
              description: 'Boş bırakılırsa fallback başlık kullanılır.',
              type: 'string',
            }),
            defineField({
              name: 'photographer',
              title: 'Photographer',
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
                title: workTitle || name || 'Untitled',
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
      return { title: 'Home Selected Works' };
    },
  },
});
