'use client';

import { useState } from 'react';
import type { MixtapeDraft } from '@/lib/types';
import { CassettePreview } from '@/components/mixtape/CassettePreview';

type PreviewStepProps = {
  draft: MixtapeDraft;
  onBack: () => void;
  onCreate: () => void;
  creating: boolean;
  error: string;
};

export function PreviewStep({ draft, onBack, onCreate, creating, error }: PreviewStepProps) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section aria-labelledby="preview-step-title">
      <div className="mb-3 max-w-2xl sm:mb-4">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#5f6468]">Step 4 / Final preview</p>
        <h2 id="preview-step-title" className="mt-1 font-display text-xl sm:text-2xl">Open it once before it becomes permanent.</h2>
        <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-6 text-[#5f6468]">This is exactly what the public link will show. After creation, the mixtape cannot be edited.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(260px,0.75fr)_minmax(0,1.25fr)] xl:items-start">
        <div>
          <CassettePreview cover={draft.cover} stickers={draft.stickers} label={draft.letter.recipient?.trim() ? `FOR ${draft.letter.recipient.trim().toUpperCase()}` : 'FOR YOU'} />
          <div className="mt-3.5 rounded-sm border-2 border-black bg-[#fffdf7] p-3 sm:p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#5f6468]">This mixtape contains</p>
            <p className="mt-1 font-display text-base sm:text-lg">{draft.songs.length} {draft.songs.length === 1 ? 'song' : 'songs'}</p>
            <p className="mt-0.5 text-xs text-[#5f6468]">{draft.stickers.length} {draft.stickers.length === 1 ? 'sticker' : 'stickers'} · {draft.letter.body ? 'a letter' : 'no letter'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden border-2 border-black bg-[#fffdf7]">
            <div className="flex items-center justify-between border-b-2 border-black bg-[#f2eee5] px-3.5 py-2.5">
              <h3 className="font-mono text-xs sm:text-sm uppercase tracking-widest">Song list</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#5f6468]">{draft.songs.length} tracks</span>
            </div>
            <ol className="divide-y-2 divide-black/10">
              {draft.songs.map((song, index) => (
                <li key={`${song.providerId}-${index}`} className="flex items-center gap-3 px-3.5 py-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-black bg-[#e8c86a] font-mono text-xs font-bold">{String(index + 1).padStart(2, '0')}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold sm:text-sm">{song.title}</span>
                    <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-widest text-[#5f6468]">YouTube</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {draft.letter.recipient || draft.letter.body || draft.letter.sender ? (
            <div className="relative border-2 border-black bg-[#fffdf7] p-4 shadow-[4px_4px_0_#171717] sm:p-5">
              <div className="absolute -top-3 left-6 rotate-[-2deg] border-2 border-black bg-[#e8c86a] px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest">a note for you</div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#5f6468]">To: {draft.letter.recipient || 'Someone wonderful'}</p>
              {draft.letter.body && <p className="mt-2.5 whitespace-pre-wrap font-handwritten text-sm leading-6">{draft.letter.body}</p>}
              {draft.letter.sender && <p className="mt-4 text-right font-handwritten text-sm">Love,<br /><strong>{draft.letter.sender}</strong></p>}
              {!draft.letter.body && <p className="mt-2.5 text-xs text-[#5f6468]">A short hello without a long letter.</p>}
            </div>
          ) : (
            <div className="rounded-sm border-2 border-dashed border-black/25 bg-[#fffdf7]/70 p-4 text-xs text-[#5f6468]">No letter was added. That is perfectly okay.</div>
          )}

          <label className="flex cursor-pointer items-start gap-2.5 rounded-sm border-2 border-black bg-[#fff7f7] p-3 text-xs leading-5">
            <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#171717]" />
            <span>This mixtape cannot be edited after you create it. I am ready to make it permanent.</span>
          </label>

          {error && <p role="alert" className="border-l-4 border-[#c95f70] bg-[#fff7f7] p-2.5 text-xs text-[#8d3e49]">{error}</p>}

          <div className="flex justify-end">
            <button type="button" onClick={onCreate} disabled={!confirmed || creating} className="min-h-10 border-2 border-black bg-[#171717] px-5 font-semibold text-xs text-[#fffdf7] shadow-[2px_2px_0_#171717] transition hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 disabled:opacity-45">
              {creating ? 'Creating...' : 'Create mixtape'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
