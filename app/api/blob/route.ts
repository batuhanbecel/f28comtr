import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const u = request.nextUrl.searchParams.get('u');
  if (!u) return new NextResponse('Missing url param', { status: 400 });

  const blobUrl = decodeURIComponent(u);

  const ALLOWED_STORE = 'srzew0qzegvhjbvh.private.blob.vercel-storage.com';
  if (!blobUrl.startsWith(`https://${ALLOWED_STORE}/`)) {
    return new NextResponse('Invalid blob URL', { status: 400 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return new NextResponse('Storage not configured', { status: 500 });

  const res = await fetch(blobUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

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
