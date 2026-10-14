'use client';

import { useState } from 'react';
import { CassettePreview } from '@/components/mixtape/CassettePreview';
import { MusicPlayer, PublicSongList } from '@/components/mixtape/MusicPlayer';
import type { PublicMixtape } from '@/lib/types';

export function PublicMixtapeClient({ mixtape }: { mixtape: PublicMixtape }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasLetter = Boolean(mixtape.letterRecipient || mixtape.letterBody || mixtape.letterSender);
  const label = mixtape.letterRecipient?.trim() ? `FOR ${mixtape.letterRecipient.trim().toUpperCase()}` : 'FOR YOU';

  return (
    <div className="min-h-screen bg-[#b7d9e3] px-4 py-6 text-[#171717] sm:px-8 sm:py-10">
      <header className="mx-auto max-w-5xl">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#5f6468]">A little gift, made by hand</p>
          <h1 className="mt-2 font-display text-2xl leading-tight sm:text-4xl">A mixtape for you</h1>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-5xl space-y-10">
        <section className="grid gap-8 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="lg:sticky lg:top-8">
            <CassettePreview cover={mixtape.cover} stickers={mixtape.stickers} label={label} />
            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-[#5f6468]">Made with care · {new Date(mixtape.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>

          {hasLetter && (
            <div className="relative border-2 border-black bg-[#fffdf7] p-6 shadow-[6px_6px_0_#171717]">
              <div className="absolute -top-3 left-6 rotate-[-2deg] border-2 border-black bg-[#e8c86a] px-2 py-1 font-mono text-[9px] uppercase tracking-widest">a note for you</div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#5f6468]">To {mixtape.letterRecipient || 'someone wonderful'}</p>
              {mixtape.letterBody && <p className="mt-5 whitespace-pre-wrap font-handwritten text-lg leading-7">{mixtape.letterBody}</p>}
              {mixtape.letterSender && <p className="mt-8 text-right font-handwritten text-lg">Love,<br /><strong>{mixtape.letterSender}</strong></p>}
            </div>
          )}
        </section>

        <MusicPlayer songs={mixtape.songs} activeIndex={activeIndex} onSelect={setActiveIndex} />
        <PublicSongList songs={mixtape.songs} activeIndex={activeIndex} onSelect={setActiveIndex} />
      </main>

      <footer className="mx-auto mt-12 max-w-5xl border-t-2 border-black/15 pt-5 text-center font-mono text-[10px] uppercase tracking-widest text-[#5f6468]">
        A permanent little corner of the internet
      </footer>
    </div>
  );
}
