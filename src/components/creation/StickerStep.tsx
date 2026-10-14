'use client';

import { useMemo, useState } from 'react';
import { STICKER_CATEGORIES, STICKERS } from '@/lib/stickers';
import { MAX_STICKERS, type StickerSelection, type CoverDraft } from '@/lib/types';
import { CassettePreview } from '@/components/mixtape/CassettePreview';
import { makeStickerSelection, StickerPicker } from '@/components/mixtape/StickerPicker';

type StickerStepProps = {
  selections: StickerSelection[];
  onChange: (selections: StickerSelection[]) => void;
  cover: CoverDraft | null;
};

export function StickerStep({ selections, onChange, cover }: StickerStepProps) {
  const [category, setCategory] = useState<(typeof STICKER_CATEGORIES)[number]['id']>('all');
  const selectedIds = useMemo(() => selections.map((selection) => selection.stickerId), [selections]);

  function toggleSticker(stickerId: string) {
    const existingPosition = selections.findIndex((selection) => selection.stickerId === stickerId);
    if (existingPosition >= 0) {
      onChange(
        selections
          .filter((selection) => selection.stickerId !== stickerId)
          .map((selection, index) => ({ ...selection, position: index })),
      );
      return;
    }

    if (selections.length >= MAX_STICKERS) return;
    onChange([...selections, makeStickerSelection(stickerId, selections.length)]);
  }

  const visibleStickers = category === 'all' ? STICKERS : STICKERS.filter((sticker) => sticker.category === category);

  return (
    <section aria-labelledby="sticker-step-title">
      <div className="mb-3 max-w-2xl sm:mb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#5f6468]">Step 2 / Add stickers</p>
          <h2 id="sticker-step-title" className="mt-1 font-display text-xl sm:text-2xl">Make it feel like it came from your desk.</h2>
        </div>
        <p className="mt-1.5 max-w-xl text-xs sm:text-sm leading-6 text-[#5f6468]">Choose up to {MAX_STICKERS} stickers. They will be placed by hand on the cassette for you.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-start">
        <div className="rounded-sm border-2 border-black bg-[#fffdf7] p-3 shadow-[4px_4px_0_#171717] sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-mono text-xs sm:text-sm uppercase tracking-widest">Sticker book</h3>
              <p className="mt-0.5 text-[11px] text-[#5f6468]">{selections.length} / {MAX_STICKERS} selected</p>
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-[#5f6468] sm:inline">press a sticker to place it</span>
          </div>

          <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Sticker categories">
            {STICKER_CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={category === item.id}
                onClick={() => setCategory(item.id)}
                className={`min-h-7 border-2 px-2.5 font-mono text-[10px] uppercase tracking-widest transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 ${
                  category === item.id ? 'border-black bg-[#171717] text-[#fffdf7]' : 'border-[#202020]/25 bg-[#fffdf7] text-[#5f6468] hover:border-black hover:text-[#171717]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <StickerPicker stickers={visibleStickers} selectedIds={selectedIds} onSelect={toggleSticker} />
          {category !== 'all' && visibleStickers.length === 0 && <p className="mt-3 text-xs text-[#5f6468]">No stickers in this category yet.</p>}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-mono text-xs sm:text-sm uppercase tracking-widest">Live preview</h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#5f6468]">{selections.length} placed</span>
          </div>
          <CassettePreview cover={cover} stickers={selections} label="YOUR MIX" />
          <p className="mt-2.5 rounded-sm border-2 border-dashed border-black/25 bg-[#fffdf7]/70 p-2 text-[11px] leading-4 text-[#5f6468]">
            The cover from step 1 will appear here with your stickers.
          </p>
        </div>
      </div>
    </section>
  );
}
