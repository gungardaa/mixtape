import { MAX_STICKERS, type StickerSelection } from '@/lib/types';

export type StickerDefinition = {
  id: string;
  label: string;
  category: 'hearts' | 'stars' | 'flowers' | 'smileys' | 'music' | 'retro' | 'labels' | 'shapes';
  color: string;
};

export const STICKERS: StickerDefinition[] = [
  { id: 'heart', label: 'Heart', category: 'hearts', color: '#e78b9a' },
  { id: 'heart-outline', label: 'Outline heart', category: 'hearts', color: '#c95f70' },
  { id: 'broken-heart', label: 'Little heart', category: 'hearts', color: '#e9a1b0' },
  { id: 'star', label: 'Star', category: 'stars', color: '#e8c86a' },
  { id: 'sparkle', label: 'Sparkle', category: 'stars', color: '#f1d98b' },
  { id: 'moon', label: 'Moon', category: 'stars', color: '#f2c14e' },
  { id: 'flower', label: 'Flower', category: 'flowers', color: '#e99bb0' },
  { id: 'daisy', label: 'Daisy', category: 'flowers', color: '#f4d987' },
  { id: 'leaf', label: 'Leaf', category: 'flowers', color: '#7ba77b' },
  { id: 'smiley', label: 'Smiley', category: 'smileys', color: '#f0c86a' },
  { id: 'wink', label: 'Wink', category: 'smileys', color: '#f0c86a' },
  { id: 'tongue', label: 'Playful face', category: 'smileys', color: '#f0c86a' },
  { id: 'music-note', label: 'Music note', category: 'music', color: '#6c9bb4' },
  { id: 'double-note', label: 'Double note', category: 'music', color: '#6c9bb4' },
  { id: 'cassette', label: 'Cassette', category: 'music', color: '#d98d83' },
  { id: 'radio', label: 'Radio', category: 'retro', color: '#8ba6b2' },
  { id: 'camera', label: 'Camera', category: 'retro', color: '#9a8fb8' },
  { id: 'game', label: 'Game', category: 'retro', color: '#e49c83' },
  { id: 'lightning', label: 'Lightning', category: 'retro', color: '#e8c86a' },
  { id: 'cloud', label: 'Cloud', category: 'shapes', color: '#c9e1e8' },
  { id: 'wave', label: 'Wave', category: 'shapes', color: '#83b9c6' },
  { id: 'ribbon', label: 'Ribbon', category: 'shapes', color: '#e6a8b5' },
  { id: 'label-love', label: 'Love label', category: 'labels', color: '#f7dfd0' },
  { id: 'label-mix', label: 'Mix label', category: 'labels', color: '#dcebd9' },
];

export const STICKER_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'hearts', label: 'Hearts' },
  { id: 'stars', label: 'Stars' },
  { id: 'flowers', label: 'Flowers' },
  { id: 'smileys', label: 'Smileys' },
  { id: 'music', label: 'Music' },
  { id: 'retro', label: 'Retro' },
  { id: 'labels', label: 'Labels' },
  { id: 'shapes', label: 'Shapes' },
] as const;

export function getSticker(stickerId: string): StickerDefinition | undefined {
  return STICKERS.find((sticker) => sticker.id === stickerId);
}

export function getStickerRotation(index: number, stickerId: string) {
  const seed = stickerId.split('').reduce((total, character) => total + character.charCodeAt(0), 0);
  return ((seed + index * 17) % 13) - 6;
}

export function getStickerPositions(): number[] {
  return Array.from({ length: MAX_STICKERS }, (_, index) => index);
}

export function normalizeStickerSelections(selections: StickerSelection[]): StickerSelection[] {
  return selections
    .filter((selection, index) => selection.position === index)
    .map((selection, index) => ({ ...selection, position: index }));
}
