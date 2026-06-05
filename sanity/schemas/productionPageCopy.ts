import { defineArrayMember, defineField, defineType } from 'sanity';
import { DesktopIcon } from '@sanity/icons';

/** Production sayfası için tam yapılandırılmış içerik — her field Studio'da ayrı UI. */
export const productionPageCopy = defineType({
  name: 'productionPageCopy',
  title: 'Production Sayfası',
  type: 'document',
  icon: DesktopIcon,
  groups: [
    { name: 'hero', title: 'Üst Bölüm', default: true },
    { name: 'services', title: 'Hizmetler' },
    { name: 'process', title: 'Sürecimiz' },
    { name: 'deliverables', title: 'Çıktılar' },
    { name: 'team', title: 'Ekip' },
    { name: 'marquee', title: 'Marquee' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Hero ────────────────────────────────────────────────────────────
    defineField({
      group: 'hero',
      name: 'sectionLabel',
      title: 'Bölüm Etiketi',
      type: 'localizedString',
    }),
    defineField({
      group: 'hero',
      name: 'heading',
      title: 'Başlık',
      type: 'localizedString',
    }),
    defineField({
      group: 'hero',
      name: 'description',
      title: 'Açıklama',
      type: 'localizedText',
    }),
    defineField({
      group: 'hero',
      name: 'stats',
      title: 'İstatistikler',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'projectsLabel', title: 'Projeler Etiketi', type: 'localizedString' }),
        defineField({ name: 'brandsLabel', title: 'Markalar Etiketi', type: 'localizedString' }),
        defineField({ name: 'sinceLabel', title: '"-den beri" Etiketi', type: 'localizedString' }),
        defineField({ name: 'projectsValue', title: 'Proje Sayısı (örn. 1000+)', type: 'string' }),
        defineField({ name: 'brandsValue', title: 'Marka Sayısı (örn. 150+)', type: 'string' }),
        defineField({ name: 'sinceYear', title: 'Kuruluş Yılı (örn. 2008)', type: 'string' }),
      ],
    }),

    // ── Services ────────────────────────────────────────────────────────
    defineField({
      group: 'services',
      name: 'services',
      title: 'Hizmetler Bölümü',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'sectionLabel', title: 'Bölüm Etiketi', type: 'localizedString' }),
        defineField({ name: 'heading', title: 'Başlık (örn. "WHAT WE DO")', type: 'localizedString' }),
        defineField({
          name: 'items',
          title: 'Hizmet Kartları',
          description: 'Sıralamak için sürükle, silmek/eklemek için "..." menüsü.',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'service',
              title: 'Hizmet',
              fields: [
                defineField({ name: 'title', title: 'Başlık', type: 'localizedString' }),
                defineField({ name: 'description', title: 'Açıklama', type: 'localizedText' }),
              ],
              preview: {
                select: { en: 'title.en', tr: 'title.tr' },
                prepare: ({ en, tr }) => ({ title: en || tr || 'İsimsiz hizmet' }),
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
      title: 'Süreç Bölümü',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'sectionLabel', title: 'Bölüm Etiketi', type: 'localizedString' }),
        defineField({ name: 'heading', title: 'Başlık (örn. "HOW WE WORK")', type: 'localizedString' }),
        defineField({
          name: 'steps',
          title: 'Adımlar',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'processStep',
              title: 'Adım',
              fields: [
                defineField({ name: 'title', title: 'Başlık', type: 'localizedString' }),
                defineField({ name: 'sub', title: 'Alt Başlık', type: 'localizedString' }),
              ],
              preview: {
                select: { en: 'title.en', tr: 'title.tr' },
                prepare: ({ en, tr }) => ({ title: en || tr || 'İsimsiz adım' }),
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
      title: 'Çıktılar Bölümü',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'sectionLabel', title: 'Bölüm Etiketi', type: 'localizedString' }),
        defineField({ name: 'heading', title: 'Başlık', type: 'localizedString' }),
        defineField({
          name: 'items',
          title: 'Çıktı Maddeleri',
          type: 'array',
          of: [defineArrayMember({ type: 'localizedString' })],
        }),
      ],
    }),

    // ── Team ────────────────────────────────────────────────────────────
    defineField({
      group: 'team',
      name: 'team',
      title: 'Ekip Bölümü',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'sectionLabel', title: 'Bölüm Etiketi', type: 'localizedString' }),
        defineField({ name: 'description', title: 'Açıklama', type: 'localizedText' }),
        defineField({ name: 'cta', title: 'Buton Yazısı', type: 'localizedString' }),
      ],
    }),

    // ── Marquee ─────────────────────────────────────────────────────────
    defineField({
      group: 'marquee',
      name: 'marqueeLabel',
      title: 'Marquee Etiketi',
      type: 'localizedString',
    }),
    defineField({
      group: 'marquee',
      name: 'marqueeRow',
      title: 'Marquee Satır Alt Metni',
      type: 'localizedString',
    }),
    defineField({
      group: 'marquee',
      name: 'marqueeViewImage',
      title: '"Görseli Gör" Yazısı',
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
        defineField({ name: 'title', title: 'Başlık', type: 'localizedString' }),
        defineField({ name: 'description', title: 'Açıklama', type: 'localizedText' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Production Sayfası' }) },
});
