'use client';

import type { SVGProps } from 'react';
import { getSticker } from '@/lib/stickers';

type StickerGraphicProps = SVGProps<SVGSVGElement> & {
  stickerId: string;
  color?: string;
};

export function StickerGraphic({ stickerId, color = '#e78b9a', className, ...props }: StickerGraphicProps) {
  const sticker = getSticker(stickerId);
  const fill = color;

  if (!sticker) return null;

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false" {...props}>
      {stickerId === 'heart' && <path fill={fill} d="M24 41S6 30 6 17a9 9 0 0 1 18-1 9 9 0 0 1 18 1c0 13-18 24-18 24Z" />}
      {stickerId === 'heart-outline' && <path fill="none" stroke={fill} strokeWidth="3" d="M24 41S7 30 7 17a8 8 0 0 1 17-1 8 8 0 0 1 17 1c0 13-17 24-17 24Z" />}
      {stickerId === 'broken-heart' && <path fill={fill} d="M24 40S10 32 10 20a8 8 0 0 1 14-4 8 8 0 0 1 14 4c0 12-14 20-14 20Zm0-25v18" stroke={fill} strokeWidth="2" />}
      {stickerId === 'star' && <path fill={fill} d="m24 5 5.5 12 13 1.5-9.7 8.8 2.7 12.7L24 33.5 12.5 40l2.7-12.7L5.5 18.5l13-1.5L24 5Z" />}
      {stickerId === 'sparkle' && <path fill={fill} d="m24 5 4 13 13 4-13 4-4 13-4-13-13-4 13-4 4-13Z" />}
      {stickerId === 'moon' && <path fill={fill} d="M35 31A15 15 0 1 1 17 9a12 12 0 1 0 18 22Z" />}
      {stickerId === 'flower' && <g fill={fill}><circle cx="24" cy="14" r="7" /><circle cx="34" cy="22" r="7" /><circle cx="31" cy="34" r="7" /><circle cx="17" cy="34" r="7" /><circle cx="14" cy="22" r="7" /><circle cx="24" cy="24" r="6" fill="#fff7df" /></g>}
      {stickerId === 'daisy' && <g fill="none" stroke={fill} strokeWidth="3"><circle cx="24" cy="12" r="6" /><circle cx="35" cy="20" r="6" /><circle cx="33" cy="34" r="6" /><circle cx="15" cy="34" r="6" /><circle cx="13" cy="20" r="6" /></g>}
      {stickerId === 'leaf' && <path fill={fill} d="M10 38C10 18 24 8 40 8c0 20-12 30-30 30Zm5-5c7-7 13-12 20-17" stroke={fill} strokeWidth="2" />}
      {stickerId === 'smiley' && <g><circle cx="24" cy="24" r="17" fill={fill} /><circle cx="18" cy="20" r="2" fill="#242424" /><circle cx="30" cy="20" r="2" fill="#242424" /><path d="M16 28c4 6 12 6 16 0" fill="none" stroke="#242424" strokeWidth="3" strokeLinecap="round" /></g>}
      {stickerId === 'wink' && <g><circle cx="24" cy="24" r="17" fill={fill} /><path d="M14 20h5" stroke="#242424" strokeWidth="3" strokeLinecap="round" /><circle cx="31" cy="20" r="2" fill="#242424" /><path d="M16 29c4 5 12 5 16 0" fill="none" stroke="#242424" strokeWidth="3" strokeLinecap="round" /></g>}
      {stickerId === 'tongue' && <g><circle cx="24" cy="24" r="17" fill={fill} /><circle cx="18" cy="20" r="2" fill="#242424" /><circle cx="30" cy="20" r="2" fill="#242424" /><path d="M17 27h14v7a7 7 0 0 1-14 0v-7Z" fill="#e78b9a" stroke="#242424" strokeWidth="2" /></g>}
      {stickerId === 'music-note' && <g fill={fill}><path d="M18 10v19a7 7 0 1 0 4 6V17l12-3v16a7 7 0 1 0 4 6V9L18 10Z" /><path d="M18 10 38 9" stroke={fill} strokeWidth="4" /></g>}
      {stickerId === 'double-note' && <g fill={fill}><path d="M13 12v20a6 6 0 1 0 4 6V19l16-3v16a6 6 0 1 0 4 6V10L13 12Z" /><path d="M13 12h24" stroke={fill} strokeWidth="4" /></g>}
      {stickerId === 'cassette' && <g><rect x="6" y="12" width="36" height="25" rx="4" fill={fill} /><rect x="11" y="17" width="26" height="15" rx="2" fill="#fff7df" /><circle cx="18" cy="24" r="3" fill={fill} /><circle cx="30" cy="24" r="3" fill={fill} /><path d="M18 24h12" stroke={fill} strokeWidth="2" /></g>}
      {stickerId === 'radio' && <g><rect x="7" y="15" width="34" height="24" rx="4" fill={fill} /><circle cx="17" cy="27" r="7" fill="#fff7df" /><path d="M28 21h9M28 27h9M28 33h6" stroke="#fff7df" strokeWidth="2" /><path d="m34 15 7-7" stroke={fill} strokeWidth="3" /></g>}
      {stickerId === 'camera' && <g><rect x="7" y="15" width="34" height="24" rx="4" fill={fill} /><circle cx="24" cy="27" r="8" fill="#fff7df" /><circle cx="24" cy="27" r="4" fill={fill} /><rect x="13" y="11" width="12" height="5" rx="1" fill={fill} /></g>}
      {stickerId === 'game' && <g><rect x="8" y="12" width="32" height="25" rx="5" fill={fill} /><path d="M18 20v10M13 25h10" stroke="#fff7df" strokeWidth="3" strokeLinecap="round" /><circle cx="31" cy="21" r="2" fill="#fff7df" /><circle cx="36" cy="27" r="2" fill="#fff7df" /></g>}
      {stickerId === 'lightning' && <path fill={fill} d="m27 4-16 23h10l-4 17 18-25H24l3-15Z" />}
      {stickerId === 'cloud' && <path fill={fill} d="M13 35h22a8 8 0 0 0 1-16 12 12 0 0 0-23 3 7 7 0 0 0 0 13Z" />}
      {stickerId === 'wave' && <path fill="none" stroke={fill} strokeWidth="4" strokeLinecap="round" d="M6 18c5-7 10-7 15 0s10 7 15 0 10-7 6-2-10 7-15 0-10-7-15 0-8 7-6 2Zm0 13c5-7 10-7 15 0s10 7 15 0 10-7 6-2-10 7-15 0-10-7-15 0-8 7-6 2Z" />}
      {stickerId === 'ribbon' && <path fill={fill} d="M9 9h30v10l-8 20-7-13-7 13-7-13-8-20 8Z" />}
      {stickerId === 'label-love' && <g><rect x="7" y="12" width="34" height="24" rx="3" fill={fill} stroke="#202020" strokeWidth="2" /><path fill="#c95f70" d="M24 31s-8-5-8-11a4 4 0 0 1 8 0 4 4 0 0 1 8 0c0 6-8 11-8 11Z" /><text x="24" y="19" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#202020">LOVE</text></g>}
      {stickerId === 'label-mix' && <g><rect x="7" y="12" width="34" height="24" rx="3" fill={fill} stroke="#202020" strokeWidth="2" /><path fill="#405e45" d="M15 29V19l8 6v-6M29 19h5v10h-5zM36 19h5v10h-5z" /><text x="24" y="19" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#202020">MIX</text></g>}
    </svg>
  );
}
