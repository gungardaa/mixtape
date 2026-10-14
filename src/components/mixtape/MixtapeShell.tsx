'use client';

import type { ReactNode } from 'react';
import { StepProgress } from '@/components/mixtape/StepProgress';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';

type MixtapeShellProps = {
  step: number;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
};

export function MixtapeShell({
  step,
  title,
  eyebrow = 'A little gift, made by hand',
  children,
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
}: MixtapeShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#b7d9e3] px-4 py-6 text-[#171717] sm:px-8 sm:py-6">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-between">
        <header className="flex w-full flex-col gap-2.5 sm:gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#5f6468]">{eyebrow}</p>
            <h1 className="mt-1 font-display text-2xl leading-tight tracking-wide sm:text-2xl">{title}</h1>
          </div>
          <StepProgress currentStep={step} />
        </header>

        <main className="my-4 w-full flex-1 sm:my-6">{children}</main>

        {(onBack || onNext) && (
          <nav className="flex w-full items-center justify-between gap-3 pt-2" aria-label="Creation steps">
            {onBack ? <SecondaryButton onClick={onBack}>← Back</SecondaryButton> : <span />}
            {onNext && (
              <PrimaryButton onClick={onNext} disabled={nextDisabled}>
                {nextLabel} <span aria-hidden="true">→</span>
              </PrimaryButton>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
