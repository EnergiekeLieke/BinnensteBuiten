'use client';

import { useState } from 'react';

interface Props {
  tekst: string;
}

interface Sectie {
  header: string;
  inhoud: string;
}

function splitSectie(tekst: string): Sectie[] {
  const regels = tekst.split('\n');
  const secties: Sectie[] = [];
  let huidig: Sectie | null = null;

  for (const regel of regels) {
    if (regel.startsWith('## ')) {
      if (huidig) secties.push(huidig);
      huidig = { header: regel.replace(/^##\s+/, ''), inhoud: '' };
    } else if (huidig) {
      huidig.inhoud += regel + '\n';
    }
  }
  if (huidig) secties.push(huidig);
  return secties;
}

function sectionType(header: string): 'patronen' | 'groei' | 'afsluiting' | 'default' {
  const h = header.toLowerCase();
  if (h.includes('patroon') || h.includes('opvallend')) return 'patronen';
  if (h.includes('groei') || h.includes('kans'))        return 'groei';
  if (h.includes('afsluiting') || h.includes('afsluit') || h.includes('conclusie')) return 'afsluiting';
  return 'default';
}

function parseBadge(titel: string): { naam: string; badge: string | null } {
  const match = titel.match(/^(.+?)\s*[\[—–-]+\s*(.+?)[\]]*$/);
  if (match) return { naam: match[1].trim(), badge: match[2].trim() };

  const badgeWoorden = ['bewust', 'onbewust', 'hoger', 'beiden', 'sterk', 'laag'];
  for (const woord of badgeWoorden) {
    if (titel.toLowerCase().includes(woord)) {
      const idx = titel.search(/[—–\[]/);
      if (idx > 0) return { naam: titel.slice(0, idx).trim(), badge: titel.slice(idx + 1).trim() };
    }
  }
  return { naam: titel, badge: null };
}

function badgeKleur(badge: string): string {
  const b = badge.toLowerCase();
  if (b.includes('bewust') && b.includes('onbewust')) return 'bg-darkRed text-cream';
  if (b.includes('bewust'))   return 'bg-darkRed text-cream';
  if (b.includes('onbewust')) return 'bg-darkGreen text-cream';
  if (b.includes('laag'))     return 'bg-darkSlate text-cream';
  if (b.includes('sterk'))    return 'bg-midGreen text-cream';
  return 'bg-orange text-white';
}

function RijkeTekst({ tekst }: { tekst: string }) {
  const delen = tekst.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {delen.map((deel, i) =>
        deel.startsWith('**') && deel.endsWith('**')
          ? <strong key={i} className="font-semibold text-orange">{deel.slice(2, -2)}</strong>
          : <span key={i}>{deel}</span>
      )}
    </>
  );
}

function SubKaarten({ inhoud, type }: { inhoud: string; type: 'patronen' | 'groei' | 'default' }) {
  const regels = inhoud.split('\n');
  const kaarten: { titel: string; tekst: string }[] = [];
  let huidig: { titel: string; tekst: string } | null = null;
  let loseTekst = '';

  for (const regel of regels) {
    if (regel.startsWith('### ')) {
      if (huidig) kaarten.push(huidig);
      huidig = { titel: regel.replace(/^###\s+/, ''), tekst: '' };
    } else if (regel.startsWith('- ') || regel.startsWith('* ')) {
      if (huidig) huidig.tekst += regel.replace(/^[-*]\s/, '') + '\n';
      else loseTekst += regel.replace(/^[-*]\s/, '') + '\n';
    } else if (regel.trim()) {
      if (huidig) huidig.tekst += regel + '\n';
      else loseTekst += regel + '\n';
    }
  }
  if (huidig) kaarten.push(huidig);

  return (
    <div className="space-y-3">
      {loseTekst.trim() && (
        <p className="text-sm text-darkSlate leading-relaxed">
          <RijkeTekst tekst={loseTekst.trim()} />
        </p>
      )}
      {kaarten.map((k, i) => {
        const { naam, badge } = parseBadge(k.titel);
        if (type === 'patronen') {
          return (
            <div key={i} className="bg-white rounded-xl border border-lightBg border-l-4 border-l-darkRed p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-salmon text-base text-darkSlate">{naam}</span>
                {badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeKleur(badge)}`}>
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-darkSlate/80 leading-relaxed">
                <RijkeTekst tekst={k.tekst.trim()} />
              </p>
            </div>
          );
        }
        if (type === 'groei') {
          return (
            <div key={i} className="bg-lightBg2 rounded-xl border border-lightBg p-4">
              <p className="font-salmon text-base text-darkGreen mb-1">{naam}</p>
              <p className="text-sm text-darkSlate/80 leading-relaxed">
                <RijkeTekst tekst={k.tekst.trim()} />
              </p>
            </div>
          );
        }
        return (
          <div key={i} className="bg-white rounded-xl border border-lightBg p-4">
            <p className="font-salmon text-base text-darkSlate mb-1">{naam}</p>
            <p className="text-sm text-darkSlate/80 leading-relaxed">
              <RijkeTekst tekst={k.tekst.trim()} />
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyseResultaat({ tekst }: Props) {
  const [gekopieerd, setGekopieerd] = useState(false);

  const kopieer = async () => {
    await navigator.clipboard.writeText(tekst);
    setGekopieerd(true);
    setTimeout(() => setGekopieerd(false), 2000);
  };

  const secties = splitSectie(tekst);

  return (
    <div id="print-area" className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-salmon text-2xl text-darkGreen">Jouw analyse</h2>
        <div className="flex gap-2 no-print">
          <button
            onClick={kopieer}
            className="text-sm px-3 py-1.5 rounded-lg border border-midGreen text-midGreen hover:bg-midGreen hover:text-white transition-colors"
          >
            {gekopieerd ? '✓ Gekopieerd' : 'Kopieer tekst'}
          </button>
          <button
            onClick={() => window.print()}
            className="text-sm px-3 py-1.5 rounded-lg bg-darkRed text-white hover:bg-darkRed/80 transition-colors"
          >
            Exporteer als PDF
          </button>
        </div>
      </div>

      {secties.map((s, i) => {
        const type = sectionType(s.header);

        if (type === 'afsluiting') {
          return (
            <div key={i} className="bg-lightBg2 border border-lightBg rounded-2xl p-5">
              <h3 className="font-salmon text-base text-orange uppercase tracking-wide mb-3 pb-2 border-b border-lightBg">
                {s.header}
              </h3>
              <p className="text-sm text-darkSlate leading-relaxed">
                <RijkeTekst tekst={s.inhoud.trim()} />
              </p>
            </div>
          );
        }

        return (
          <div key={i}>
            <h3 className="font-salmon text-base text-darkSlate uppercase tracking-wide mb-3 pb-2 border-b-2 border-orange">
              {s.header}
            </h3>
            <SubKaarten inhoud={s.inhoud} type={type === 'patronen' || type === 'groei' ? type : 'default'} />
          </div>
        );
      })}

      <details className="mt-2 no-print">
        <summary className="cursor-pointer text-xs text-midGreen hover:text-darkGreen select-none">
          Toon ruwe tekst
        </summary>
        <textarea
          readOnly value={tekst}
          className="mt-2 w-full h-40 text-xs p-3 bg-cream border border-lightBg rounded-lg resize-none font-mono"
        />
      </details>
    </div>
  );
}
