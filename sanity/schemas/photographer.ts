import { defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';
import { PortfolioImagesInput } from '../components/PortfolioImagesInput';

const AVAILABLE_TAGS = [
  { title: 'Portre', value: 'portrait' },
  { title: 'Reklam', value: 'commercial' },
  { title: 'Moda', value: 'fashion' },
  { title: 'Editöryal', value: 'editorial' },
  { title: 'Ürün', value: 'product' },
  { title: 'Yaşam Tarzı', value: 'lifestyle' },
  { title: 'Güzellik', value: 'beauty' },
  { title: 'Yemek', value: 'food' },
  { title: 'Mimari', value: 'architecture' },
  { title: 'Etkinlik', value: 'event' },
];

export const photographer = defineType({
  name: 'photographer',
  title: 'Fotoğrafçı',
  type: 'document',
  icon: UserIcon,
  groups: [
    { name: 'identity', title: 'Kimlik Bilgileri', default: true },
    { name: 'portfolio', title: 'Portfolyo' },
    { name: 'bio', title: 'Biyografi & Sosyal' },
  ],
  fields: [
    orderRankField({ type: 'photographer' }),

    // ── Kimlik Bilgileri ──────────────────────────────────────────────────
    defineField({
      group: 'identity',
      name: 'fullName',
      title: 'Tam İsim',
      description: 'Büyük harflerle yazın, örn. "OZAN ÇAKMAK" — listelerde ve başlıklarda kullanılır.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      group: 'identity',
      name: 'name',
      title: 'Kısa Ad',
      description: 'Yalnızca ilk adı, örn. "Ozan" — hero bölümü ve selamlamalar için.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      group: 'identity',
      name: 'slug',
      title: 'URL (Slug)',
      description: 'Sayfanın adresi: f28.com.tr/[slug] — Tam İsim girilince otomatik oluşur.',
      type: 'slug',
      options: {
        source: 'fullName',
        maxLength: 64,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/ı/g, 'i')
            .replace(/ş/g, 's')
            .replace(/ç/g, 'c')
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ö/g, 'o')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      group: 'identity',
      name: 'title',
      title: 'Görev / Ünvan',
      description: 'Portfolyo kartı ve detay sayfasında görünür.',
      type: 'string',
      options: {
        list: [
          { title: 'Fotoğrafçı', value: 'PHOTOGRAPHER' },
          { title: 'Retoucher', value: 'RETOUCHER' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      group: 'identity',
      name: 'tags',
      title: 'Uzmanlık Alanları',
      description: 'Portfolyolar sayfasında filtre olarak kullanılır. Birden fazla seçebilirsiniz.',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: AVAILABLE_TAGS },
    }),
    defineField({
      group: 'identity',
      name: 'preview',
      title: 'Kapak Görseli',
      description: 'Portfolyolar listesinde ve sosyal medya paylaşımlarında (OG) kullanılır. Dikey oran (2:3) önerilir.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),

    // ── Portfolyo ─────────────────────────────────────────────────────────
    defineField({
      group: 'portfolio',
      name: 'portfolioImages',
      title: 'Portfolyo Görselleri',
      description:
        'Detay sayfasındaki ızgara. Görsel ekleyin; sıralama ve silme için üst çubuk, kırpma ve hotspot için görsele tıklayın.',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      components: {
        input: PortfolioImagesInput,
      },
    }),

    // ── Biyografi & Sosyal ────────────────────────────────────────────────
    defineField({
      group: 'bio',
      name: 'bio',
      title: 'Biyografi',
      description: 'Detay sayfasının alt bölümünde gösterilir. Her iki dilde de doldurun.',
      type: 'object',
      options: { collapsible: false },
      fields: [
        defineField({ name: 'tr', title: 'Türkçe', type: 'text', rows: 5 }),
        defineField({ name: 'en', title: 'İngilizce', type: 'text', rows: 5 }),
      ],
    }),
    defineField({
      group: 'bio',
      name: 'instagram',
      title: 'Instagram',
      description: 'Tam URL, örn. https://instagram.com/ozancakmak',
      type: 'url',
    }),
    defineField({
      group: 'bio',
      name: 'website',
      title: 'Kişisel Web Sitesi',
      description: 'Varsa kişisel portfolyo veya web sitesi adresi.',
      type: 'url',
    }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      title: 'fullName',
      role: 'title',
      media: 'preview',
      imageCount: 'portfolioImages.length',
    },
    prepare({ title, role, media, imageCount }) {
      const roleLabel = role === 'RETOUCHER' ? 'Retoucher' : 'Fotoğrafçı';
      const count = typeof imageCount === 'number' ? `${imageCount} görsel` : null;
      return {
        title: title || 'İsimsiz',
        subtitle: [roleLabel, count].filter(Boolean).join('  ·  '),
        media,
      };
    },
  },
});
