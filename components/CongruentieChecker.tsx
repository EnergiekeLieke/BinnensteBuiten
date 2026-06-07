'use client';

import { useState, useRef, useEffect } from 'react';
import { LEVENSGEBIEDEN, kleuren, sliderBackground, streamAnalyse, vervangMDashes } from '@/lib/huisstijl';
import AnalyseResultaat from './AnalyseResultaat';
import { CongruentieCheckerPdfKnop } from './CongruentieCheckerPdf';

type OvertuigingData = { overtuigd: number; loslaten: number };
type OvertuigingState = Record<string, Record<number, OvertuigingData | null>>;

const ALGEMENE_OVERTUIGINGEN_HOOG = [
  'Zo goed ben ik (nog) niet.',
  'Ik moet nog meer leren voordat ik dit kan.',
  'Het telt pas als het perfect is.',
  'Wat ik doe is eigenlijk heel normaal.',
  'Straks val ik door de mand.',
  'Ik vertrouw mijn gevoel niet helemaal.',
  'Als ik dit erken, moet ik er ook naar leven.',
];

const VRAGEN = [
  {
    id: 'zeg_doe',
    tekst: 'Ik zeg wat ik doe.',
    toelichting: 'Je deelt je intenties en plannen, in plaats van ze voor jezelf te houden.',
    overtuigingenLaag: [
      'Ik hoef dit niet uit te spreken, dat spreekt voor zich.',
      'Als ik het uitspreek, ben ik tot last.',
      'Eerst doen, dan pas zeggen.',
      'Wat ik wil of nodig heb is niet zo belangrijk.',
      'Als ik het uitspreek, moet ik het ook waarmaken.',
    ],
    overtuigingenHoogSpecifiek: [
      'Ik spreek me niet zo goed uit.',
      'Ik ben daar niet duidelijk genoeg in.',
    ],
  },
  {
    id: 'doe_zeg',
    tekst: 'Ik doe wat ik zeg.',
    toelichting: 'Je zet een eerste stap in de richting van wat je hebt uitgesproken.',
    overtuigingenLaag: [
      'Ik weet niet of ik het kan waarmaken.',
      'Straks stel ik iemand teleur.',
      'Ik heb er geen energie of tijd voor.',
      'Het moet perfect, anders heeft het geen zin.',
      'Anderen zijn belangrijker dan ik.',
      'Ik voel niet wat ik écht wil.',
    ],
    overtuigingenHoogSpecifiek: [
      'Ik maak dingen niet af.',
      'Ik ben niet consequent.',
    ],
  },
  {
    id: 'laat_zien',
    tekst: 'Ik laat zien dat ik heb gedaan wat ik heb gezegd.',
    toelichting: 'Je geeft jezelf erkenning voor wat je gedaan hebt en maakt het zichtbaar.',
    overtuigingenLaag: [
      'Het is opschepperig om dit te delen.',
      'Straks vinden mensen er iets van.',
      'Het is niet goed genoeg om te laten zien.',
      'Dit is toch normaal?',
      'Ik hoef geen aandacht.',
      'Als ik zichtbaar ben, ben ik kwetsbaar.',
    ],
    overtuigingenHoogSpecifiek: [
      'Ik ben niet zichtbaar genoeg.',
      'Ik deel te weinig.',
    ],
  },
];

function hoogLijst(vraag: typeof VRAGEN[0]) {
  return [...ALGEMENE_OVERTUIGINGEN_HOOG, ...vraag.overtuigingenHoogSpecifiek];
}

type Scores = Record<string, { bewust: number; onbewust: number }>;
type Modus = 'bewust' | 'onbewust' | 'beide';

const BEGIN_SCORES: Scores = Object.fromEntries(
  VRAGEN.map((v) => [v.id, { bewust: 5, onbewust: 5 }])
);

const MODUS_OPTIES: { id: Modus; label: string }[] = [
  { id: 'beide',    label: 'Bewust én onbewust' },
  { id: 'bewust',   label: 'Alleen bewust' },
  { id: 'onbewust', label: 'Alleen onbewust' },
];

