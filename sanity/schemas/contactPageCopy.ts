import { defineField, defineType } from 'sanity';

export const contactPageCopy = defineType({
  name: 'contactPageCopy',
  title: 'İletişim Sayfası',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Üst Bölüm', default: true },
    { name: 'channels', title: 'İletişim Kanalları' },
    { name: 'form', title: 'Form' },
    { name: 'info', title: 'İletişim Bilgileri' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Hero ────────────────────────────────────────────────────────────
    defineField({ group: 'hero', name: 'sectionLabel', title: 'Bölüm Etiketi', type: 'localizedString' }),
    defineField({ group: 'hero', name: 'heading', title: 'Başlık', type: 'localizedString' }),
    defineField({ group: 'hero', name: 'description', title: 'Açıklama', type: 'localizedText' }),

    // ── Channels (sidebar) ──────────────────────────────────────────────
    defineField({
      group: 'channels',
      name: 'channelsLabel',
      title: 'Kanallar Bölüm Etiketi',
      type: 'localizedString',
    }),
    defineField({
      group: 'channels',
      name: 'channelsHeading',
      title: 'Kanallar Başlığı',
      type: 'localizedString',
    }),
    defineField({ group: 'channels', name: 'emailLabel', title: 'Email Etiketi', type: 'localizedString' }),
    defineField({ group: 'channels', name: 'instagramLabel', title: 'Instagram Etiketi', type: 'localizedString' }),
    defineField({ group: 'channels', name: 'linkedinLabel', title: 'LinkedIn Etiketi', type: 'localizedString' }),
    defineField({ group: 'channels', name: 'addressLabel', title: 'Adres Etiketi', type: 'localizedString' }),

    // ── Form ────────────────────────────────────────────────────────────
    defineField({ group: 'form', name: 'formLabel', title: 'Form Bölüm Etiketi', type: 'localizedString' }),
    defineField({ group: 'form', name: 'formHeading', title: 'Form Başlığı', type: 'localizedString' }),
    defineField({
      group: 'form',
      name: 'form',
      title: 'Form Alan Etiketleri',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'name', title: 'İsim', type: 'localizedString' }),
        defineField({ name: 'email', title: 'Email', type: 'localizedString' }),
        defineField({ name: 'subject', title: 'Konu', type: 'localizedString' }),
        defineField({ name: 'message', title: 'Mesaj', type: 'localizedString' }),
        defineField({ name: 'submit', title: 'Gönder Butonu', type: 'localizedString' }),
        defineField({ name: 'sending', title: 'Gönderiliyor Durumu', type: 'localizedString' }),
        defineField({ name: 'success', title: 'Başarı Mesajı', type: 'localizedString' }),
        defineField({ name: 'error', title: 'Hata Mesajı', type: 'localizedString' }),
        defineField({ name: 'required', title: 'Zorunlu Alan Mesajı', type: 'localizedString' }),
        defineField({ name: 'invalidEmail', title: 'Geçersiz Email Mesajı', type: 'localizedString' }),
      ],
    }),

    // ── Contact Info ────────────────────────────────────────────────────
    defineField({
      group: 'info',
      name: 'info',
      title: 'İletişim Bilgileri',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
        defineField({ name: 'address', title: 'Adres', type: 'string' }),
        defineField({ name: 'city', title: 'Şehir', type: 'string' }),
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
  preview: { prepare: () => ({ title: 'İletişim Sayfası' }) },
});
