'use client';

import { useState } from 'react';
import AnalyseResultaat from './AnalyseResultaat';
import { roepAnalyseAan } from '@/lib/huisstijl';

const STELLINGEN = [
  'Ik voel me helemaal op mijn gemak bij het idee om veel geld te verdienen.',
  'Geld mag moeiteloos naar me toe stromen, zonder er keihard voor te hoeven werken.',
  'Rijk zijn past bij wie ik ben en bij de bijdrage die ik lever.',
  'Geld verdienen met wat ik leuk vind voelt eerlijk, natuurlijk en in lijn met mijn missie.',
  'Ik kan met gemak geld ontvangen en behouden.',
  'Ontvangen (geld, complimenten, hulp) voelt veilig en natuurlijk.',
  'Ik gun mezelf meer geld, overvloed en financiële rust.',
  'Ik geloof dat geld mensen juist versterkt in wie ze echt zijn.',
  'Ik vertrouw erop dat succes hand in hand kan gaan met liefde, rust en verbinding.',
  'Ik voel me slim, bekwaam en zakelijk genoeg om financieel te groeien.',
  'Ik weet dat er overvloed genoeg is voor iedereen.',
  'Ik voel me vrij om mijn geld alleen te dragen voor mezelf. Ik hoef niemand te redden.',
  'Ik vertrouw erop dat ik altijd genoeg heb.',
  'Sparen voelt als een liefdevolle keuze voor mijn toekomst.',
  'Ik ga bewust en met plezier om met mijn geld.',
];

const STRATEGIEEN: { label: string; toelichting: string }[] = [
  { label: 'Bewaren',                    toelichting: 'Geld oppotten uit angst dat het op raakt, ook als er genoeg is.' },
  { label: 'Hamsteren',                  toelichting: 'Meer bewaren dan nodig vanuit een diep schaarstegevoel.' },
  { label: 'Controleren',               toelichting: 'Alles tot achter de komma bijhouden om een gevoel van veiligheid te creëren.' },
  { label: 'Schaamte verbergen',        toelichting: 'Je financiële situatie verbergen voor anderen uit schaamte of schuldgevoel.' },
  { label: 'Geld vermijden',            toelichting: 'Rekeningen niet openen, bankapp mijden — geld liever niet onder ogen zien.' },
  { label: 'Alles zelf doen',           toelichting: 'Geen hulp inhuren om kosten te besparen, ook als het jou energie kost.' },
  { label: 'Uiten in spullen',          toelichting: 'Emoties of spanning omzetten in aankopen — retail therapy als ventiel.' },
  { label: 'Geld verdienen als bewijs', toelichting: 'Geld gebruiken als bewijs van je waarde, succes of goed genoeg zijn.' },
  { label: 'Geven zonder grenzen',      toelichting: 'Geld weggeven aan anderen zonder op je eigen behoeften te letten.' },
  { label: 'Investeren zonder voelen',  toelichting: 'Impulsief investeren of uitgeven zonder je gevoel te checken.' },
  { label: 'Onderhandelen vermijden',   toelichting: 'Prijzen stilzwijgend accepteren — onderhandelen voelt ongemakkelijk of onwaardig.' },
  { label: 'Wachten op toestemming',    toelichting: 'Pas uitgeven of investeren als iemand anders zegt dat het mag of kan.' },
  { label: 'Kleine stapjes blijven doen', toelichting: 'Voorzichtigheid als bescherming — nooit een grote stap durven zetten.' },
  { label: 'Behoefte onderdrukken',     toelichting: 'Eigen wensen wegdrukken om te besparen, ook als de behoefte reëel is.' },
  { label: 'Geld romantiseren',         toelichting: 'Dromen en fantaseren over financiële vrijheid zonder concreet actie te nemen.' },
];

const OVERTUIGINGEN = [
  'Geld groeit niet aan bomen',
  'Je moet hard werken voor je geld',
  'Rijke mensen zijn niet spiritueel',
  'Geld is de oorzaak van alle problemen',
  'Ik ben niet goed met geld',
  'Geld is er nooit wanneer ik het nodig heb',
  'Ik ben het niet waard om veel geld te hebben',
  'Als ik geld verdien met wat ik leuk vind telt het niet',
  'Geld verdienen mag geen plezier zijn',
  'Geld gaat altijd snel weer weg',
  'Ik moet eerst geven dan mag ik ontvangen',
  'Anderen hebben meer recht op geld',
  'Ik kan niet omgaan met geld dus hoef het ook niet',
  'Geld maakt hebberig',
  'Als ik veel geld heb verlies ik mensen',
  'Ik moet sparen want het is nooit zeker',
  'Het is verkeerd te verlangen naar meer geld',
  'Ik ben niet slim genoeg om rijk te worden',
  'Als ik succesvol ben krijg ik meer kritiek',
  'Geld maakt mij verantwoordelijk voor anderen',
];

