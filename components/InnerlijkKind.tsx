'use client';

import { useState, useRef, useEffect } from 'react';
import AnalyseResultaat from './AnalyseResultaat';
import { InnerlijkKindPdfKnop } from './InnerlijkKindPdf';
import { streamAnalyse, vervangMDashes, sliderBackground, kleuren as C } from '@/lib/huisstijl';

const WONDEN = [
  {
    wond: 'Afwijzing',
    kracht: 'Acceptatie',
    masker: 'De Vluchteling',
    ouder: 'Ontstaat bij de ouder van hetzelfde geslacht',
    kerngevoel: '"Ik ben niet gewenst / niet goed genoeg"',
    lichaam: 'Spanning, laag energiegevoel. De energie trekt zich letterlijk terug.',
    ontstaatDoor: 'Je voelde je niet gezien of welkom bij je ouder van hetzelfde geslacht. Niet omdat je niet goed genoeg was, maar omdat die ouder zelf worstelde met zijn of haar eigenwaarde.',
    herkenning: ['pleasegedrag', 'onzichtbaar willen blijven', 'onzekerheid', 'jezelf klein maken', 'vermijden van conflict'],
    links: 'Ik voel me niet welkom en verdwijn liever voordat iemand anders bij mij weggaat.',
    rechts: 'Ik durf aanwezig te zijn en weet dat ik er mag zijn, precies zoals ik ben.',
  },
  {
    wond: 'Verlating',
    kracht: 'Verbinding',
    masker: 'De Afhankelijke',
    ouder: 'Ontstaat bij de ouder van het tegengestelde geslacht',
    kerngevoel: '"Ik ben alleen / niemand blijft"',
    lichaam: 'Hartgebied, een diep verlangen naar nabijheid en verbinding.',
    ontstaatDoor: 'Je ouder van het tegengestelde geslacht was er emotioneel of fysiek niet genoeg voor je. Niet opzettelijk, maar genoeg voor het jonge kind om te leren: ik moet zelf zorgen dat ik niet alleen achterblijf.',
    herkenning: ['moeite met alleen zijn', 'bevestiging zoeken', 'overzorgen', 'leegte voelen', 'afhankelijkheid in relaties'],
    links: 'Ik ben voortdurend bang verlaten te worden en zoek bevestiging buiten mezelf.',
    rechts: 'Ik voel me compleet, geef mezelf de bevestiging die ik nodig heb, en kan genieten van anderen zonder ervan afhankelijk te zijn.',
  },
  {
    wond: 'Vernedering',
    kracht: 'Waardigheid',
    masker: 'De Masochist',
    ouder: 'Ontstaat bij de moeder of de meest zorgende ouder',
    kerngevoel: '"Ik ben te veel / ik ben een last"',
    lichaam: 'Buikgebied, schaamte zit in het lichaam. Soms overeten of jezelf verwaarlozen.',
    ontstaatDoor: 'Je voelde je beschaamd voor wie je was of voor wat je nodig had, vaak via de moeder. Je leerde dat jouw behoeften een last waren, en dat je minder ruimte mocht innemen dan je nodig had.',
    herkenning: ['jezelf wegcijferen', 'voor anderen zorgen ten koste van jezelf', 'schaamte over eigen behoeften', 'moeite met genieten', 'zelfkritiek'],
    links: 'Ik schaam me voor wie ik ben. Mijn behoeften zijn te veel en ik verdien geen plezier.',
    rechts: 'Ik voel dat ik er mag zijn zoals ik ben, en dat mijn behoeften er mogen zijn.',
  },
  {
    wond: 'Verraad',
    kracht: 'Vertrouwen',
    masker: 'De Controleur',
    ouder: 'Ontstaat bij de ouder van het tegengestelde geslacht',
    kerngevoel: '"Ik kan niemand vertrouwen"',
    lichaam: 'Spanning in buik en levergebied, link met vastgehouden frustratie en woede.',
    ontstaatDoor: 'Er werden beloftes gebroken, of je ouder van het tegengestelde geslacht was onbetrouwbaar of manipulatief. Het kind leerde: vertrouwen is gevaarlijk, ik regel het liever zelf.',
    herkenning: ['alles zelf willen doen', 'moeite met loslaten', 'sterk willen zijn', 'controle houden', 'wantrouwen in relaties'],
    links: 'Ik vertrouw niemand echt en heb alles liever zelf onder controle.',
    rechts: 'Ik kan vertrouwen en loslaten, wetend dat anderen betrouwbaar kunnen zijn.',
  },
  {
    wond: 'Onrecht',
    kracht: 'Mildheid',
    masker: 'De Rigide',
    ouder: 'Ontstaat bij de ouder van hetzelfde geslacht',
    kerngevoel: '"Het is niet eerlijk / ik moet perfect zijn"',
    lichaam: 'Spanning en blokkades door het lichaam, weinig contact met gevoelens.',
    ontstaatDoor: 'Je groeide op in een strenge of kritische omgeving, waar weinig ruimte was voor fouten of voor gevoelens. Je leerde dat je alleen de moeite waard was als je het goed deed.',
    herkenning: ['streng voor zichzelf', 'veel "moeten"', 'perfectionisme', 'rigiditeit', 'moeite met spelen of ontspannen'],
    links: 'Ik ben streng voor mezelf. Alles moet perfect en rechtvaardig zijn en ik voel me nooit goed genoeg.',
    rechts: 'Ik ben mild voor mezelf en weet dat goed genoeg ook echt goed genoeg is.',
  },
];

