import { defineField, defineType } from 'sanity';

export const siteAssets = defineType({
  name: 'siteAssets',
  title: 'Site Assets',
  type: 'document',
  fields: [
    defineField({
      name: 'landingImages',
      title: 'Landing Images',
      description: 'Anasayfa hero/landing panellerinde gösterilen görseller.',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'clients',
          title: 'Client Logos',
          description: 'About sayfasında "Brands we worked with" bölümünde.',
          type: 'array',
          of: [{ type: 'image' }],
          options: { layout: 'grid' },
        }),
        defineField({
          name: 'partners',
          title: 'Partner Agency Logos',
          description: 'About sayfasında ajans/iş ortağı logoları.',
          type: 'array',
          of: [{ type: 'image' }],
          options: { layout: 'grid' },
        }),
        defineField({
          name: 'f28',
          title: 'F/28 Logos',
          description: 'f/2.8 markasının farklı varyantları (favicon, beyaz/siyah, vs).',
          type: 'array',
          of: [{ type: 'image' }],
          options: { layout: 'grid' },
        }),
        defineField({
          name: 'social',
          title: 'Social Icons',
          description: 'Instagram, LinkedIn vb. sosyal medya ikonları.',
          type: 'array',
          of: [{ type: 'image' }],
          options: { layout: 'grid' },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Assets' };
    },
  },
});
