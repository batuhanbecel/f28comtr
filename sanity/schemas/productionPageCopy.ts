import { defineArrayMember, defineField, defineType } from 'sanity';
import { DesktopIcon } from '@sanity/icons';
import { SELECTED_WORKS_MAX } from '@/lib/homeSelectedWorks.shared';
import { HomeSelectedWorksInput } from '../components/HomeSelectedWorksInput';
import { selectedWorkMember } from './_objects/selectedWork';

/** Production sayfası için tam yapılandırılmış içerik — her field Studio'da ayrı UI. */
export const productionPageCopy = defineType({
  name: 'productionPageCopy',
  title: 'Production Sayfası',
  type: 'document',
  icon: DesktopIcon,
  groups: [
    { name: 'hero', title: 'Üst Bölüm', default: true },
    { name: 'selectedWorks', title: 'Seçili İşler' },
    { name: 'projects', title: 'Projeler' },
    { name: 'services', title: 'Hizmetler' },
    { name: 'process', title: 'Sürecimiz' },
    { name: 'deliverables', title: 'Çıktılar' },
    { name: 'team', title: 'İş Şeridi' },
    { name: 'marquee', title: 'İş Şeridi Başlığı' },
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
    // ── Projects (case studies listed from "Prodüksiyon Projeleri") ─────
    defineField({
      group: 'projects',
      name: 'projectsLabel',
      title: 'Projeler Etiketi',
      description: 'Proje ızgarasının üstündeki küçük etiket. Projeler "Prodüksiyon Projeleri" bölümünden yönetilir.',
      type: 'localizedString',
    }),
    defineField({
      group: 'projects',
      name: 'projectsHeading',
      title: 'Projeler Başlığı',
      type: 'localizedString',
    }),

    defineField({
      group: 'hero',
      name: 'stats',
      title: 'İstatistikler',
      description: 'Rakamlar "Hakkımızda" sayfasında gösterilir (proje, marka sayısı ve kuruluş yılı).',
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
      title: 'İş Şeridi',
      description: 'Sayfadaki kaydırılabilir iş şeridi: etiket, sağdaki kısa açıklama ve "portfolyolar" bağlantısı.',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'sectionLabel', title: 'Bölüm Etiketi', type: 'localizedString' }),
        defineField({ name: 'description', title: 'Açıklama', type: 'localizedText' }),
        defineField({ name: 'cta', title: 'Buton Yazısı', type: 'localizedString' }),
      ],
    }),

    // ── Selected works (site-wide) ──────────────────────────────────────
    defineField({
      group: 'selectedWorks',
      name: 'selectedWorks',
      title: 'Seçili İşler',
      description:
        'Sitenin tek "Seçili işler" listesi: Anasayfadaki "Seçili işler", bu sayfadaki iş şeridi ve Hakkımızda sayfası buradan gelir. Boş bırakırsan her sanatçının portfolyosundan rastgele bir iş gösterilir (seçim her gün değişir). Fotoğrafçıyı seçip portfolyosundan ekleyin; sırayı sürükleyerek değiştirin.',
      type: 'array',
      of: [selectedWorkMember],
      options: {
        layout: 'grid',
        modal: { type: 'dialog', width: 5 },
      },
      validation: (Rule) => Rule.max(SELECTED_WORKS_MAX),
      components: {
        input: HomeSelectedWorksInput,
      },
    }),

    // ── Marquee ─────────────────────────────────────────────────────────
    defineField({
      group: 'marquee',
      name: 'marqueeLabel',
      title: 'İş Şeridi Başlığı',
      description: 'Örn. "Seçili prodüksiyon işleri".',
      type: 'localizedString',
    }),
    defineField({
      group: 'marquee',
      name: 'marqueeRow',
      title: 'Marquee Satır Alt Metni (kullanılmıyor)',
      type: 'localizedString',
      hidden: true,
    }),
    defineField({
      group: 'marquee',
      name: 'marqueeViewImage',
      title: '"Görseli Gör" Yazısı (kullanılmıyor)',
      type: 'localizedString',
      hidden: true,
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
