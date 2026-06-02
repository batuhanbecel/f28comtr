'use client';

import { F28LogoAnimated } from '@/components/F28LogoAnimated';

interface HomeV2HeroLogoProps {
  title: string;
}

export function HomeV2HeroLogo({ title }: HomeV2HeroLogoProps) {
  return (
    <h1 className="home-v2-hero-logo-heading w-full m-0">
      <span className="sr-only">{title}</span>
      <div className="home-v2-hero-logo-stage mx-auto w-fit max-w-full">
        <F28LogoAnimated className="home-v2-hero-logo text-white" />
      </div>
    </h1>
  );
}
