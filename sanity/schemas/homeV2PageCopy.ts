import { defineArrayMember, defineField, defineType } from 'sanity';
import { HomeIcon } from '@sanity/icons';
import { HomeSelectedWorksInput } from '../components/HomeSelectedWorksInput';

export const homeV2PageCopy = defineType({
  name: 'homeV2PageCopy',
  title: 'Anasayfa',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'selectedWorks', title: 'Öne Çıkan İşler' },
    { name: 'artists', title: 'Sanatçılar' },
    { name: 'aiSplit', title: 'AI Bölümü' },
    { name: 'other', title: 'Diğer' },
  ],
  fields: [
    defineField({
      group: 'hero',
      name: 'heroLabel',
      title: 'Hero Etiketi',
      description: 'Üst satır, örn. "İstanbul — 2008\'den Beri"',
      type: 'localizedString',
    }),
    defineField({
      group: 'hero',
      name: 'heroTitle',
      title: 'Hero Başlığı',
      type: 'localizedString',
    }),
    defineField({
      group: 'hero',
      name: 'heroDescription',
      title: 'Hero Açıklaması',
      type: 'localizedText',
    }),

    defineField({
      group: 'selectedWorks',
      name: 'selectedWorksLabel',
      title: 'Bölüm Etiketi',
      type: 'localizedString',
    }),
    defineField({
      group: 'selectedWorks',
      name: 'selectedWorksHeading',
      title: 'Bölüm Başlığı',
      type: 'localizedString',
    }),
    defineField({
      group: 'selectedWorks',
      name: 'workTitleFallback',
      title: 'İş Başlığı Yedeği',
      description: 'Öne çıkan işte başlık boşsa kullanılır.',
      type: 'localizedString',
    }),
    defineField({
      group: 'selectedWorks',
      name: 'works',
      title: 'Öne Çıkan İşler',
      description:
        'Anasayfada gösterilen işler (en fazla 6). Sırayı sürükleyerek veya kartlardan değiştirebilirsiniz.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homeSelectedWork',
          title: 'Öne Çıkan İş',
          fields: [
            defineField({
              name: 'image',
              title: 'Görsel',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'workTitle',
              title: 'İş Başlığı',
              description: 'Boş bırakırsan yedek başlık kullanılır.',
              type: 'string',
            }),
            defineField({
              name: 'photographer',
              title: 'Fotoğrafçı',
              type: 'reference',
              to: [{ type: 'photographer' }],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              media: 'image',
              workTitle: 'workTitle',
              name: 'photographer.fullName',
              role: 'photographer.title',
            },
            prepare({ media, workTitle, name, role }) {
              return {
                media,
                title: workTitle || name || 'İsimsiz',
                subtitle: [name, role].filter(Boolean).join('  —  ') || undefined,
              };
            },
          },
        }),
      ],
      options: {
        layout: 'grid',
        modal: { type: 'dialog', width: 5 },
      },
      validation: (Rule) => Rule.max(6),
      components: {
        input: HomeSelectedWorksInput,
      },
    }),

    defineField({
      group: 'artists',
      name: 'artistsLabel',
      title: 'Sanatçılar Etiketi',
      type: 'localizedString',
    }),
    defineField({
      group: 'artists',
      name: 'artistsHeading',
      title: 'Sanatçılar Başlığı',
      type: 'localizedString',
    }),
    defineField({
      group: 'artists',
      name: 'viewAllArtists',
      title: '"Tümünü Gör" Yazısı',
      type: 'localizedString',
    }),

    defineField({
      group: 'aiSplit',
      name: 'aiSplitLabel',
      title: 'AI Bölüm Etiketi',
      type: 'localizedString',
    }),
    defineField({
      group: 'aiSplit',
      name: 'aiSplitTitle',
      title: 'AI Bölüm Başlığı',
      type: 'localizedString',
    }),
    defineField({
      group: 'aiSplit',
      name: 'aiSplitBody',
      title: 'AI Bölüm Metni',
      type: 'localizedText',
    }),
    defineField({
      group: 'aiSplit',
      name: 'aiSplitCta',
      title: 'AI Buton Yazısı',
      type: 'localizedString',
    }),
    defineField({
      group: 'aiSplit',
      name: 'aiWorksStat',
      title: 'AI İş Sayısı Etiketi',
      description: 'Örn. "AI iş" / "AI works"',
      type: 'localizedString',
    }),

    defineField({
      group: 'other',
      name: 'servicesMarqueeLabel',
      title: 'Hizmetler Marquee Etiketi',
      type: 'localizedString',
    }),
    defineField({
      group: 'other',
      name: 'clientsMarqueeLabel',
      title: 'Müşteri Logoları Marquee Etiketi',
      type: 'localizedString',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Anasayfa' };
    },
  },
});
