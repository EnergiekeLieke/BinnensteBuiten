'use client';

import { useState } from 'react';
import SpinnenWeb from './SpinnenWeb';
import AnalyseResultaat from './AnalyseResultaat';
import { LEVENSGEBIEDEN, roepAnalyseAan, exporteerAlsPdf } from '@/lib/huisstijl';

type Scores = { bewust: number; onbewust: number };

const initScores = (): Scores[] => LEVENSGEBIEDEN.map(() => ({ bewust: 5, onbewust: 5 }));

export default function LevenswielAnalyse() {
  const [scores, setScores]         = useState<Scores[]>(initScores);
  const [analyse, setAnalyse]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [fout, setFout]             = useState('');

  const updateScore = (i: number, soort: keyof Scores, waarde: number) =>
    setScores((prev) => prev.map((s, idx) => (idx === i ? { ...s, [soort]: waarde } : s)));

  const analyseer = async () => {
    setLoading(true);
    setFout('');
    try {
      const regels = LEVENSGEBIEDEN.map(
        (g, i) =>
          `- ${g}: bewust ${scores[i].bewust}/10, onbewust ${scores[i].onbewust}/10` +
          (scores[i].bewust > scores[i].onbewust
            ? ' [bewust_hoger]'
            : scores[i].onbewust > scores[i].bewust
            ? ' [onbewust_hoger]'
            : scores[i].bewust <= 4
            ? ' [laag_beiden]'
            : ' [sterk_gebied]')
      ).join('\n');

      const prompt = `Analyseer dit Levenswiel:

${regels}

Schrijf een persoonlijke analyse in het Nederlands met deze secties:
## Samenvatting
(2-3 zinnen overall beeld)

## Opvallende patronen
(per patroon: bewust_hoger = spanning onder oppervlak, uitnodiging eerlijker te kijken; onbewust_hoger = je doet het beter dan je denkt, mogelijk perfectionisme; laag_beiden = aandacht nodig; sterk_gebied = benoem kracht)

## Groeikansen
(2-3 concrete kansen, vermeld ook tijd/geld/energie tips waar relevant)

## Afsluiting
(warme, persoonlijke afsluitende zin met verwijzing naar Vitaliteitstest als relevant)`;

      const tekst = await roepAnalyseAan(prompt, 2500);
      setAnalyse(tekst);
    } catch (e: unknown) {
      setFout(e instanceof Error ? e.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  };

  const exportPdf = async () => {
    if (!analyse) return;
    setPdfLoading(true);
    try {
      const scoresHtml = `
        <h2>Ingevulde scores</h2>
        <table>
          <tr><th>Levensgebied</th><th>Bewust</th><th>Onbewust</th></tr>
          ${LEVENSGEBIEDEN.map((g, i) => `
            <tr>
              <td>${g}</td>
              <td><span class="score-badge bewust">${scores[i].bewust}/10</span></td>
              <td><span class="score-badge onbewust">${scores[i].onbewust}/10</span></td>
            </tr>`).join('')}
        </table>
        <h2>AI-Analyse</h2>
        <div class="analyse-block">${analyse.replace(/\n/g, '<br>')}</div>`;
      await exporteerAlsPdf(scoresHtml, 'Levenswiel Analyse');
    } catch (e: unknown) {
      setFout(e instanceof Error ? e.message : 'PDF export mislukt');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">Levenswiel Analyse</h1>
        <p className="text-midGreen">Scoor elk levensgebied: rood = bewust, groen = onbewust</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders */}
        <div className="space-y-5">
          {LEVENSGEBIEDEN.map((gebied, i) => (
            <div key={gebied} className="bg-white rounded-xl p-4 shadow-sm border border-lightBg">
              <h3 className="font-salmon text-base text-darkSlate mb-3">{gebied}</h3>
              <div className="space-y-3">
                <SliderRij
                  label="Bewust" waarde={scores[i].bewust} soort="slider-bewust" kleur="text-darkRed"
                  onChange={(v) => updateScore(i, 'bewust', v)}
                />
                <SliderRij
                  label="Onbewust" waarde={scores[i].onbewust} soort="slider-onbewust" kleur="text-darkGreen"
                  onChange={(v) => updateScore(i, 'onbewust', v)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Spinnenweb + actieknop */}
        <div className="flex flex-col items-center gap-6 sticky top-8 self-start">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-lightBg w-full flex justify-center">
            <SpinnenWeb
              labels={[...LEVENSGEBIEDEN]}
              bewustScores={scores.map((s) => s.bewust)}
              onbewustScores={scores.map((s) => s.onbewust)}
              size={280}
            />
          </div>

          <button
            onClick={analyseer}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-darkGreen text-cream font-salmon text-lg hover:bg-darkGreen/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Analyseren…' : 'Analyseer mijn levenswiel'}
          </button>

          {fout && <p className="text-darkRed text-sm text-center">{fout}</p>}
        </div>
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

function SliderRij({ label, waarde, soort, kleur, onChange }: {
  label: string; waarde: number; soort: string; kleur: string; onChange: (v: number) => void;
}) {
  const trackColor = soort === 'slider-onbewust' ? '#3b5633' : '#9e3816';
  const pct = `${waarde * 10}%`;
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-medium w-16 ${kleur}`}>{label}</span>
      <input
        type="range" min={0} max={10} step={1} value={waarde}
        className={`flex-1 ${soort}`}
        style={{ background: `linear-gradient(to right, ${trackColor} 0%, ${trackColor} ${pct}, #fde8d0 ${pct}, #fde8d0 100%)` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className={`text-sm font-bold w-6 text-right ${kleur}`}>{waarde}</span>
    </div>
  );
}
