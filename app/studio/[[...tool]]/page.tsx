'use client';

import { NextStudio } from 'next-sanity/studio';

import config from '@/sanity.config';
import '@/sanity/studio.css';

export const dynamic = 'force-static';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
