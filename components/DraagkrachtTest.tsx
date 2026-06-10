'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { kleuren, sliderBackground, streamAnalyse, vervangMDashes } from '@/lib/huisstijl';
import AnalyseResultaat from './AnalyseResultaat';

const DraagkrachtTestPdfKnop = dynamic(
  () => import('./DraagkrachtTestPdf').then((m) => m.DraagkrachtTestPdfKnop),
  { ssr: false }
);

const VRAGEN = [
  'Ik voel me fysiek energiek en uitgerust.',
  'Ik herstel snel na een drukke dag.',
  'Ik ervaar innerlijke rust, ook als het druk is.',
  'Ik kan mijn grenzen goed voelen.',
  'Ik geef mijn grenzen ook daadwerkelijk aan.',
  'Ik neem voldoende tijd om op te laden.',
  'Ik voel me emotioneel stabiel.',
  'Ik kan goed omgaan met prikkels om mij heen.',
  'Ik kan "nee" zeggen zonder schuldgevoel.',
  'Ik voel dat ik de dingen in mijn leven aankan.',
];

type Band = {
  label: string;
  kleur: string;
  bg: string;
  grens: string;
  beschrijving: string;
  kans: string;
  thema: string;
  emoji: string;
};

const BANDEN: Band[] = [
  {
    label: 'Lage draagkracht',
    kleur: '#9e3816',
    bg: '#fdf0ec',
    grens: '0 – 40',
    emoji: '🔴',
    beschrijving: 'Jouw systeem zit (bijna) vol! Let goed op jezelf en neem voldoende rust.',
    kans: 'Grote kans op vermoeidheid, prikkelbaarheid of uitval.',
    thema: 'Herstel & ontladen',
  },
  {
    label: 'Wisselende draagkracht',
    kleur: '#d56119',
    bg: '#fdf5ed',
    grens: '40 – 70',
    emoji: '🟠',
    beschrijving: 'Je kunt veel aan, maar je energieniveau is niet altijd stabiel.',
    kans: 'Kans op pieken en dalen.',
    thema: 'Balans & grenzen bewaken',
  },
  {
    label: 'Sterke draagkracht',
    kleur: '#3b5633',
    bg: '#eef3ec',
    grens: '70 – 100',
    emoji: '🟢',
    beschrijving: 'Je systeem is veerkrachtig en flexibel.',
    kans: 'Bewust (blijven) inzetten van je energie, om dit zo te houden.',
    thema: 'Bewust inzetten van je energie',
  },
];

function getBand(score: number): Band {
  if (score < 40) return BANDEN[0];
  if (score < 70) return BANDEN[1];
  return BANDEN[2];
}

