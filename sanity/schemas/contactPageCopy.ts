import { defineField, defineType } from 'sanity';

export const contactPageCopy = defineType({
  name: 'contactPageCopy',
  title: 'Contact Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'channels', title: 'Channels' },
    { name: 'form', title: 'Form' },
    { name: 'info', title: 'Contact Info' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Hero ────────────────────────────────────────────────────────────
    defineField({ group: 'hero', name: 'sectionLabel', title: 'Section Label', type: 'localizedString' }),
    defineField({ group: 'hero', name: 'heading', title: 'Heading', type: 'localizedString' }),
    defineField({ group: 'hero', name: 'description', title: 'Description', type: 'localizedText' }),

    // ── Channels (sidebar) ──────────────────────────────────────────────
    defineField({
      group: 'channels',
      name: 'channelsLabel',
      title: 'Channels Section Label',
      type: 'localizedString',
    }),
    defineField({
      group: 'channels',
      name: 'channelsHeading',
      title: 'Channels Heading',
      type: 'localizedString',
    }),
    defineField({ group: 'channels', name: 'emailLabel', title: 'Email Label', type: 'localizedString' }),
    defineField({ group: 'channels', name: 'instagramLabel', title: 'Instagram Label', type: 'localizedString' }),
    defineField({ group: 'channels', name: 'linkedinLabel', title: 'LinkedIn Label', type: 'localizedString' }),
    defineField({ group: 'channels', name: 'addressLabel', title: 'Address Label', type: 'localizedString' }),

    // ── Form ────────────────────────────────────────────────────────────
    defineField({ group: 'form', name: 'formLabel', title: 'Form Section Label', type: 'localizedString' }),
    defineField({ group: 'form', name: 'formHeading', title: 'Form Heading', type: 'localizedString' }),
    defineField({
      group: 'form',
      name: 'form',
      title: 'Form Labels',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'name', title: 'Name', type: 'localizedString' }),
        defineField({ name: 'email', title: 'Email', type: 'localizedString' }),
        defineField({ name: 'subject', title: 'Subject', type: 'localizedString' }),
        defineField({ name: 'message', title: 'Message', type: 'localizedString' }),
        defineField({ name: 'submit', title: 'Submit Button', type: 'localizedString' }),
        defineField({ name: 'sending', title: 'Sending State', type: 'localizedString' }),
        defineField({ name: 'success', title: 'Success Message', type: 'localizedString' }),
        defineField({ name: 'error', title: 'Error Message', type: 'localizedString' }),
        defineField({ name: 'required', title: 'Required Field Message', type: 'localizedString' }),
        defineField({ name: 'invalidEmail', title: 'Invalid Email Message', type: 'localizedString' }),
      ],
    }),

    // ── Contact Info ────────────────────────────────────────────────────
    defineField({
      group: 'info',
      name: 'info',
      title: 'Contact Info',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
        defineField({ name: 'address', title: 'Address', type: 'string' }),
        defineField({ name: 'city', title: 'City', type: 'string' }),
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
        defineField({ name: 'title', title: 'Title', type: 'localizedString' }),
        defineField({ name: 'description', title: 'Description', type: 'localizedText' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Contact Page' }) },
});
