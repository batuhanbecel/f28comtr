import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { trTRLocale } from '@sanity/locale-tr-tr';
import { media } from 'sanity-plugin-media';

import { apiVersion, dataset, projectId, studioBasePath } from './sanity/env';
import { schemaTypes } from './sanity/schemas';
import { isSingleton, structure } from './sanity/structure';
import { StudioLogo } from './sanity/components/StudioLogo';
import { studioTheme } from './sanity/theme';
import { locations } from './sanity/locations';

// Studio is always loaded in a browser, so prefer the current origin.
const previewOrigin =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default defineConfig({
  name: 'f28-studio',
  title: 'f/2.8 Studio',
  basePath: studioBasePath,
  projectId,
  dataset,
  icon: StudioLogo,
  theme: studioTheme,
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !isSingleton(schemaType)),
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: previewOrigin,
        previewMode: { enable: '/api/draft-mode/enable' },
      },
      resolve: locations,
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    media(),
    trTRLocale(),
  ],
  i18n: {
    bundles: [],
  },
  // Default locale = Turkish
  // (the locale plugin exposes itself in the user menu; default applies on
  //  first visit, users can switch back to English if they prefer)
  studio: {
    components: {
      logo: StudioLogo,
    },
  },
  document: {
    actions: (input, context) =>
      isSingleton(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action && ['publish', 'discardChanges', 'restore'].includes(action),
          )
        : input,
  },
});
