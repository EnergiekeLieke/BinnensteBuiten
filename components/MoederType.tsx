'use client';

import { useState } from 'react';
import AnalyseResultaat from './AnalyseResultaat';
import { roepAnalyseAan, sliderBackground, kleuren as C } from '@/lib/huisstijl';

const MOEDERTYPEN = [
  {
    naam: 'De overbeschermende moeder',
    kracht: 'De vertrouwende moeder',
    links: 'Ik voel de neiging om mijn kind te beschermen tegen alles, en vind het lastig om los te laten.',
    rechts: 'Ik vertrouw op mijn kind en geef ruimte om zelf te ontdekken en te groeien.',
  },
  {
    naam: 'De afhankelijke moeder',
    kracht: 'De zelfstandige moeder',
    links: 'Ik leun (onbewust) emotioneel op mijn kind of maak mijn kind verantwoordelijk voor mijn gevoel.',
    rechts: 'Ik neem verantwoordelijkheid voor mijn eigen emoties en laat mijn kind kind zijn.',
  },
  {
    naam: 'De afwijzende moeder',
    kracht: 'De waarderende moeder',
    links: 'Ik ben kritisch of snel ontevreden, waardoor mijn kind zich niet altijd goed genoeg voelt.',
    rechts: 'Ik zie en waardeer mijn kind zoals het is, zonder voorwaarden.',
  },
  {
    naam: 'De opofferende moeder',
    kracht: 'De zelfzorgende moeder',
    links: 'Ik zet mezelf vaak opzij en voel me verantwoordelijk voor het geluk van mijn kind.',
    rechts: 'Ik zorg goed voor mezelf én mijn kind, en laat zien dat beide belangrijk zijn.',
  },
  {
    naam: 'De beste-vriendin-moeder',
    kracht: 'De veilige moeder',
    links: 'Ik behandel mijn kind als gelijke en vind het lastig om grenzen te stellen.',
    rechts: 'Ik ben liefdevol én duidelijk, en bied mijn kind veiligheid door gezonde grenzen.',
  },
  {
    naam: 'De dominante moeder',
    kracht: 'De begeleidende moeder',
    links: 'Ik bepaal veel voor mijn kind en stuur sterk, soms vanuit controle.',
    rechts: 'Ik begeleid mijn kind en geef ruimte voor eigen keuzes en autonomie.',
  },
  {
    naam: 'De afwezige moeder',
    kracht: 'De aanwezige moeder',
    links: 'Ik ben er niet altijd volledig, emotioneel of fysiek, voor mijn kind.',
    rechts: 'Ik ben aanwezig, afgestemd en beschikbaar voor mijn kind.',
  },
];

const BEHOEFTEN = [
  { naam: 'Emotionele validatie',      omschrijving: 'Mijn emoties werden gezien als echt en waardevol.' },
  { naam: 'Warmte en zachtheid',       omschrijving: 'Ik ontving warmte en zachtheid, vooral in momenten van verdriet en onzekerheid.' },
  { naam: 'Consistente aanwezigheid',  omschrijving: 'Er was consistente aanwezigheid wanneer ik contact en/of troost nodig had.' },
  { naam: 'Een veilige plek',          omschrijving: 'Ik had een veilige plek om mijn innerlijke wereld bij kwijt te kunnen, zonder schaamte of schuldgevoel.' },
];

const REFLECTIEVRAGEN = [
  'Waar zit mijn grootste disbalans?',
  'Welk patroon herken ik uit mijn eigen jeugd?',
  'Wat heb ik nodig om meer naar de rechterkant te bewegen?',
];

const TOTAL_STEPS = 3; // moedertypen + behoeften + reflectie

