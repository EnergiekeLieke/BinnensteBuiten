'use client';

import { useState } from 'react';
import SpinnenWeb from './SpinnenWeb';
import AnalyseResultaat from './AnalyseResultaat';
import { roepAnalyseAan } from '@/lib/huisstijl';

const CATEGORIEEN_DETAIL = [
  {
    naam: 'Financiën & geldstroom',
    subonderdelen: ['Omzet & inkomsten', 'Prijsstelling', 'Geld ontvangen', 'Overzicht over cijfers'],
  },
  {
    naam: 'Administratie & structuur',
    subonderdelen: ['Boekhouding', 'Agenda en planning', 'Systemen en processen', 'Rust in hoofd'],
  },
  {
    naam: 'Zichtbaarheid & marketing',
    subonderdelen: ['Online zichtbaarheid', 'Nieuwsbrief/socials', 'Jezelf laten zien', 'Consistentie'],
  },
  {
    naam: 'Klantstroom & klantcontact',
    subonderdelen: ['Nieuwe klanten', 'Verbinding bestaande klanten', 'Vertrouwen aanbod', 'Doorstroom'],
  },
  {
    naam: 'Aanbod & creatie',
    subonderdelen: ['Klopt aanbod nog?', 'Creativiteit', 'Vernieuwing', 'Afstemming (ziels)missie'],
  },
  {
    naam: 'Energie & vitaliteit',
    subonderdelen: ['Werk-energie', 'Balans werk/privé', 'Overprikkeling', 'Plezier in ondernemen'],
  },
  {
    naam: 'Mindset & zelfvertrouwen',
    subonderdelen: ['Impostergevoelens', 'Geldwaardigheid', 'Durven groeien', 'Innerlijke rust'],
  },
  {
    naam: 'Intuïtie & afstemming',
    subonderdelen: ['Luisteren intuïtie', 'Werken volgens energie', 'Beslissingen vanuit gevoel', 'Vertrouwen signalen'],
  },
  {
    naam: 'Tijd & focus',
    subonderdelen: ['Juiste dingen?', 'Uitstelgedrag', 'Focus', 'Groei vs brandjes blussen'],
  },
  {
    naam: 'Plezier & vervulling',
    subonderdelen: ['Blij van worden?', 'Lichtheid', 'Flow', 'Zingeving'],
  },
  {
    naam: 'Persoonlijke groei als ondernemer',
    subonderdelen: ['Ontwikkeling', 'Nieuwe skills', 'Schaduwwerk', 'Comfortzone'],
  },
  {
    naam: 'Missie & impact',
    subonderdelen: ['Visie en (ziels)missie?', 'Impact maken?', 'Bijdragen op eigen manier?'],
  },
] as const;

const BONUS_ITEMS = [
  'Oké met niet-weten', 'Niet alles controleren', 'Durven experimenteren',
  'Onzekerheid dragen', 'Vertrouwen op timing', 'Flow vs forceren',
];

const WHAT_WHY_HOW_WHEN = [
  { id: 'what', label: 'Versterken van je WHAT?', vraag: 'Wat wil je echt? Wat is jouw diepste verlangen als ondernemer?' },
  { id: 'why',  label: 'Versterken van je WHY?',  vraag: 'Waarom is jouw intentie en missie belangrijk? Wat drijft jou echt?' },
  { id: 'when', label: 'Loslaten van WHEN?',      vraag: 'Hoe kun je de timing meer overlaten aan het proces in plaats van te forceren?' },
  { id: 'how',  label: 'Loslaten van HOW?',       vraag: 'Hoe vertrouw je meer op het proces en laat je los hoe het moet gaan?' },
] as const;

type SubScore = { bewust: number; onbewust: number };
type CatData  = { open: boolean; sub: SubScore[]; focuspunten: boolean[] };
type BonusData = { bewust: number; onbewust: number; focuspunten: boolean[]; activeFocus: string[] };

const gem = (arr: SubScore[], soort: 'bewust' | 'onbewust') =>
  arr.length ? Math.round((arr.reduce((s, x) => s + x[soort], 0) / arr.length) * 10) / 10 : 0;

