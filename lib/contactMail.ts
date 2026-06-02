import nodemailer from 'nodemailer';

const DEFAULT_TO = 'info@f28.com.tr';

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function getSmtpConfig() {
  const user = process.env.CONTACT_SMTP_USER?.trim();
  const pass = process.env.CONTACT_SMTP_PASS?.trim();
  const to = process.env.CONTACT_TO?.trim() || DEFAULT_TO;

  if (!user || !pass) {
    throw new Error('CONTACT_SMTP_USER and CONTACT_SMTP_PASS must be set');
  }

  return { user, pass, to };
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export async function sendContactEmail(payload: ContactPayload) {
  const { user, pass, to } = getSmtpConfig();

  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user, pass },
  });

  const { name, email, subject, message } = payload;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');

  await transport.sendMail({
    from: `"f/2.8 Contact" <${user}>`,
    to,
    replyTo: email,
    subject: `[f/2.8] ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Subject:</strong> ${safeSubject}</p><p><strong>Message:</strong></p><p>${safeMessage}</p>`,
  });
}
