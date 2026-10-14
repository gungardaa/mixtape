import type { BuiltInCover } from '@/lib/types';

export const BUILT_IN_COVERS: BuiltInCover[] = [
  {
    kind: 'built-in',
    id: 'sunrise-drive',
    label: 'Sunrise drive',
    background: 'linear-gradient(145deg, #f7c9d6 0%, #f9e7b8 52%, #a9d9e5 100%)',
    foreground: '#284b53',
    pattern: 'sun',
  },
  {
    kind: 'built-in',
    id: 'blue-hour',
    label: 'Blue hour',
    background: 'linear-gradient(145deg, #8dbbd0 0%, #d9e9e8 55%, #f5d8c0 100%)',
    foreground: '#173d4c',
    pattern: 'waves',
  },
  {
    kind: 'built-in',
    id: 'paper-hearts',
    label: 'Paper hearts',
    background: 'linear-gradient(145deg, #fff7e8 0%, #f6d6d8 100%)',
    foreground: '#8e4d58',
    pattern: 'dots',
  },
  {
    kind: 'built-in',
    id: 'night-market',
    label: 'Night market',
    background: 'linear-gradient(145deg, #293b53 0%, #6d6a91 58%, #e8adad 100%)',
    foreground: '#fff6dc',
    pattern: 'stars',
  },
  {
    kind: 'built-in',
    id: 'garden-note',
    label: 'Garden note',
    background: 'linear-gradient(145deg, #d9e9c7 0%, #f7e9b8 100%)',
    foreground: '#405e45',
    pattern: 'grid',
  },
  {
    kind: 'built-in',
    id: 'static-love',
    label: 'Static love',
    background: 'repeating-linear-gradient(135deg, #f4d5d0 0, #f4d5d0 12px, #f8ecd4 12px, #f8ecd4 24px)',
    foreground: '#6e3f45',
    pattern: 'stripes',
  },
];

export function getBuiltInCover(id: string): BuiltInCover | undefined {
  return BUILT_IN_COVERS.find((cover) => cover.id === id);
}
