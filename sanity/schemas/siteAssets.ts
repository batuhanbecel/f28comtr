import { defineField, defineType } from 'sanity';
import { ImagesIcon } from '@sanity/icons';

export const siteAssets = defineType({
  name: 'siteAssets',
  title: 'Site Görselleri',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'landingImages',
      title: 'Anasayfa Görselleri',
      description:
        'Anasayfa (home-v2) hero slayt görselleri. Sıra = slayt sırası. Boşsa varsayılan /public/home görselleri kullanılır.',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'logos',
      title: 'Logolar',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'clients',
          title: 'Müşteri Logoları',
          description: "About sayfasında \"Çalıştığımız markalar\" bölümünde gösterilir.",
          type: 'array',
          of: [{ type: 'image' }],
          options: { layout: 'grid' },
        }),
        defineField({
          name: 'partners',
          title: 'Ajans / İş Ortağı Logoları',
          description: 'About sayfasında ajans ve iş ortağı logoları.',
          type: 'array',
          of: [{ type: 'image' }],
          options: { layout: 'grid' },
        }),
        defineField({
          name: 'f28',
          title: 'F/28 Logoları',
          description: 'f/2.8 markasının farklı varyantları (favicon, siyah/beyaz, vs).',
          type: 'array',
          of: [{ type: 'image' }],
          options: { layout: 'grid' },
        }),
        defineField({
          name: 'social',
          title: 'Sosyal Medya İkonları',
          description: 'Instagram, LinkedIn vb. ikonlar.',
          type: 'array',
          of: [{ type: 'image' }],
          options: { layout: 'grid' },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      landing: 'landingImages.length',
      clients: 'logos.clients.length',
      partners: 'logos.partners.length',
    },
    prepare({ landing, clients, partners }) {
      const parts = [
        typeof landing === 'number' ? `${landing} hero` : null,
        typeof clients === 'number' ? `${clients} müşteri logosu` : null,
        typeof partners === 'number' ? `${partners} iş ortağı` : null,
      ].filter(Boolean);
      return {
        title: 'Site Görselleri & Logolar',
        subtitle: parts.join('  ·  ') || undefined,
      };
    },
  },
});
