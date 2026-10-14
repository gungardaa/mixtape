'use client';

import { MAX_LETTER_BODY_LENGTH } from '@/lib/types';
import type { LetterDraft } from '@/lib/types';

type LetterPaperProps = {
  letter: LetterDraft;
  onChange: (letter: LetterDraft) => void;
};

export function LetterPaper({ letter, onChange }: LetterPaperProps) {
  function update(field: keyof LetterDraft, value: string) {
    onChange({ ...letter, [field]: value });
  }

  return (
    <div className="relative border-2 border-black bg-[#fffdf7] p-4 shadow-[4px_4px_0_#171717] sm:p-5">
      <div className="absolute -top-3 left-6 rotate-[-2deg] border-2 border-black bg-[#e8c86a] px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest">a note for you</div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#5f6468]">Optional letter</p>
          <h3 className="mt-0.5 font-display text-base sm:text-lg">Write it like paper.</h3>
        </div>
        <span className="font-mono text-[10px] text-[#5f6468]">{letter.body.length}/{MAX_LETTER_BODY_LENGTH}</span>
      </div>

      <div className="grid gap-3">
        <label className="grid gap-1 font-mono text-[11px] uppercase tracking-widest text-[#5f6468]">
          To
          <input
            value={letter.recipient}
            onChange={(event) => update('recipient', event.target.value)}
            className="min-h-9 border-2 border-black bg-[#fffdf7] px-3 font-sans text-xs text-[#171717] placeholder:text-[#5f6468]/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/15"
            placeholder="Someone wonderful"
            maxLength={80}
          />
        </label>

        <label className="grid gap-1 font-mono text-[11px] uppercase tracking-widest text-[#5f6468]">
          Your letter
          <textarea
            value={letter.body}
            onChange={(event) => update('body', event.target.value)}
            className="min-h-28 resize-y border-2 border-black bg-[#fffdf7] p-2.5 font-handwritten text-sm leading-6 text-[#171717] placeholder:text-[#5f6468]/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/15"
            placeholder="Dear..."
            maxLength={MAX_LETTER_BODY_LENGTH}
          />
        </label>

        <label className="grid gap-1 justify-self-end font-mono text-[11px] uppercase tracking-widest text-[#5f6468]">
          Love,
          <input
            value={letter.sender}
            onChange={(event) => update('sender', event.target.value)}
            className="min-h-9 w-44 border-2 border-black bg-[#fffdf7] px-3 font-sans text-xs text-[#171717] placeholder:text-[#5f6468]/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/15"
            placeholder="Your name"
            maxLength={80}
          />
        </label>
      </div>
    </div>
  );
}
