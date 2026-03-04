import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function POST(request: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await request.formData();
  const file = form.get('file') as File | null;
  const folder = (form.get('folder') as string | null) ?? 'uploads';

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG and WebP allowed' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN not configured' }, { status: 500 });
  }

  try {
    const blob = await put(name, file, { access: 'private' });
    // Return a same-origin proxy URL so images load regardless of store access type
    const proxyUrl = `/api/blob?u=${encodeURIComponent(blob.url)}`;
    return NextResponse.json({ url: proxyUrl });
  } catch (err) {
    console.error('[upload] put() failed:', err);
    return NextResponse.json({ error: (err as Error).message ?? 'Upload failed' }, { status: 500 });
  }
}
