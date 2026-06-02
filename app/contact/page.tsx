import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import { ContactPageContent } from './ContactPageContent';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('contact', '/contact');
}

export default function ContactPage() {
  return <ContactPageContent />;
}
