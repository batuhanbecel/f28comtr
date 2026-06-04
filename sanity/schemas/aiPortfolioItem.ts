import { defineArrayMember, defineField, defineType } from 'sanity';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';

export const aiPortfolioItem = defineType({
  name: 'aiPortfolioItem',
  title: 'AI Portfolyo Görseli',
  type: 'document',
  fields: [
    orderRankField({ type: 'aiPortfolioItem' }),
    defineField({
      name: 'image',
      title: 'Görsel',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Etiketler',
      description:
        "Bu fotoğrafın etiketleri. Her etiket için İngilizce + Türkçe karşılığını gir. Aynı etiketi diğer görsellerde de aynen yazarsan filtre tek bir grup olarak gösterir.",
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'inlineTag',
          title: 'Etiket',
          fields: [
            defineField({
              name: 'en',
              title: 'İngilizce',
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
            prepare: ({ en, tr }) => ({
              title: en || tr || 'Etiket',
              subtitle: en && tr ? `${en} / ${tr}` : undefined,
            }),
          },
        }),
      ],
      options: { layout: 'tags' },
    }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      media: 'image',
      filename: 'image.asset.originalFilename',
      tag0: 'tags.0.en',
      tag1: 'tags.1.en',
    },
    prepare({ media, filename, tag0, tag1 }) {
      const tags = [tag0, tag1].filter(Boolean).join(' · ');
      return {
        title: filename || 'İsimsiz görsel',
        subtitle: tags || undefined,
        media,
      };
    },
  },
});
