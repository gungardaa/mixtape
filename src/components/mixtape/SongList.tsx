'use client';

import type { SongDraft } from '@/lib/types';

type SongListProps = {
  songs: SongDraft[];
  onRemove: (index: number) => void;
  emptyLabel?: string;
};

export function SongList({ songs, onRemove, emptyLabel = 'Your mixtape is empty. Add your first song above.' }: SongListProps) {
  return (
    <div className="overflow-hidden border-2 border-black bg-[#fffdf7]">
      <div className="flex items-center justify-between border-b-2 border-black bg-[#f2eee5] px-4 py-3">
        <h3 className="font-mono text-sm uppercase tracking-widest">Song list</h3>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#5f6468]">{songs.length} tracks</span>
      </div>

      {songs.length === 0 ? (
        <div className="p-3 text-center text-xs leading-5 text-[#5f6468] sm:p-3.5">
          <p className="font-display text-xs uppercase tracking-wide text-[#171717]">No songs yet</p>
          <p className="mt-0.5">{emptyLabel}</p>
        </div>
      ) : (
        <ol className="divide-y-2 divide-black/10">
          {songs.map((song, index) => (
            <li key={`${song.providerId}-${index}`} className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-[#e8c86a] font-mono text-xs font-bold">{String(index + 1).padStart(2, '0')}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{song.title}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-[#5f6468]">YouTube · {song.providerId}</p>
              </div>
              <button type="button" onClick={() => onRemove(index)} className="border-2 border-black bg-[#fffdf7] px-3 py-2 font-mono text-xs uppercase tracking-widest shadow-[2px_2px_0_#171717] transition hover:bg-[#e6a8b5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20" aria-label={`Remove ${song.title}`}>
                Remove
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
