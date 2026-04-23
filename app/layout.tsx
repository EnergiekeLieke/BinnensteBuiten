import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Energieke Lieke — Van denken naar voelen',
  description: 'Coaching tools voor persoonlijke en zakelijke groei',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-cream font-brogi" suppressHydrationWarning>
        <header className="bg-darkSlate text-cream px-4 sm:px-6 py-4 flex items-center justify-between shadow-md">
          <a href="/" className="flex flex-col leading-tight">
            <span className="font-salmon text-2xl text-lightBg">Energieke Lieke</span>
            <span className="text-xs text-midGreen tracking-widest uppercase">Van denken naar voelen</span>
          </a>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8 pb-12">{children}</main>
        <footer className="mt-8 py-6 text-center text-sm text-midGreen border-t border-lightBg">
          Energieke Lieke — Van denken naar voelen
        </footer>
      </body>
    </html>
  );
}