type Slider2 = { overtuigd: number; loslaten: number };

function scoreband(totaal: number): string {
  if (totaal <= 40)  return 'Er stroomt nog weinig energie. Tijd om blokkades te helen.';
  if (totaal <= 80)  return 'Je bent onderweg. Oude overtuigingen mogen loslaten.';
  if (totaal <= 120) return 'Mooie transformatie van schaarste naar overvloed.';
  return 'Geldenergie stroomt vrij!';
}

export default function GeldGedoe() {
  // Deel 1
  const [d1, setD1] = useState<{ bewust: number; onbewust: number }[]>(
    STELLINGEN.map(() => ({ bewust: 5, onbewust: 5 }))
  );

  // Deel 2
  const [gekozenStrategieen, setGekozenStrategieen] = useState<string[]>([]);

  // Deel 3
  const [aangevinktOv, setAangevinktOv]   = useState<boolean[]>(OVERTUIGINGEN.map(() => false));
  const [slidersOv, setSlidersOv]         = useState<Slider2[]>(OVERTUIGINGEN.map(() => ({ overtuigd: 50, loslaten: 50 })));

  // Deel 4
  const [kernOvertuigingen, setKernOvertuigingen] = useState<string[]>([]);
  const [aangevinktKern, setAangevinktKern]       = useState<boolean[]>([]);
  const [slidersKern, setSlidersKern]             = useState<Slider2[]>([]);
  const [kernLoading, setKernLoading]             = useState(false);

  const [analyse, setAnalyse]       = useState('');
  const [loading, setLoading] = useState(false);
  const [fout, setFout]       = useState('');

  const totaalBewust   = d1.reduce((s, x) => s + x.bewust, 0);
  const totaalOnbewust = d1.reduce((s, x) => s + x.onbewust, 0);

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
      const prompt = `Op basis van deze belemmerende geldovertuigingen die iemand aangevinkt heeft:
${aangevinkteLijst.join('\n')}

Genereer 5 tot 8 NEGATIEVE existentiële kernovertuigingen in ik-vorm.
Deze gaan NIET over geld maar over wie de persoon denkt te zijn.
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
      const gekozenKern = kernOvertuigingen
        .filter((_, i) => aangevinktKern[i])
        .map((k) => {
          const idx = kernOvertuigingen.indexOf(k);
          return `"${k}" — overtuigd: ${slidersKern[idx]?.overtuigd ?? 50}%, loslaten: ${slidersKern[idx]?.loslaten ?? 50}%`;
        });

      const gekozenGeldOv = OVERTUIGINGEN.filter((_, i) => aangevinktOv[i]).map((ov) => {
        const idx = OVERTUIGINGEN.indexOf(ov);
        return `"${ov}" — overtuigd: ${slidersOv[idx].overtuigd}%, loslaten: ${slidersOv[idx].loslaten}%`;
      });

      const prompt = `Sluit deze Geld Gedoe sessie af.

## Geldenergie scores (deel 1)
Bewust totaal: ${totaalBewust}/150 — ${scoreband(totaalBewust)}
Onbewust totaal: ${totaalOnbewust}/150 — ${scoreband(totaalOnbewust)}

## Top 3 geldstrategieën (deel 2)
${gekozenStrategieen.join(', ') || 'geen geselecteerd'}

## Belemmerende geldovertuigingen (deel 3)
${gekozenGeldOv.join('\n') || 'geen aangevinkt'}

## Existentiële kernovertuigingen (deel 4)
${gekozenKern.join('\n') || 'geen aangevinkt'}

Schrijf een persoonlijke conclusie in het Nederlands met exact deze opmaak:

## Samenvatting
2-3 zinnen overall beeld als doorlopende tekst.

## Opvallende patronen
Gebruik voor elk patroon een ### blok:
### [Thema, bijv. "Geldenergie", "Overtuiging: [naam]"]
2-3 zinnen inzicht. Gebruik **vetgedrukte woorden** voor kernbegrippen.

## Groeikansen
Gebruik voor elke kans een ### blok:
### [Thema of stap]
Concrete aanbeveling in 2-3 zinnen.

## Afsluiting
Warme afsluitende alinea met 2-3 affirmaties (begin elk met ✨).`;

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
        <h1 className="font-salmon text-3xl text-darkSlate mb-1">Flauwekul Filter: Geld Gedoe</h1>
        <p className="text-orange italic text-sm">"Geld maakt niet gelukkig. Maar gelukkig is er geld!"</p>
      </div>

      {/* DEEL 1 */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
        <h2 className="font-salmon text-xl text-darkSlate mb-1">Deel 1 — Energiemeting stellingen</h2>
        <p className="text-sm text-midGreen mb-5">Scoor elke stelling: rood = bewust, groen = onbewust (0–10)</p>
        <div className="space-y-5">
          {STELLINGEN.map((stelling, i) => (
            <div key={i} className="border-b border-lightBg pb-4 last:border-0 last:pb-0">
              <p className="text-sm text-darkSlate mb-2"><span className="text-midGreen font-bold mr-1">{i + 1}.</span>{stelling}</p>
              <div className="space-y-2">
                <SliderRijGeld
                  label="Bewust" waarde={d1[i].bewust} soort="slider-bewust" kleur="text-darkRed"
                  onChange={(v) => setD1((p) => p.map((x, idx) => idx === i ? { ...x, bewust: v } : x))}
                />
                <SliderRijGeld
                  label="Onbewust" waarde={d1[i].onbewust} soort="slider-onbewust" kleur="text-darkGreen"
                  onChange={(v) => setD1((p) => p.map((x, idx) => idx === i ? { ...x, onbewust: v } : x))}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {(['Bewust', 'Onbewust'] as const).map((soort) => {
            const totaal = soort === 'Bewust' ? totaalBewust : totaalOnbewust;
            return (
              <div key={soort} className={`rounded-xl p-4 text-center ${soort === 'Bewust' ? 'bg-darkRed/10' : 'bg-darkGreen/10'}`}>
                <div className={`text-3xl font-bold ${soort === 'Bewust' ? 'text-darkRed' : 'text-darkGreen'}`}>{totaal}<span className="text-lg">/150</span></div>
                <div className="text-xs text-darkSlate mt-1">{soort}</div>
                <div className="text-xs text-midGreen mt-1 italic">{scoreband(totaal)}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DEEL 2 */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
        <h2 className="font-salmon text-xl text-darkSlate mb-1">Deel 2 — Geldstrategieën</h2>
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

        {/* Legenda */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-midGreen hover:text-darkGreen select-none">
            Toon toelichting per strategie
          </summary>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {STRATEGIEEN.map((s) => (
              <div key={s.label} className="grid grid-cols-[160px_1fr] gap-x-2 text-xs leading-snug">
                <span className="font-medium text-darkGreen">{s.label}</span>
                <span className="text-darkSlate/70">{s.toelichting}</span>
              </div>
            ))}
          </div>
        </details>
      </section>

      {/* DEEL 3 */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
        <h2 className="font-salmon text-xl text-darkSlate mb-1">Deel 3 — Belemmerende overtuigingen</h2>
        <p className="text-sm text-midGreen mb-4">Vink aan via biotensor, score dan hoe overtuigd en hoe klaar om los te laten</p>
        <div className="space-y-3">
          {OVERTUIGINGEN.map((ov, i) => (
            <div key={i} className={`rounded-xl p-3 border transition-colors ${aangevinktOv[i] ? 'border-orange bg-lightBg2' : 'border-lightBg'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aangevinktOv[i]}
                  onChange={(e) => setAangevinktOv((p) => p.map((x, idx) => idx === i ? e.target.checked : x))}
                  className="mt-0.5 accent-orange"
                />
                <span className="text-sm text-darkSlate">{ov}</span>
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
        <h2 className="font-salmon text-xl text-darkSlate mb-1">Deel 4 — Existentiële kernovertuigingen</h2>
        <p className="text-sm text-midGreen mb-4">Genereer kernovertuigingen op basis van jouw aangevinkte overtuigingen</p>
        <button
          onClick={genereerKernOvertuigingen}
          disabled={kernLoading || aangevinktOv.every((x) => !x)}
          className="px-6 py-2 rounded-xl bg-orange text-white font-salmon hover:bg-orange/80 transition-colors disabled:opacity-50"
        >
          {kernLoading ? 'Genereren…' : 'Genereer kernovertuigingen'}
        </button>

        {kernOvertuigingen.length > 0 && (
          <div className="mt-5 space-y-3">
            {kernOvertuigingen.map((k, i) => (
              <div key={i} className={`rounded-xl p-3 border transition-colors ${aangevinktKern[i] ? 'border-orange bg-white' : 'border-lightBg bg-white'}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
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

      {analyse && (
        <AnalyseResultaat tekst={analyse} />
      )}
    </div>
  );
}

function SliderRijGeld({ label, waarde, soort, kleur, onChange }: {
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

function SliderPercentage({ label, waarde, kleur, onChange }: {
  label: string; waarde: number; kleur: string; onChange: (v: number) => void;
}) {
  const trackColor = kleur.includes('Green') ? '#3b5633' : '#9e3816';
  const pct = `${waarde}%`;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-midGreen">
        <span>{label}</span>
        <span className={`font-bold ${kleur}`}>{waarde}%</span>
      </div>
      <input
        type="range" min={0} max={100} step={5} value={waarde}
        className={`w-full ${kleur.includes('Green') ? 'slider-onbewust' : 'slider-bewust'}`}
        style={{ background: `linear-gradient(to right, ${trackColor} 0%, ${trackColor} ${pct}, #fde8d0 ${pct}, #fde8d0 100%)` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