const BEHOEFTEN = [
  { naam: 'Gezien worden',                omschrijving: 'Mijn eigenheid werd gezien en gewaardeerd.' },
  { naam: 'Veiligheid',                   omschrijving: 'Ik voelde me veilig en geborgen bij mijn ouders.' },
  { naam: 'Ruimte voor gevoelens',        omschrijving: 'Er was ruimte voor mijn gevoelens en behoeften.' },
  { naam: 'Onvoorwaardelijke acceptatie', omschrijving: 'Ik werd geaccepteerd zoals ik was, zonder voorwaarden.' },
];

const REFLECTIEVRAGEN = [
  'Welke wond raakt je het meest? (Afwijzing, Verlating, Vernedering, Verraad of Onrecht)',
  'In welke situaties voel jij je "het kind van vroeger"?',
  'Wat had jouw innerlijk kind het allermeest nodig?',
];

const TOTAL_STEPS = 3;

export default function InnerlijkKind() {
  const [stap, setStap] = useState(0);
  const [scores, setScores] = useState<number[]>(WONDEN.map(() => 50));
  const [behoeftenScores, setBehoeftenScores] = useState<number[]>(BEHOEFTEN.map(() => 50));
  const [reflecties, setReflecties] = useState(['', '', '']);
  const [analyse, setAnalyse] = useState('');
  const [loading, setLoading] = useState(false);
  const [fout, setFout] = useState('');

  const isWondenStap    = stap === 0;
  const isBehoeftenStap = stap === 1;
  const isReflectieStap = stap === 2;
  const voortgang = Math.round((stap / TOTAL_STEPS) * 100);

  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const analyseAanvragen = async () => {
    setLoading(true);
    setFout('');
    try {
      const wondenLijst = WONDEN.map(
        (w, i) =>
          `${i + 1}. Wond: ${w.wond} / Krachtnaam: ${w.kracht} / Masker: ${w.masker}: ${scores[i]}%\n   Kerngevoel: ${w.kerngevoel}\n   Wond (0%): ${w.links}\n   Kracht (100%): ${w.rechts}\n   Herkenningspunten: ${w.herkenning.join(', ')}\n   Lichaam: ${w.lichaam}\n   Ontstaat door: ${w.ontstaatDoor}`,
      ).join('\n\n');

      const reflectieTekst = REFLECTIEVRAGEN
        .map((v, i) => (reflecties[i].trim() ? `${v}\n"${reflecties[i].trim()}"` : ''))
        .filter(Boolean)
        .join('\n\n');

      const behoeftenLijst = BEHOEFTEN.map(
        (b, i) => `${b.naam}: ${behoeftenScores[i]}% ontvangen: "${b.omschrijving}"`
      ).join('\n');

      const prompt = `Analyseer de biotensor test "Jouw innerlijk kind" gebaseerd op het werk van Lise Bourbeau (De vijf wonden die je verhinderen jezelf te zijn).

Scores (0% = volledig in de wond/actief, 100% = volledig in kracht/geheeld):
${wondenLijst}

Ontvangen basisbehoeften als kind (0% = nauwelijks ontvangen, 100% = volop ontvangen):
${behoeftenLijst}

${reflectieTekst ? `Reflectie:\n${reflectieTekst}` : ''}

Stijlregels (VERPLICHT te volgen):
- Schrijf luchtig, speels en direct. Geen stijve of formele zinnen.
- Gebruik NOOIT een m-dash (—). Splits de zin in twee losse zinnen of gebruik een komma of dubbele punt.
- Gebruik 'je' en 'jouw', niet 'zij' of 'haar'.
- Gebruik 'niet onderhandelbaar', nooit 'niet negocieerbaar'.
- Bij scores HOGER DAN 50%: gebruik ALTIJD de krachtnaam als primaire aanduiding, nooit de wondnaam. Dus bij 55% of hoger schrijf je 'Acceptatie' in plaats van 'Afwijzing', 'Vertrouwen' in plaats van 'Verraad', etc. Je mag de wond tussen haakjes noemen als verwijzing naar de heling, bijv: 'Acceptatie (genezing van Afwijzing, 95%)'.
- Bij scores van 50% of lager: benoem de wondnaam en het masker als primaire aanduiding.

Gebruik de herkenningspunten per wond om concrete, herkenbare gedragspatronen te benoemen in de analyse. Zeg niet "herkenningspunten zijn X", maar gebruik ze als basis voor observaties: "je merkt het misschien aan..." of "dit zie je terug in...".

Verbind de ontvangen basisbehoeften met de actieve wonden: lage behoeftescores verklaren vaak waarom een bepaalde wond zo sterk aanwezig is.

Noem waar relevant het lichaamsaspect van de wond, als concreet aanknopingspunt voor lichaamswerk of bewustwording.

Schrijf een warme, persoonlijke analyse in het Nederlands met exact deze opmaak:

## Jouw meest actieve wond
Benoem welke wond het meest actief is (laagste score) en wat dat dieper betekent. Noem het bijbehorende kerngevoel en masker. Gebruik de herkenningspunten om het herkenbaar te maken. 2-3 zinnen als doorlopende tekst.

## Opvallende wonden
Gebruik voor elke opvallende wond een ### blok:
### [Naam wond, masker, score%]
Inzicht in 2-3 zinnen. Benoem herkenbaar gedrag uit de herkenningspunten en het lichaamsaspect als dat relevant is. Gebruik **vetgedrukte woorden** voor kernbegrippen.

## Energie loslaten
### [Thema van wat losgelaten mag worden]
Welke overtuiging of energie mag loslaten. Concreet en voelbaar, 2-3 zinnen.

## Jouw kracht
### [Krachtnaam op basis van hoge scores]
Waar je al sterk in staat. Noem de wonden die al richting genezing bewegen. Benoem dit warm en bemoedigend.

## Tips: Je innerlijk kind helen
### [Tip 1]
Concrete tip in 2-3 zinnen.
### [Tip 2]
Concrete tip in 2-3 zinnen.
### [Tip 3]
Concrete tip in 2-3 zinnen.

## Afsluiting
Schrijf één warme inleidende zin. Geef dan 3 affirmaties, elk op een eigen regel, EXACT beginnend met ✨ gevolgd door een spatie. Geen nummers, geen streepjes ervoor. Voeg daarna 3 groei-affirmaties toe voor als de affirmaties nog te groots voelen, elk op een eigen regel, EXACT beginnend met 🌱 gevolgd door een spatie. Geen nummers, geen streepjes ervoor. Gebruik formuleringen als 'Ik leer...', 'Het mag...', of zinnen waarin 'elke dag een beetje meer' MIDDENIN de zin staat, zoals: 'Ik voel elke dag een beetje meer dat...' of 'Ik ontdek elke dag een beetje meer hoe...'.
VERPLICHT: formuleer alle affirmaties en groei-affirmaties POSITIEF. Zeg wat er WEL is, niet wat er niet is. Geen 'niet', 'geen', 'hoef niet', 'nooit meer'. Fout: 'Ik voel dat ik niet hoef te bewijzen dat ik goed genoeg ben.' Goed: 'Ik voel dat ik goed genoeg ben, precies zoals ik ben.'`;

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
          <h1 className="font-salmon text-2xl text-darkSlate mb-1">Jouw innerlijk kind</h1>
        </div>
        <AnalyseResultaat tekst={analyse} titel="Innerlijk kind" isLoading={loading} verbergPrintKnop />
        <div className="flex justify-center pt-2">
          {!loading && (
            <InnerlijkKindPdfKnop
              titel="Jouw innerlijk kind"
              analyse={analyse}
              wonden={WONDEN}
              behoeften={BEHOEFTEN}
              reflectievragen={REFLECTIEVRAGEN}
              scores={scores}
              behoeftenScores={behoeftenScores}
              reflecties={reflecties}
            />
          )}
        </div>
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              if (!window.confirm('Weet je zeker dat je opnieuw wilt beginnen? Al je invoer gaat verloren.')) return;
              setAnalyse(''); setStap(0); setScores(WONDEN.map(() => 50)); setBehoeftenScores(BEHOEFTEN.map(() => 50)); setReflecties(['', '', '']);
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
        <h1 className="font-salmon text-2xl text-darkSlate mb-1">Jouw innerlijk kind</h1>
        <p className="text-midGreen italic text-sm">Biotensortest · naar het werk van Lise Bourbeau</p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-darkSlate/60">
          <span>{isReflectieStap ? 'Reflectie' : isBehoeftenStap ? 'Behoeften als kind' : 'De vijf wonden'}</span>
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
      {isWondenStap && (
        <div className="bg-lightBg2 rounded-2xl p-4 border border-orange/20 text-sm text-darkSlate space-y-1">
          <p>Voel per wond waar jij zit tussen links en rechts.</p>
          <p>Meet op <strong>5% nauwkeurig</strong> je scores via de biotensor.</p>
          <div className="flex justify-between text-xs text-darkSlate/50 pt-1">
            <span>⬅️ 0% = wond actief</span>
            <span>100% = in kracht ➡️</span>
          </div>
        </div>
      )}

      {/* De vijf wonden */}
      {isWondenStap && (
        <div className="space-y-4">
          {WONDEN.map((w, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-lightBg space-y-4">

              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h2 className="font-salmon text-base leading-snug text-darkRed">
                    <span className="text-midGreen font-bold mr-1">{i + 1}.</span>
                    {w.wond}
                  </h2>
                  <p className="text-[10px] text-darkSlate/40 mt-0.5">{w.masker}</p>
                  <p className="text-[10px] text-darkSlate/40 mt-0.5">{w.ouder}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-salmon text-base leading-snug text-darkGreen">{w.kracht}</p>
                </div>
              </div>

              {/* Kerngevoel */}
              <p className="text-sm text-darkRed/70 italic">{w.kerngevoel}</p>

              {/* Lichaam */}
              <div className="flex items-start gap-2 text-xs text-darkSlate/60 bg-darkSlate/5 rounded-xl px-3 py-2">
                <span className="shrink-0">🫀</span>
                <span>{w.lichaam}</span>
              </div>

              {/* Wond / Kracht kaarten */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-darkRed/5 rounded-xl p-4 border-l-4 border-darkRed">
                  <div className="text-[10px] font-bold text-darkRed uppercase tracking-widest mb-2">Wond · 0%</div>
                  <p className="text-sm text-darkSlate leading-relaxed italic">{w.links}</p>
                </div>
                <div className="bg-darkGreen/5 rounded-xl p-4 border-l-4 border-darkGreen">
                  <div className="text-[10px] font-bold text-darkGreen uppercase tracking-widest mb-2">Kracht · 100%</div>
                  <p className="text-sm text-darkSlate leading-relaxed italic">{w.rechts}</p>
                </div>
              </div>

              {/* Uitklapbaar: Ontstaat door */}
              <details className="group">
                <summary className="cursor-pointer text-xs text-midGreen hover:text-darkGreen list-none flex items-center gap-1 select-none">
                  <span className="transition-transform duration-200 group-open:rotate-90 inline-block">▶</span>
                  Hoe ontstaat deze wond?
                </summary>
                <p className="mt-2 text-xs text-darkSlate/70 leading-relaxed pl-4 border-l-2 border-midGreen/30">
                  {w.ontstaatDoor}
                </p>
              </details>

              {/* Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-darkRed">⬅️ wond</span>
                  <span className="font-bold text-midGreen text-lg">{scores[i]}%</span>
                  <span className="text-darkGreen">kracht ➡️</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={scores[i]}
                  aria-label={`Score voor wond ${w.wond}`}
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
            <p className="text-sm text-midGreen">Meet via de biotensor hoeveel je van elk van deze behoeften hebt ontvangen van je ouders.</p>
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
        {(isWondenStap || isBehoeftenStap) && (
          <button
            onClick={() => setStap((s) => s + 1)}
            className="flex-1 py-3.5 rounded-xl bg-darkGreen text-cream font-salmon text-base hover:bg-darkGreen/90 transition-colors"
          >
            {isWondenStap ? 'Naar behoeften →' : 'Naar reflectie →'}
          </button>
        )}
        {isReflectieStap && (
          <button
            onClick={analyseAanvragen}
            disabled={loading}
            className="flex-1 py-3.5 rounded-xl bg-darkGreen text-cream font-salmon text-base hover:bg-darkGreen/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Bezig...' : 'Onthul mijn innerlijk kind'}
          </button>
        )}
      </div>

      {fout && <p className="text-darkRed text-sm text-center">{fout}</p>}

    </div>
  );
}
