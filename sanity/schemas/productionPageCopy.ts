import { defineArrayMember, defineField, defineType } from 'sanity';

/** Production sayfası için tam yapılandırılmış içerik — her field Studio'da ayrı UI. */
export const productionPageCopy = defineType({
  name: 'productionPageCopy',
  title: 'Production Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'services', title: 'What We Do' },
    { name: 'process', title: 'How We Work' },
    { name: 'deliverables', title: 'What We Deliver' },
    { name: 'team', title: 'Team' },
    { name: 'marquee', title: 'Marquee' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Hero ────────────────────────────────────────────────────────────
    defineField({
      group: 'hero',
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'localizedString',
    }),
    defineField({
      group: 'hero',
      name: 'heading',
      title: 'Heading',
      type: 'localizedString',
    }),
    defineField({
      group: 'hero',
      name: 'description',
      title: 'Description',
      type: 'localizedText',
    }),
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
        defineField({ name: 'projectsValue', title: 'Projects Value (e.g. 1000+)', type: 'string' }),
        defineField({ name: 'brandsValue', title: 'Brands Value (e.g. 150+)', type: 'string' }),
        defineField({ name: 'sinceYear', title: 'Since Year (e.g. 2008)', type: 'string' }),
      ],
    }),

    // ── Services ────────────────────────────────────────────────────────
    defineField({
      group: 'services',
      name: 'services',
      title: 'Services Section',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'sectionLabel', title: 'Section Label', type: 'localizedString' }),
        defineField({ name: 'heading', title: 'Heading (e.g. "WHAT WE DO")', type: 'localizedString' }),
        defineField({
          name: 'items',
          title: 'Service Cards',
          description: 'Sıralamak için sürükle, silmek/eklemek için "..." menüsü.',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'service',
              title: 'Service',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'localizedString' }),
                defineField({ name: 'description', title: 'Description', type: 'localizedText' }),
              ],
              preview: {
                select: { en: 'title.en', tr: 'title.tr' },
                prepare: ({ en, tr }) => ({ title: en || tr || 'Untitled service' }),
              },
            }),
          ],
        }),
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
        defineField({ name: 'heading', title: 'Heading (e.g. "HOW WE WORK")', type: 'localizedString' }),
        defineField({
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'processStep',
              title: 'Step',
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

    // ── Deliverables ────────────────────────────────────────────────────
    defineField({
      group: 'deliverables',
      name: 'deliverables',
      title: 'Deliverables Section',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'sectionLabel', title: 'Section Label', type: 'localizedString' }),
        defineField({ name: 'heading', title: 'Heading', type: 'localizedString' }),
        defineField({
          name: 'items',
          title: 'Deliverable Items',
          type: 'array',
          of: [defineArrayMember({ type: 'localizedString' })],
        }),
      ],
    }),

    // ── Team ────────────────────────────────────────────────────────────
    defineField({
      group: 'team',
      name: 'team',
      title: 'Team Section',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'sectionLabel', title: 'Section Label', type: 'localizedString' }),
        defineField({ name: 'description', title: 'Description', type: 'localizedText' }),
        defineField({ name: 'cta', title: 'CTA Label', type: 'localizedString' }),
      ],
    }),

    // ── Marquee ─────────────────────────────────────────────────────────
    defineField({
      group: 'marquee',
      name: 'marqueeLabel',
      title: 'Marquee Label',
      type: 'localizedString',
    }),
    defineField({
      group: 'marquee',
      name: 'marqueeRow',
      title: 'Marquee Row Alt',
      type: 'localizedString',
    }),
    defineField({
      group: 'marquee',
      name: 'marqueeViewImage',
      title: 'View Image Label',
      type: 'localizedString',
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
  preview: { prepare: () => ({ title: 'Production Page' }) },
});
