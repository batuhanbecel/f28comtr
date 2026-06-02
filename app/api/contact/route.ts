import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/contactMail';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      website?: string;
    };

    if (body.website?.trim()) {
      return NextResponse.json({ ok: true });
    }

    const name = body.name?.trim() ?? '';
    const email = body.email?.trim() ?? '';
    const subject = body.subject?.trim() ?? '';
    const message = body.message?.trim() ?? '';

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }

    if (name.length > 200 || email.length > 254 || subject.length > 200 || message.length > 10000) {
      return NextResponse.json({ error: 'too_long' }, { status: 400 });
    }

    await sendContactEmail({ name, email, subject, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[api/contact]', error);
    return NextResponse.json({ error: 'send_failed' }, { status: 500 });
  }
}
