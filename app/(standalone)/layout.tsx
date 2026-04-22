import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Energieke Lieke',
};

export default function StandaloneLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="font-brogi" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
