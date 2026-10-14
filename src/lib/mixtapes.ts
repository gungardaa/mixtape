import { getBuiltInCover } from '@/lib/covers';
import { getAdminSupabase } from '@/lib/supabase/admin';
import type { PublicMixtape } from '@/lib/types';

export async function getPublicMixtape(slug: string): Promise<PublicMixtape | null> {
  const supabase = getAdminSupabase();
  const normalizedSlug = slug.trim();

  const { data: mixtape, error: mixtapeError } = await supabase
    .from('mixtapes')
    .select('id, slug, cover_path, letter_recipient, letter_body, letter_sender, created_at')
    .eq('slug', normalizedSlug)
    .eq('status', 'published')
    .single();

  if (mixtapeError) return null;

  const { data: songs, error: songsError } = await supabase
    .from('songs')
    .select('id, url, provider, provider_id, title, position')
    .eq('mixtape_id', mixtape.id)
    .eq('provider', 'youtube')
    .order('position', { ascending: true });

  const { data: stickers, error: stickersError } = await supabase
    .from('mixtape_stickers')
    .select('id, sticker_id, position, rotation')
    .eq('mixtape_id', mixtape.id)
    .order('position', { ascending: true });

  if (songsError || stickersError) return null;

  const cover = mixtape.cover_path.startsWith('builtin:')
    ? getBuiltInCover(mixtape.cover_path.slice('builtin:'.length))
    : {
        kind: 'uploaded' as const,
        publicUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_STORAGE_BUCKET || 'covers'}/${mixtape.cover_path}`,
      };

  if (!cover) return null;

  return {
    slug: mixtape.slug,
    coverPath: mixtape.cover_path,
    cover,
    letterRecipient: mixtape.letter_recipient,
    letterBody: mixtape.letter_body,
    letterSender: mixtape.letter_sender,
    createdAt: mixtape.created_at,
    songs: songs.map((song) => ({
      id: song.id,
      url: song.url,
      provider: 'youtube',
      providerId: song.provider_id,
      title: song.title,
      position: song.position,
    })),
    stickers: stickers.map((sticker) => ({
      id: sticker.id,
      stickerId: sticker.sticker_id,
      position: sticker.position,
      rotation: sticker.rotation,
    })),
  };
}
