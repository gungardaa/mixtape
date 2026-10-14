import { NextResponse } from 'next/server';
import { MAX_UPLOAD_BYTES } from '@/lib/types';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { makeSlug } from '@/lib/slug';

const ACCEPTED_CONTENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: { contentType?: unknown; size?: unknown };
  try {
    body = (await request.json()) as { contentType?: unknown; size?: unknown };
  } catch {
    return NextResponse.json({ error: 'Send a JSON body.' }, { status: 400 });
  }

  if (typeof body.contentType !== 'string' || !ACCEPTED_CONTENT_TYPES.has(body.contentType)) {
    return NextResponse.json({ error: 'Choose a JPG, PNG, or WebP image.' }, { status: 400 });
  }
  if (typeof body.size !== 'number' || !Number.isFinite(body.size) || body.size < 1 || body.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'That image is too large. Please choose an image under 5 MB.' }, { status: 400 });
  }

  const extension = body.contentType === 'image/png' ? 'png' : body.contentType === 'image/webp' ? 'webp' : 'jpg';
  const path = `${makeSlug()}.${extension}`;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'covers';
  const supabase = getAdminSupabase();
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path, { upsert: false });

  if (error || !data) {
    return NextResponse.json({ error: 'The cover upload could not be prepared.' }, { status: 500 });
  }

  return NextResponse.json({ path, signedUrl: data.signedUrl }, { headers: { 'Cache-Control': 'no-store' } });
}
