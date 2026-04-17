'use client';

import { useState } from 'react';

interface Props {
  tekst: string;
  onExportPdf?: () => void;
  exportLoading?: boolean;
}

export default function AnalyseResultaat({ tekst, onExportPdf, exportLoading }: Props) {
  const [gekopieerd, setGekopieerd] = useState(false);

  const kopieer = async () => {
    await navigator.clipboard.writeText(tekst);
    setGekopieerd(true);
    setTimeout(() => setGekopieerd(false), 2000);
  };

  const secties = parseerMarkdown(tekst);

  return (
    <div className="mt-8 bg-lightBg2 rounded-2xl p-6 border border-lightBg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-salmon text-2xl text-darkGreen">Jouw analyse</h2>
        <div className="flex gap-2">
          <button
            onClick={kopieer}
            className="text-sm px-3 py-1.5 rounded-lg border border-midGreen text-midGreen hover:bg-midGreen hover:text-white transition-colors"
          >
            {gekopieerd ? '✓ Gekopieerd' : 'Kopieer tekst'}
          </button>
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              disabled={exportLoading}
              className="text-sm px-3 py-1.5 rounded-lg bg-darkRed text-white hover:bg-darkRed/80 transition-colors disabled:opacity-50"
            >
              {exportLoading ? 'Bezig…' : 'Exporteer als PDF'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {secties.map((s, i) =>
          s.type === 'heading' ? (
            <h3 key={i} className="font-salmon text-lg text-darkRed mt-6 first:mt-0">{s.text}</h3>
          ) : s.type === 'affirmatie' ? (
            <div key={i} className="bg-darkGreen text-cream rounded-lg px-4 py-2 text-sm">{s.text}</div>
          ) : s.type === 'groei-affirmatie' ? (
            <div key={i} className="bg-orange text-white rounded-lg px-4 py-2 text-sm">{s.text}</div>
          ) : (
            <p key={i} className="text-darkSlate leading-relaxed text-sm">{s.text}</p>
          )
        )}
      </div>

      {/* Kopieertekstvak */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm text-midGreen hover:text-darkGreen">Toon ruwe tekst (kopiëren)</summary>
        <textarea
          readOnly
          value={tekst}
          className="mt-2 w-full h-40 text-xs p-3 bg-cream border border-lightBg rounded-lg resize-none font-mono"
        />
      </details>
    </div>
  );
}

function parseerMarkdown(tekst: string) {
  return tekst.split('\n').filter(Boolean).map((regel) => {
    if (regel.startsWith('## ') || regel.startsWith('### ')) {
      return { type: 'heading', text: regel.replace(/^#+\s/, '') };
    }
    if (regel.startsWith('✨') || regel.startsWith('💚')) {
      return { type: 'affirmatie', text: regel };
    }
    if (regel.startsWith('🌱') || regel.startsWith('🟠')) {
      return { type: 'groei-affirmatie', text: regel };
    }
    return { type: 'paragraph', text: regel.replace(/^\*\*(.+)\*\*$/, '$1').replace(/^[-*]\s/, '') };
  });
}
