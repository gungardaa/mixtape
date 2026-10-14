const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function parseYouTubeUrl(value: string) {
  const input = value.trim();
  if (!input) return null;

  try {
    const url = new URL(input);
    const host = url.hostname.toLowerCase().replace(/^www\.|^m\.|^music\./, '');
    let id = '';

    if (host === 'youtu.be') {
      id = url.pathname.split('/').filter(Boolean)[0] ?? '';
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname === '/watch' || url.pathname === '/live') {
        id = url.searchParams.get('v') ?? '';
      } else if (url.pathname.startsWith('/shorts/') || url.pathname.startsWith('/embed/')) {
        id = url.pathname.split('/').filter(Boolean)[1] ?? '';
      }
    } else {
      return null;
    }

    if (!YOUTUBE_ID_PATTERN.test(id)) return null;

    return {
      id,
      canonicalUrl: `https://www.youtube.com/watch?v=${id}`,
    };
  } catch {
    return null;
  }
}

export function getYouTubeEmbedUrl(providerId: string) {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(providerId)}?rel=0`;
}
