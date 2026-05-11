'use client';

// ─── GEBRUIK ──────────────────────────────────────────────────────────────────
// 1. Dupliceer dit bestand naar components/<NaamFilter>.tsx
// 2. Vul de vier arrays in: STELLINGEN, GROEI_AFFIRMATIES, STRATEGIEEN, OVERTUIGINGEN
// 3. Pas de teksten aan: filternaam, quote, scoreband-namen, AI-promptcontext
// 4. Maak app/<routenaam>/page.tsx aan (zie onderaan dit bestand)
// 5. Voeg een Link toe in app/page.tsx (Flauwekul Filter sectie)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import AnalyseResultaat from './AnalyseResultaat';
import { roepAnalyseAan, sliderBackground, kleuren as C } from '@/lib/huisstijl';

type Slider2 = { overtuigd: number; loslaten: number };

// ── DEEL 1: 15 positief geformuleerde stellingen ──────────────────────────────
const STELLINGEN: string[] = [
  // Vul hier 15 stellingen in
];

// ── GROEI-AFFIRMATIES (output in rapport, niet scoreerbaar) ───────────────────
const GROEI_AFFIRMATIES: string[] = [
  // Vul hier de groei-affirmaties in
];

// ── DEEL 2: Strategieën (max ~15, top 3 kiezen) ───────────────────────────────
const STRATEGIEEN: { label: string; toelichting: string }[] = [
  // { label: 'Naam strategie', toelichting: 'Korte omschrijving.' },
];

// ── DEEL 3: Belemmerende overtuigingen (max 25) ───────────────────────────────
const OVERTUIGINGEN: string[] = [
  // Vul hier de overtuigingen in (worden automatisch genummerd)
];

// ── SCOREBANDS ────────────────────────────────────────────────────────────────
// Pas de namen en teksten aan op het thema van het filter
function scoreband(totaal: number): string {
  const max = STELLINGEN.length * 10;
  const pct = totaal / max;
  if (pct <= 0.25) return 'Flauwekul Alarm: [tekst invullen]';
  if (pct <= 0.50) return 'Wankelende Wiebel: [tekst invullen]';
  if (pct <= 0.75) return '[Naam]: [tekst invullen]';
  return '[Naam]: [tekst invullen]';
}

// ── FILTERNAAM & QUOTE ────────────────────────────────────────────────────────
const FILTERNAAM = '[Filternaam]';
const QUOTE      = '"[Openingsquote voor de header]"';

// ── AI-CONTEXT ────────────────────────────────────────────────────────────────
// Beschrijf het thema van dit filter voor de AI-prompts
const THEMA_OVERTUIGINGEN = '[thema, bijv. geld / liefde / energie]';
const THEMA_KERNOV        = '[thema, bijv. geld / liefde / energie]';

