import Link from 'next/link';
import { BlockHead } from '@/components/gallery/BlockHead';
import type { ContactPageCopy } from '@/lib/pageCopy.types';

interface ContactChannelsProps {
  copy: ContactPageCopy;
}

/** Direct channels as large numbered rows — same index language as Production. */
export function ContactChannels({ copy }: ContactChannelsProps) {
  const rows = [
    { label: copy.emailLabel, href: `mailto:${copy.info.email}`, value: copy.info.email, external: false },
    { label: copy.instagramLabel, href: copy.info.instagram, value: 'Instagram', external: true },
    { label: copy.linkedinLabel, href: copy.info.linkedin, value: 'LinkedIn', external: true },
  ] as const;

  return (
    <section className="g-section" aria-labelledby="contact-channels-title">
      <BlockHead id="contact-channels-title" label={copy.channelsLabel} title={copy.channelsHeading} />
      <div className="g-inner">
        <ul className="contact-rows">
          {rows.map((row, index) => (
            <li key={row.label} className="contact-row">
              <span className="index-list__num">{String(index + 1).padStart(2, '0')}</span>
              <span className="contact-row__label">{row.label}</span>
              <Link
                href={row.href}
                {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="contact-row__value hover-line"
              >
                {row.value}
                {row.external ? <span aria-hidden> ↗</span> : null}
              </Link>
            </li>
          ))}
          <li className="contact-row">
            <span className="index-list__num">04</span>
            <span className="contact-row__label">{copy.addressLabel}</span>
            <p className="contact-row__value contact-row__value--text whitespace-pre-line">
              {`${copy.info.address.replace(/No:\s+/g, 'No: ')}\n${copy.info.city}`}
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
