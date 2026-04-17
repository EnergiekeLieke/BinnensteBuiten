'use client';

import { useState } from 'react';
import SpinnenWeb from './SpinnenWeb';
import AnalyseResultaat from './AnalyseResultaat';
import { roepAnalyseAan, exporteerAlsPdf } from '@/lib/huisstijl';

const CATEGORIEEN = [
  {
    naam: 'Financiën & geldstroom',
    focuspunten: ['Omzet & inkomsten', 'Prijsstelling', 'Geld ontvangen', 'Overzicht over cijfers'],
  },
  {
    naam: 'Administratie & structuur',
    focuspunten: ['Boekhouding', 'Agenda en planning', 'Systemen en processen', 'Rust in hoofd'],
  },
  {
    naam: 'Zichtbaarheid & marketing',
    focuspunten: ['Online zichtbaarheid', 'Nieuwsbrief/socials', 'Jezelf laten zien', 'Consistentie'],
  },
  {
    naam: 'Klantstroom & klantcontact',
    focuspunten: ['Nieuwe klanten', 'Verbinding bestaande klanten', 'Vertrouwen aanbod', 'Doorstroom'],
  },
  {
    naam: 'Aanbod & creatie',
    focuspunten: ['Klopt aanbod nog?', 'Creativiteit', 'Vernieuwing', 'Afstemming (ziels)missie'],
  },
  {
    naam: 'Energie & vitaliteit',
    focuspunten: ['Werk-energie', 'Balans werk/privé', 'Overprikkeling', 'Plezier in ondernemen'],
  },
  {
    naam: 'Mindset & zelfvertrouwen',
    focuspunten: ['Impostergevoelens', 'Geldwaardigheid', 'Durven groeien', 'Innerlijke rust'],
  },
  {
    naam: 'Intuïtie & afstemming',
    focuspunten: ['Luisteren intuïtie', 'Werken volgens energie', 'Beslissingen vanuit gevoel', 'Vertrouwen signalen'],
  },
  {
    naam: 'Tijd & focus',
    focuspunten: ['Juiste dingen?', 'Uitstelgedrag', 'Focus', 'Groei vs brandjes blussen'],
  },
  {
    naam: 'Plezier & vervulling',
    focuspunten: ['Blij van worden?', 'Lichtheid', 'Flow', 'Zingeving'],
  },
  {
    naam: 'Persoonlijke groei als ondernemer',
    focuspunten: ['Ontwikkeling', 'Nieuwe skills', 'Schaduwwerk', 'Comfortzone'],
  },
  {
    naam: 'Missie & impact',
    focuspunten: ['Visie en (ziels)missie?', 'Impact maken?', 'Bijdragen op eigen manier?'],
  },
] as const;

const BONUS_ITEMS = [
  'Oké met niet-weten',
  'Niet alles controleren',
  'Durven experimenteren',
  'Onzekerheid dragen',
  'Vertrouwen op timing',
  'Flow vs forceren',
];

const WHAT_WHY_HOW_WHEN = [
  { id: 'what', label: 'Versterken van je WHAT?', vraag: 'Wat wil je echt? Wat is jouw diepste verlangen als ondernemer?' },
  { id: 'why',  label: 'Versterken van je WHY?',  vraag: 'Waarom is jouw intentie en missie belangrijk? Wat drijft jou echt?' },
  { id: 'when', label: 'Loslaten van WHEN?',      vraag: 'Hoe kun je de timing meer overlaten aan het proces in plaats van te forceren?' },
  { id: 'how',  label: 'Loslaten van HOW?',       vraag: 'Hoe vertrouw je meer op het proces en laat je los hoe het moet gaan?' },
] as const;

type CatScore = { bewust: number; onbewust: number; focuspunten: boolean[] };
type BonusScore = { bewust: number; onbewust: number; focuspunten: boolean[]; activeFocus: string[] };

const initCat = (): CatScore[] =>
  CATEGORIEEN.map((c) => ({ bewust: 5, onbewust: 5, focuspunten: c.focuspunten.map(() => false) }));

const initBonus = (): BonusScore => ({ bewust: 5, onbewust: 5, focuspunten: BONUS_ITEMS.map(() => false), activeFocus: [] });