export default function FlauwekulFilterTemplate() {
  const [d1, setD1] = useState<{ bewust: number; onbewust: number }[]>(
    STELLINGEN.map(() => ({ bewust: 5, onbewust: 5 }))
  );
  const [gekozenStrategieen, setGekozenStrategieen] = useState<string[]>([]);
  const [aangevinktOv, setAangevinktOv]             = useState<boolean[]>(OVERTUIGINGEN.map(() => false));
  const [slidersOv, setSlidersOv]                   = useState<Slider2[]>(OVERTUIGINGEN.map(() => ({ overtuigd: 50, loslaten: 50 })));
  const [kernOvertuigingen, setKernOvertuigingen]   = useState<string[]>([]);
  const [aangevinktKern, setAangevinktKern]         = useState<boolean[]>([]);
  const [slidersKern, setSlidersKern]               = useState<Slider2[]>([]);
  const [kernLoading, setKernLoading]               = useState(false);
  const [analyse, setAnalyse]                       = useState('');
  const [loading, setLoading]                       = useState(false);
  const [fout, setFout]                             = useState('');

  const totaalBewust   = d1.reduce((s, x) => s + x.bewust, 0);
  const totaalOnbewust = d1.reduce((s, x) => s + x.onbewust, 0);
  const max            = STELLINGEN.length * 10;

  const toggleStrategie = (s: string) => {
    setGekozenStrategieen((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : prev.length < 3 ? [...prev, s] : prev
    );
  };

  const genereerKernOvertuigingen = async () => {
    setKernLoading(true);
    setFout('');
    try {
      const aangevinkteLijst = OVERTUIGINGEN.filter((_, i) => aangevinktOv[i]);
      const lageStellingen = STELLINGEN
        .map((s, i) => ({ s, bewust: d1[i].bewust, onbewust: d1[i].onbewust }))
        .filter(({ bewust, onbewust }) => bewust < 4 || onbewust < 4)
        .map(({ s, bewust, onbewust }) => `"${s}" (bewust: ${bewust}, onbewust: ${onbewust})`);

      const prompt = `Op basis van deze belemmerende ${THEMA_KERNOV}overtuigingen die iemand aangevinkt heeft:
${aangevinkteLijst.join('\n')}
${lageStellingen.length > 0 ? `\nEn deze stellingen waarop laag gescoord werd (bewust of onbewust onder 4):\n${lageStellingen.join('\n')}` : ''}

Genereer 5 tot 8 NEGATIEVE existentiële kernovertuigingen in ik-vorm.
Deze gaan NIET over ${THEMA_KERNOV} maar over wie de persoon denkt te zijn.
Voorbeelden: "Ik ben niet genoeg", "Ik moet mijn plek verdienen", "Ik ben niet veilig als ik te veel ruimte inneem".
Geef alleen de kernovertuigingen, één per regel, zonder nummering of extra uitleg.`;

      const tekst = await roepAnalyseAan(prompt, 500);
      const lijst = tekst.split('\n').map((r) => r.trim()).filter(Boolean);
      setKernOvertuigingen(lijst);
      setAangevinktKern(lijst.map(() => false));
      setSlidersKern(lijst.map(() => ({ overtuigd: 50, loslaten: 50 })));
    } catch (e: unknown) {
      setFout(e instanceof Error ? e.message : 'Fout bij genereren kernovertuigingen');
    } finally {
      setKernLoading(false);
    }
  };

  const sluitSessieAf = async () => {
    setLoading(true);
    setFout('');
    try {
      const stellingenDetail = STELLINGEN.map((s, i) =>
        `  - ${s} (bewust: ${d1[i].bewust}, onbewust: ${d1[i].onbewust})`
      ).join('\n');

      const kloofStellingen = STELLINGEN
        .map((s, i) => ({ s, kloof: Math.abs(d1[i].bewust - d1[i].onbewust), bewust: d1[i].bewust, onbewust: d1[i].onbewust }))
        .filter(({ kloof }) => kloof >= 4)
        .map(({ s, bewust, onbewust }) => `  - "${s}" (bewust: ${bewust}, onbewust: ${onbewust})`);

      const gekozenKern = kernOvertuigingen
        .filter((_, i) => aangevinktKern[i])
        .map((k) => {
          const idx = kernOvertuigingen.indexOf(k);
          const slider = slidersKern[idx] ?? { overtuigd: 50, loslaten: 50 };
          return `"${k}" - overtuigd: ${slider.overtuigd}%, loslaten: ${slider.loslaten}%`;
        });

      const gekozenOv = OVERTUIGINGEN.filter((_, i) => aangevinktOv[i]).map((ov) => {
        const idx = OVERTUIGINGEN.indexOf(ov);
        return `"${ov}" - overtuigd: ${slidersOv[idx].overtuigd}%, loslaten: ${slidersOv[idx].loslaten}%`;
      });

      const prompt = `Sluit deze ${FILTERNAAM} sessie af.

## Energiemeting stellingen (deel 1)
Bewust totaal: ${totaalBewust}/${max} - ${scoreband(totaalBewust)}
Onbewust totaal: ${totaalOnbewust}/${max} - ${scoreband(totaalOnbewust)}
Totaalkloof bewust/onbewust: ${Math.abs(totaalBewust - totaalOnbewust)} punten
${kloofStellingen.length > 0 ? `Stellingen met grote kloof (verschil ≥ 4):\n${kloofStellingen.join('\n')}` : ''}

${stellingenDetail}

## Top 3 strategieën (deel 2)
${gekozenStrategieen.length > 0
  ? gekozenStrategieen.map((label, rank) => {
      const s = STRATEGIEEN.find((x) => x.label === label);
      return `${rank + 1}. ${label}: ${s?.toelichting ?? ''}`;
    }).join('\n')
  : 'geen geselecteerd'}

## Belemmerende ${THEMA_OVERTUIGINGEN}overtuigingen (deel 3)
${gekozenOv.join('\n') || 'geen aangevinkt'}

## Existentiële kernovertuigingen (deel 4)
${gekozenKern.join('\n') || 'geen aangevinkt'}

## Beschikbare groei-affirmaties (gebruik de meest passende in de afsluiting)
${GROEI_AFFIRMATIES.join('\n')}

Let specifiek op de kloof tussen bewust en onbewust: een groot verschil bij individuele stellingen of in de totaalscore duidt op blinde vlekken of innerlijk conflict dat nog niet doorgebroken is.

Schrijf een persoonlijke conclusie in het Nederlands met exact deze opmaak:

## Samenvatting
2-3 zinnen overall beeld als doorlopende tekst.

## Opvallende patronen
Gebruik voor elk patroon een ### blok:
### [Thema]
2-3 zinnen inzicht. Gebruik **vetgedrukte woorden** voor kernbegrippen.

## Groeikansen
Gebruik voor elke kans een ### blok:
### [Thema of stap]
Concrete aanbeveling in 2-3 zinnen.

## Afsluiting
Warme afsluitende alinea. Kies 3-4 affirmaties uit de beschikbare groei-affirmaties die het beste passen bij deze persoon (begin elk met ✨).`;

      const tekst = await roepAnalyseAan(prompt, 3000);
      setAnalyse(tekst);
    } catch (e: unknown) {
      setFout(e instanceof Error ? e.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="font-salmon text-3xl text-darkSlate mb-1">Flauwekul Filter: {FILTERNAAM}</h1>
        <p className="text-orange italic text-sm">{QUOTE}</p>
      </div>

      {/* DEEL 1 */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
        <h2 className="font-salmon text-xl text-darkSlate mb-1">Deel 1: Energiemeting stellingen</h2>
        <p className="text-sm text-midGreen mb-5">
          Scoor elke stelling met de biotensor: rood = bewust, groen = onbewust.{' '}
          <span className="text-darkSlate/70">0 = helemaal niet van toepassing · 10 = volledig van toepassing</span>
        </p>
        <div className="space-y-5">
          {STELLINGEN.map((stelling, i) => (
            <div key={i} className="border-b border-lightBg pb-4 last:border-0 last:pb-0">
              <p className="text-sm text-darkSlate mb-2">
                <span className="text-midGreen font-bold mr-1">{i + 1}.</span>{stelling}
              </p>
              <div className="space-y-2">
                <SliderRij
                  label="Bewust" waarde={d1[i].bewust} soort="slider-bewust" kleur="text-darkRed"
                  onChange={(v) => setD1((p) => p.map((x, idx) => idx === i ? { ...x, bewust: v } : x))}
                />
                <SliderRij
                  label="Onbewust" waarde={d1[i].onbewust} soort="slider-onbewust" kleur="text-darkGreen"
                  onChange={(v) => setD1((p) => p.map((x, idx) => idx === i ? { ...x, onbewust: v } : x))}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 xs:grid-cols-2 gap-4">
          {(['Bewust', 'Onbewust'] as const).map((soort) => {
            const totaal = soort === 'Bewust' ? totaalBewust : totaalOnbewust;
            return (
              <div key={soort} className={`rounded-xl p-4 text-center ${soort === 'Bewust' ? 'bg-darkRed/10' : 'bg-darkGreen/10'}`}>
                <div className={`text-3xl font-bold ${soort === 'Bewust' ? 'text-darkRed' : 'text-darkGreen'}`}>
                  {totaal}<span className="text-lg">/{max}</span>
                </div>
                <div className="text-xs text-darkSlate mt-1">{soort}</div>
                <div className="text-xs text-midGreen mt-1 italic">{scoreband(totaal)}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DEEL 2 */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
        <h2 className="font-salmon text-xl text-darkSlate mb-1">Deel 2: Strategieën</h2>
        <p className="text-sm text-midGreen mb-4">
          Klik via je biotensor je top 3 strategieën in volgorde.
          {gekozenStrategieen.length < 3 && (
            <span className="ml-1 text-darkSlate font-medium">Kies nr {gekozenStrategieen.length + 1}:</span>
          )}
          {gekozenStrategieen.length === 3 && (
            <span className="ml-1 text-darkGreen font-medium">Top 3 compleet ✓</span>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {STRATEGIEEN.map((s) => {
            const rank = gekozenStrategieen.indexOf(s.label) + 1;
            const actief = rank > 0;
            const vol = gekozenStrategieen.length >= 3;
            const rankKleuren = ['bg-darkRed', 'bg-orange', 'bg-midGreen'];
            return (
              <button
                key={s.label}
                onClick={() => toggleStrategie(s.label)}
                disabled={!actief && vol}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  actief
                    ? `${rankKleuren[rank - 1]} text-white border-transparent`
                    : 'border-midGreen text-midGreen hover:border-darkGreen hover:text-darkGreen'
                } ${!actief && vol ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                {actief && (
                  <span className="text-xs font-bold bg-white/30 rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {rank}
                  </span>
                )}
                {s.label}
              </button>
            );
          })}
        </div>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-midGreen hover:text-darkGreen select-none">
            Toon toelichting per strategie
          </summary>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {STRATEGIEEN.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5 text-xs leading-snug sm:grid sm:grid-cols-[160px_1fr] sm:gap-x-2">
                <span className="font-medium text-darkGreen">{s.label}</span>
                <span className="text-darkSlate/70">{s.toelichting}</span>
              </div>
            ))}
          </div>
        </details>
      </section>

      {/* DEEL 3 */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
        <h2 className="font-salmon text-xl text-darkSlate mb-1">Deel 3: Belemmerende overtuigingen</h2>
        <p className="text-sm text-midGreen mb-4">Vink aan via biotensor, score dan hoe overtuigd en hoe klaar om los te laten</p>
        <div className="space-y-3">
          {OVERTUIGINGEN.map((ov, i) => (
            <div key={i} className={`rounded-xl p-3 border transition-colors ${aangevinktOv[i] ? 'border-orange bg-lightBg2' : 'border-lightBg'}`}>
              <label htmlFor={`ov-${i}`} className="flex items-start gap-3 cursor-pointer">
                <input
                  id={`ov-${i}`}
                  type="checkbox"
                  checked={aangevinktOv[i]}
                  onChange={(e) => setAangevinktOv((p) => p.map((x, idx) => idx === i ? e.target.checked : x))}
                  className="mt-0.5 accent-orange"
                />
                <span className="text-sm text-darkSlate"><span className="text-midGreen font-bold mr-1">{i + 1}.</span>{ov}</span>
              </label>
              {aangevinktOv[i] && (
                <div className="mt-3 pl-6 space-y-2">
                  <SliderPercentage
                    label="In hoeverre geloof ik op diep niveau dat dit waar is?" waarde={slidersOv[i].overtuigd}
                    kleur="text-darkRed"
                    onChange={(v) => setSlidersOv((p) => p.map((x, idx) => idx === i ? { ...x, overtuigd: v } : x))}
                  />
                  <SliderPercentage
                    label="Hoe bereid en klaar ben ik om dit los te laten?" waarde={slidersOv[i].loslaten}
                    kleur="text-darkGreen"
                    onChange={(v) => setSlidersOv((p) => p.map((x, idx) => idx === i ? { ...x, loslaten: v } : x))}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* DEEL 4 */}
      <section className="bg-lightBg2 rounded-2xl p-6 border border-orange/30">
        <h2 className="font-salmon text-xl text-darkSlate mb-1">Deel 4: Existentiële kernovertuigingen</h2>
        <p className="text-sm text-midGreen mb-4">
          <span className="font-semibold">Genereer existentiële kernovertuigingen op basis van jouw aangevinkte overtuigingen.</span>{' '}
          <span className="italic">Dit zijn de diepste stemmen over wie jij bent en wat jij verdient.</span>
        </p>
        <button
          onClick={genereerKernOvertuigingen}
          disabled={kernLoading || aangevinktOv.every((x) => !x)}
          className="px-6 py-2 rounded-xl bg-orange text-white font-salmon hover:bg-orange/80 transition-colors disabled:bg-darkSlate/30 disabled:text-darkSlate/50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
        >
          {kernLoading ? 'Genereren…' : 'Genereer kernovertuigingen'}
        </button>
        {!kernLoading && aangevinktOv.every((x) => !x) && (
          <p className="text-xs text-darkSlate/60 mt-2">Vink eerst overtuigingen aan in deel 3.</p>
        )}
        {kernOvertuigingen.length > 0 && (
          <div className="mt-5 space-y-3">
            {kernOvertuigingen.map((k, i) => (
              <div key={i} className={`rounded-xl p-3 border transition-colors ${aangevinktKern[i] ? 'border-orange bg-white' : 'border-lightBg bg-white'}`}>
                <label htmlFor={`kern-${i}`} className="flex items-start gap-3 cursor-pointer">
                  <input
                    id={`kern-${i}`}
                    type="checkbox"
                    checked={aangevinktKern[i]}
                    onChange={(e) => setAangevinktKern((p) => p.map((x, idx) => idx === i ? e.target.checked : x))}
                    className="mt-0.5 accent-orange"
                  />
                  <span className="text-sm text-darkSlate italic">{k}</span>
                </label>
                {aangevinktKern[i] && (
                  <div className="mt-3 pl-6 space-y-2">
                    <SliderPercentage
                      label="In hoeverre geloof ik op diep niveau dat dit waar is?" waarde={slidersKern[i].overtuigd}
                      kleur="text-darkRed"
                      onChange={(v) => setSlidersKern((p) => p.map((x, idx) => idx === i ? { ...x, overtuigd: v } : x))}
                    />
                    <SliderPercentage
                      label="Hoe bereid en klaar ben ik om dit los te laten?" waarde={slidersKern[i].loslaten}
                      kleur="text-darkGreen"
                      onChange={(v) => setSlidersKern((p) => p.map((x, idx) => idx === i ? { ...x, loslaten: v } : x))}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={sluitSessieAf}
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-darkGreen text-cream font-salmon text-lg hover:bg-darkGreen/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Bezig…' : 'Maak mijn analyse'}
        </button>
        {fout && <p className="text-darkRed text-sm">{fout}</p>}
      </div>

      {analyse && <AnalyseResultaat tekst={analyse} />}
    </div>
  );
}

function SliderRij({ label, waarde, soort, kleur, onChange }: {
  label: string; waarde: number; soort: string; kleur: string; onChange: (v: number) => void;
}) {
  const trackColor = soort === 'slider-onbewust' ? C.darkGreen : C.darkRed;
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs w-16 ${kleur}`}>{label}</span>
      <input
        type="range" min={0} max={10} step={1} value={waarde}
        aria-label={label}
        className={`flex-1 ${soort}`}
        style={{ background: sliderBackground(waarde, 10, trackColor) }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className={`text-xs font-bold w-4 text-right ${kleur}`}>{waarde}</span>
    </div>
  );
}

function SliderPercentage({ label, waarde, kleur, onChange }: {
  label: string; waarde: number; kleur: string; onChange: (v: number) => void;
}) {
  const isLoslaten = kleur.includes('Green');
  const trackColor = isLoslaten ? C.darkGreen : C.darkRed;
  const ankerLinks  = isLoslaten ? 'ik houd mezelf nog tegen' : 'helemaal niet';
  const ankerRechts = isLoslaten ? 'ik ben er klaar voor'     : 'zit diep verankerd';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-midGreen">
        <span>{label}</span>
        <span className={`font-bold ${kleur}`}>{waarde}%</span>
      </div>
      <input
        type="range" min={0} max={100} step={5} value={waarde}
        aria-label={label}
        className={`w-full ${isLoslaten ? 'slider-onbewust' : 'slider-bewust'}`}
        style={{ background: sliderBackground(waarde, 100, trackColor) }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-[10px] text-darkSlate/50 mt-0.5">
        <span>{ankerLinks}</span>
        <span>{ankerRechts}</span>
      </div>
    </div>
  );
}

// ── PAGINA (kopieer naar app/<routenaam>/page.tsx) ────────────────────────────
//
// import FlauwekulFilterTemplate from '@/components/FlauwekulFilterTemplate';
//
// export const metadata = { title: 'Flauwekul Filter: [Naam] · Energieke Lieke' };
//
// export default function Page() {
//   return <FlauwekulFilterTemplate />;
// }
