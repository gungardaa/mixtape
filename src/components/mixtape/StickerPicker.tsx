'use client';

import { STICKER_CATEGORIES, STICKERS, getStickerRotation, type StickerDefinition } from '@/lib/stickers';
import type { StickerSelection } from '@/lib/types';
import { StickerGraphic } from '@/components/mixtape/StickerGraphic';

type StickerPickerProps = {
  stickers: StickerDefinition[];
  selectedIds: string[];
  onSelect: (stickerId: string) => void;
};

export function StickerPicker({ stickers, selectedIds, onSelect }: StickerPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-8">
      {stickers.map((sticker) => {
        const selected = selectedIds.includes(sticker.id);
        return (
          <button
            key={sticker.id}
            type="button"
            onClick={() => onSelect(sticker.id)}
            aria-pressed={selected}
            className={`relative aspect-square rounded-sm border-2 p-2 transition hover:-rotate-2 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 ${
              selected ? 'border-black bg-[#e8c86a] shadow-[3px_3px_0_#171717]' : 'border-[#202020]/20 bg-[#fffdf7]'
            }`}
            title={sticker.label}
          >
            <StickerGraphic stickerId={sticker.id} color={sticker.color} className="h-full w-full" />
            {selected && <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center border-2 border-black bg-[#70a879] text-[8px] font-bold">✓</span>}
          </button>
        );
      })}
    </div>
  );
}

export function getSelectedStickerIds(selections: StickerSelection[]) {
  return selections.map((selection) => selection.stickerId);
}

export function getStickerDefinition(stickerId: string): StickerDefinition | undefined {
  return STICKERS.find((sticker) => sticker.id === stickerId);
}

export function makeStickerSelection(stickerId: string, position: number): StickerSelection {
  return {
    stickerId,
    position,
    rotation: getStickerRotation(position, stickerId),
  };
}
