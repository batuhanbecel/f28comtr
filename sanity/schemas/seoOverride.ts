import { defineField, defineType } from 'sanity';
import { EarthGlobeIcon } from '@sanity/icons';

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
  icon: EarthGlobeIcon,
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
        defineField({
          name: 'title',
          title: 'Başlık',
          type: 'string',
          description: 'Arama sonucu başlığı. ~60 karakter idealdir.',
          validation: (Rule) =>
            Rule.max(70).warning('60 karakterin altında tutmak arama sonuçlarında daha iyi görünür.'),
        }),
        defineField({
          name: 'description',
          title: 'Açıklama',
          type: 'text',
          rows: 3,
          description: 'Meta açıklama. 150–160 karakter idealdir.',
          validation: (Rule) =>
            Rule.max(170).warning('160 karakterin altında tutmak arama sonuçlarında daha iyi görünür.'),
        }),
      ],
    }),
    defineField({
      name: 'tr',
      title: 'Türkçe',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'title',
          title: 'Başlık',
          type: 'string',
          description: 'Arama sonucu başlığı. ~60 karakter idealdir.',
          validation: (Rule) =>
            Rule.max(70).warning('60 karakterin altında tutmak arama sonuçlarında daha iyi görünür.'),
        }),
        defineField({
          name: 'description',
          title: 'Açıklama',
          type: 'text',
          rows: 3,
          description: 'Meta açıklama. 150–160 karakter idealdir.',
          validation: (Rule) =>
            Rule.max(170).warning('160 karakterin altında tutmak arama sonuçlarında daha iyi görünür.'),
        }),
      ],
    }),
  ],
  preview: {
    select: { pageKey: 'pageKey', enTitle: 'en.title', trTitle: 'tr.title' },
    prepare({ pageKey, enTitle, trTitle }) {
      const label = PAGE_KEYS.find((p) => p.value === pageKey)?.title;
      return {
        title: label || pageKey || 'İsimsiz',
        subtitle: [enTitle, trTitle].filter(Boolean).join('  /  ') || undefined,
      };
    },
  },
});
