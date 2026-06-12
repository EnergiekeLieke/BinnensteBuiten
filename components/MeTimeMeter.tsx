'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { kleuren, sliderBackground, streamAnalyse, vervangMDashes } from '@/lib/huisstijl';
import AnalyseResultaat from './AnalyseResultaat';

const MeTimeMeterPdfKnop = dynamic(
  () => import('./MeTimeMeterPdf').then((m) => m.MeTimeMeterPdfKnop),
  { ssr: false }
);

const STELLINGEN = [
  { links: 'Ik maak geen tijd voor mezelf vrij in mijn agenda, het gebeurt alleen als er toevallig ruimte overblijft.', rechts: 'Ik plan bewust tijd voor mezelf in mijn agenda.' },
  { links: 'Zodra het druk wordt, is mijn me-time het eerste dat ik laat schieten.', rechts: 'Ik houd me aan mijn me-time, ook als het druk wordt.' },
  { links: 'Als ik tijd voor mezelf neem, voel ik me schuldig.', rechts: 'Ik neem zonder schuldgevoel tijd voor mezelf.' },
  { links: 'Ik merk vaak te laat dat ik aan rust toe ben, pas als ik al overprikkeld of uitgeput ben.', rechts: 'Ik herken op tijd dat ik rust nodig heb.' },
  { links: 'Ik laat de behoeften van anderen altijd voorgaan, mijn eigen behoeften komen op de laatste plek.', rechts: 'Ik zet mijn eigen behoeften net zo serieus als die van anderen.' },
  { links: 'Ik schrap als eerste mijn me-time wanneer mijn agenda volloopt.', rechts: 'Ik blijf mijn me-time prioriteit geven, ook wanneer mijn agenda volloopt.' },
  { links: 'Ik heb geen idee wat mij écht oplaadt, of ik weet het wel maar doe het bijna nooit.', rechts: 'Ik weet wat mij écht oplaadt (en doe dat ook).' },
  { links: 'Hele dagen gaan voorbij zonder dat ik ook maar één moment van rust heb genomen.', rechts: 'Ik neem dagelijks kleine momenten van rust.' },
  { links: 'Ik voel me vaak opgejaagd of leeg.', rechts: 'Ik voel me ontspannen en energiek gedurende de dag.' },
  { links: 'Ik vind tijd voor mezelf nemen iets dat eigenlijk niet mag, of waar ik over twijfel.', rechts: 'Ik gun mezelf zonder twijfel tijd voor mezelf.' },
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
    label: 'Overlevingsstand',
    kleur: '#9e3816',
    bg: '#fdf0ec',
    grens: '0 – 40',
    emoji: '🔴',
    beschrijving: 'Me-time verdwijnt zodra het druk wordt.',
    kans: 'Grote kans op uitputting.',
    thema: 'Grenzen & zelfwaarde',
  },
  {
    label: 'Bewust maar inconsistent',
    kleur: '#d56119',
    bg: '#fdf5ed',
    grens: '40 – 70',
    emoji: '🟠',
    beschrijving: 'Je weet dat je me-time nodig hebt, maar doet het niet altijd.',
    kans: 'Kans op terugval zodra je agenda volloopt.',
    thema: 'Keuzes maken & prioriteit geven',
  },
  {
    label: 'Zelfzorg in balans',
    kleur: '#3b5633',
    bg: '#eef3ec',
    grens: '70 – 100',
    emoji: '🟢',
    beschrijving: 'Je bewaakt je energie goed.',
    kans: 'Een stevige basis om verder te verdiepen.',
    thema: 'Verdieping & verfijning',
  },
];

function getBand(score: number): Band {
  if (score < 40) return BANDEN[0];
  if (score < 70) return BANDEN[1];
  return BANDEN[2];
}

