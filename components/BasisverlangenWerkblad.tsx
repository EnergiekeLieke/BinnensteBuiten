'use client';

import { useState } from 'react';
import AnalyseResultaat from './AnalyseResultaat';
import { LEVENSGEBIEDEN, roepAnalyseAan, exporteerAlsPdf } from '@/lib/huisstijl';

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
  const [loading, setLoading]       = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [fout, setFout]             = useState('');

  const analyseer = async () => {
    setLoading(true);
    setFout('');
    try {
      const regels = LEVENSGEBIEDEN.map((g, i) => {
        const v = VERLANGENS.find((x) => x.id === keuzes[i]);
        return `- ${g}: ${v ? `${v.label} (${v.beschrijving})` : 'niet ingevuld'}`;
      }).join('\n');

      const prompt = `Je bent een warme coach voor Energieke Lieke. Analyseer dit Basisverlangens Werkblad:

Keuzes per levensgebied:
${regels}

Wat de klant zelf opvalt: ${opvallend || '(niet ingevuld)'}
Wat de klant gaat doen: ${actie || '(niet ingevuld)'}

Schrijf een persoonlijke analyse in het Nederlands met deze secties:
## Patroon: jouw dominante verlangens
(welke verlangens komen vaker voor, wat zegt dat over jou)

## Tijd, geld en energie
(per dominant verlangen: hoe investeer je daarin bewust of onbewust qua tijd/geld/energie)

## Conflicterende verlangens
(benoem spanningsvelden tussen verlangens in verschillende gebieden + concrete tips om hiermee om te gaan)

## Jouw vervolgstap
(warme, concrete aanzet gebaseerd op wat de klant zelf schreef)`;

      const tekst = await roepAnalyseAan(prompt, 2500);
      setAnalyse(tekst);
    } catch (e: unknown) {
      setFout(e instanceof Error ? e.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  };

  const exportPdf = async () => {
    setPdfLoading(true);
    try {
      const tabelHtml = `
        <h2>Ingevulde keuzes</h2>
        <table>
          <tr><th>Levensgebied</th><th>Basisverlangen</th></tr>
          ${LEVENSGEBIEDEN.map((g, i) => {
            const v = VERLANGENS.find((x) => x.id === keuzes[i]);
            return `<tr><td>${g}</td><td>${v ? `${v.label} — ${v.beschrijving}` : '—'}</td></tr>`;
          }).join('')}
        </table>
        ${opvallend ? `<p><strong>Wat valt je op:</strong> ${opvallend}</p>` : ''}
        ${actie ? `<p><strong>Wat ga je doen:</strong> ${actie}</p>` : ''}
        <h2>AI-Analyse</h2>
        <div class="analyse-block">${analyse.replace(/\n/g, '<br>')}</div>`;
      await exporteerAlsPdf(tabelHtml, 'Basisverlangens Werkblad');
    } catch (e: unknown) {
      setFout(e instanceof Error ? e.message : 'PDF export mislukt');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">Basisverlangens Werkblad</h1>
        <p className="text-midGreen">Welk basisverlangen drijft jou in elk levensgebied?</p>
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
              <option value="">— Kies een basisverlangen —</option>
              {VERLANGENS.map((v) => (
                <option key={v.id} value={v.id}>{v.label} — {v.beschrijving}</option>
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
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-darkGreen text-cream font-salmon text-lg hover:bg-darkGreen/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Analyseren…' : 'Analyseer mijn verlangens'}
        </button>
        {fout && <p className="text-darkRed text-sm">{fout}</p>}
      </div>

      {analyse && (
        <AnalyseResultaat
          tekst={analyse}
          onExportPdf={exportPdf}
          exportLoading={pdfLoading}
        />
      )}
    </div>
  );
}
