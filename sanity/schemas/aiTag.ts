import { defineField, defineType } from 'sanity';

export const aiTag = defineType({
  name: 'aiTag',
  title: 'AI Portfolyo Etiketi',
  type: 'document',
  fields: [
    defineField({
      name: 'en',
      title: 'İngilizce',
      description: 'Filtrede kullanılan ana etiket. Diğer görsellerde aynı yazıyı seçin.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tr',
      title: 'Türkçe',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { en: 'en', tr: 'tr' },
    prepare({ en, tr }) {
      return {
        title: en || tr || 'Etiket',
        subtitle: en && tr ? tr : undefined,
      };
    },
  },
});
