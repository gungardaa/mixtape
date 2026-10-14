'use client';

import { getYouTubeEmbedUrl } from '@/lib/music';
import type { PublicSong } from '@/lib/types';

type MusicPlayerProps = {
  songs: PublicSong[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function MusicPlayer({ songs, activeIndex, onSelect }: MusicPlayerProps) {
  const activeSong = songs[activeIndex];

  return (
    <section aria-labelledby="music-player-title" className="rounded-sm border-2 border-black bg-[#171717] p-4 text-[#fffdf7] shadow-[6px_6px_0_#171717] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#e8c86a]">Now playing</p>
          <h2 id="music-player-title" className="mt-2 font-display text-lg leading-snug sm:text-2xl">{activeSong?.title ?? 'Choose a track'}</h2>
        </div>
        {activeSong && <span className="shrink-0 border-2 border-[#e8c86a] px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-[#e8c86a]">YouTube</span>}
      </div>

      <div className="mt-5 aspect-video w-full overflow-hidden border-2 border-[#fffdf7]/20 bg-[#0e0e0e]">
        {activeSong ? (
          <iframe
            src={getYouTubeEmbedUrl(activeSong.providerId)}
            title={`Play ${activeSong.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-widest text-[#5f6468]">No track selected</div>
        )}
      </div>
    </section>
  );
}

export function PublicSongList({ songs, activeIndex, onSelect }: { songs: PublicSong[]; activeIndex: number; onSelect: (index: number) => void }) {
  return (
    <ol className="overflow-hidden border-2 border-black bg-[#fffdf7]">
      {songs.map((song, index) => {
        const active = index === activeIndex;
        return (
          <li key={song.id}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 ${
                active ? 'bg-[#e8c86a]' : 'hover:bg-[#f2eee5]'
              }`}
              aria-current={active ? 'true' : undefined}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black font-mono text-xs font-bold ${active ? 'bg-[#171717] text-[#fffdf7]' : 'bg-[#fffdf7]'}`}>{String(index + 1).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{song.title}</span>
                <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-widest text-[#5f6468]">YouTube · track {index + 1}</span>
              </span>
              <span className={`h-3 w-3 border-2 border-black ${active ? 'bg-[#70a879]' : 'bg-[#fffdf7]'}`} aria-hidden="true" />
            </button>
          </li>
        );
      })}
    </ol>
  );
}
