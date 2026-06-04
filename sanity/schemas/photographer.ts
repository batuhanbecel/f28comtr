import { defineField, defineType } from 'sanity';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';

const AVAILABLE_TAGS = [
  { title: 'Portre', value: 'portrait' },
  { title: 'Reklam', value: 'commercial' },
  { title: 'Moda', value: 'fashion' },
  { title: 'Editöryal', value: 'editorial' },
  { title: 'Ürün', value: 'product' },
  { title: 'Yaşam Tarzı', value: 'lifestyle' },
  { title: 'Güzellik', value: 'beauty' },
  { title: 'Yemek', value: 'food' },
  { title: 'Mimari', value: 'architecture' },
  { title: 'Etkinlik', value: 'event' },
];

export const photographer = defineType({
  name: 'photographer',
  title: 'Fotoğrafçı',
  type: 'document',
  fields: [
    orderRankField({ type: 'photographer' }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      description: "URL'de görünen kısım: f28.com.tr/<slug>",
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
      title: 'Ad',
      description: 'Tek kelime, örn. "Ozan"',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fullName',
      title: 'Tam İsim',
      description: 'Tüm isim büyük harflerle, örn. "OZAN ÇAKMAK"',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Görev',
      type: 'string',
      options: {
        list: [
          { title: 'Fotoğrafçı', value: 'PHOTOGRAPHER' },
          { title: 'Retoucher', value: 'RETOUCHER' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Etiketler',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: AVAILABLE_TAGS },
    }),
    defineField({
      name: 'preview',
      title: 'Önizleme Görseli',
      description: 'Liste ve OG (sosyal paylaşım) görselinde kullanılır.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'portfolioImages',
      title: 'Portfolyo Görselleri',
      description: 'Detay sayfasında gösterilen portfolyo görselleri (sırayla).',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'bio',
      title: 'Biyografi',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'İngilizce', type: 'text', rows: 4 }),
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
      title: 'Web Sitesi URL',
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