function OvertuigingenBlok({
  teksten,
  label,
  state,
  onToggle,
  onWaarde,
}: {
  teksten: string[];
  label: string;
  state: Record<number, OvertuigingData | null>;
  onToggle: (idx: number) => void;
  onWaarde: (idx: number, type: 'overtuigd' | 'loslaten', waarde: number) => void;
}) {
  return (
    <div className="mt-1 pt-4 border-t border-lightBg">
      <p className="text-xs font-semibold text-darkSlate mb-3">
        {label}{' '}
        <span className="font-normal text-darkSlate/50">(test met biotensor)</span>
      </p>
      <div className="flex flex-col gap-3">
        {teksten.map((tekst, idx) => {
          const data = state[idx] ?? null;
          const aangevinkt = data !== null;
          return (
            <div key={idx}>
              <button
                onClick={() => onToggle(idx)}
                className="flex items-start gap-2 text-left w-full group"
              >
                <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  aangevinkt
                    ? 'bg-darkGreen border-darkGreen'
                    : 'bg-white border-lightBg group-hover:border-midGreen'
                }`}>
                  {aangevinkt && <span className="text-cream text-[10px] leading-none">✓</span>}
                </span>
                <span className="text-xs text-darkSlate leading-relaxed">"{tekst}"</span>
              </button>

              {aangevinkt && (
                <div className="ml-6 mt-2 flex flex-col gap-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs text-darkSlate/60">% overtuigd</label>
                      <span className="text-xs font-bold text-darkRed">{data.overtuigd}%</span>
                    </div>
                    <input
                      type="range" min={0} max={100} value={data.overtuigd}
                      onChange={(e) => onWaarde(idx, 'overtuigd', Number(e.target.value))}
                      className="slider-bewust w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ background: sliderBackground(data.overtuigd, 100, kleuren.darkRed) }}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs text-darkSlate/60">% bereid tot loslaten</label>
                      <span className="text-xs font-bold text-midGreen">{data.loslaten}%</span>
                    </div>
                    <input
                      type="range" min={0} max={100} value={data.loslaten}
                      onChange={(e) => onWaarde(idx, 'loslaten', Number(e.target.value))}
                      className="slider-onbewust w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ background: sliderBackground(data.loslaten, 100, kleuren.midGreen) }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CongruentieChecker() {
  const [geselecteerdeGebieden, setGeselecteerdeGebieden] = useState<string[]>([]);
  const [modus, setModus] = useState<Modus>('beide');
  const [scores, setScores] = useState<Scores>(BEGIN_SCORES);
  const [ovtLaag, setOvtLaag] = useState<OvertuigingState>({});
  const [ovtHoog, setOvtHoog] = useState<OvertuigingState>({});
  const [stap, setStap] = useState<0 | 1>(0);
  const [analyse, setAnalyse] = useState('');
  const [loading, setLoading] = useState(false);
  const [fout, setFout] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  function toggleGebied(gebied: string) {
    setGeselecteerdeGebieden((prev) =>
      prev.includes(gebied) ? prev.filter((g) => g !== gebied) : [...prev, gebied]
    );
  }

  function setScore(vraagId: string, type: 'bewust' | 'onbewust', waarde: number) {
    setScores((prev) => ({ ...prev, [vraagId]: { ...prev[vraagId], [type]: waarde } }));
  }

  function toggleLaag(vraagId: string, idx: number) {
    setOvtLaag((prev) => {
      const huidig = (prev[vraagId] ?? {})[idx] ?? null;
      return { ...prev, [vraagId]: { ...(prev[vraagId] ?? {}), [idx]: huidig ? null : { overtuigd: 50, loslaten: 50 } } };
    });
  }

  function setWaardeLaag(vraagId: string, idx: number, type: 'overtuigd' | 'loslaten', waarde: number) {
    setOvtLaag((prev) => ({
      ...prev,
      [vraagId]: { ...prev[vraagId], [idx]: { ...prev[vraagId][idx]!, [type]: waarde } },
    }));
  }

  function toggleHoog(vraagId: string, idx: number) {
    setOvtHoog((prev) => {
      const huidig = (prev[vraagId] ?? {})[idx] ?? null;
      return { ...prev, [vraagId]: { ...(prev[vraagId] ?? {}), [idx]: huidig ? null : { overtuigd: 50, loslaten: 50 } } };
    });
  }

  function setWaardeHoog(vraagId: string, idx: number, type: 'overtuigd' | 'loslaten', waarde: number) {
    setOvtHoog((prev) => ({
      ...prev,
      [vraagId]: { ...prev[vraagId], [idx]: { ...prev[vraagId][idx]!, [type]: waarde } },
    }));
  }

  function toonLaagVoor(vraagId: string) {
    return (modus === 'onbewust' || modus === 'beide') && scores[vraagId].onbewust <= 5;
  }

  function toonHoogVoor(vraagId: string) {
    return modus === 'beide' && scores[vraagId].onbewust >= 6 && scores[vraagId].bewust <= 5;
  }

  function bouwAangevinkt() {
    return VRAGEN
      .map((v) => {
        const laagItems = Object.entries(ovtLaag[v.id] ?? {})
          .filter(([, d]) => d !== null)
          .map(([idx, d]) => ({ tekst: v.overtuigingenLaag[Number(idx)], overtuigd: d!.overtuigd, loslaten: d!.loslaten }));
        const hoogItems = Object.entries(ovtHoog[v.id] ?? {})
          .filter(([, d]) => d !== null)
          .map(([idx, d]) => ({ tekst: hoogLijst(v)[Number(idx)], overtuigd: d!.overtuigd, loslaten: d!.loslaten }));
        const items = [...laagItems, ...hoogItems];
        return items.length > 0 ? { vraagTekst: v.tekst, items } : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }

  async function analyseer() {
    setLoading(true);
    setFout('');
    setAnalyse('');
    setStap(1);

    const gebiedTekst = geselecteerdeGebieden.length
      ? geselecteerdeGebieden.join(', ')
      : 'niet opgegeven';

    const enkeleScores = (type: 'bewust' | 'onbewust') =>
      VRAGEN.map((v) => `- "${v.tekst}": ${scores[v.id][type]}/10`).join('\n');

    const enkeleSorted = (type: 'bewust' | 'onbewust') => {
      const data = VRAGEN.map((v) => ({ ...v, waarde: scores[v.id][type] }));
      return {
        laagste: data.reduce((a, b) => a.waarde < b.waarde ? a : b),
        hoogste: data.reduce((a, b) => a.waarde > b.waarde ? a : b),
      };
    };

    let prompt = `Schrijf in correct Nederlands: grammaticaal juist, correcte spelling, correcte woordkeuze en geen anglicismen.

Iemand heeft de Congruentie Checker ingevuld. Congruentie gaat over de mate waarin woorden, daden en zichtbaarheid op één lijn staan.

Levensgebied(en): ${gebiedTekst}
`;

    const toltekSection = `
## Tolteekse inzichten als spiegel
Koppel de scores aan de vier akkoorden van Don Miguel Ruiz:
- "Ik zeg wat ik doe" raakt aan: Wees onberispelijk met je woorden / Ga niet uit van aannames
- "Ik doe wat ik zeg" raakt aan: Doe altijd je best
- "Ik laat zien dat ik heb gedaan wat ik heb gezegd" raakt aan: Vat niets persoonlijk op (zichtbaar zijn zonder angst voor oordeel)
Welk akkoord spreekt het meest tot de scores van deze persoon, en waarom? Maak het concreet. 3-4 zinnen.

## Reflectievragen
Geef 2-3 rake reflectievragen die direct aansluiten bij de scores en eventuele overtuigingen. Begin elke vraag op een nieuwe regel met "→".

## Jouw gedragsexperiment
Geef één klein, concreet en haalbaar experiment voor de komende week. Iets wat de persoon morgen al kan beginnen. Begin met: "Probeer deze week:"`;

    if (modus === 'beide') {
      const vraagRegels = VRAGEN.map((v) => {
        const s = scores[v.id];
        const gap = s.bewust - s.onbewust;
        return `- "${v.tekst}": bewust ${s.bewust}/10, onbewust ${s.onbewust}/10, gap: ${gap >= 0 ? '+' : ''}${gap}`;
      }).join('\n');
      const gapData = VRAGEN.map((v) => ({ ...v, gap: scores[v.id].bewust - scores[v.id].onbewust }));
      const grootsteGap = gapData.reduce((a, b) => Math.abs(a.gap) > Math.abs(b.gap) ? a : b);
      const gemiddeldes = VRAGEN.map((v) => ({ ...v, gem: (scores[v.id].bewust + scores[v.id].onbewust) / 2 }));
      const laagste = gemiddeldes.reduce((a, b) => a.gem < b.gem ? a : b);
      const hoogste = gemiddeldes.reduce((a, b) => a.gem > b.gem ? a : b);
      const gapRichting = grootsteGap.gap > 0
        ? `Bewust hoger dan onbewust: "Ik dénk dat ik het doe, maar diep vanbinnen klopt het nog niet."`
        : grootsteGap.gap < 0
        ? `Onbewust hoger dan bewust: "Ik doe het al, maar ben me er nog niet van bewust."`
        : 'Er is geen significant verschil.';

      prompt += `
Scores (0-10, bewust en onbewust):
${vraagRegels}

Analyse-context:
- Grootste gap: "${grootsteGap.tekst}" (gap: ${grootsteGap.gap >= 0 ? '+' : ''}${grootsteGap.gap}), ${gapRichting}
- Laagste gemiddelde: "${laagste.tekst}" (${laagste.gem.toFixed(1)}/10), grootste groeipotentie
- Hoogste gemiddelde: "${hoogste.tekst}" (${hoogste.gem.toFixed(1)}/10), bestaande kracht

Schrijf een warme, persoonlijke analyse. Gebruik "je" (niet "jij" of "u"). Geen m-dash. Gebruik dubbele punt in subkoppen.

## Waar zit het grootste verschil?
Bespreek de grootste gap en wat dat zegt over het patroon van de persoon. Gebruik de gap-richting hierboven als vertrekpunt. 2-3 zinnen.

## De plek met de meeste groeipotentie
Bespreek de laagste gemiddelde score en wat dat concreet betekent in het dagelijks leven. Geef een herkenbaar voorbeeld. 2-3 zinnen.

## Jouw kracht als hulpbron
Bespreek de hoogste gemiddelde score als bestaande kracht. Hoe kan deze kracht worden ingezet op de andere gebieden? 2-3 zinnen.
${toltekSection}`;

    } else {
      const type = modus;
      const label = type === 'bewust' ? 'bewuste' : 'onbewuste';
      const { laagste, hoogste } = enkeleSorted(type);

      prompt += `
Scores (${label}, 0-10):
${enkeleScores(type)}

Analyse-context:
- Laagste ${label} score: "${laagste.tekst}" (${laagste.waarde}/10), grootste groeipotentie
- Hoogste ${label} score: "${hoogste.tekst}" (${hoogste.waarde}/10), bestaande kracht

Schrijf een warme, persoonlijke analyse. Gebruik "je" (niet "jij" of "u"). Geen m-dash. Gebruik dubbele punt in subkoppen.

## Wat vertellen je ${label} scores?
Geef een eerste duiding van het beeld dat de scores laten zien. Welk patroon valt op? 2-3 zinnen.

## De plek met de meeste groeipotentie
Bespreek de laagste score en wat dat concreet betekent in het dagelijks leven. Geef een herkenbaar voorbeeld. 2-3 zinnen.

## Jouw kracht als hulpbron
Bespreek de hoogste score als bestaande kracht. Hoe kan deze kracht worden ingezet op de andere gebieden? 2-3 zinnen.
${toltekSection}`;
    }

    const laagAangevinkt = VRAGEN
      .map((v) => {
        const items = Object.entries(ovtLaag[v.id] ?? {})
          .filter(([, d]) => d !== null)
          .map(([idx, d]) => ({ tekst: v.overtuigingenLaag[Number(idx)], overtuigd: d!.overtuigd, loslaten: d!.loslaten }));
        return items.length > 0 ? { vraag: v.tekst, items } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (laagAangevinkt.length > 0) {
      prompt += `\n\nBelemmerende overtuigingen (getest met biotensor, lage onbewuste score):`;
      laagAangevinkt.forEach((item) => {
        prompt += `\nBij "${item.vraag}":`;
        item.items.forEach((o) => {
          prompt += `\n  - "${o.tekst}" (overtuigd: ${o.overtuigd}%, bereid tot loslaten: ${o.loslaten}%)`;
        });
      });
    }

    const hoogAangevinkt = VRAGEN
      .map((v) => {
        const lijst = hoogLijst(v);
        const items = Object.entries(ovtHoog[v.id] ?? {})
          .filter(([, d]) => d !== null)
          .map(([idx, d]) => ({ tekst: lijst[Number(idx)], overtuigd: d!.overtuigd, loslaten: d!.loslaten }));
        return items.length > 0 ? { vraag: v.tekst, items } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (hoogAangevinkt.length > 0) {
      prompt += `\n\nBelemmerende overtuigingen (getest met biotensor, hoog onbewust maar laag bewust — dit patroon wijst op een blinde vlek: de persoon doet het al meer dan ze zelf denken, maar herkent het niet):`;
      hoogAangevinkt.forEach((item) => {
        prompt += `\nBij "${item.vraag}":`;
        item.items.forEach((o) => {
          prompt += `\n  - "${o.tekst}" (overtuigd: ${o.overtuigd}%, bereid tot loslaten: ${o.loslaten}%)`;
        });
      });
    }

    if (laagAangevinkt.length > 0 || hoogAangevinkt.length > 0) {
      prompt += `\n\nVerwerk deze overtuigingen in de analyse. Let op de verhouding: hoog overtuigd + laag bereid tot loslaten = meer weerstand, hoog bereid tot loslaten = openheid voor verandering. Bespreek dit in de bestaande secties, niet als apart kopje.`;
    }

    try {
      abortRef.current = new AbortController();
      let acc = '';
      await streamAnalyse(prompt, 2000, (chunk) => {
        acc += chunk;
        setAnalyse(acc);
      }, undefined, abortRef.current.signal);
      setAnalyse(vervangMDashes(acc));
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setFout('De analyse kon niet worden geladen. Probeer het opnieuw.');
        setStap(0);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">Congruentie Checker</h1>
        <p className="text-sm text-darkSlate/70 leading-relaxed">
          Hoe goed kloppen jouw woorden, daden en zichtbaarheid met elkaar? Meet je congruentie met de biotensor en ontdek waar de grootste ruimte voor groei zit.
        </p>
      </div>

      {stap === 0 && (
        <>
          <div className="mb-8">
            <p className="text-sm font-semibold text-darkSlate mb-2">
              Over welk levensgebied?{' '}
              <span className="font-normal text-darkSlate/50">(optioneel)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {LEVENSGEBIEDEN.map((gebied) => {
                const actief = geselecteerdeGebieden.includes(gebied);
                return (
                  <button
                    key={gebied}
                    onClick={() => toggleGebied(gebied)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      actief
                        ? 'bg-darkGreen text-cream border-darkGreen'
                        : 'bg-white border-lightBg text-darkSlate hover:border-midGreen'
                    }`}
                  >
                    {gebied}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm font-semibold text-darkSlate mb-2">Hoe wil je scoren?</p>
            <div className="flex gap-2 flex-wrap">
              {MODUS_OPTIES.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setModus(opt.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    modus === opt.id
                      ? 'bg-darkGreen text-cream border-darkGreen'
                      : 'bg-white border-lightBg text-darkSlate hover:border-midGreen'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5 mb-8">
            {VRAGEN.map((vraag) => {
              const s = scores[vraag.id];
              const gap = s.bewust - s.onbewust;
              return (
                <div key={vraag.id} className="bg-white rounded-2xl p-5 shadow">
                  <p className="font-semibold text-sm text-darkSlate mb-1">"{vraag.tekst}"</p>
                  <p className="text-xs text-darkSlate/50 leading-relaxed mb-4">{vraag.toelichting}</p>

                  <div className="flex flex-col gap-4">
                    {(modus === 'bewust' || modus === 'beide') && (
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-xs text-darkSlate/60">Bewust</label>
                          <span className="text-sm font-bold text-darkRed">{s.bewust}</span>
                        </div>
                        <input
                          type="range" min={0} max={10} value={s.bewust}
                          onChange={(e) => setScore(vraag.id, 'bewust', Number(e.target.value))}
                          className="slider-bewust w-full h-2 rounded-full appearance-none cursor-pointer"
                          style={{ background: sliderBackground(s.bewust, 10, kleuren.darkRed) }}
                        />
                      </div>
                    )}

                    {(modus === 'onbewust' || modus === 'beide') && (
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-xs text-darkSlate/60">Onbewust</label>
                          <span className="text-sm font-bold text-midGreen">{s.onbewust}</span>
                        </div>
                        <input
                          type="range" min={0} max={10} value={s.onbewust}
                          onChange={(e) => setScore(vraag.id, 'onbewust', Number(e.target.value))}
                          className="slider-onbewust w-full h-2 rounded-full appearance-none cursor-pointer"
                          style={{ background: sliderBackground(s.onbewust, 10, kleuren.midGreen) }}
                        />
                      </div>
                    )}

                    {modus === 'beide' && gap !== 0 && (
                      <p className={`text-xs italic leading-relaxed ${Math.abs(gap) >= 3 ? 'text-orange' : 'text-darkSlate/40'}`}>
                        {gap > 0
                          ? `Bewust hoger (+${gap}): je denkt het te doen, maar vanbinnen klopt het nog niet helemaal.`
                          : `Onbewust hoger (${gap}): je doet het al meer dan je denkt.`
                        }
                      </p>
                    )}

                    {toonLaagVoor(vraag.id) && (
                      <OvertuigingenBlok
                        teksten={vraag.overtuigingenLaag}
                        label="Welke overtuiging speelt er?"
                        state={ovtLaag[vraag.id] ?? {}}
                        onToggle={(idx) => toggleLaag(vraag.id, idx)}
                        onWaarde={(idx, type, waarde) => setWaardeLaag(vraag.id, idx, type, waarde)}
                      />
                    )}

                    {toonHoogVoor(vraag.id) && (
                      <OvertuigingenBlok
                        teksten={hoogLijst(vraag)}
                        label="Wat houdt je tegen om te erkennen wat er onbewust al is?"
                        state={ovtHoog[vraag.id] ?? {}}
                        onToggle={(idx) => toggleHoog(vraag.id, idx)}
                        onWaarde={(idx, type, waarde) => setWaardeHoog(vraag.id, idx, type, waarde)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {fout && <p className="text-sm text-darkRed mb-4">{fout}</p>}

          <button
            onClick={analyseer}
            className="w-full py-3 rounded-xl bg-darkGreen text-cream text-sm font-semibold hover:bg-darkGreen/80 transition-colors"
          >
            Analyseer mijn congruentie →
          </button>
        </>
      )}

      {stap === 1 && (
        <>
          <button
            onClick={() => { setStap(0); abortRef.current?.abort(); }}
            className="text-sm text-midGreen hover:text-darkGreen mb-6 inline-flex items-center gap-1 transition-colors"
          >
            ← Pas scores aan
          </button>
          <AnalyseResultaat
            tekst={analyse}
            titel="Congruentie Checker"
            isLoading={loading}
            verbergPrintKnop
          />
          {!loading && analyse && (
            <div className="mt-4">
              <CongruentieCheckerPdfKnop
                geselecteerdeGebieden={geselecteerdeGebieden}
                scoreRegels={VRAGEN.map((v) => ({ tekst: v.tekst, ...scores[v.id] }))}
                analyse={analyse}
                modus={modus}
                aangevinktOvertuigingen={bouwAangevinkt()}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
