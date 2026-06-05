import { defineArrayMember, defineField, defineType } from 'sanity';
import { RobotIcon } from '@sanity/icons';

export const aiPoweredPageCopy = defineType({
  name: 'aiPoweredPageCopy',
  title: 'AI Powered Sayfası',
  type: 'document',
  icon: RobotIcon,
  groups: [
    { name: 'hero', title: 'Üst Bölüm', default: true },
    { name: 'process', title: 'Sürecimiz' },
    { name: 'filters', title: 'Filtreler' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Hero ────────────────────────────────────────────────────────────
    defineField({ group: 'hero', name: 'sectionLabel', title: 'Bölüm Etiketi', type: 'localizedString' }),
    defineField({ group: 'hero', name: 'heading', title: 'Başlık', type: 'localizedString' }),
    defineField({ group: 'hero', name: 'description', title: 'Açıklama', type: 'localizedText' }),
    defineField({ group: 'hero', name: 'worksLabel', title: 'Çalışma Etiketi', type: 'localizedString' }),
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
        defineField({ name: 'sinceYear', title: 'Kuruluş Yılı', type: 'string' }),
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
        defineField({ name: 'heading', title: 'Başlık', type: 'localizedString' }),
        defineField({
          name: 'steps',
          title: 'Adımlar',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'processStep',
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

    // ── Filters ─────────────────────────────────────────────────────────
    defineField({
      group: 'filters',
      name: 'filters',
      title: 'Filtre Etiketleri',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'brand', title: 'Marka Etiketi', type: 'localizedString' }),
        defineField({ name: 'type', title: 'Tür Etiketi', type: 'localizedString' }),
        defineField({ name: 'all', title: 'Tümü', type: 'localizedString' }),
        defineField({ name: 'allBrands', title: 'Tüm Markalar', type: 'localizedString' }),
        defineField({ name: 'allTypes', title: 'Tüm Türler', type: 'localizedString' }),
        defineField({ name: 'visual', title: 'Görsel', type: 'localizedString' }),
        defineField({ name: 'video', title: 'Video', type: 'localizedString' }),
        defineField({ name: 'hybrid', title: 'Hibrit', type: 'localizedString' }),
        defineField({ name: 'resultsSuffix', title: 'Sonuç Sonek', type: 'localizedString' }),
        defineField({ name: 'empty', title: 'Boş Durum Mesajı', type: 'localizedString' }),
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
        defineField({ name: 'title', title: 'Başlık', type: 'localizedString' }),
        defineField({ name: 'description', title: 'Açıklama', type: 'localizedText' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'AI Powered Sayfası' }) },
});
