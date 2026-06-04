import { defineField, defineType } from 'sanity';

const PAGE_KEYS = [
  { title: 'Home', value: 'home' },
  { title: 'Production', value: 'production' },
  { title: 'AI Powered', value: 'aiPowered' },
  { title: 'AI Powered Portfolio', value: 'aiPoweredPortfolio' },
  { title: 'Portfolios', value: 'portfolios' },
  { title: 'About', value: 'about' },
  { title: 'Contact', value: 'contact' },
  { title: 'Photographer (template)', value: 'photographer' },
  { title: '404 / Not Found', value: 'notFound' },
];

export const seoOverride = defineType({
  name: 'seoOverride',
  title: 'SEO Override',
  type: 'document',
  fields: [
    defineField({
      name: 'pageKey',
      title: 'Page',
      type: 'string',
      options: { list: PAGE_KEYS, layout: 'dropdown' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'tr',
      title: 'Türkçe',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
      ],
    }),
  ],
  preview: {
    select: { title: 'pageKey', enTitle: 'en.title', trTitle: 'tr.title' },
    prepare({ title, enTitle, trTitle }) {
      return {
        title: title || 'Untitled',
        subtitle: [enTitle, trTitle].filter(Boolean).join(' / ') || undefined,
      };
    },
  },
});
