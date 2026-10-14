'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MixtapeShell } from '@/components/mixtape/MixtapeShell';
import { CoverStep } from '@/components/creation/CoverStep';
import { StickerStep } from '@/components/creation/StickerStep';
import { SongsLetterStep } from '@/components/creation/SongsLetterStep';
import { PreviewStep } from '@/components/creation/PreviewStep';
import { getSticker } from '@/lib/stickers';
import type { CoverDraft, LetterDraft, MixtapeDraft, PersistedCover, SongDraft, StickerSelection } from '@/lib/types';
import { MAX_SONGS, MAX_STICKERS } from '@/lib/types';

const DRAFT_KEY = 'digital-mixtape-draft';

const emptyLetter: LetterDraft = { recipient: '', body: '', sender: '' };

function getInitialDraft(): MixtapeDraft {
  return { cover: null, stickers: [], songs: [], letter: emptyLetter };
}

function isCover(value: unknown): value is CoverDraft {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<CoverDraft>;
  return candidate.kind === 'built-in' && typeof candidate.id === 'string'
    || candidate.kind === 'uploaded' && typeof candidate.dataUrl === 'string' && typeof candidate.fileName === 'string';
}

function loadDraft() {
  try {
    const saved = sessionStorage.getItem(DRAFT_KEY);
    if (!saved) return { draft: getInitialDraft(), step: 1 };
    const parsed = JSON.parse(saved) as { step?: unknown; cover?: unknown; stickers?: unknown; songs?: unknown; letter?: unknown };
    const cover = isCover(parsed.cover) ? parsed.cover : null;
    const stickers = Array.isArray(parsed.stickers)
      ? parsed.stickers.filter((item): item is StickerSelection => Boolean(item && typeof item.stickerId === 'string' && getSticker(item.stickerId))).slice(0, MAX_STICKERS).map((item, index) => ({ ...item, position: index }))
      : [];
    const songs = Array.isArray(parsed.songs)
      ? parsed.songs.filter((item): item is SongDraft => Boolean(item && item.provider === 'youtube' && typeof item.providerId === 'string' && typeof item.title === 'string' && typeof item.url === 'string')).slice(0, MAX_SONGS)
      : [];
    const letterValue = parsed.letter as { recipient?: unknown; body?: unknown; sender?: unknown } | null | undefined;
    const letter = letterValue
      ? {
          recipient: typeof letterValue.recipient === 'string' ? letterValue.recipient.slice(0, 80) : '',
          body: typeof letterValue.body === 'string' ? letterValue.body.slice(0, 2000) : '',
          sender: typeof letterValue.sender === 'string' ? letterValue.sender.slice(0, 80) : '',
        }
      : emptyLetter;

    const step = typeof parsed.step === 'number' ? Math.min(4, Math.max(1, parsed.step)) : 1;
    return { draft: { cover, stickers, songs, letter }, step };
  } catch {
    return { draft: getInitialDraft(), step: 1 };
  }
}

