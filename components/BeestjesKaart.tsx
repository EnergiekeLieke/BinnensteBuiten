'use client';

import { useState } from 'react';

type Insect = { naam: string; emoji: string; href?: string; olieen: string[] };

export default function BeestjesKaart({ insecten }: { insecten: Insect[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border-l-4 border-orange p-5 shadow sm:col-span-2">
      <div className="text-2xl mb-2">🐝</div>
      <h2 className="font-salmon text-lg text-darkSlate mb-4">Beestjes</h2>

      <div className="relative">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 overflow-hidden transition-all duration-500 ${open ? 'max-h-[2000px]' : 'max-h-[280px]'}`}>
          {insecten.map(({ naam, emoji, href, olieen }) => {
            const cls = `bg-orange/5 rounded-xl p-4 ${href ? 'hover:bg-orange/10 transition-colors cursor-pointer' : ''}`;
            const inner = (
              <>
                <div className="text-3xl mb-2">{emoji}</div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange mb-3">{naam}</p>
                <div className="flex flex-wrap gap-1.5">
                  {olieen.map((o) => (
                    <span key={o} className="text-xs bg-white border border-orange/20 text-darkSlate/80 rounded-full px-2.5 py-1">{o}</span>
                  ))}
                </div>
              </>
            );
            return href ? (
              <a key={naam} href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
            ) : (
              <div key={naam} className={cls}>{inner}</div>
            );
          })}
        </div>

        {!open && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      <button
        onClick={() => setOpen((s) => !s)}
        className="mt-4 text-sm font-medium text-orange hover:underline flex items-center gap-1"
      >
        {open ? 'Minder tonen ▲' : 'Alle beestjes tonen ▼'}
      </button>

      <div className="flex flex-col gap-2 border-t border-darkSlate/10 pt-4 mt-4">
        <p className="text-sm text-darkSlate/70 leading-relaxed">
          Zet een draadloze diffuser buiten op tafel om beestjes bij je vandaan te houden, bijv. de Macaron, Aroma Globe of Wanderbliss is hier geschikt voor. Super handig tijdens het eten of de BBQ. Heb je die niet? Een houten diffuserblokje met een paar druppels olie erop werkt ook best goed.
        </p>
        <p className="text-sm text-darkSlate/70 leading-relaxed">
          Spray je drempel of raamkozijn in met een spray om ongewenste indringers buiten de deur te houden.
        </p>
      </div>
    </div>
  );
}
