'use client';

import Image from 'next/image';
import { getBuiltInCover } from '@/lib/covers';
import { getSticker } from '@/lib/stickers';
import type { CoverDraft, PublicCover, StickerSelection } from '@/lib/types';
import { StickerGraphic } from '@/components/mixtape/StickerGraphic';

type CassettePreviewProps = {
  cover: CoverDraft | PublicCover | null;
  stickers: StickerSelection[];
  label?: string;
  compact?: boolean;
};

const stickerPositions = [
  { top: '4%', left: '4%' },
  { top: '4%', left: '74%' },
  { top: '30%', left: '1%' },
  { top: '30%', left: '79%' },
  { top: '52%', left: '10%' },
  { top: '52%', left: '66%' },
];

export function CoverPattern({ pattern, foreground }: { pattern: string; foreground: string }) {
  if (pattern === 'sun') {
    return (
      <div className="absolute inset-0" aria-hidden="true">
        {/* Horizon lines - lowered closer to bottom elements */}
        <div className="absolute inset-x-[6%] bottom-[25%] h-[2.5%] min-h-[2px]" style={{ background: foreground }} />
        <div className="absolute inset-x-[12%] bottom-[17%] h-[1.5%] min-h-[1px]" style={{ background: foreground }} />
        {/* Sun: larger sun circle resting right on the horizon line */}
        <div className="absolute inset-x-0 top-0 bottom-[25%] overflow-hidden">
          <div className="absolute left-1/2 bottom-0 aspect-square h-[88%] -translate-x-1/2 translate-y-[44%] rounded-full border-[3px]" style={{ borderColor: foreground, background: `${foreground}22` }} />
        </div>
      </div>
    );
  }

  if (pattern === 'waves') {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 200 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 35c20-18 38-18 58 0s38 18 58 0 38-18 58 0 20 18 26 0M0 65c20-18 38-18 58 0s38 18 58 0 38-18 58 0 20 18 26 0M0 95c20-18 38-18 58 0s38 18 58 0 38-18 58 0 20 18 26 0" fill="none" stroke={foreground} strokeWidth="3" />
      </svg>
    );
  }

  if (pattern === 'grid') {
    return <div className="absolute inset-0 opacity-35" style={{ backgroundImage: `linear-gradient(${foreground}22 1px, transparent 1px), linear-gradient(90deg, ${foreground}22 1px, transparent 1px)`, backgroundSize: '18px 18px' }} aria-hidden="true" />;
  }

  if (pattern === 'dots') {
    return <div className="absolute inset-0 opacity-45" style={{ backgroundImage: `radial-gradient(${foreground} 1.5px, transparent 1.5px)`, backgroundSize: '16px 16px' }} aria-hidden="true" />;
  }

  if (pattern === 'stars') {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-75" viewBox="0 0 200 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="m20 15 3 7 7 1-7 1-3 7-3-7-7-1 7-1 3-7Zm70 12 3 7 7 1-7 1-3 7-3-7-7-1 7-1 3-7Zm75-5 3 7 7 1-7 1-3 7-3-7-7-1 7-1 3-7Zm-112 50 3 7 7 1-7 1-3 7-3-7-7-1 7-1 3-7Zm82 17 3 7 7 1-7 1-3 7-3-7-7-1 7-1 3-7Z" fill={foreground} />
      </svg>
    );
  }

  return <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 18px, rgba(23,23,23,0.16) 18px, rgba(23,23,23,0.16) 20px)' }} aria-hidden="true" />;
}

function CoverVisual({ cover }: { cover: CoverDraft | PublicCover }) {
  if (cover.kind === 'uploaded') {
    const source = 'dataUrl' in cover ? cover.dataUrl : cover.publicUrl;
    return <Image src={source} alt="Uploaded mixtape cover" fill unoptimized sizes="100%" className="object-cover" />;
  }

  const builtIn = getBuiltInCover(cover.id);
  if (!builtIn) return <div className="h-full w-full bg-[#f2eee5]" />;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: builtIn.background }}>
      <CoverPattern pattern={builtIn.pattern} foreground={builtIn.foreground} />
    </div>
  );
}

export function CassettePreview({ cover, stickers, label = 'FOR YOU', compact = false }: CassettePreviewProps) {
  const coverName = cover?.kind === 'built-in' ? getBuiltInCover(cover.id)?.label : null;
  return (
    <div className={`relative w-full border-4 border-black bg-[#fffdf7] shadow-[6px_6px_0_#171717] ${compact ? 'aspect-[16/10]' : 'aspect-[16/10]'}`} aria-label="Mixtape preview">
      {/* 1. Top Cover Section */}
      <div className="absolute inset-x-3 top-3 h-[50%] overflow-hidden border-2 border-black bg-[#f2eee5]">
        {cover ? <CoverVisual cover={cover} /> : <div className="flex h-full items-center justify-center bg-[#f2eee5] font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#5f6468]">choose a cover</div>}
      </div>

      {/* 2. Middle Tape Accent Strip (Below Cover) */}
      <div className="absolute inset-x-3 top-[calc(0.75rem+50%)] h-[11%] border-x-2 border-b-2 border-black bg-[#e8dfd0] flex items-center justify-center" aria-hidden="true">
        <div className="h-1 w-20 bg-[#171717]" />
      </div>

      {/* 3. Bottom Label Section (Below Middle Strip) */}
      <div className="absolute inset-x-3 bottom-3 top-[calc(0.75rem+50%+11%)] border-x-2 border-b-2 border-black bg-[#f7f1e5]">
        <div className="flex h-full items-center justify-between px-3 sm:px-4">
          <div className="min-w-0">
            <p className="overflow-hidden font-display text-[8px] uppercase tracking-widest text-[#171717] sm:text-[10px]">{label}</p>
            <p className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.16em] text-[#5f6468] sm:text-[8px]">{coverName ? `${coverName} · handmade mix` : 'handmade digital mix'}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-[#fffdf7] sm:h-7 sm:w-7">
              <span className="h-1.5 w-1.5 rounded-full bg-[#171717]" />
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-[#fffdf7] sm:h-7 sm:w-7">
              <span className="h-1.5 w-1.5 rounded-full bg-[#171717]" />
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-3 top-3 h-[50%]" aria-hidden="true">
        {stickers.map((selection, index) => {
          const sticker = getSticker(selection.stickerId);
          const position = stickerPositions[selection.position] ?? stickerPositions[index % stickerPositions.length];
          if (!sticker) return null;

          return (
            <span
              key={`${selection.stickerId}-${selection.position}`}
              className="absolute h-7 w-7 drop-shadow-sm sm:h-9 sm:w-9"
              style={{ ...position, transform: `rotate(${selection.rotation}deg)` }}
            >
              <StickerGraphic stickerId={sticker.id} color={sticker.color} className="h-full w-full" />
            </span>
          );
        })}
      </div>

      <div className="absolute right-2 top-2 rotate-6 border-2 border-black bg-[#e8c86a] px-2 py-1 font-mono text-[8px] uppercase tracking-widest text-[#171717] sm:px-3 sm:py-1.5 sm:text-[9px]">
        play
      </div>
    </div>
  );
}