export default function MeTimeMeter() {
  const [scores, setScores] = useState<number[]>(Array(STELLINGEN.length).fill(5));
  const [aangeraakt, setAangeraakt] = useState<boolean[]>(Array(STELLINGEN.length).fill(false));
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

    const scorelijst = STELLINGEN
      .map((s, i) => `- ${scores[i]}/10 richting "${s.rechts}" (0 zou zijn: "${s.links}")`)
      .join('\n');
    const laagste = STELLINGEN
      .map((s, i) => ({ s, score: scores[i] }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((x) => `- ${x.score}/10 richting "${x.s.rechts}" (0 zou zijn: "${x.s.links}")`)
      .join('\n');

    const prompt = `
Dit zijn de scores van een Me-time Meter (0-10 per stelling, maximale totaalscore: 100). Elke stelling is een spectrum: 0 staat voor de uitputtende of grenzeloze kant, 10 voor de zelfzorgvolle kant.

${scorelijst}

Totaalscore: ${totaal}/100 (${band.label})

De drie stellingen die het dichtst bij de uitputtende kant liggen:
${laagste}

Schrijf een persoonlijke analyse in drie onderdelen:

## Wat opvalt
Beschrijf in 2-3 zinnen wat het patroon in de scores zegt over hoe deze persoon met me-time omgaat. Wees concreet en persoonlijk, niet algemeen.

## Groeikans
Kies het gebied waar de meeste winst te behalen valt (op basis van de stellingen die het dichtst bij de uitputtende kant liggen). Benoem waarom juist dit gebied aandacht vraagt. Schrijf 2-3 zinnen.

## Gedragsexperiment
Geef één concreet, klein en haalbaar gedragsexperiment dat past bij de groeikans. Beschrijf het zo specifiek dat de persoon het morgen al kan uitproberen. Geen algemeen advies, maar een concrete actie. Formuleer het als een uitnodiging, niet als een opdracht.
`.trim();

    const system = `Schrijf in correct Nederlands: grammaticaal juist, correcte spelling, correcte woordkeuze en geen anglicismen.
Je bent een empathische coach die mensen helpt zien hoeveel ruimte ze voor zichzelf maken en bewaken. Je toon is warm, direct en niet betuttelend. Geen m-dashes gebruiken. Begin zinnen niet met "En".`;

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
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">Me-time Meter</h1>
        <p className="text-sm text-midGreen leading-relaxed">
          Schuif de slider naar de kant die het meest bij jou past, vanuit je onderbewustzijn. Meet de scores per stelling met je biotensor.
        </p>
      </div>

      <div className="flex flex-col gap-6 mb-10">
        {STELLINGEN.map((stelling, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-darkRed/5 rounded-xl p-4 border-l-4 border-darkRed">
                <div className="text-[10px] font-bold text-darkRed uppercase tracking-widest mb-2">Patroon · 0</div>
                <p className="text-sm text-darkSlate leading-relaxed italic">{stelling.links}</p>
              </div>
              <div className="bg-darkGreen/5 rounded-xl p-4 border-l-4 border-darkGreen">
                <div className="text-[10px] font-bold text-darkGreen uppercase tracking-widest mb-2">Kracht · 10</div>
                <p className="text-sm text-darkSlate leading-relaxed italic">{stelling.rechts}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-darkRed">⬅️ patroon</span>
                <span className="font-bold text-midGreen text-lg">{scores[i]}</span>
                <span className="text-darkGreen">kracht ➡️</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={scores[i]}
                aria-label={`Score voor stelling ${i + 1}`}
                onChange={(e) => setScore(i, Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer slider-onbewust"
                style={{ background: sliderBackground(scores[i], 10, kleuren.darkGreen) }}
              />
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
              titel="Jouw me-time analyse"
              verbergPrintKnop
              isLoading={loading}
            />
          </div>
        )}
      </div>

      {/* PDF-knop */}
      <div className="mt-6 flex justify-end">
        <MeTimeMeterPdfKnop scores={scores} analyse={analyse} />
      </div>

      {/* Alle banden als legenda */}
      {!alleAangeraakt && (
        <p className="text-xs text-center text-midGreen/60 mt-6">
          Beweeg de sliders om je me-time te meten.
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
