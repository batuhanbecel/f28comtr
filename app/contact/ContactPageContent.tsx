import { BlockHead } from '@/components/gallery/BlockHead';
import { Footer } from '@/components/Footer';
import { EditorialPageHero } from '@/components/EditorialPageHero';
import { HeroSnapBody } from '@/components/HeroSnapBody';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { getPageCopy } from '@/lib/cms';
import { getServerLang } from '@/lib/serverLang';
import { ContactChannels } from './ContactChannels';
import { ContactForm } from './ContactForm';

export async function ContactPageContent() {
  const lang = await getServerLang();
  const copy = await getPageCopy('contact', lang);

  const heroCopy = {
    label: copy.sectionLabel,
    title: copy.heading,
    description: copy.description,
  };

  return (
    <ProductionSnapContainer>
      <EditorialPageHero page="contact" lang={lang} heroCopy={heroCopy} />

      <HeroSnapBody className="bg-th-bg">
        <ContactChannels copy={copy} />

        <section className="g-section" aria-labelledby="contact-form-title">
          <BlockHead id="contact-form-title" label={copy.formLabel} title={copy.formHeading} />
          <div className="g-inner">
            <ContactForm copy={copy} />
          </div>
        </section>

        <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  );
}
