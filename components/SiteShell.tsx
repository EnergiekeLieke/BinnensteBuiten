'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function Shell({ children }: { children: React.ReactNode }) {
  const params = useSearchParams();
  const embed = params.get('embed') === 'true';

  useEffect(() => {
    if (embed) {
      document.documentElement.style.overflow = 'hidden';
      return () => { document.documentElement.style.overflow = ''; };
    }
  }, [embed]);

  if (embed) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8 pb-12">{children}</main>
    );
  }

  return (
    <>
      <header className="bg-darkSlate text-cream px-4 sm:px-6 py-4 flex items-center justify-between shadow-md">
        <a href="/" className="flex flex-col leading-tight">
          <span className="font-salmon text-2xl text-lightBg">Energieke Lieke</span>
          <span className="text-xs text-midGreen tracking-widest uppercase">Van denken naar voelen</span>
        </a>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 pb-12">{children}</main>
      <footer className="mt-8 py-6 text-center text-sm text-midGreen border-t border-lightBg">
        Energieke Lieke · Van denken naar voelen
      </footer>
    </>
  );
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <>
        <header className="bg-darkSlate text-cream px-4 sm:px-6 py-4 flex items-center justify-between shadow-md">
          <a href="/" className="flex flex-col leading-tight">
            <span className="font-salmon text-2xl text-lightBg">Energieke Lieke</span>
            <span className="text-xs text-midGreen tracking-widest uppercase">Van denken naar voelen</span>
          </a>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8 pb-12">{children}</main>
        <footer className="mt-8 py-6 text-center text-sm text-midGreen border-t border-lightBg">
          Energieke Lieke · Van denken naar voelen
        </footer>
      </>
    }>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