export default function DraagkrachtTest() {
  const [scores, setScores] = useState<number[]>(Array(VRAGEN.length).fill(5));
  const [aangeraakt, setAangeraakt] = useState<boolean[]>(Array(VRAGEN.length).fill(false));
  const [analyse, setAnalyse] = useState('');
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const totaal = scores.reduce((s, v) => s + v, 0);
  const alleAangeraakt = aangeraakt.every(Boolean);
  const band = getBand(totaal);

  async function genereerAnalyse() {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setAnalyse('');
    setLoading(true);

    const scorelijst = VRAGEN.map((v, i) => `- ${v}: ${scores[i]}/10`).join('\n');
    const laagste = VRAGEN
      .map((v, i) => ({ v, s: scores[i] }))
      .sort((a, b) => a.s - b.s)
      .slice(0, 3)
      .map((x) => `- ${x.v} (${x.s}/10)`)
      .join('\n');

    const prompt = `
Dit zijn de scores van een Draagkracht Test (0-10 per stelling, maximale totaalscore: 100):

${scorelijst}

Totaalscore: ${totaal}/100 (${band.label})

De drie laagst scorende stellingen:
${laagste}

Schrijf een persoonlijke analyse in drie onderdelen:

## Wat opvalt
Beschrijf in 2-3 zinnen wat het patroon in de scores zegt over de draagkracht van deze persoon. Wees concreet en persoonlijk, niet algemeen.

## Groeikans
Kies het gebied waar de meeste winst te behalen valt (op basis van de laagste scores). Benoem waarom juist dit gebied aandacht vraagt. Schrijf 2-3 zinnen.

## Gedragsexperiment
Geef één concreet, klein en haalbaar gedragsexperiment dat past bij de groeikans. Beschrijf het zo specifiek dat de persoon het morgen al kan uitproberen. Geen algemeen advies, maar een concrete actie. Formuleer het als een uitnodiging, niet als een opdracht.
`.trim();

    const system = `Schrijf in correct Nederlands: grammaticaal juist, correcte spelling, correcte woordkeuze en geen anglicismen.
Je bent een empathische coach die mensen helpt hun draagkracht te begrijpen. Je toon is warm, direct en niet betuttelend. Geen m-dashes gebruiken. Begin zinnen niet met "En".`;

    try {
      let acc = '';
      await streamAnalyse(prompt, 700, (chunk) => {
        acc += chunk;
        setAnalyse(acc);
      }, system, controller.signal);
      setAnalyse(vervangMDashes(acc));
    } catch {
      // geannuleerd of fout
    } finally {
      setLoading(false);
    }
  }

  function setScore(index: number, waarde: number) {
    setScores((prev) => {
      const nieuw = [...prev];
      nieuw[index] = waarde;
      return nieuw;
    });
    setAangeraakt((prev) => {
      const nieuw = [...prev];
      nieuw[index] = true;
      return nieuw;
    });
  }

  const voortgang = Math.round((totaal / 100) * 100);

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">Draagkracht Test</h1>
        <p className="text-sm text-midGreen leading-relaxed">
          Geef per stelling aan hoe dit voor jou voelt, vanuit je onderbewustzijn. Meet de scores per stelling met je biotensor.
        </p>
      </div>

      <div className="flex flex-col gap-6 mb-10">
        {VRAGEN.map((vraag, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-darkSlate mb-4 leading-snug font-medium">{vraag}</p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-midGreen w-4 text-right shrink-0">0</span>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={scores[i]}
                onChange={(e) => setScore(i, Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer slider-onbewust"
                style={{ background: sliderBackground(scores[i], 10, kleuren.darkGreen) }}
              />
              <span className="text-xs text-midGreen w-4 text-left shrink-0">10</span>
              <span
                className="text-sm font-bold w-6 text-right shrink-0"
                style={{ color: kleuren.darkGreen }}
              >
                {scores[i]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Totaalscore balk */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-darkSlate">Totaalscore</span>
          <span className="text-2xl font-bold" style={{ color: band.kleur }}>{totaal}</span>
        </div>
        <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${voortgang}%`, backgroundColor: band.kleur }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-400">0</span>
          <span className="text-[10px] text-gray-400">100</span>
        </div>
      </div>

      {/* Interpretatie */}
      <div
        className="rounded-2xl p-6 border-l-4"
        style={{ backgroundColor: band.bg, borderLeftColor: band.kleur }}
      >
        <p className="text-lg font-bold mb-1" style={{ color: band.kleur }}>
          {band.emoji} {band.grens} | {band.label}
        </p>
        <p className="text-sm text-darkSlate leading-relaxed mb-2">{band.beschrijving}</p>
        <p className="text-sm text-darkSlate/70 leading-relaxed mb-3">{band.kans}</p>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: band.kleur }}>
          Thema: {band.thema}
        </p>
      </div>

      {/* Analyse */}
      <div className="mt-6">
        <button
          onClick={genereerAnalyse}
          disabled={loading}
          className="w-full rounded-xl py-3 text-sm font-bold text-white transition-colors disabled:opacity-60"
          style={{ backgroundColor: band.kleur }}
        >
          {loading ? 'Analyse genereren…' : analyse ? 'Analyse opnieuw genereren' : 'Genereer mijn analyse'}
        </button>
        {(analyse || loading) && (
          <div className="mt-4">
            <AnalyseResultaat
              tekst={analyse}
              titel="Jouw draagkracht analyse"
              verbergPrintKnop
              isLoading={loading}
            />
          </div>
        )}
      </div>

      {/* PDF-knop */}
      <div className="mt-6 flex justify-end">
        <DraagkrachtTestPdfKnop scores={scores} analyse={analyse} />
      </div>

      {/* Alle banden als legenda */}
      {!alleAangeraakt && (
        <p className="text-xs text-center text-midGreen/60 mt-6">
          Beweeg de sliders om je draagkracht te meten.
        </p>
      )}

      <div className="mt-10 mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-darkSlate mb-3">Interpretatie overzicht</p>
        <div className="flex flex-col gap-3">
          {BANDEN.map((b) => (
            <div
              key={b.label}
              className="rounded-xl px-4 py-3 border-l-4 flex items-start gap-3"
              style={{
                backgroundColor: b.bg,
                borderLeftColor: b.kleur,
                opacity: band.label === b.label ? 1 : 0.5,
              }}
            >
              <span className="text-base mt-0.5">{b.emoji}</span>
              <div>
                <p className="text-xs font-bold" style={{ color: b.kleur }}>
                  {b.grens} | {b.label}
                </p>
                <p className="text-xs text-darkSlate/70 mt-0.5">Thema: {b.thema}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
