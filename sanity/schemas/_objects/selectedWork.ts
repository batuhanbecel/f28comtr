import { defineArrayMember, defineField } from 'sanity';
import { HomeWorkImageInput } from '../../components/HomeWorkImageInput';
import { ARTIST_ROLE_STUDIO_LABELS, formatRoles, normalizeRoles } from '@/lib/artistRoles';

/**
 * One picked work: a photographer + an image from their portfolio (or an
 * upload). Shared by the home hero reel ("Öne Çıkan İşler") and the site-wide
 * "Seçili İşler" list on the Production document.
 */
export const selectedWorkMember = defineArrayMember({
  type: 'object',
  name: 'homeSelectedWork',
  title: 'Öne Çıkan İş',
  fields: [
    defineField({
      name: 'photographer',
      title: 'Fotoğrafçı',
      type: 'reference',
      to: [{ type: 'photographer' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Görsel',
      description: 'Seçili fotoğrafçının portfolyosundan seçin ya da bilgisayardan yükleyin.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      components: { input: HomeWorkImageInput },
    }),
    defineField({
      name: 'workTitle',
      title: 'İş Başlığı',
      description: 'Boş bırakırsan yedek başlık kullanılır.',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      media: 'image',
      workTitle: 'workTitle',
      name: 'photographer.fullName',
      roles: 'photographer.roles',
      legacyRole: 'photographer.title',
    },
    prepare({ media, workTitle, name, roles, legacyRole }) {
      const role = name
        ? formatRoles(normalizeRoles(roles?.length ? roles : legacyRole), ARTIST_ROLE_STUDIO_LABELS)
        : null;
      return {
        media,
        title: workTitle || name || 'İsimsiz',
        subtitle: [name, role].filter(Boolean).join('  —  ') || undefined,
      };
    },
  },
});
