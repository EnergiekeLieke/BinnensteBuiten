'use client';

import { useState, useRef, useEffect } from 'react';
import AnalyseResultaat from './AnalyseResultaat';
import { streamAnalyse, vervangMDashes, sliderBackground, kleuren as C } from '@/lib/huisstijl';

const VADERPATRONEN = [
  {
    naam: 'De afwezige vader',
    kracht: 'De aanwezige volwassene',
    herkenning: ['moeite met vertrouwen (vooral in mannen/autoriteit)', '"ik moet het alleen doen"', 'moeite met ontvangen en hulp vragen', 'diep verlangen om gezien te worden'],
    links: 'Door de afwezigheid van mijn vader leerde ik het alleen te doen, of zoek ik juist voortdurend bevestiging en nabijheid.',
    rechts: 'Ik weet wat ik nodig heb en kan om hulp vragen, zonder angst om alleen achter te blijven.',
  },
  {
    naam: 'De emotioneel onbereikbare vader',
    kracht: 'De verbonden volwassene',
    herkenning: ['eigen gevoelens makkelijk afsluiten', 'verlangt naar diepgang maar vindt het spannend', 'trekt onbeschikbare partners aan', '"ik moet sterk zijn, emoties zijn lastig"'],
    links: 'Mijn vader was er wel, maar achter een emotionele muur. Ik sluit mijn eigen gevoelens makkelijk af of zoek wanhopig naar echte diepgang.',
    rechts: 'Ik durf mijn eigen wereld te laten zien en sta open voor echte emotionele verbinding met anderen.',
  },
  {
    naam: 'De autoritaire vader',
    kracht: 'De zelfbepalende volwassene',
    herkenning: ['pleasen of juist rebelleren tegen autoriteit', 'moeite met eigen grenzen en eigen waarheid spreken', 'angst om fouten te maken', 'snel aanpassen om conflicten te vermijden'],
    links: 'Zijn wil was wet. Ik leerde pleasen of juist rebelleren, maar mijn eigen stem vinden is nog een uitdaging.',
    rechts: 'Ik neem mijn eigen ruimte in, spreek mijn waarheid en respecteer ook die van anderen, vanuit vrijheid in plaats van angst.',
  },
  {
    naam: 'De kritische vader',
    kracht: 'De zelfwaarderende volwassene',
    herkenning: ['perfectionisme', 'sterke innerlijke criticus', 'bewijsdrang ("ik moet laten zien dat ik het waard ben")', 'moeite met ontspannen en genieten'],
    links: 'Het was nooit goed genoeg. Ik draag een strenge innerlijke criticus met me mee die me constant beoordeelt.',
    rechts: 'Ik zie mijn eigen waarde en kan trots zijn op wie ik ben, zonder mezelf voortdurend te bewijzen.',
  },
  {
    naam: 'De afwezige-beschermende vader',
    kracht: 'De vrije volwassene',
    herkenning: ['liefde koppelen aan presteren', 'voelt zich waardevol als ik iets bereik', 'moeite met rust nemen', 'altijd "aan" staan'],
    links: 'Mijn vader zorgde wel, maar op afstand. Ik heb liefde leren koppelen aan presteren en voel me pas waardevol als ik iets bereik.',
    rechts: 'Ik weet dat mijn waarde er gewoon is, los van wat ik doe of bereik. Zijn is genoeg.',
  },
  {
    naam: 'De vriend-vader',
    kracht: 'De gegronde volwassene',
    herkenning: ['onduidelijke grenzen in relaties', 'moeite met leiderschap nemen in eigen leven', 'verantwoordelijk voelen voor anderen', 'bevestiging zoeken buiten jezelf'],
    links: 'Mijn vader was meer maatje dan ouder. Er waren weinig grenzen, weinig richting. Ik zoek nog altijd houvast buiten mezelf.',
    rechts: 'Ik vind mijn eigen richting van binnenuit en kan anderen leiden én begeleiden vanuit stevigheid.',
  },
  {
    naam: 'De onveilige vader',
    kracht: 'De veilige volwassene',
    herkenning: ['hyperalert zijn (altijd scannen: is het veilig?)', 'moeite met ontspanning', 'sterke behoefte aan controle', 'angst voor afwijzing of conflict'],
    links: 'Zijn gedrag was wisselend en onvoorspelbaar. Ik leerde constant scannen: is het veilig? Die alertheid draag ik nog altijd met me mee.',
    rechts: 'Ik voel me veilig in mezelf en hoef de omgeving niet meer voortdurend te monitoren om me oké te voelen.',
  },
];

