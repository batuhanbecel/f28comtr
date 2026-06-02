import { PageSection } from '@/components/PageSection';
import { Footer } from '@/components/Footer';
import { EditorialPageHero } from '@/components/EditorialPageHero';
import { HeroSnapBody } from '@/components/HeroSnapBody';
import { HeroSnapTarget } from '@/components/HeroSnapTarget';
import { ProductionSnapContainer } from '@/components/ProductionSnapContainer';
import { getPageCopy } from '@/lib/pageCopy';
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
    <ProductionSnapContainer snapMode="heroSnap">
      <EditorialPageHero page="contact" lang={lang} heroCopy={heroCopy} />

      <HeroSnapBody className="bg-th-bg">
        <PageSection className="contact-page pb-20 md:pb-28">
          <HeroSnapTarget className="hero-snap-target--pad">
          <div className="contact-layout">
            <div className="contact-layout__channels">
              <ContactChannels copy={copy} />
            </div>

            <div className="contact-layout__form">
              <ContactForm copy={copy} />
            </div>
          </div>
          </HeroSnapTarget>
        </PageSection>

        <Footer />
      </HeroSnapBody>
    </ProductionSnapContainer>
  );
}
