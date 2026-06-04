import { defineField, defineType } from 'sanity';
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
        'Önce "AI Powered → Etiket Tanımları" bölümünden etiket oluşturun, sonra buradan seçin. Aynı etiket tüm filtrelerde tek grup olarak görünür.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'aiTag' }],
        },
      ],
      options: { layout: 'tags' },
    }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      media: 'image',
      filename: 'image.asset.originalFilename',
      tag0: 'tags.0->en',
      tag1: 'tags.1->en',
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