const BEHOEFTEN = [
  { naam: 'Trots en erkenning',        omschrijving: 'Mijn vader liet weten dat hij trots op mij was, om wie ik was.' },
  { naam: 'Bescherming en stevigheid', omschrijving: 'Ik voelde me veilig en beschermd bij mijn vader.' },
  { naam: 'Ruimte voor wie ik ben',    omschrijving: 'Er was ruimte voor mijn eigen identiteit, keuzes en gevoelens.' },
  { naam: 'Emotionele nabijheid',      omschrijving: 'Mijn vader was emotioneel bereikbaar en aanwezig voor mij.' },
];

const REFLECTIEVRAGEN = [
  'Welk vaderpatroon raakt je het meest? (De afwezige vader, De emotioneel onbereikbare vader, De autoritaire vader, De kritische vader, De afwezige-beschermende vader, De vriend-vader of De onveilige vader)',
  'Hoe herken je dit patroon in jouw huidige leven of relaties?',
  'Wat had jij het allermeest nodig van jouw vader?',
];

const TOTAL_STEPS = 3;

export default function VaderType() {
  const [stap, setStap] = useState(0);
  const [scores, setScores] = useState<number[]>(VADERPATRONEN.map(() => 50));
  const [behoeftenScores, setBehoeftenScores] = useState<number[]>(BEHOEFTEN.map(() => 50));
  const [reflecties, setReflecties] = useState(['', '', '']);
  const [analyse, setAnalyse] = useState('');
  const [loading, setLoading] = useState(false);
  const [fout, setFout] = useState('');

  const isVraagStap     = stap === 0;
  const isBehoeftenStap = stap === 1;
  const isReflectieStap = stap === 2;
  const voortgang = Math.round((stap / TOTAL_STEPS) * 100);

  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const analyseAanvragen = async () => {
    setLoading(true);
    setFout('');
    try {
      const scoresLijst = VADERPATRONEN.map(
        (p, i) =>
          `${i + 1}. Patroon: ${p.naam} / Kracht: ${p.kracht}: ${scores[i]}%\n   Patroon (0%): ${p.links}\n   Kracht (100%): ${p.rechts}\n   Herkenningspunten: ${p.herkenning.join(', ')}`,
      ).join('\n\n');

      const reflectieTekst = REFLECTIEVRAGEN
        .map((v, i) => (reflecties[i].trim() ? `${v}\n"${reflecties[i].trim()}"` : ''))
        .filter(Boolean)
        .join('\n\n');

      const behoeftenLijst = BEHOEFTEN.map(
        (b, i) => `${b.naam}: ${behoeftenScores[i]}% ontvangen: "${b.omschrijving}"`
      ).join('\n');

      const prompt = `Analyseer de biotensor test "Welk vaderpatroon draag jij mee?" van deze vrouw.

Scores (0% = patroon van vader leeft sterk voort in haar leven, 100% = zij staat volledig in haar kracht):
${scoresLijst}

Ontvangen basisbehoeften als kind (van haar vader, 0% = nauwelijks ontvangen, 100% = volop ontvangen):
${behoeftenLijst}

${reflectieTekst ? `Reflectie:\n${reflectieTekst}` : ''}

Stijlregels (VERPLICHT te volgen):
- Schrijf luchtig, speels en direct. Geen stijve of formele zinnen.
- Gebruik NOOIT een m-dash (—). Splits de zin in twee losse zinnen of gebruik een komma of dubbele punt.
- Gebruik 'je' en 'jouw', niet 'zij' of 'haar'.
- Gebruik 'niet onderhandelbaar', nooit 'niet negocieerbaar'.
- Bij scores HOGER DAN 50%: noem altijd de KRACHTNAAM (rechts), niet de patroonnaam. Dus bij 55% of hoger schrijf je "de aanwezige volwassene", niet "de afwezige vader".
- Bij scores van 50% of lager: noem de patroonnaam (links).

Gebruik de herkenningspunten per patroon om concrete, herkenbare gedragspatronen te benoemen in de analyse. Zeg niet "herkenningspunten zijn X", maar gebruik ze als basis voor observaties: "je merkt het misschien aan..." of "dit zie je terug in...".

Verbind de ontvangen basisbehoeften met de actieve vaderpatronen: lage behoeftescores verklaren vaak waarom een bepaald patroon zo sterk doorwerkt.

Schrijf een warme, persoonlijke analyse in het Nederlands met exact deze opmaak:

## Jouw meest actieve vaderpatroon
Benoem welk vaderpatroon het meest actief is (laagste score) en wat dat dieper betekent voor wie je nu bent. Gebruik de herkenningspunten om het herkenbaar te maken. 2-3 zinnen als doorlopende tekst.

## Opvallende patronen
Gebruik voor elk opvallend patroon een ### blok:
### [Naam vaderpatroon, score%]
Inzicht in 2-3 zinnen. Benoem herkenbaar gedrag uit de herkenningspunten. Gebruik **vetgedrukte woorden** voor kernbegrippen.

## Energie loslaten
### [Thema van wat losgelaten mag worden]
Welke overtuiging of energie mag loslaten. Concreet en voelbaar, 2-3 zinnen.

## Jouw kracht
### [Krachtnaam op basis van hoge scores]
Waar je al sterk in staat. Benoem dit warm en bemoedigend.

## Tips: Je eigen patroon loslaten
### [Tip 1]
Concrete tip in 2-3 zinnen.
### [Tip 2]
Concrete tip in 2-3 zinnen.
### [Tip 3]
Concrete tip in 2-3 zinnen.

## Afsluiting
Schrijf één warme inleidende zin. Geef dan 3 affirmaties, elk op een eigen regel, EXACT beginnend met ✨ gevolgd door een spatie. Geen nummers, geen streepjes ervoor. Voeg daarna 3 groei-affirmaties toe voor als de affirmaties nog te groots voelen, elk op een eigen regel, EXACT beginnend met 🌱 gevolgd door een spatie. Geen nummers, geen streepjes ervoor. Gebruik formuleringen als 'Ik leer...', 'Het mag...', of zinnen waarin 'elke dag een beetje meer' MIDDENIN de zin staat, zoals 'Ik voel elke dag een beetje meer dat...'.
VERPLICHT: formuleer alle affirmaties en groei-affirmaties POSITIEF. Zeg wat er WEL is, nooit wat er niet is. Geen 'niet', 'geen', 'hoef niet', 'nooit meer'.`;

      const controller = new AbortController();
      abortRef.current = controller;
      let acc = '';
      await streamAnalyse(prompt, 3000, (chunk) => { acc += chunk; setAnalyse(acc); }, undefined, controller.signal);
      setAnalyse(vervangMDashes(acc));
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') return;
      setFout(e instanceof Error ? e.message : 'Er ging iets mis');
    } finally {
      setLoading(false);
    }
  };

  if (analyse) {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="text-center">
          <h1 className="font-salmon text-2xl text-darkSlate mb-1">Welk vaderpatroon draag jij mee?</h1>
        </div>
        <AnalyseResultaat tekst={analyse} titel="Vaderpatroon" isLoading={loading} />
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              if (!window.confirm('Weet je zeker dat je opnieuw wilt beginnen? Al je invoer gaat verloren.')) return;
              setAnalyse(''); setStap(0); setScores(VADERPATRONEN.map(() => 50)); setBehoeftenScores(BEHOEFTEN.map(() => 50)); setReflecties(['', '', '']);
            }}
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
        <h1 className="font-salmon text-2xl text-darkSlate mb-1">Welk vaderpatroon draag jij mee?</h1>
        <p className="text-midGreen italic text-sm">Biotensortest · alleen onbewuste scores</p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-darkSlate/60">
          <span>{isReflectieStap ? 'Reflectie' : isBehoeftenStap ? 'Behoeften als kind' : 'Vaderpatronen'}</span>
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
          <p>Voel per patroon in hoeverre het vaderpatroon nog doorwerkt in jouw leven.</p>
          <p>Meet op <strong>5% nauwkeurig</strong> je scores.</p>
          <div className="flex justify-between text-xs text-darkSlate/50 pt-1">
            <span>⬅️ 0% = patroon werkt sterk door</span>
            <span>100% = in kracht ➡️</span>
          </div>
        </div>
      )}

      {/* Alle vaderpatronen */}
      {isVraagStap && (
        <div className="space-y-4">
          {VADERPATRONEN.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-lightBg space-y-4">
              <div className="flex justify-between items-start gap-2">
                <h2 className="font-salmon text-base leading-snug text-darkRed">
                  <span className="text-midGreen font-bold mr-1">{i + 1}.</span>
                  {p.naam}
                </h2>
                <h2 className="font-salmon text-base leading-snug text-darkGreen text-right shrink-0">
                  {p.kracht}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-darkRed/5 rounded-xl p-4 border-l-4 border-darkRed">
                  <div className="text-[10px] font-bold text-darkRed uppercase tracking-widest mb-2">Patroon · 0%</div>
                  <p className="text-sm text-darkSlate leading-relaxed italic">{p.links}</p>
                </div>
                <div className="bg-darkGreen/5 rounded-xl p-4 border-l-4 border-darkGreen">
                  <div className="text-[10px] font-bold text-darkGreen uppercase tracking-widest mb-2">Kracht · 100%</div>
                  <p className="text-sm text-darkSlate leading-relaxed italic">{p.rechts}</p>
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
                  aria-label={`Score voor ${p.naam}`}
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
            <p className="text-sm text-midGreen">Meet via de biotensor hoeveel je van elk van deze behoeften hebt ontvangen van je vader.</p>
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
            {loading ? 'Bezig...' : 'Onthul mijn vaderpatroon'}
          </button>
        )}
      </div>

      {fout && <p className="text-darkRed text-sm text-center">{fout}</p>}

    </div>
  );
}
