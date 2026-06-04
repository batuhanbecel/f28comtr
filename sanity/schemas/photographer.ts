import { defineField, defineType } from 'sanity';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';

const AVAILABLE_TAGS = [
  { title: 'Portrait', value: 'portrait' },
  { title: 'Commercial', value: 'commercial' },
  { title: 'Fashion', value: 'fashion' },
  { title: 'Editorial', value: 'editorial' },
  { title: 'Product', value: 'product' },
  { title: 'Lifestyle', value: 'lifestyle' },
  { title: 'Beauty', value: 'beauty' },
  { title: 'Food', value: 'food' },
  { title: 'Architecture', value: 'architecture' },
  { title: 'Event', value: 'event' },
];

export const photographer = defineType({
  name: 'photographer',
  title: 'Photographer',
  type: 'document',
  fields: [
    orderRankField({ type: 'photographer' }),
    defineField({
      name: 'slug',
      title: 'Slug (URL ID)',
      description: 'URL\'de geçen kısım: f28.com.tr/<slug>',
      type: 'slug',
      options: {
        source: 'fullName',
        maxLength: 64,
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
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'First Name',
      description: 'Tek kelime, e.g. "Ozan"',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fullName',
      title: 'Full Name',
      description: 'Tüm isim, büyük harflerle, e.g. "OZAN ÇAKMAK"',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      options: {
        list: [
          { title: 'Photographer', value: 'PHOTOGRAPHER' },
          { title: 'Retoucher', value: 'RETOUCHER' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: AVAILABLE_TAGS },
    }),
    defineField({
      name: 'preview',
      title: 'Preview Image',
      description: 'Listede ve OG görselinde kullanılır.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'portfolioImages',
      title: 'Portfolio Images',
      description: 'Detay sayfasında gösterilen tüm portfolyo görselleri (sırayla).',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 4 }),
        defineField({ name: 'tr', title: 'Türkçe', type: 'text', rows: 4 }),
      ],
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
    }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'title',
      media: 'preview',
    },
  },
});
