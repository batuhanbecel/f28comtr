import { defineField, defineType } from 'sanity';

const PAGE_KEYS = [
  { title: 'Anasayfa', value: 'home' },
  { title: 'Production', value: 'production' },
  { title: 'AI Powered', value: 'aiPowered' },
  { title: 'AI Powered Portfolyo', value: 'aiPoweredPortfolio' },
  { title: 'Portfolyolar', value: 'portfolios' },
  { title: 'Hakkımızda', value: 'about' },
  { title: 'İletişim', value: 'contact' },
  { title: 'Fotoğrafçı (şablon)', value: 'photographer' },
  { title: '404 / Sayfa Bulunamadı', value: 'notFound' },
];

export const seoOverride = defineType({
  name: 'seoOverride',
  title: 'SEO Düzenlemesi',
  type: 'document',
  fields: [
    defineField({
      name: 'pageKey',
      title: 'Sayfa',
      type: 'string',
      options: { list: PAGE_KEYS, layout: 'dropdown' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'İngilizce',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'title', title: 'Başlık', type: 'string' }),
        defineField({ name: 'description', title: 'Açıklama', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'tr',
      title: 'Türkçe',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'title', title: 'Başlık', type: 'string' }),
        defineField({ name: 'description', title: 'Açıklama', type: 'text', rows: 3 }),
      ],
    }),
  ],
  preview: {
    select: { title: 'pageKey', enTitle: 'en.title', trTitle: 'tr.title' },
    prepare({ title, enTitle, trTitle }) {
      return {
        title: title || 'İsimsiz',
        subtitle: [enTitle, trTitle].filter(Boolean).join(' / ') || undefined,
      };
    },
  },
});
