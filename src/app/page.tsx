import Link from 'next/link';
import { CassettePreview } from '@/components/mixtape/CassettePreview';
import { BUILT_IN_COVERS } from '@/lib/covers';

const heroCover = BUILT_IN_COVERS[0];

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#b7d9e3] px-4 py-6 text-[#171717] sm:px-8 sm:py-8">
      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] lg:gap-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5f6468]">A little gift, made by hand</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl leading-[1.2] tracking-wide sm:text-5xl">Make a mixtape that feels like paper.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#34383b] sm:text-lg">Choose a cover, place a few stickers, add the songs that say what you cannot, and write a note worth keeping. Then send one permanent link.</p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link href="/create" className="inline-flex min-h-11 items-center justify-center border-2 border-black bg-[#171717] px-6 font-semibold text-[#fffdf7] shadow-[3px_3px_0_#171717] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#171717] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20">
              Start a mixtape <span aria-hidden="true">&nbsp;→</span>
            </Link>
          </div>
          <details id="how-it-works" open className="mt-6 scroll-mt-8 rounded-sm border-2 border-black bg-[#fffdf7] p-4 shadow-[4px_4px_0_#171717]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 pr-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20">
              <span className="font-display text-xs uppercase tracking-wide">How it works</span>
              <span className="font-mono text-lg leading-none text-[#5f6468]" aria-hidden="true">−</span>
            </summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ['01', 'Pick a cover'],
                ['02', 'Add stickers + songs'],
                ['03', 'Share the link'],
              ].map(([number, label]) => (
                <div key={number} className="border-2 border-black bg-[#f2eee5] p-4">
                  <p className="font-mono text-xs text-[#5f6468]">{number}</p>
                  <p className="mt-2 font-display text-xs uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </details>
        </div>

        <div className="mx-auto w-full max-w-md">
          <CassettePreview cover={heroCover} stickers={[]} label="FOR YOU" />
        </div>
      </div>
    </div>
  );
}