export default function BusinessScanDetailed() {
  const [cats, setCats] = useState<CatData[]>(() =>
    CATEGORIEEN_DETAIL.map((c) => ({
      open: false,
      sub: c.subonderdelen.map(() => ({ bewust: 5, onbewust: 5 })),
      focuspunten: c.subonderdelen.map(() => false),
    }))
  );

  const [bonus, setBonus] = useState<BonusData>({
    bewust: 5, onbewust: 5,
    focuspunten: BONUS_ITEMS.map(() => false),
    activeFocus: [],
  });

  const [analyse, setAnalyse]       = useState('');
  const [loading, setLoading] = useState(false);
  const [fout, setFout]       = useState('');

  const toggleCat = (i: number) =>
    setCats((p) => p.map((c, idx) => idx === i ? { ...c, open: !c.open } : c));

  const updateSub = (ci: number, si: number, soort: 'bewust' | 'onbewust', v: number) =>
    setCats((p) =>
      p.map((c, idx) =>
        idx === ci ? { ...c, sub: c.sub.map((s, si2) => si2 === si ? { ...s, [soort]: v } : s) } : c
      )
    );

  const toggleFocus = (ci: number, fi: number) =>
    setCats((p) =>
      p.map((c, idx) =>
        idx === ci ? { ...c, focuspunten: c.focuspunten.map((f, fii) => fii === fi ? !f : f) } : c
      )
    );

  const analyseer = async () => {
    setLoading(true);
    setFout('');
    try {
      const regels = CATEGORIEEN_DETAIL.map((c, i) => {
        const gB = gem(cats[i].sub, 'bewust');
        const gO = gem(cats[i].sub, 'onbewust');
        const subs = c.subonderdelen.map((s, si) =>
          `  · ${s}: bewust ${cats[i].sub[si].bewust}, onbewust ${cats[i].sub[si].onbewust}${cats[i].focuspunten[si] ? ' [focus]' : ''}`
        ).join('\n');
        return `### ${c.naam} (gem. bewust: ${gB}, gem. onbewust: ${gO})\n${subs}`;
      }).join('\n\n');

      const prompt = `Analyseer deze gedetailleerde Business Scan:

${regels}

Bonus — Vertrouwen & overgave: bewust ${bonus.bewust}/10, onbewust ${bonus.onbewust}/10

Schrijf een DIEPGAANDE persoonlijke analyse in het Nederlands met exact deze opmaak:

## Samenvatting
3-4 zinnen overall beeld als doorlopende tekst.

## Opvallende patronen
Gebruik voor elk aandachtsgebied een ### blok:
### [Categorie › Subonderdeel] — [Bewust hoger / Onbewust hoger / Laag in beide]
Uitleg van het patroon + concrete tip. Gebruik **vetgedrukte woorden** voor kernbegrippen.

## Groeikansen
Gebruik voor elke kans een ### blok:
### [Categorie › Subonderdeel]
Concrete actie + tip voor tijd, geld of energie in 2-3 zinnen.

## Het ONE THING
Beschrijf in 2-3 alinea's het meest impactvolle subonderdeel om NU op te focussen. Leg uit waarom dit ene ding als een domino de andere knelpunten ontsluit. Sluit af met een warme, bemoedigende zin.`;

      const tekst = await roepAnalyseAan(prompt, 4000);
      setAnalyse(tekst);
    } catch (e: unknown) {
      setFout(e instanceof Error ? e.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  };

  const catBewust   = cats.map((c) => gem(c.sub, 'bewust'));
  const catOnbewust = cats.map((c) => gem(c.sub, 'onbewust'));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">Business Scan Gedetailleerd</h1>
        <p className="text-midGreen text-sm">Per subonderdeel scoren voor diepgaand inzicht in jouw onderneming</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {CATEGORIEEN_DETAIL.map((cat, i) => {
            const gB = gem(cats[i].sub, 'bewust');
            const gO = gem(cats[i].sub, 'onbewust');
            return (
              <div key={cat.naam} className="bg-white rounded-xl shadow-sm border border-lightBg overflow-hidden">
                <button
                  onClick={() => toggleCat(i)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-lightBg2 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-midGreen text-xs w-5">{i + 1}.</span>
                    <span className="font-salmon text-darkSlate text-base">{cat.naam}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-darkRed font-bold">B:{gB}</span>
                    <span className="text-xs text-darkGreen font-bold">O:{gO}</span>
                    <span className="text-midGreen text-sm">{cats[i].open ? '▲' : '▼'}</span>
                  </div>
                </button>

                {cats[i].open && (
                  <div className="px-4 pb-4 border-t border-lightBg">
                    <div className="space-y-4 mt-3">
                      {cat.subonderdelen.map((sub, si) => (
                        <div key={sub} className="rounded-lg p-3 border border-lightBg">
                          <span className="text-sm font-medium text-darkSlate block mb-2">{sub}</span>
                          <div className="space-y-2">
                            <MiniSlider
                              label="Bewust" waarde={cats[i].sub[si].bewust} soort="slider-bewust" kleur="text-darkRed"
                              onChange={(v) => updateSub(i, si, 'bewust', v)}
                            />
                            <MiniSlider
                              label="Onbewust" waarde={cats[i].sub[si].onbewust} soort="slider-onbewust" kleur="text-darkGreen"
                              onChange={(v) => updateSub(i, si, 'onbewust', v)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-darkSlate/60 mb-1.5">
                        <span className="font-medium text-orange">Focus:</span> Waar mag jouw aandacht naar toe om dit gebied te versterken of te behouden?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cat.subonderdelen.map((sub, si) => (
                          <button
                            key={sub}
                            onClick={() => toggleFocus(i, si)}
                            className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                              cats[i].focuspunten[si] ? 'bg-orange text-white border-orange' : 'border-lightBg text-midGreen hover:border-orange'
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bonus */}
          <div className="bg-orange/10 rounded-xl p-4 border border-orange/30">
            <h3 className="font-salmon text-base text-orange mb-3">Bonus — Vertrouwen & overgave</h3>
            <div className="space-y-2 mb-4">
              <MiniSlider label="Bewust" waarde={bonus.bewust} soort="slider-bewust" kleur="text-darkRed" emptyColor="#d4a87a"
                onChange={(v) => setBonus((b) => ({ ...b, bewust: v }))} />
              <MiniSlider label="Onbewust" waarde={bonus.onbewust} soort="slider-onbewust" kleur="text-darkGreen" emptyColor="#d4a87a"
                onChange={(v) => setBonus((b) => ({ ...b, onbewust: v }))} />
            </div>

            <p className="text-xs text-darkSlate/60 mb-1.5">
              <span className="font-medium text-orange">Focus:</span> Waar mag jouw aandacht naar toe om dit gebied te versterken of te behouden?
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {BONUS_ITEMS.map((item, i) => (
                <button key={item}
                  onClick={() => setBonus((b) => ({ ...b, focuspunten: b.focuspunten.map((f, fi) => fi === i ? !f : f) }))}
                  className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                    bonus.focuspunten[i] ? 'bg-orange text-white border-orange' : 'border-orange/40 text-orange'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <p className="text-xs text-darkSlate/60 mb-2">
              <span className="font-medium text-orange">Verdieping:</span> Meet met je biotensor wat je te versterken en/of loslaten hebt.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {WHAT_WHY_HOW_WHEN.map((item) => (
                <button key={item.id}
                  onClick={() => setBonus((b) => ({ ...b, activeFocus: b.activeFocus.includes(item.id) ? b.activeFocus.filter((x) => x !== item.id) : [...b.activeFocus, item.id] }))}
                  className={`text-xs px-3 py-2 rounded-lg border text-left transition-colors ${
                    bonus.activeFocus.includes(item.id) ? 'bg-darkSlate text-cream border-darkSlate' : 'border-darkSlate/30 text-darkSlate hover:border-darkSlate'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {bonus.activeFocus.length > 0 && (
              <div className="mt-3 space-y-2">
                {WHAT_WHY_HOW_WHEN.filter((x) => bonus.activeFocus.includes(x.id)).map((x) => (
                  <div key={x.id} className="bg-white rounded-lg p-3 border border-darkSlate/20">
                    <p className="text-xs font-medium text-darkSlate mb-0.5">{x.label}</p>
                    <p className="text-sm text-darkSlate/70 italic">{x.vraag}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky zijkant */}
        <div className="flex flex-col items-center gap-6 sticky top-8 self-start">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-lightBg w-full flex justify-center">
            <SpinnenWeb
              labels={CATEGORIEEN_DETAIL.map((c) => c.naam.split(' ')[0])}
              bewustScores={catBewust}
              onbewustScores={catOnbewust}
              size={260}
            />
          </div>
          <button
            onClick={analyseer}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-darkGreen text-cream font-salmon text-lg hover:bg-darkGreen/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Analyseren…' : 'Diepgaande analyse'}
          </button>
          {fout && <p className="text-darkRed text-sm text-center">{fout}</p>}
        </div>
      </div>

      {analyse && (
        <AnalyseResultaat tekst={analyse} />
      )}
    </div>
  );
}

function MiniSlider({ label, waarde, soort, kleur, onChange, emptyColor = '#fde8d0' }: {
  label: string; waarde: number; soort: string; kleur: string; onChange: (v: number) => void; emptyColor?: string;
}) {
  const trackColor = soort === 'slider-onbewust' ? '#3b5633' : '#9e3816';
  const pct = `${waarde * 10}%`;
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs w-16 ${kleur}`}>{label}</span>
      <input
        type="range" min={0} max={10} step={1} value={waarde}
        className={`flex-1 ${soort}`}
        style={{ background: `linear-gradient(to right, ${trackColor} 0%, ${trackColor} ${pct}, ${emptyColor} ${pct}, ${emptyColor} 100%)` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className={`text-xs font-bold w-4 text-right ${kleur}`}>{waarde}</span>
    </div>
  );
}
