'use client';

import { useState, type FormEvent } from 'react';
import { MAX_SONGS } from '@/lib/types';
import type { LetterDraft, SongDraft } from '@/lib/types';
import { LetterPaper } from '@/components/mixtape/LetterPaper';
import { SongList } from '@/components/mixtape/SongList';

type SongsLetterStepProps = {
  songs: SongDraft[];
  onSongsChange: (songs: SongDraft[]) => void;
  letter: LetterDraft;
  onLetterChange: (letter: LetterDraft) => void;
};

type YouTubeResponse = {
  url: string;
  provider: 'youtube';
  providerId: string;
  title: string;
};

export function SongsLetterStep({ songs, onSongsChange, letter, onLetterChange }: SongsLetterStepProps) {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function addSong(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!urlInput.trim() || songs.length >= MAX_SONGS) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/music/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      });
      const payload = (await response.json()) as YouTubeResponse & { error?: string };

      if (!response.ok || !payload.providerId) {
        throw new Error(payload.error ?? 'That link could not be added.');
      }

      onSongsChange([...songs, payload]);
      setUrlInput('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'That link could not be added.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="songs-letter-step-title">
      <div className="mb-3 max-w-2xl sm:mb-4">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#5f6468]">Step 3 / Songs + letter</p>
        <h2 id="songs-letter-step-title" className="mt-1 font-display text-xl sm:text-2xl">Choose the soundtrack, then leave a note.</h2>
        <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-6 text-[#5f6468]">Paste a YouTube link for each track. You can add between 1 and 50 songs.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] xl:items-start">
        <div className="space-y-4">
          <form onSubmit={addSong} className="rounded-sm border-2 border-black bg-[#fffdf7] p-3.5 shadow-[4px_4px_0_#171717] sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-mono text-xs sm:text-sm uppercase tracking-widest">Add a song</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#5f6468]">{songs.length}/{MAX_SONGS}</span>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <label className="sr-only" htmlFor="youtube-url">YouTube URL</label>
              <input
                id="youtube-url"
                value={urlInput}
                onChange={(event) => setUrlInput(event.target.value)}
                placeholder="Paste a YouTube link..."
                disabled={loading || songs.length >= MAX_SONGS}
                className="min-h-10 flex-1 border-2 border-black bg-[#fffdf7] px-3 font-sans text-xs focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/15 disabled:opacity-50"
                inputMode="url"
              />
              <button type="submit" disabled={loading || !urlInput.trim() || songs.length >= MAX_SONGS} className="min-h-10 border-2 border-black bg-[#70a879] px-4 font-semibold text-xs shadow-[2px_2px_0_#171717] transition hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 disabled:opacity-45">
                {loading ? 'Adding...' : 'Add song'}
              </button>
            </div>
            {error && <p role="alert" className="mt-3 border-l-4 border-[#c95f70] bg-[#fff7f7] p-2.5 text-xs text-[#8d3e49]">{error}</p>}
          </form>

          <SongList songs={songs} onRemove={(index) => onSongsChange(songs.filter((_, songIndex) => songIndex !== index))} />
        </div>

        <LetterPaper letter={letter} onChange={onLetterChange} />
      </div>
    </section>
  );
}
