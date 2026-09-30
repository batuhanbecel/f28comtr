import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/contactMail';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Allow at most 5 contact requests per 10 minutes per IP
    const rateLimit = checkRateLimit(ip, { windowMs: 10 * 60 * 1000, max: 5 });

    if (!rateLimit.success) {
      const retryAfterSeconds = Math.ceil((rateLimit.reset - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'rate_limited', message: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSeconds),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.reset),
          },
        },
      );
    }

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
