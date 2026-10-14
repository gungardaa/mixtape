'use client';

type StepProgressProps = {
  currentStep: number;
};

const labels = ['Cover', 'Stickers', 'Songs + letter', 'Preview'];

export function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <ol className="flex w-full items-center" aria-label="Mixtape creation progress">
      {labels.map((label, index) => {
        const step = index + 1;
        const state = step < currentStep ? 'completed' : step === currentStep ? 'active' : 'upcoming';
        const isFirst = index === 0;

        return (
          <li key={label} className={`flex items-center gap-2${!isFirst ? ' flex-1' : ''}`}>
            {!isFirst && (
              <span
                className={`mx-2 h-px flex-1 ${step <= currentStep ? 'bg-[#70a879]' : 'bg-[#202020]/25'}`}
                aria-hidden="true"
              />
            )}
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 border-black text-xs font-bold ${
                state === 'completed'
                  ? 'bg-[#70a879] text-[#171717]'
                  : state === 'active'
                    ? 'bg-[#171717] text-[#fffdf7]'
                    : 'bg-[#fffdf7] text-[#5f6468]'
              }`}
              aria-current={state === 'active' ? 'step' : undefined}
            >
              {state === 'completed' ? '✓' : step}
            </span>
            <span className={`hidden text-xs font-semibold sm:inline ${state === 'active' ? 'text-[#171717]' : 'text-[#5f6468]'}`}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
