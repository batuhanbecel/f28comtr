import { defineEnableDraftMode } from 'next-sanity/draft-mode';

import { getReadClient } from '@/lib/sanity.client';

export const { GET } = defineEnableDraftMode({
  client: getReadClient(),
});
