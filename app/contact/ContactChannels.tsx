import Link from 'next/link';
import type { ContactPageCopy } from '@/lib/pageCopy.types';

interface ContactChannelsProps {
  copy: ContactPageCopy;
}

export function ContactChannels({ copy }: ContactChannelsProps) {
  const rows = [
    {
      label: copy.emailLabel,
      href: `mailto:${copy.info.email}`,
      value: copy.info.email,
      external: false,
    },
    {
      label: copy.instagramLabel,
      href: copy.info.instagram,
      value: 'Instagram',
      external: true,
    },
    {
      label: copy.linkedinLabel,
      href: copy.info.linkedin,
      value: 'LinkedIn',
      external: true,
    },
  ] as const;

  return (
    <div className="contact-channels">
      <div className="page-heading-stack mb-8 md:mb-10">
        <span className="section-label">{copy.channelsLabel}</span>
        <h2 className="heading-section">{copy.channelsHeading}</h2>
      </div>

      <ul className="contact-channel-list">
        {rows.map((row, index) => {
          const num = String(index + 1).padStart(2, '0');
          return (
            <li key={row.label} className="contact-channel-row">
              <span className="contact-channel-num">{num}</span>
              <span className="contact-channel-label">{row.label}</span>
              <Link
                href={row.href}
                {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="contact-channel-value contact-channel-link hover-line"
              >
                {row.value}
              </Link>
            </li>
          );
        })}

        <li className="contact-channel-row">
          <span className="contact-channel-num">04</span>
          <span className="contact-channel-label">{copy.addressLabel}</span>
          <p className="contact-channel-value contact-channel-address whitespace-pre-line">
            {`${copy.info.address}\n${copy.info.city}`}
          </p>
        </li>
      </ul>
    </div>
  );
}
