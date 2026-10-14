export const MAX_SONGS = 50;
export const MAX_STICKERS = 6;
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_LETTER_BODY_LENGTH = 2000;

export type Provider = 'youtube';

export type BuiltInCover = {
  kind: 'built-in';
  id: string;
  label: string;
  background: string;
  foreground: string;
  pattern: 'sun' | 'waves' | 'grid' | 'dots' | 'stars' | 'stripes';
};

export type UploadedCover = {
  kind: 'uploaded';
  fileName: string;
  dataUrl: string;
  contentType: 'image/jpeg' | 'image/png' | 'image/webp';
  path: string;
};

export type CoverDraft = BuiltInCover | UploadedCover;

export type SongDraft = {
  url: string;
  provider: Provider;
  providerId: string;
  title: string;
};

export type StickerSelection = {
  stickerId: string;
  position: number;
  rotation: number;
};

export type LetterDraft = {
  recipient: string;
  body: string;
  sender: string;
};

export type MixtapeDraft = {
  cover: CoverDraft | null;
  stickers: StickerSelection[];
  songs: SongDraft[];
  letter: LetterDraft;
};

export type PersistedCover =
  | BuiltInCover
  | {
      kind: 'uploaded';
      path: string;
    };

export type CreateMixtapePayload = {
  cover: PersistedCover;
  stickers: StickerSelection[];
  songs: SongDraft[];
  letter: LetterDraft;
};

export type PublicSong = {
  id: string;
  url: string;
  provider: Provider;
  providerId: string;
  title: string;
  position: number;
};

export type PublicSticker = {
  id: string;
  stickerId: string;
  position: number;
  rotation: number;
};

export type PublicCover =
  | BuiltInCover
  | {
      kind: 'uploaded';
      publicUrl: string;
    };

export type PublicMixtape = {
  slug: string;
  coverPath: string;
  cover: PublicCover;
  letterRecipient: string | null;
  letterBody: string | null;
  letterSender: string | null;
  createdAt: string;
  songs: PublicSong[];
  stickers: PublicSticker[];
};
