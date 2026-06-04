import { defineField, defineType } from 'sanity';

/** İki dilli metin — her metin field'ı için kullanılır. */
export const localizedString = defineType({
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
    }),
    defineField({
      name: 'tr',
      title: 'Türkçe',
      type: 'string',
    }),
  ],
  preview: {
    select: { en: 'en', tr: 'tr' },
    prepare({ en, tr }) {
      return {
        title: en || tr || '—',
        subtitle: en && tr ? tr : undefined,
      };
    },
  },
});

/** İki dilli uzun metin (textarea). */
export const localizedText = defineType({
  name: 'localizedText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'tr',
      title: 'Türkçe',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { en: 'en', tr: 'tr' },
    prepare({ en, tr }) {
      const sample = en || tr || '';
      return {
        title: sample.slice(0, 80) || '—',
      };
    },
  },
});
