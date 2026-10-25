import { defineArrayMember, defineField, defineType } from 'sanity';
import { HomeIcon } from '@sanity/icons';
import { selectedWorkMember } from './_objects/selectedWork';
import { HomeSelectedWorksInput } from '../components/HomeSelectedWorksInput';
import { AiSceneItemsInput } from '../components/AiSceneItemsInput';
import { HOME_AI_SCENE_MAX } from '@/lib/homeV2.shared';

export const homeV2PageCopy = defineType({
  name: 'homeV2PageCopy',
  title: 'Anasayfa',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'selectedWorks', title: 'Öne Çıkan İşler' },
    { name: 'artists', title: 'Sanatçılar' },
    { name: 'aiSplit', title: 'AI Sahnesi' },
    { name: 'other', title: 'Müşteriler' },
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
      description: 'Hero cümlesinin beyaz ilk kısmı, örn. "Prodüksiyonun en iyi hali".',
      type: 'localizedString',
    }),
    defineField({
      group: 'hero',
      name: 'heroDescription',
      title: 'Hero Açıklaması',
      description:
        'Cümlenin devamı. İçindeki "fotoğrafçılık", "rötuş" ve "hibrit AI prodüksiyon" (EN: "photography", "retouch", "hybrid AI production") kelimeleri otomatik olarak ilgili sayfaya bağlanır.',
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
        'Hero\'nun numaralı slaytları (01–06), aynı sırayla. Fotoğrafçıyı seçip portfolyosundan ekleyin; sırayı sürükleyerek değiştirin. Anasayfadaki "Seçili işler" bölümü buradan değil, Prodüksiyon Sayfası → "Seçili İşler" listesinden gelir.',
      type: 'array',
      of: [
        selectedWorkMember,
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
      name: 'artistsIntro',
      title: 'Sanatçılar Açıklaması',
      description: 'Başlığın sağındaki kısa cümle, örn. "Birlikte çalıştığımız fotoğrafçı ve retoucherlar".',
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
      name: 'aiSceneLeft',
      title: 'Sahne — Üst Yazı',
      description:
        'Kaydırınca büyüyen görselin üstündeki kısa cümle, örn. "Made with AI."',
      type: 'localizedString',
    }),
    defineField({
      group: 'aiSplit',
      name: 'aiSceneItems',
      title: 'Sahne Görselleri',
      description:
        'Kaydırınca sırayla gösterilen görseller (en fazla 6), AI Portfolyo\'dan seçilir. Sırayı sürükleyerek değiştirin. Boş bırakılırsa AI Portfolyo\'nun ilk 4 görseli gösterilir.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'aiPortfolioItem' }],
        }),
      ],
      options: { layout: 'grid' },
      validation: (Rule) => Rule.max(HOME_AI_SCENE_MAX).unique(),
      components: { input: AiSceneItemsInput },
    }),
    defineField({
      group: 'aiSplit',
      name: 'aiSceneRight',
      title: 'Sahne — Alt Yazı',
      description: 'Görselin altındaki kısa cümle, örn. "Finished by hand."',
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
      description: 'Sahnedeki beyaz buton, AI Powered Portfolyo sayfasına gider. Örn. "View portfolio" / "Portfolyoyu gör".',
      type: 'localizedString',
    }),
    defineField({
      group: 'aiSplit',
      name: 'aiWorksStat',
      title: 'AI İş Sayısı Etiketi (kullanılmıyor)',
      description: 'Eski tasarımdan kalma; sitede gösterilmiyor.',
      type: 'localizedString',
      hidden: true,
    }),

    defineField({
      group: 'other',
      name: 'servicesMarqueeLabel',
      title: 'Hizmetler Marquee Etiketi (kullanılmıyor)',
      description: 'Eski tasarımdan kalma; sitede gösterilmiyor.',
      type: 'localizedString',
      hidden: true,
    }),
    defineField({
      group: 'other',
      name: 'clientsMarqueeLabel',
      title: 'Müşteriler Etiketi',
      description: 'Logo duvarının üstündeki küçük etiket, örn. "Clients". Logolar Site Ayarları & Medya\'dan yönetilir.',
      type: 'localizedString',
    }),
    defineField({
      group: 'other',
      name: 'clientsHeading',
      title: 'Müşteriler Başlığı',
      description: 'Örn. "Birlikte çalıştığımız markalar".',
      type: 'localizedString',
    }),
    defineField({
      group: 'other',
      name: 'clientsIntro',
      title: 'Müşteriler Açıklaması',
      type: 'localizedText',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Anasayfa' };
    },
  },
});
