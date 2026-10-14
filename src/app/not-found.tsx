import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#b7d9e3] px-4 text-[#171717]">
      <section className="max-w-md border-2 border-black bg-[#fffdf7] p-8 text-center shadow-[7px_7px_0_#171717]">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#5f6468]">404 / tape not found</p>
        <h1 className="mt-4 font-display text-2xl">This mixtape is not playing.</h1>
        <p className="mt-4 text-sm leading-6 text-[#5f6468]">The link may be incomplete, or the mixtape may no longer be available.</p>
        <Link href="/" className="mt-6 inline-flex min-h-10 items-center justify-center border-2 border-black bg-[#171717] px-5 font-semibold text-[#fffdf7]">Back home</Link>
      </section>
    </main>
  );
}
