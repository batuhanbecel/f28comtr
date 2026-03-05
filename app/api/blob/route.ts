import { type NextRequest, NextResponse } from 'next/server';

const BLOB_DOMAIN_RE = /^https:\/\/[a-z0-9]+\.(public|private)\.blob\.vercel-storage\.com\//;

export async function GET(request: NextRequest) {
  const u = request.nextUrl.searchParams.get('u');
  if (!u) return new NextResponse('Missing url param', { status: 400 });

  const blobUrl = decodeURIComponent(u);

  if (!BLOB_DOMAIN_RE.test(blobUrl)) {
    return new NextResponse('Invalid blob URL', { status: 400 });
  }

  const isPrivate = blobUrl.includes('.private.blob.vercel-storage.com');

  const headers: HeadersInit = {};
  if (isPrivate) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return new NextResponse('Storage not configured', { status: 500 });
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(blobUrl, { headers });

  if (!res.ok) {
    return new NextResponse('Blob not found', { status: res.status });
  }

  const contentType = res.headers.get('content-type') ?? 'image/jpeg';
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
