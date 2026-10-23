'use client';

import { useRef, useState, type FormEvent } from 'react';
import { EditorialButton } from '@/components/EditorialButton';
import type { ContactPageCopy } from '@/lib/pageCopy.types';

interface ContactFormProps {
  copy: ContactPageCopy;
}

type FormStatus = 'idle' | 'sending' | 'success';
type FieldName = 'name' | 'email' | 'subject' | 'message';
type FieldErrors = Partial<Record<FieldName, string>>;

const FIELD_ORDER: FieldName[] = ['name', 'email', 'subject', 'message'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ copy }: ContactFormProps) {
  const f = copy.form;
  const [status, setStatus] = useState<FormStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Sanity copy may predate these keys — fall back to the generic messages.
  const requiredMsg = f.fieldRequired || f.required;
  const rateLimitedMsg = f.rateLimited || f.error;

  function validate(values: Record<FieldName, string>): FieldErrors {
    const errors: FieldErrors = {};
    for (const key of FIELD_ORDER) {
      if (!values[key].trim()) errors[key] = requiredMsg;
    }
    if (!errors.email && !EMAIL_RE.test(values.email.trim())) errors.email = f.invalidEmail;
    return errors;
  }

  function focusFirstError(errors: FieldErrors) {
    const first = FIELD_ORDER.find((key) => errors[key]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  function clearFieldError(name: FieldName) {
    if (!fieldErrors[name]) return;
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      subject: String(data.get('subject') ?? ''),
      message: String(data.get('message') ?? ''),
    };

    const errors = validate(values);
    setFieldErrors(errors);
    setFormError('');
    if (Object.keys(errors).length > 0) {
      focusFirstError(errors);
      return;
    }

    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, website: String(data.get('website') ?? '') }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        if (body?.error === 'invalid_email') {
          const next = { email: f.invalidEmail };
          setFieldErrors(next);
          focusFirstError(next);
        } else if (body?.error === 'missing_fields') {
          setFormError(f.required);
        } else if (res.status === 429 || body?.error === 'rate_limited') {
          setFormError(rateLimitedMsg);
        } else {
          setFormError(f.error);
        }
        setStatus('idle');
        return;
      }

      form.reset();
      setStatus('success');
    } catch {
      setFormError(f.error);
      setStatus('idle');
    }
  }

  const fieldProps = (name: FieldName) => ({
    name,
    'aria-invalid': fieldErrors[name] ? true : undefined,
    'aria-describedby': fieldErrors[name] ? `contact-${name}-error` : undefined,
    'aria-required': true,
    disabled: status === 'sending',
    onChange: () => {
      clearFieldError(name);
      if (status === 'success') setStatus('idle');
    },
  });

  const renderError = (name: FieldName) =>
    fieldErrors[name] ? (
      <span id={`contact-${name}-error`} className="contact-field-error">
        {fieldErrors[name]}
      </span>
    ) : null;

  const renderLabel = (text: string) => (
    <span className="contact-label">
      {text}
      <span aria-hidden="true" className="contact-required">*</span>
    </span>
  );

  return (
    <div className="contact-form-wrap">
      <form ref={formRef} onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="contact-form-grid">
          <label className="contact-field">
            {renderLabel(f.name)}
            <input className="contact-input" type="text" autoComplete="name" maxLength={200} {...fieldProps('name')} />
            {renderError('name')}
          </label>

          <label className="contact-field">
            {renderLabel(f.email)}
            <input
              className="contact-input"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={254}
              {...fieldProps('email')}
            />
            {renderError('email')}
          </label>

          <label className="contact-field contact-field--full">
            {renderLabel(f.subject)}
            <input className="contact-input" type="text" autoComplete="off" maxLength={200} {...fieldProps('subject')} />
            {renderError('subject')}
          </label>

          <label className="contact-field contact-field--full">
            {renderLabel(f.message)}
            <textarea className="contact-input contact-textarea" maxLength={10000} {...fieldProps('message')} />
            {renderError('message')}
          </label>

          <label className="sr-only" aria-hidden="true">
            <span>Website</span>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="contact-form-actions">
          <div aria-live="polite" className="contact-form-status">
            {status === 'success' ? <p className="contact-form-success">{f.success}</p> : null}
            {formError ? (
              <p className="contact-form-error" role="alert">
                {formError}
              </p>
            ) : null}
          </div>
          <EditorialButton type="submit" variant="primary" disabled={status === 'sending'} aria-busy={status === 'sending'}>
            {status === 'sending' ? f.sending : f.submit}
          </EditorialButton>
        </div>
      </form>
    </div>
  );
}