export default function BusinessScan() {
  const [scores, setScores]         = useState<CatScore[]>(initCat);
  const [bonus, setBonus]           = useState<BonusScore>(initBonus);
  const [analyse, setAnalyse]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [fout, setFout]             = useState('');

  const updateScore = (i: number, soort: 'bewust' | 'onbewust', v: number) =>
    setScores((p) => p.map((x, idx) => idx === i ? { ...x, [soort]: v } : x));

  const toggleFocus = (catIdx: number, fpIdx: number) =>
    setScores((p) =>
      p.map((x, idx) =>
        idx === catIdx
          ? { ...x, focuspunten: x.focuspunten.map((f, fi) => fi === fpIdx ? !f : f) }
          : x
      )
    );

  const patroon = (b: number, o: number) =>
    b > o + 1 ? 'bewust_hoger' : o > b + 1 ? 'onbewust_hoger' : b <= 4 ? 'laag_beiden' : 'sterk_gebied';

  const analyseer = async () => {
    setLoading(true);
    setFout('');
    try {
      const regels = CATEGORIEEN.map((c, i) => {
        const fp = c.focuspunten.filter((_, fi) => scores[i].focuspunten[fi]).join(', ');
        return `- ${c.naam}: bewust ${scores[i].bewust}/10, onbewust ${scores[i].onbewust}/10 [${patroon(scores[i].bewust, scores[i].onbewust)}]${fp ? ` | focuspunten: ${fp}` : ''}`;
      }).join('\n');

      const bonusFp = BONUS_ITEMS.filter((_, i) => bonus.focuspunten[i]).join(', ');

      const prompt = `Analyseer deze Business Scan:

${regels}
- Vertrouwen & overgave (bonus): bewust ${bonus.bewust}/10, onbewust ${bonus.onbewust}/10${bonusFp ? ` | focuspunten: ${bonusFp}` : ''}

Schaal: 0 = gaat voor geen meter · 10 = gaat perfect en moeiteloos

Schrijf een persoonlijke analyse in het Nederlands met:
## Samenvatting
(3-4 zinnen overall beeld van het bedrijf)

## Sterktes
(2-3 categorieën die goed gaan + inzicht per sterkte)

## Aandachtsgebieden
(categorieën met bewust_hoger / onbewust_hoger / laag_beiden — uitleg wat dat betekent + tip)

## Groeikansen
(per kans: concrete tip + tip voor tijd, geld of energie)

## Het ONE THING
(het meest impactvolle gebied om NU op te focussen — motiveer waarom)

## Afsluiting
(warme, bemoedigende zin)`;

      const tekst = await roepAnalyseAan(prompt, 3000);
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
      const html = `
        <h2>Business Scan scores</h2>
        <table>
          <tr><th>Categorie</th><th>Bewust</th><th>Onbewust</th><th>Focuspunten</th></tr>
          ${CATEGORIEEN.map((c, i) => {
            const fp = c.focuspunten.filter((_, fi) => scores[i].focuspunten[fi]).join(', ');
            return `<tr><td>${c.naam}</td><td><span class="score-badge bewust">${scores[i].bewust}</span></td><td><span class="score-badge onbewust">${scores[i].onbewust}</span></td><td>${fp || '—'}</td></tr>`;
          }).join('')}
          <tr><td>Vertrouwen & overgave</td><td><span class="score-badge bewust">${bonus.bewust}</span></td><td><span class="score-badge onbewust">${bonus.onbewust}</span></td><td>${BONUS_ITEMS.filter((_, i) => bonus.focuspunten[i]).join(', ') || '—'}</td></tr>
        </table>
        <h2>AI-Analyse</h2>
        <div class="analyse-block">${analyse.replace(/\n/g, '<br>')}</div>`;
      await exporteerAlsPdf(html, 'Business Scan');
    } catch (e: unknown) {
      setFout(e instanceof Error ? e.message : 'PDF export mislukt');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">Business Scan</h1>
        <p className="text-midGreen text-sm mb-4">Scoor elk gebied van <span className="font-medium">0</span> (gaat voor geen meter) tot <span className="font-medium">10</span> (gaat perfect en moeiteloos) — en voel wat er echt speelt.</p>
      </div>

      <div className="bg-lightBg2 rounded-2xl p-5 border border-lightBg text-sm text-darkSlate space-y-2 leading-relaxed">
        <p><span className="font-medium text-darkRed">Bewust (rood):</span> het cijfer dat je bewust geeft — wat je denkt en redeneert over dit gebied.</p>
        <p><span className="font-medium text-darkGreen">Onbewust (groen):</span> het cijfer dat vanuit je onderbuik of lichaam komt — wat je echt voelt, los van wat je denkt te moeten vinden.</p>
        <p className="text-darkSlate/60 text-xs">Tip: geef eerst je bewuste score, en test daarna met de biotensor welk cijfer vanuit je onderbewustzijn opkomt.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {CATEGORIEEN.map((cat, i) => (
            <div key={cat.naam} className="bg-white rounded-xl p-4 shadow-sm border border-lightBg">
              <h3 className="font-salmon text-base text-darkSlate mb-3">{i + 1}. {cat.naam}</h3>
              <div className="space-y-2 mb-3">
                <SliderRijBusiness
                  label="Bewust" waarde={scores[i].bewust} soort="slider-bewust" kleur="text-darkRed"
                  onChange={(v) => updateScore(i, 'bewust', v)}
                />
                <SliderRijBusiness
                  label="Onbewust" waarde={scores[i].onbewust} soort="slider-onbewust" kleur="text-darkGreen"
                  onChange={(v) => updateScore(i, 'onbewust', v)}
                />
              </div>
              <div>
                <p className="text-xs text-darkSlate/60 mb-1.5">
                  <span className="font-medium text-orange">Focus:</span> Waar mag jouw aandacht naar toe om dit gebied te versterken of te behouden?
                </p>
                <div className="flex flex-wrap gap-2">
                {cat.focuspunten.map((fp, fi) => (
                  <button
                    key={fp}
                    onClick={() => toggleFocus(i, fi)}
                    className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                      scores[i].focuspunten[fi]
                        ? 'bg-orange text-white border-orange'
                        : 'border-lightBg text-midGreen hover:border-orange'
                    }`}
                  >
                    {fp}
                  </button>
                ))}
                </div>
              </div>
            </div>
          ))}

          {/* Bonus */}
          <div className="bg-orange/10 rounded-xl p-4 border border-orange/30">
            <h3 className="font-salmon text-base text-orange mb-3">Bonus — Vertrouwen & overgave</h3>
            <div className="space-y-2 mb-4">
              <SliderRijBusiness
                label="Bewust" waarde={bonus.bewust} soort="slider-bewust" kleur="text-darkRed"
                onChange={(v) => setBonus((b) => ({ ...b, bewust: v }))}
              />
              <SliderRijBusiness
                label="Onbewust" waarde={bonus.onbewust} soort="slider-onbewust" kleur="text-darkGreen"
                onChange={(v) => setBonus((b) => ({ ...b, onbewust: v }))}
              />
            </div>

            <p className="text-xs text-darkSlate/60 mb-1.5">
              <span className="font-medium text-orange">Focus:</span> Waar mag jouw aandacht naar toe om dit gebied te versterken of te behouden?
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {BONUS_ITEMS.map((item, i) => (
                <button
                  key={item}
                  onClick={() => setBonus((b) => ({ ...b, focuspunten: b.focuspunten.map((f, fi) => fi === i ? !f : f) }))}
                  className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                    bonus.focuspunten[i] ? 'bg-orange text-white border-orange' : 'border-orange/40 text-orange hover:border-orange'
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
                <button
                  key={item.id}
                  onClick={() => setBonus((b) => ({ ...b, activeFocus: b.activeFocus.includes(item.id) ? b.activeFocus.filter((x) => x !== item.id) : [...b.activeFocus, item.id] }))}
                  className={`text-xs px-3 py-2 rounded-lg border text-left transition-colors ${
                    bonus.activeFocus.includes(item.id)
                      ? 'bg-darkSlate text-cream border-darkSlate'
                      : 'border-darkSlate/30 text-darkSlate hover:border-darkSlate'
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
              labels={CATEGORIEEN.map((c) => c.naam.split(' ')[0])}
              bewustScores={scores.map((s) => s.bewust)}
              onbewustScores={scores.map((s) => s.onbewust)}
              size={260}
            />
          </div>
          <button
            onClick={analyseer}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-darkGreen text-cream font-salmon text-lg hover:bg-darkGreen/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Analyseren…' : 'Analyseer mijn business'}
          </button>
          {fout && <p className="text-darkRed text-sm text-center">{fout}</p>}
        </div>
      </div>

      {analyse && (
        <AnalyseResultaat tekst={analyse} onExportPdf={exportPdf} exportLoading={pdfLoading} />
      )}
    </div>
  );
}

function SliderRijBusiness({ label, waarde, soort, kleur, onChange }: {
  label: string; waarde: number; soort: string; kleur: string; onChange: (v: number) => void;
}) {
  const trackColor = soort === 'slider-onbewust' ? '#3b5633' : '#9e3816';
  const pct = `${waarde * 10}%`;
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs w-16 ${kleur}`}>{label}</span>
      <input
        type="range" min={0} max={10} step={1} value={waarde}
        className={`flex-1 ${soort}`}
        style={{ background: `linear-gradient(to right, ${trackColor} 0%, ${trackColor} ${pct}, #fde8d0 ${pct}, #fde8d0 100%)` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className={`text-xs font-bold w-4 text-right ${kleur}`}>{waarde}</span>
    </div>
  );
}
