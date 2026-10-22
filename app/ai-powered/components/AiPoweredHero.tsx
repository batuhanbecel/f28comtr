"use client"

import { EditorialPageHero } from '@/components/EditorialPageHero';
import type { AiPoweredPageCopy } from '@/lib/pageCopy.types';
import type { Lang } from '@/lib/translations';

interface AiPoweredHeroProps {
  lang: Lang;
  copy: AiPoweredPageCopy;
}

export function AiPoweredHero({ lang, copy }: AiPoweredHeroProps) {
  const heroCopy = {
    label: copy.sectionLabel,
    title: copy.heading,
    description: copy.description,
  };

  return (
    <EditorialPageHero page="aiPowered" lang={lang} heroCopy={heroCopy} />
  );
}
