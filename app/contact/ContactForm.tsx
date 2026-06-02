'use client';

import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { EditorialButton } from '@/components/EditorialButton';
import { SectionHeader } from '@/components/PageHeader';
import type { ContactPageCopy } from '@/lib/pageCopy.types';

interface ContactFormProps {
  copy: ContactPageCopy;
}

type FormStatus = 'idle' | 'sending' | 'success';

export function ContactForm({ copy }: ContactFormProps) {
  const f = copy.form;
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      subject: String(data.get('subject') ?? ''),
      message: String(data.get('message') ?? ''),
      website: String(data.get('website') ?? ''),
    };

    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        if (body?.error === 'invalid_email') {
          toast.error(f.invalidEmail);
        } else if (body?.error === 'missing_fields') {
          toast.error(f.required);
        } else {
          toast.error(f.error);
        }
        setStatus('idle');
        return;
      }

      form.reset();
      setStatus('success');
      toast.success(f.success);
    } catch {
      toast.error(f.error);
      setStatus('idle');
    }
  }

  return (
    <div className="contact-form-wrap">
      <SectionHeader label={copy.formLabel} title={copy.formHeading} className="mb-10 md:mb-12" />

      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="contact-form-grid">
          <label className="contact-field">
            <span className="contact-label">{f.name}</span>
            <input
              className="contact-input"
              type="text"
              name="name"
              autoComplete="name"
              required
              maxLength={200}
              disabled={status === 'sending'}
            />
          </label>

          <label className="contact-field">
            <span className="contact-label">{f.email}</span>
            <input
              className="contact-input"
              type="email"
              name="email"
              autoComplete="email"
              required
              maxLength={254}
              disabled={status === 'sending'}
            />
          </label>

          <label className="contact-field contact-field--full">
            <span className="contact-label">{f.subject}</span>
            <input
              className="contact-input"
              type="text"
              name="subject"
              autoComplete="off"
              required
              maxLength={200}
              disabled={status === 'sending'}
            />
          </label>

          <label className="contact-field contact-field--full">
            <span className="contact-label">{f.message}</span>
            <textarea
              className="contact-input contact-textarea"
              name="message"
              required
              maxLength={10000}
              disabled={status === 'sending'}
            />
          </label>

          <label className="sr-only" aria-hidden="true">
            <span>Website</span>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="contact-form-actions">
          {status === 'success' ? (
            <p className="contact-form-success" role="status">
              {f.success}
            </p>
          ) : null}
          <EditorialButton type="submit" variant="primary" disabled={status === 'sending'}>
            {status === 'sending' ? f.sending : f.submit}
          </EditorialButton>
        </div>
      </form>
    </div>
  );
}
