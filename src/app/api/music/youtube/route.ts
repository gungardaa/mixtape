import { NextResponse } from 'next/server';
import { parseYouTubeUrl } from '@/lib/music';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let url: string;

  try {
    const body = (await request.json()) as { url?: unknown };
    url = typeof body.url === 'string' ? body.url : '';
  } catch {
    return NextResponse.json({ error: 'Send a JSON body with a YouTube URL.' }, { status: 400 });
  }

  const parsed = parseYouTubeUrl(url);
  if (!parsed) {
    return NextResponse.json({ error: "That doesn't look like a supported YouTube link." }, { status: 400 });
  }

  let title = `YouTube video ${parsed.id}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${parsed.id}`)}&format=json`,
      {
        signal: controller.signal,
        headers: { 'User-Agent': 'Digital Mixtape/1.0' },
      },
    );
    clearTimeout(timeout);

    if (response.ok) {
      const metadata = (await response.json()) as { title?: unknown };
      if (typeof metadata.title === 'string' && metadata.title.trim()) {
        title = metadata.title.trim().slice(0, 200);
      }
    }
  } catch {
    title = `YouTube video ${parsed.id}`;
  }

  return NextResponse.json({
    url: parsed.canonicalUrl,
    provider: 'youtube',
    providerId: parsed.id,
    title,
  });
}
