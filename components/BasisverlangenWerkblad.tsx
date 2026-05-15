'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AnalyseResultaat from './AnalyseResultaat';
import type { PdfKeuze } from './BasisverlangenPdf';
import { LEVENSGEBIEDEN, streamAnalyse, vervangMDashes } from '@/lib/huisstijl';

const BasisverlangenPdfKnop = dynamic(
  () => import('./BasisverlangenPdf').then((m) => m.BasisverlangenPdfKnop),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);

const VERLANGENS = [
  { id: 'certainty',    label: 'Zekerheid',   beschrijving: 'veiligheid, comfort, stabiliteit',            kleur: 'bg-darkSlate text-cream' },
  { id: 'variety',      label: 'Afwisseling', beschrijving: 'verandering, spanning, avontuur',              kleur: 'bg-orange text-white' },
  { id: 'significance', label: 'Erkenning',   beschrijving: 'je belangrijk voelen, waardering',                        kleur: 'bg-darkRed text-cream' },
  { id: 'love',         label: 'Liefde',      beschrijving: 'verbondenheid, intimiteit, acceptatie',       kleur: 'bg-lightBg text-darkSlate' },
  { id: 'growth',       label: 'Groei',       beschrijving: 'jezelf ontwikkelen en blijven leren',         kleur: 'bg-darkGreen text-cream' },
  { id: 'contribution', label: 'Bijdragen',   beschrijving: 'aan anderen of een groter geheel',            kleur: 'bg-midGreen text-cream' },
] as const;

type VerlangensId = (typeof VERLANGENS)[number]['id'];

export default function BasisverlangenWerkblad() {
  const [keuzes, setKeuzes]         = useState<(VerlangensId | '')[]>(LEVENSGEBIEDEN.map(() => ''));
  const [opvallend, setOpvallend]   = useState('');
  const [actie, setActie]           = useState('');
  const [analyse, setAnalyse]       = useState('');
  const [loading, setLoading] = useState(false);
  const [fout, setFout]       = useState('');

  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const analyseer = async () => {
    setLoading(true);
    setFout('');
    try {
      const regels = LEVENSGEBIEDEN.map((g, i) => {
        const v = VERLANGENS.find((x) => x.id === keuzes[i]);
        return `- ${g}: ${v ? `${v.label} (${v.beschrijving})` : 'niet ingevuld'}`;
      }).join('\n');

      const prompt = `Analyseer dit Basisverlangens Werkblad:

Keuzes per levensgebied:
${regels}

Wat de klant zelf opvalt: ${opvallend || '(niet ingevuld)'}
Wat de klant gaat doen: ${actie || '(niet ingevuld)'}

Schrijf een persoonlijke analyse in het Nederlands met exact deze opmaak:

## Samenvatting
2-3 zinnen overall beeld als doorlopende tekst.

## Opvallende patronen
Gebruik voor elk dominant verlangen een ### blok:
### [Verlangennaam]
Wat dit verlangen zegt over jou in 2-3 zinnen. Gebruik **vetgedrukte woorden** voor kernbegrippen.

## Groeikansen
Gebruik voor elke kans een ### blok:
### [Verlangen of thema]
Concrete tip voor tijd, geld of energie in 2-3 zinnen.

## Afsluiting
Warme afsluiting gebaseerd op wat de klant zelf schreef.`;

      const controller = new AbortController();
      abortRef.current = controller;
      let acc = '';
      await streamAnalyse(prompt, 2500, (chunk) => { acc += chunk; setAnalyse(acc); }, undefined, controller.signal);
      setAnalyse(vervangMDashes(acc));
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') return;
      setFout(e instanceof Error ? e.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">Basisverlangens Werkblad</h1>
        <p className="text-midGreen">Welk basisverlangen drijft jou in elk levensgebied?</p>
      </div>

      <div className="bg-lightBg2 border-l-4 border-midGreen rounded-xl px-4 py-3 text-sm text-darkSlate leading-relaxed">
        <span className="font-semibold text-midGreen">Zo gebruik je dit: </span>
        Vraag de biotensor per levensgebied: 'Welk basisverlangen is nu het meest actief?' Beantwoord daarna de twee reflectievragen, voordat je de analyse aanvraagt.
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-2xl p-5 border border-lightBg shadow-sm">
        <h2 className="font-salmon text-base text-darkSlate mb-3">De 6 basisverlangens</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {VERLANGENS.map((v) => (
            <div key={v.id} className="grid grid-cols-[100px_1fr] items-start gap-x-2 text-xs leading-snug">
              <span className={`px-2 py-0.5 rounded text-center font-bold ${v.kleur}`}>{v.label}</span>
              <span className="text-darkSlate/70 self-center">{v.beschrijving}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LEVENSGEBIEDEN.map((gebied, i) => (
          <div key={gebied} className="bg-white rounded-xl p-4 shadow-sm border border-lightBg">
            <label className="block font-salmon text-base text-darkSlate mb-2">{gebied}</label>
            <select
              value={keuzes[i]}
              onChange={(e) => setKeuzes((prev) => prev.map((k, idx) => idx === i ? e.target.value as VerlangensId : k))}
              className="w-full rounded-lg border border-lightBg px-3 py-2 text-sm bg-cream focus:outline-none focus:border-darkGreen"
            >
              <option value="">Kies een basisverlangen</option>
              {VERLANGENS.map((v) => (
                <option key={v.id} value={v.id}>{v.label}: {v.beschrijving}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-darkRed border border-lightBg">
          <label className="block font-salmon text-base text-darkRed mb-2">Wat valt je op?</label>
          <textarea
            value={opvallend}
            onChange={(e) => setOpvallend(e.target.value)}
            rows={4}
            placeholder="Schrijf hier wat je opvalt na het invullen…"
            className="w-full rounded-lg border border-lightBg px-3 py-2 text-sm bg-cream focus:outline-none focus:border-darkRed resize-none"
          />
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-darkGreen border border-lightBg">
          <label className="block font-salmon text-base text-darkGreen mb-2">Wat ga je doen, nu je dit weet?</label>
          <textarea
            value={actie}
            onChange={(e) => setActie(e.target.value)}
            rows={4}
            placeholder="Welke concrete stap neem je…"
            className="w-full rounded-lg border border-lightBg px-3 py-2 text-sm bg-cream focus:outline-none focus:border-darkGreen resize-none"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={analyseer}
          disabled={loading || keuzes.filter(k => k !== '').length < 4}
          className="px-8 py-3 rounded-xl bg-darkGreen text-cream font-salmon text-lg hover:bg-darkGreen/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Analyseren…' : 'Analyseer mijn verlangens'}
        </button>
        {fout && <p className="text-darkRed text-sm">{fout}</p>}
      </div>

      {analyse && (
        <>
          <AnalyseResultaat tekst={analyse} verbergPrintKnop isLoading={loading} />
          <div className="flex justify-end mt-4 no-print">
            {loading
              ? <span className="text-sm px-3 py-1.5 rounded-lg bg-darkRed/40 text-white cursor-not-allowed inline-block">Download als PDF</span>
              : <BasisverlangenPdfKnop
                  keuzes={LEVENSGEBIEDEN.map((g, i): PdfKeuze => {
                    const v = VERLANGENS.find((x) => x.id === keuzes[i]) ?? null;
                    return { gebied: g, verlangenId: v?.id ?? null, verlangenLabel: v?.label ?? null };
                  })}
                  opvallend={opvallend}
                  actie={actie}
                  analyse={analyse}
                />
            }
          </div>
        </>
      )}
    </div>
  );
}