export default function CreatePage() {
  const router = useRouter();
  const [initial] = useState(loadDraft);
  const [step, setStep] = useState(initial.step);
  const [draft, setDraft] = useState<MixtapeDraft>(initial.draft);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [successSlug, setSuccessSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step, ...draft }));
    } catch {
      // ponytail: sessionStorage cannot reliably hold a 5 MB data URL; use IndexedDB if full reload restoration for large uploads becomes required.
    }
  }, [draft, step]);

  function goTo(nextStep: number) {
    setError('');
    setStep(nextStep);
  }

  function canContinue() {
    if (step === 1) return Boolean(draft.cover);
    if (step === 3) return draft.songs.length >= 1 && draft.songs.length <= MAX_SONGS;
    return true;
  }

  async function createMixtape() {
    if (!draft.cover || draft.songs.length < 1) return;

    setCreating(true);
    setError('');
    try {
      let persistedCover: PersistedCover = draft.cover;

      if (draft.cover.kind === 'uploaded') {
        if (!coverFile) {
          setError('Please upload the cover image again before creating the mixtape.');
          return;
        }

        const signedResponse = await fetch('/api/covers/signed-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentType: draft.cover.contentType, size: coverFile.size }),
        });
        const signedPayload = (await signedResponse.json()) as { path?: string; signedUrl?: string; error?: string };
        if (!signedResponse.ok || !signedPayload.path || !signedPayload.signedUrl) {
          throw new Error(signedPayload.error ?? 'The cover upload could not be prepared.');
        }

        const uploadResponse = await fetch(signedPayload.signedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': draft.cover.contentType, 'x-upsert': 'false' },
          body: coverFile,
        });
        if (!uploadResponse.ok) throw new Error('The cover image could not be uploaded.');
        persistedCover = { kind: 'uploaded', path: signedPayload.path };
      }

      const response = await fetch('/api/mixtapes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cover: persistedCover,
          stickers: draft.stickers,
          songs: draft.songs,
          letter: draft.letter,
        }),
      });
      const payload = (await response.json()) as { slug?: string; error?: string };
      if (!response.ok || !payload.slug) throw new Error(payload.error ?? 'Creation failed. Your draft is still here.');

      setSuccessSlug(payload.slug);
      sessionStorage.removeItem(DRAFT_KEY);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Creation failed. Your draft is still here.');
    } finally {
      setCreating(false);
    }
  }

  async function copyLink() {
    if (!successSlug) return;
    const url = `${window.location.origin}/m/${successSlug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (successSlug) {
    const shareUrl = `${window.location.origin}/m/${successSlug}`;
    return (
      <MixtapeShell step={4} title="Your mixtape is ready" eyebrow="A little gift, sent into the world">
        <section className="mx-auto max-w-2xl rounded-sm border-2 border-black bg-[#fffdf7] p-6 text-center shadow-[7px_7px_0_#171717] sm:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center border-2 border-black bg-[#70a879] font-display text-2xl">✓</div>
          <h2 className="font-display text-2xl sm:text-3xl">Press play on something handmade.</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5f6468]">Your permanent public link is ready to share. Anyone with this link can open the mixtape.</p>
          <div className="mt-6 overflow-hidden border-2 border-black bg-[#f2eee5] p-3 font-mono text-xs break-all sm:text-sm">{shareUrl}</div>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={copyLink} className="min-h-11 border-2 border-black bg-[#171717] px-6 font-semibold text-[#fffdf7] shadow-[3px_3px_0_#171717] hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20">
              {copied ? 'Copied' : 'Copy link'}
            </button>
            <Link href={`/m/${successSlug}`} className="min-h-11 inline-flex items-center justify-center border-2 border-black bg-[#e8c86a] px-6 font-semibold shadow-[3px_3px_0_#171717] hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20">
              Open mixtape
            </Link>
          </div>
          <Link href="/" className="mt-6 inline-block text-xs font-semibold text-[#5f6468] underline underline-offset-4 hover:text-[#171717]">Make another mixtape</Link>
        </section>
      </MixtapeShell>
    );
  }

  return (
    <MixtapeShell
      step={step}
      title={['Choose a cover', 'Add stickers', 'Songs + letter', 'Final preview'][step - 1]}
      onNext={step < 4 ? () => goTo(step + 1) : undefined}
      onBack={step === 1 ? () => router.push('/') : step > 1 ? () => goTo(step - 1) : undefined}
      nextLabel={step === 3 ? 'Preview mixtape' : undefined}
      nextDisabled={!canContinue()}
    >
      {step === 1 && <CoverStep cover={draft.cover} uploadedFileMissing={draft.cover?.kind === 'uploaded' && !coverFile} onChange={(cover) => setDraft({ ...draft, cover })} onFileChange={setCoverFile} />}
      {step === 2 && <StickerStep selections={draft.stickers} onChange={(stickers) => setDraft({ ...draft, stickers })} cover={draft.cover} />}
      {step === 3 && (
        <SongsLetterStep
          songs={draft.songs}
          onSongsChange={(songs) => setDraft({ ...draft, songs })}
          letter={draft.letter}
          onLetterChange={(letter) => setDraft({ ...draft, letter })}
        />
      )}
      {step === 4 && draft.cover && (
        <PreviewStep draft={draft} onBack={() => goTo(3)} onCreate={createMixtape} creating={creating} error={error} />
      )}
    </MixtapeShell>
  );
}
