"use client"

import { EditorialPageHero } from '@/components/EditorialPageHero';
import type { AiPoweredPageCopy } from '@/lib/pageCopy.types';
import type { Lang } from '@/lib/translations';

interface AiPoweredHeroProps {
  lang: Lang;
  copy: AiPoweredPageCopy;
  statsSlot?: React.ReactNode;
}

export function AiPoweredHero({ lang, copy, statsSlot }: AiPoweredHeroProps) {
  const heroCopy = {
    label: copy.sectionLabel,
    title: copy.heading,
    description: copy.description,
  };

  return (
    <EditorialPageHero page="aiPowered" lang={lang} heroCopy={heroCopy}>
      {statsSlot}
    </EditorialPageHero>
  );
}
