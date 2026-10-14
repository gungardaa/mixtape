'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { BUILT_IN_COVERS } from '@/lib/covers';
import { MAX_UPLOAD_BYTES } from '@/lib/types';
import type { CoverDraft } from '@/lib/types';
import { CassettePreview, CoverPattern } from '@/components/mixtape/CassettePreview';

type CoverStepProps = {
  cover: CoverDraft | null;
  uploadedFileMissing?: boolean;
  onChange: (cover: CoverDraft) => void;
  onFileChange?: (file: File | null) => void;
};

export function CoverStep({ cover, uploadedFileMissing = false, onChange, onFileChange }: CoverStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  function chooseBuiltIn(coverId: string) {
    const selected = BUILT_IN_COVERS.find((item) => item.id === coverId);
    if (selected) {
      onChange({ ...selected });
      onFileChange?.(null);
      setError('');
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!acceptedTypes.includes(file.type)) {
      setError('Please choose a JPG, PNG, or WebP image.');
      onFileChange?.(null);
      event.target.value = '';
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setError('That image is too large. Please choose an image under 5 MB.');
      onFileChange?.(null);
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;

      const contentType = file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';

      onChange({
        kind: 'uploaded',
        fileName: file.name,
        dataUrl,
        contentType,
        path: '',
      });
      onFileChange?.(file);
      setError('');
    };
    reader.onerror = () => {
      setError('That image could not be read. Please try another file.');
      onFileChange?.(null);
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  }

  return (
    <section aria-labelledby="cover-step-title">
      <div className="mb-3 max-w-2xl sm:mb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#5f6468]">Step 1 / Choose a cover</p>
          <h2 id="cover-step-title" className="mt-1 font-display text-xl sm:text-2xl">Pick the first thing they will see.</h2>
        </div>
        <p className="mt-1.5 max-w-xl text-xs sm:text-sm leading-6 text-[#5f6468]">Use one of the handmade covers or bring your own image. The preview updates immediately.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-start">
        <div className="rounded-sm border-2 border-black bg-[#fffdf7] p-3 shadow-[4px_4px_0_#171717] sm:p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <h3 className="font-mono text-xs sm:text-sm uppercase tracking-widest">Built-in covers</h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#5f6468]">{BUILT_IN_COVERS.length} options</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {BUILT_IN_COVERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => chooseBuiltIn(item.id)}
                className={`group relative aspect-[4/3] overflow-hidden border-2 p-1 text-left transition hover:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 ${cover?.kind === 'built-in' && cover.id === item.id ? 'border-[#171717] shadow-[3px_3px_0_#171717]' : 'border-[#202020]/20 bg-[#f2eee5]'
                  }`}
                aria-pressed={cover?.kind === 'built-in' && cover.id === item.id}
              >
                <span className="relative block h-full w-full overflow-hidden" style={{ background: item.background }}>
                  <CoverPattern pattern={item.pattern} foreground={item.foreground} />
                  <span className="absolute inset-2 border border-black/20" />
                  <span className="absolute bottom-2 left-2 font-mono text-[8px] uppercase tracking-widest" style={{ color: item.foreground }}>
                    {item.label}
                  </span>
                </span>
                {cover?.kind === 'built-in' && cover.id === item.id && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center border-2 border-black bg-[#70a879] text-[10px] font-bold">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-2 border-t-2 border-black/15 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-mono text-xs sm:text-sm uppercase tracking-widest">Your own image</h3>
              <p className="mt-0.5 text-[11px] leading-4 text-[#5f6468]">JPG, PNG, or WebP · up to 5 MB</p>
            </div>
            <div className="flex items-center gap-3">
              <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="sr-only" />
              <button type="button" onClick={() => inputRef.current?.click()} className="min-h-9 border-2 border-black bg-[#e8c86a] px-3.5 text-xs font-semibold shadow-[2px_2px_0_#171717] transition hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20">
                Upload image
              </button>
              {cover?.kind === 'uploaded' && (
                <button type="button" onClick={() => inputRef.current?.click()} className="text-xs font-semibold text-[#5f6468] underline underline-offset-4 hover:text-[#171717]">
                  Replace
                </button>
              )}
            </div>
          </div>
          {error && <p role="alert" className="mt-3 border-l-4 border-[#c95f70] bg-[#fff7f7] p-2.5 text-xs text-[#8d3e49]">{error}</p>}
          {uploadedFileMissing && <p role="status" className="mt-3 border-l-4 border-[#e8c86a] bg-[#fffaf0] p-2.5 text-xs text-[#725518]">Your browser kept the preview, but not the original file. Please upload the cover again before creating the mixtape.</p>}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-mono text-xs sm:text-sm uppercase tracking-widest">Live preview</h3>
            {cover && <span className="font-mono text-[10px] uppercase tracking-widest text-[#5f6468]">{cover.kind === 'built-in' ? 'template' : 'upload'}</span>}
          </div>
          <CassettePreview cover={cover} stickers={[]} label="YOUR MIX" />
          <p className="mt-2.5 rounded-sm border-2 border-dashed border-black/25 bg-[#fffdf7]/70 p-2 text-[11px] leading-4 text-[#5f6468]">
            Stickers and songs will join this cassette in the next steps.
          </p>
        </div>
      </div>
    </section>
  );
}
