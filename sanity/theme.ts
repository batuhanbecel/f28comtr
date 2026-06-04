import { buildLegacyTheme } from 'sanity';

/** f/2.8 — editorial siyah/beyaz Studio teması. */
const props = {
  '--black': '#0a0a0a',
  '--white': '#ffffff',

  '--gray': '#9a9a9a',
  '--gray-base': '#202020',

  '--component-bg': '#0d0d0d',
  '--component-text-color': '#fafafa',

  '--brand-primary': '#ffffff',

  '--default-button-color': '#1a1a1a',
  '--default-button-primary-color': '#ffffff',
  '--default-button-success-color': '#4ade80',
  '--default-button-warning-color': '#facc15',
  '--default-button-danger-color': '#ef4444',

  '--state-info-color': '#ffffff',
  '--state-success-color': '#4ade80',
  '--state-warning-color': '#facc15',
  '--state-danger-color': '#ef4444',

  '--main-navigation-color': '#0a0a0a',
  '--main-navigation-color--inverted': '#ffffff',

  '--focus-color': '#ffffff',
};

export const studioTheme = buildLegacyTheme(props);
