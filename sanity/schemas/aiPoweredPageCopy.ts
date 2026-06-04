import { defineArrayMember, defineField, defineType } from 'sanity';

export const aiPoweredPageCopy = defineType({
  name: 'aiPoweredPageCopy',
  title: 'AI Powered Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'process', title: 'How We Work' },
    { name: 'filters', title: 'Filters' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Hero ────────────────────────────────────────────────────────────
    defineField({ group: 'hero', name: 'sectionLabel', title: 'Section Label', type: 'localizedString' }),
    defineField({ group: 'hero', name: 'heading', title: 'Heading', type: 'localizedString' }),
    defineField({ group: 'hero', name: 'description', title: 'Description', type: 'localizedText' }),
    defineField({ group: 'hero', name: 'worksLabel', title: 'Works Label', type: 'localizedString' }),
    defineField({
      group: 'hero',
      name: 'stats',
      title: 'Stats',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'projectsLabel', title: 'Projects Label', type: 'localizedString' }),
        defineField({ name: 'brandsLabel', title: 'Brands Label', type: 'localizedString' }),
        defineField({ name: 'sinceLabel', title: 'Since Label', type: 'localizedString' }),
        defineField({ name: 'sinceYear', title: 'Since Year', type: 'string' }),
      ],
    }),

    // ── Process ─────────────────────────────────────────────────────────
    defineField({
      group: 'process',
      name: 'process',
      title: 'Process Section',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'sectionLabel', title: 'Section Label', type: 'localizedString' }),
        defineField({ name: 'heading', title: 'Heading', type: 'localizedString' }),
        defineField({
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'processStep',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'localizedString' }),
                defineField({ name: 'sub', title: 'Subtitle', type: 'localizedString' }),
              ],
              preview: {
                select: { en: 'title.en', tr: 'title.tr' },
                prepare: ({ en, tr }) => ({ title: en || tr || 'Untitled step' }),
              },
            }),
          ],
        }),
      ],
    }),

    // ── Filters ─────────────────────────────────────────────────────────
    defineField({
      group: 'filters',
      name: 'filters',
      title: 'Filter Labels',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'brand', title: 'Brand Label', type: 'localizedString' }),
        defineField({ name: 'type', title: 'Type Label', type: 'localizedString' }),
        defineField({ name: 'all', title: 'All', type: 'localizedString' }),
        defineField({ name: 'allBrands', title: 'All Brands', type: 'localizedString' }),
        defineField({ name: 'allTypes', title: 'All Types', type: 'localizedString' }),
        defineField({ name: 'visual', title: 'Visual', type: 'localizedString' }),
        defineField({ name: 'video', title: 'Video', type: 'localizedString' }),
        defineField({ name: 'hybrid', title: 'Hybrid', type: 'localizedString' }),
        defineField({ name: 'resultsSuffix', title: 'Results Suffix', type: 'localizedString' }),
        defineField({ name: 'empty', title: 'Empty State Message', type: 'localizedString' }),
      ],
    }),

    // ── SEO ─────────────────────────────────────────────────────────────
    defineField({
      group: 'seo',
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'localizedString' }),
        defineField({ name: 'description', title: 'Description', type: 'localizedText' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'AI Powered Page' }) },
});