export default function MoederType() {
  const [stap, setStap] = useState(0);
  const [scores, setScores] = useState<number[]>(MOEDERTYPEN.map(() => 50));
  const [behoeftenScores, setBehoeftenScores] = useState<number[]>(BEHOEFTEN.map(() => 50));
  const [reflecties, setReflecties] = useState(['', '', '']);
  const [analyse, setAnalyse] = useState('');
  const [loading, setLoading] = useState(false);
  const [fout, setFout] = useState('');

  const isVraagStap     = stap === 0;
  const isBehoeftenStap = stap === 1;
  const isReflectieStap = stap === 2;
  const voortgang = Math.round((stap / TOTAL_STEPS) * 100);

  const analyseAanvragen = async () => {
    setLoading(true);
    setFout('');
    try {
      const scoresLijst = MOEDERTYPEN.map(
        (m, i) =>
          `${i + 1}. Patroon: ${m.naam} / Kracht: ${m.kracht}: ${scores[i]}%\n   Patroon (0%): ${m.links}\n   Kracht (100%): ${m.rechts}`,
      ).join('\n');

      const reflectieTekst = REFLECTIEVRAGEN
        .map((v, i) => (reflecties[i].trim() ? `${v}\n"${reflecties[i].trim()}"` : ''))
        .filter(Boolean)
        .join('\n\n');

      const behoeftenLijst = BEHOEFTEN.map(
        (b, i) => `${b.naam}: ${behoeftenScores[i]}% ontvangen — "${b.omschrijving}"`
      ).join('\n');

      const prompt = `Analyseer de biotensor test "Welk type moeder ben jij?" van deze vrouw.

Scores (0% = volledig in het patroon/wond, 100% = volledig in kracht):
${scoresLijst}

Ontvangen basisbehoeften als kind (van haar eigen moeder, 0% = nauwelijks ontvangen, 100% = volop ontvangen):
${behoeftenLijst}

${reflectieTekst ? `Reflectie van de vrouw:\n${reflectieTekst}` : ''}

Stijlregels (VERPLICHT te volgen):
- Schrijf luchtig, speels en direct. Geen stijve of formele zinnen.
- Gebruik NOOIT een m-dash (—). Splits de zin in twee losse zinnen of gebruik een komma of dubbele punt.
- Verwijs naar het kind als 'je kind' of 'jouw kind', niet als 'hij' of 'zij'.
- Gebruik 'niet onderhandelbaar', nooit 'niet negocieerbaar'.
- Bij scores HOGER DAN 50%: noem altijd de KRACHTNAAM (rechts), niet de patroonnaam. Dus bij 55% of hoger schrijf je "de vertrouwende moeder", niet "de overbeschermende moeder".
- Bij scores van 50% of lager: noem de patroonnaam (links).

Verbind waar mogelijk de ontvangen basisbehoeften als kind met de actieve moederpatronen: lage scores op een behoefte verklaren vaak waarom een bepaald patroon zo sterk aanwezig is.

Schrijf een warme, persoonlijke analyse in het Nederlands met exact deze opmaak:

## Jouw meest actieve moederpatroon
Benoem welk moedertype het meest actief is (laagste score) en wat dat dieper betekent. 2-3 zinnen als doorlopende tekst.

## Opvallende patronen
Gebruik voor elk opvallend patroon een ### blok:
### [Naam moedertype, score%]
Inzicht over dit patroon in 2-3 zinnen. Gebruik **vetgedrukte woorden** voor kernbegrippen.

## Energie loslaten
### [Thema van wat losgelaten mag worden]
Welke energie of overtuiging mag zij hierin loslaten. Concreet en voelbaar, 2-3 zinnen.

## Jouw kracht als moeder
### [Krachtnaam]
Waar zij al sterk in is op basis van de hoge scores. Noem de krachtnamen. Benoem dit warm en bemoedigend.

## Tips: In je kracht staan als moeder
### [Tip 1]
Concrete tip in 2-3 zinnen.
### [Tip 2]
Concrete tip in 2-3 zinnen.
### [Tip 3]
Concrete tip in 2-3 zinnen.

## Afsluiting
Schrijf één warme inleidende zin. Geef dan 3 affirmaties (begin elk met ✨ op een nieuwe regel). Voeg daarna 3 groei-affirmaties toe voor als de affirmaties nog te groots voelen (begin elk met 🌱 op een nieuwe regel, gebruik formuleringen als 'Ik leer...', 'Elke dag een beetje meer...', 'Het mag...').`;

      const tekst = await roepAnalyseAan(prompt, 3000);
      setAnalyse(tekst);
    } catch (e: unknown) {
      setFout(e instanceof Error ? e.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  };

  if (analyse) {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="text-center">
          <h1 className="font-salmon text-2xl text-darkSlate mb-1">Welk type moeder ben jij?</h1>
        </div>
        <AnalyseResultaat tekst={analyse} />
        <div className="flex justify-center pt-2">
          <button
            onClick={() => { setAnalyse(''); setStap(0); setScores(MOEDERTYPEN.map(() => 50)); setBehoeftenScores(BEHOEFTEN.map(() => 50)); setReflecties(['', '', '']); }}
            className="text-sm text-midGreen hover:text-darkGreen underline underline-offset-2"
          >
            Opnieuw beginnen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">

      <div className="text-center">
        <h1 className="font-salmon text-2xl text-darkSlate mb-1">Welk type moeder ben jij?</h1>
        <p className="text-midGreen italic text-sm">Biotensortest · alleen onbewuste scores</p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-darkSlate/60">
          <span>{isReflectieStap ? 'Reflectie' : isBehoeftenStap ? 'Behoeften als kind' : 'Moederpatronen'}</span>
          <span>{voortgang}%</span>
        </div>
        <div className="w-full bg-lightBg rounded-full h-2">
          <div
            className="bg-darkGreen h-2 rounded-full transition-all duration-300"
            style={{ width: `${voortgang}%` }}
          />
        </div>
      </div>

      {/* Instructie */}
      {isVraagStap && (
        <div className="bg-lightBg2 rounded-2xl p-4 border border-orange/20 text-sm text-darkSlate space-y-1">
          <p>Voel per stelling waar jij zit tussen links en rechts.</p>
          <p>Meet op <strong>5% nauwkeurig</strong> je scores.</p>
          <div className="flex justify-between text-xs text-darkSlate/50 pt-1">
            <span>⬅️ 0% = volledig patroon</span>
            <span>100% = volledig in kracht ➡️</span>
          </div>
        </div>
      )}

      {/* Alle moedertypen */}
      {isVraagStap && (
        <div className="space-y-4">
          {MOEDERTYPEN.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-lightBg space-y-4">
              <div className="flex justify-between items-start gap-2">
                <h2 className="font-salmon text-base leading-snug text-darkRed">
                  <span className="text-midGreen font-bold mr-1">{i + 1}.</span>
                  {m.naam}
                </h2>
                <h2 className="font-salmon text-base leading-snug text-darkGreen text-right shrink-0">
                  {m.kracht}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-darkRed/5 rounded-xl p-4 border-l-4 border-darkRed">
                  <div className="text-[10px] font-bold text-darkRed uppercase tracking-widest mb-2">Patroon · 0%</div>
                  <p className="text-sm text-darkSlate leading-relaxed italic">{m.links}</p>
                </div>
                <div className="bg-darkGreen/5 rounded-xl p-4 border-l-4 border-darkGreen">
                  <div className="text-[10px] font-bold text-darkGreen uppercase tracking-widest mb-2">Kracht · 100%</div>
                  <p className="text-sm text-darkSlate leading-relaxed italic">{m.rechts}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-darkRed">⬅️ patroon</span>
                  <span className="font-bold text-midGreen text-lg">{scores[i]}%</span>
                  <span className="text-darkGreen">kracht ➡️</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={scores[i]}
                  aria-label={`Score voor ${m.naam}`}
                  className="w-full slider-onbewust"
                  style={{ background: sliderBackground(scores[i], 100, C.darkGreen) }}
                  onChange={(e) =>
                    setScores((prev) => prev.map((s, idx) => idx === i ? Number(e.target.value) : s))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Behoeften als kind */}
      {isBehoeftenStap && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-lightBg space-y-5">
          <div>
            <h2 className="font-salmon text-xl text-darkSlate mb-1">Jouw behoeften als kind</h2>
            <p className="text-sm text-midGreen">Meet via de biotensor hoeveel je van elk van deze behoeften hebt ontvangen van je eigen moeder.</p>
          </div>
          <div className="flex justify-between text-xs text-darkSlate/50 -mb-2">
            <span>⬅️ nauwelijks ontvangen</span>
            <span>volop ontvangen ➡️</span>
          </div>
          {BEHOEFTEN.map((b, i) => (
            <div key={i} className="space-y-2 border-b border-lightBg pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-darkSlate">{b.naam}</span>
                <span className="font-bold text-midGreen">{behoeftenScores[i]}%</span>
              </div>
              <p className="text-xs text-darkSlate/60 italic">{b.omschrijving}</p>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={behoeftenScores[i]}
                aria-label={b.naam}
                className="w-full slider-onbewust"
                style={{ background: sliderBackground(behoeftenScores[i], 100, C.darkGreen) }}
                onChange={(e) =>
                  setBehoeftenScores((prev) => prev.map((s, idx) => idx === i ? Number(e.target.value) : s))
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Reflectie */}
      {isReflectieStap && (
        <div className="bg-lightBg2 rounded-2xl p-5 border border-orange/30 space-y-5">
          <div>
            <h2 className="font-salmon text-xl text-darkSlate mb-1">Reflectie</h2>
            <p className="text-sm text-midGreen">Optioneel, maar geeft mooie extra diepte aan de analyse.</p>
          </div>
          {REFLECTIEVRAGEN.map((vraag, i) => (
            <div key={i}>
              <label className="text-sm font-medium text-darkSlate block mb-1.5">💛 {vraag}</label>
              <textarea
                value={reflecties[i]}
                onChange={(e) =>
                  setReflecties((prev) => prev.map((r, idx) => (idx === i ? e.target.value : r)))
                }
                className="w-full rounded-xl border border-lightBg bg-white p-3 text-sm text-darkSlate resize-none focus:outline-none focus:ring-2 focus:ring-midGreen"
                rows={3}
                placeholder="Schrijf hier jouw antwoord..."
              />
            </div>
          ))}
        </div>
      )}

      {/* Navigatie */}
      <div className="flex gap-3">
        {stap > 0 && (
          <button
            onClick={() => setStap((s) => s - 1)}
            className="flex-1 py-3.5 rounded-xl border border-midGreen text-midGreen font-salmon text-base hover:bg-midGreen/10 transition-colors"
          >
            ← Vorige
          </button>
        )}
        {(isVraagStap || isBehoeftenStap) && (
          <button
            onClick={() => setStap((s) => s + 1)}
            className="flex-1 py-3.5 rounded-xl bg-darkGreen text-cream font-salmon text-base hover:bg-darkGreen/90 transition-colors"
          >
            {isVraagStap ? 'Naar behoeften →' : 'Naar reflectie →'}
          </button>
        )}
        {isReflectieStap && (
          <button
            onClick={analyseAanvragen}
            disabled={loading}
            className="flex-1 py-3.5 rounded-xl bg-darkGreen text-cream font-salmon text-base hover:bg-darkGreen/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Bezig...' : 'Onthul mijn moederpatroon'}
          </button>
        )}
      </div>

      {fout && <p className="text-darkRed text-sm text-center">{fout}</p>}

    </div>
  );
}
