import { NextResponse } from 'next/server';
import { BUILT_IN_COVERS } from '@/lib/covers';
import { parseYouTubeUrl } from '@/lib/music';
import { makeSlug } from '@/lib/slug';
import { STICKERS } from '@/lib/stickers';
import { MAX_LETTER_BODY_LENGTH, MAX_SONGS, MAX_STICKERS } from '@/lib/types';
import type { PersistedCover, SongDraft, StickerSelection } from '@/lib/types';
import { getAdminSupabase } from '@/lib/supabase/admin';

const COVER_PATH_PATTERN = /^[A-Za-z0-9_-]{8,}\.(?:jpg|png|webp)$/;

function isCover(value: unknown): value is PersistedCover {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<PersistedCover>;
  if (candidate.kind === 'built-in') {
    return typeof candidate.id === 'string' && BUILT_IN_COVERS.some((cover) => cover.id === candidate.id);
  }
  return candidate.kind === 'uploaded' && typeof candidate.path === 'string' && COVER_PATH_PATTERN.test(candidate.path);
}

function normalizeStickers(stickers: unknown): StickerSelection[] | null {
  if (!Array.isArray(stickers) || stickers.length > MAX_STICKERS) return null;
  const positions = new Set<number>();
  const normalized: StickerSelection[] = [];

  for (const value of stickers) {
    if (!value || typeof value !== 'object') return null;
    const sticker = value as Partial<StickerSelection>;
    const stickerId = sticker.stickerId;
    const position = sticker.position;
    const rotation = sticker.rotation;
    if (typeof stickerId !== 'string' || !STICKERS.some((item) => item.id === stickerId) || position === undefined || rotation === undefined || !Number.isInteger(position) || !Number.isFinite(rotation)) return null;
    if (position < 0 || position >= MAX_STICKERS || positions.has(position)) return null;
    positions.add(position);
    normalized.push({ stickerId, position, rotation });
  }

  return normalized.sort((a, b) => a.position - b.position);
}

function normalizeSongs(songs: unknown): SongDraft[] | null {
  if (!Array.isArray(songs) || songs.length < 1 || songs.length > MAX_SONGS) return null;
  const normalized: SongDraft[] = [];

  for (const value of songs) {
    if (!value || typeof value !== 'object') return null;
    const song = value as Partial<SongDraft>;
    const parsedUrl = parseYouTubeUrl(typeof song.url === 'string' ? song.url : '');
    if (song.provider !== 'youtube' || typeof song.providerId !== 'string' || !/^[A-Za-z0-9_-]{11}$/.test(song.providerId) || parsedUrl?.id !== song.providerId || typeof song.title !== 'string' || !song.title.trim() || typeof song.url !== 'string') return null;
    normalized.push({ provider: 'youtube', providerId: song.providerId, title: song.title.trim().slice(0, 200), url: song.url });
  }

  return normalized;
}

function normalizeLetter(letter: unknown) {
  if (!letter || typeof letter !== 'object') return null;
  const value = letter as Record<string, unknown>;
  const recipient = typeof value.recipient === 'string' ? value.recipient.trim().slice(0, 80) : '';
  const body = typeof value.body === 'string' ? value.body.slice(0, MAX_LETTER_BODY_LENGTH) : '';
  const sender = typeof value.sender === 'string' ? value.sender.trim().slice(0, 80) : '';
  return { recipient, body, sender };
}

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send a JSON body.' }, { status: 400 });
  }

  if (!payload || typeof payload !== 'object') return NextResponse.json({ error: 'Invalid mixtape data.' }, { status: 400 });
  const body = payload as { cover?: unknown; stickers?: unknown; songs?: unknown; letter?: unknown };
  if (!isCover(body.cover)) return NextResponse.json({ error: 'Choose a valid cover.' }, { status: 400 });
  const stickers = normalizeStickers(body.stickers);
  const songs = normalizeSongs(body.songs);
  const letter = normalizeLetter(body.letter);
  if (!stickers || !songs || !letter) return NextResponse.json({ error: 'Check the songs and stickers, then try again.' }, { status: 400 });

  const supabase = getAdminSupabase();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'covers';
  const slug = body.cover.kind === 'uploaded' ? body.cover.path.split('.')[0] : makeSlug();
  const coverPath = body.cover.kind === 'built-in' ? `builtin:${body.cover.id}` : body.cover.path;

  const rpcPayload = {
    slug,
    coverPath,
    letterRecipient: letter.recipient || null,
    letterBody: letter.body || null,
    letterSender: letter.sender || null,
    songs: songs.map((song, index) => ({
      url: song.url,
      provider: 'youtube',
      providerId: song.providerId,
      title: song.title,
      position: index + 1,
    })),
    stickers: stickers.map((sticker) => ({
      stickerId: sticker.stickerId,
      position: sticker.position,
      rotation: sticker.rotation,
    })),
  };

  const { data: createdSlug, error } = await supabase.rpc('create_mixtape', { payload: rpcPayload });
  if (error || typeof createdSlug !== 'string') {
    if (body.cover.kind === 'uploaded') await supabase.storage.from(bucket).remove([coverPath]);
    return NextResponse.json({ error: 'The mixtape could not be created. Your draft is still here.' }, { status: 500 });
  }

  return NextResponse.json({ slug: createdSlug });
}
