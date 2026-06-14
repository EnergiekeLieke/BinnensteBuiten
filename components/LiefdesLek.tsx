'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AnalyseResultaat from './AnalyseResultaat';
import { roepAnalyseAan, streamAnalyse, vervangMDashes, sliderBackground, kleuren as C } from '@/lib/huisstijl';

const LiefdesLekPdfKnop = dynamic(
  () => import('./LiefdesLekPdf').then((m) => m.LiefdesLekPdfKnop),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);

export type Slider2 = { overtuigd: number; loslaten: number };

export const STELLINGEN = [
  'Ik kan mijn fouten zien zonder mezelf af te straffen.',
  'Ik ben waardevol, precies zoals ik nu ben (inclusief al mijn imperfecties).',
  'Ik durf "nee" te zeggen als iets niet goed voelt.',
  'Ik kies regelmatig voor mezelf, ook als anderen dat lastig vinden.',
  'Ik zorg goed voor mijn lichaam met rust, beweging en voeding.',
  'Ik luister naar mijn lichaam en neem signalen serieus.',
  'Ik spreek mezelf vaker bemoedigend toe dan streng of negatief.',
  'Ik kan mild en vriendelijk zijn naar mezelf als iets niet lukt.',
  'Ik erken mijn eigen waarde en weet dat ik liefde verdien.',
  'Ik voel me veilig om mijn hart open te stellen voor anderen.',
  'Ik ontvang liefde, zorg en aandacht met gemak.',
  'Ik vertrouw erop dat er genoeg liefde is voor mij.',
  'Ik geef liefde aan anderen zonder mezelf daarin te verliezen.',
  'Ik durf los te laten wat mij niet meer dient.',
  'Ik weet dat echte verbinding begint bij de liefde voor mezelf.',
];

const GROEI_AFFIRMATIES = [
  'Ik ben goed genoeg, precies zoals ik nu ben.',
  'Mijn waarde hangt niet af van perfectie.',
  'Elke fout is een kans om te groeien.',
  'Ik mag leren en ontdekken in mijn eigen tempo.',
  'Ik mag kiezen wat goed voelt voor mij.',
  'Nee zeggen tegen een ander is ja zeggen tegen mezelf.',
  'Mijn energie is kostbaar en ik bewaak haar met liefde.',
  'Ik heb het recht om ruimte in te nemen.',
  'Mijn lichaam is mijn thuis en ik zorg er liefdevol voor.',
  'Ik luister naar de signalen van mijn lichaam en respecteer ze.',
  'Rust, voeding en beweging zijn cadeautjes aan mezelf.',
  'Ik ben dankbaar voor alles wat mijn lichaam elke dag voor mij doet.',
  'Ik spreek tegen mezelf met zachtheid en respect.',
  'Ik ben mijn eigen grootste supporter.',
  'Mijn gedachten mogen vriendelijk en opbouwend zijn.',
  'Ik kies ervoor mezelf liefdevol toe te spreken.',
];

export const STRATEGIEEN: { label: string; toelichting: string }[] = [
  { label: 'Behoefte onderdrukken',          toelichting: 'Niet uitspreken wat je nodig hebt uit angst voor afwijzing.' },
  { label: 'Bewijzen',                        toelichting: 'Je liefde tonen door continu te geven of te zorgen.' },
  { label: 'Jezelf aanpassen',                toelichting: 'Niet jezelf zijn om de ander tevreden te houden.' },
  { label: 'Afstand houden',                  toelichting: 'Emotioneel terugtrekken uit zelfbescherming.' },
  { label: 'Altijd beschikbaar zijn',         toelichting: 'Grenzen vervagen, jezelf wegcijferen.' },
  { label: 'Achterhouden',                    toelichting: 'Liefde of aandacht inhouden als controlemechanisme.' },
  { label: 'Zoeken naar bevestiging',         toelichting: 'Liefde willen ontvangen als bewijs van eigenwaarde.' },
  { label: 'Verlaten vóór je verlaten wordt', toelichting: 'De controle houden door eerder weg te gaan.' },
  { label: 'Verwachtingen invullen',           toelichting: 'Denken te weten wat de ander wil en daarnaar handelen.' },
  { label: 'Liefde verdienen',                toelichting: 'Denken dat je eerst "goed genoeg" moet zijn.' },
  { label: 'Romantiseren',                    toelichting: 'De ander of de relatie mooier maken dan hij is.' },
  { label: 'Liefde verwarren met zorg',       toelichting: 'Denken dat zorgen voor de ander hetzelfde is als liefde.' },
  { label: 'Relatie idealiseren',             toelichting: 'Alles op de ander projecteren, jezelf vergeten.' },
];

export const OVERTUIGINGEN = [
  'Ik ben niet goed genoeg om echt geliefd te worden.',
  'Liefde moet je verdienen.',
  'Ik moet mezelf aanpassen om erbij te horen.',
  'Als ik mezelf laat zien, word ik afgewezen.',
  'Er is niemand die écht bij mij past.',
  'Ik ben te veel of te weinig voor anderen.',
  'Ik trek altijd de verkeerde mensen aan.',
  'Als ik me openstel, raak ik gekwetst.',
  'Ik moet eerst mezelf verbeteren voordat ik liefde verdien.',
  'Ware liefde is voor anderen, niet voor mij.',
  'Als ik van mezelf houd, ben ik arrogant.',
  'Zelfliefde is egoïstisch.',
  'Mensen verlaten me altijd.',
  'Ik ben verantwoordelijk voor het geluk van anderen.',
  'Ik moet hard werken voor liefde en aandacht.',
  'Mijn behoeften doen er niet toe.',
  'Ik ben alleen waardevol als ik iets beteken voor een ander.',
  'Als ze echt om me gaven, zouden ze me wel beter behandelen.',
  'Ik ben bang om alleen te zijn.',
  'Liefde doet altijd pijn.',
  'In een relatie verlies ik mezelf altijd.',
  'Ik mag mijn kwetsbaarheid niet laten zien.',
  'Als ik te veel vraag, loopt de ander weg.',
  'Echte liefde bestaat niet.',
  'Liefde en vrijheid gaan niet samen.',
];

export function scoreband(totaal: number): string {
  const max = STELLINGEN.length * 10;
  const pct = totaal / max;
  if (pct <= 0.25) return 'Flauwekul Alarm: Tijd om jezelf weer op nummer 1 te zetten!';
  if (pct <= 0.50) return 'Wankelende Wiebel: Je doet je best, maar oude patronen trekken nog aan je.';
  if (pct <= 0.75) return 'Zelfliefde in de Maak: Je bent goed op weg, blijf oefenen en verzachten.';
  return 'Liefdesbaas: Jij straalt zelfliefde uit en inspireert anderen!';
}

export default function LiefdesLek() {
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

      const prompt = `Op basis van deze belemmerende liefdesovertuigingen die iemand aangevinkt heeft:
${aangevinkteLijst.join('\n')}
${lageStellingen.length > 0 ? `\nEn deze stellingen waarop laag gescoord werd (bewust of onbewust onder 4):\n${lageStellingen.join('\n')}` : ''}

Genereer 5 tot 8 NEGATIEVE existentiële kernovertuigingen in ik-vorm.
Deze gaan NIET over liefde maar over wie de persoon denkt te zijn.
Voorbeelden: "Ik ben niet genoeg", "Ik moet mijn plek verdienen", "Ik ben niet veilig als ik te veel ruimte inneem".
Geef alleen de kernovertuigingen, één per regel, zonder nummering of extra uitleg.`;

      const controller = new AbortController();
      abortRef.current = controller;
      const tekst = await roepAnalyseAan(prompt, 500, controller.signal);
      const lijst = tekst.split('\n').map((r) => r.trim()).filter(Boolean);
      setKernOvertuigingen(lijst);
      setAangevinktKern(lijst.map(() => false));
      setSlidersKern(lijst.map(() => ({ overtuigd: 50, loslaten: 50 })));
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') return;
      setFout(e instanceof Error ? e.message : 'Fout bij genereren kernovertuigingen');
    } finally {
      setKernLoading(false);
    }
  };

  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const sluitSessieAf = async () => {
    setLoading(true);
    setFout('');
    try {
      const gekozenKern = kernOvertuigingen
        .filter((_, i) => aangevinktKern[i])
        .map((k) => {
          const idx = kernOvertuigingen.indexOf(k);
          const slider = slidersKern[idx] ?? { overtuigd: 50, loslaten: 50 };
          return `"${k}" - overtuigd: ${slider.overtuigd}%, bereid om los te laten: ${slider.loslaten}%`;
        });

      const gekozenLiefdeOv = OVERTUIGINGEN.filter((_, i) => aangevinktOv[i]).map((ov) => {
        const idx = OVERTUIGINGEN.indexOf(ov);
        return `"${ov}" - overtuigd: ${slidersOv[idx].overtuigd}%, bereid om los te laten: ${slidersOv[idx].loslaten}%`;
      });

      const stellingenDetail = STELLINGEN.map((s, i) =>
        `  - ${s} (bewust: ${d1[i].bewust}, onbewust: ${d1[i].onbewust})`
      ).join('\n');

      const kloofStellingen = STELLINGEN
        .map((s, i) => ({ s, kloof: Math.abs(d1[i].bewust - d1[i].onbewust), bewust: d1[i].bewust, onbewust: d1[i].onbewust }))
        .filter(({ kloof }) => kloof >= 4)
        .map(({ s, bewust, onbewust }) => `  - "${s}" (bewust: ${bewust}, onbewust: ${onbewust})`);

      const prompt = `Sluit deze LiefdesLek sessie af.

## Energiemeting stellingen (deel 1)
Bewust totaal: ${totaalBewust}/${max} - ${scoreband(totaalBewust)}
Onbewust totaal: ${totaalOnbewust}/${max} - ${scoreband(totaalOnbewust)}
Totaalkloof bewust/onbewust: ${Math.abs(totaalBewust - totaalOnbewust)} punten
${kloofStellingen.length > 0 ? `Stellingen met grote kloof (verschil ≥ 4):\n${kloofStellingen.join('\n')}` : ''}

${stellingenDetail}

## Top 3 liefdessstrategieën (deel 2)
${gekozenStrategieen.length > 0
  ? gekozenStrategieen.map((label, rank) => {
      const s = STRATEGIEEN.find((x) => x.label === label);
      return `${rank + 1}. ${label}: ${s?.toelichting ?? ''}`;
    }).join('\n')
  : 'geen geselecteerd'}

## Belemmerende liefdesovertuigingen (deel 3)
${gekozenLiefdeOv.join('\n') || 'geen aangevinkt'}

## Existentiële kernovertuigingen (deel 4)
${gekozenKern.join('\n') || 'geen aangevinkt'}

## Beschikbare groei-affirmaties (gebruik de meest passende in de afsluiting)
${GROEI_AFFIRMATIES.join('\n')}

Elke stelling is positief geformuleerd en gescoord van 0 (helemaal niet van toepassing) tot 10 (volledig van toepassing), zowel voor bewust als onbewust. Een hogere score betekent dus een sterkere bevestiging van de positieve stelling. Let specifiek op de kloof tussen bewust en onbewust, maar bepaal de richting aan de hand van de daadwerkelijke cijfers: is de onbewuste score hoger dan de bewuste, dan voelt het systeem onbewust meer vertrouwen of overtuiging dan er bewust wordt erkend. Is de onbewuste score lager, dan zit er onbewust meer weerstand of twijfel dan er bewust wordt toegegeven. Ga nooit uit van de aanname dat het onbewuste per definitie negatiever is, baseer de uitleg altijd op de werkelijke richting van de kloof.

Let bij de percentages "overtuigd" en "bereid om los te laten" op het volgende: dit zijn twee onafhankelijke metingen, geen voortgang op één schaal. "Overtuigd" geeft aan hoe diep de overtuiging nu nog verankerd zit. "Bereid om los te laten" geeft aan hoe groot de bereidheid is om die overtuiging los te laten en een ander perspectief aan te nemen, niet hoeveel er al daadwerkelijk losgelaten is. Een lage "bereid om los te laten"-score betekent dat er nog voordelen of weerstand zitten in het vasthouden, niet dat er nog een lange weg te gaan is in loslaten zelf.

Schrijf een persoonlijke conclusie in het Nederlands met exact deze opmaak:

## Samenvatting
2-3 zinnen overall beeld als doorlopende tekst.

## Opvallende patronen
Gebruik voor elk patroon een ### blok:
### [Thema, bijv. "Zelfliefde", "Overtuiging: [naam]"]
2-3 zinnen inzicht. Gebruik **vetgedrukte woorden** voor kernbegrippen.

## Groeikansen
Gebruik voor elke kans een ### blok:
### [Thema of stap]
Concrete aanbeveling in 2-3 zinnen.

## Afsluiting
Warme afsluitende alinea. Kies dan 3-4 affirmaties uit de beschikbare groei-affirmaties die het beste passen bij deze persoon (begin elk met ✨).`;

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

  return (
    <div className="space-y-10">
      <div className="bg-lightBg2 border-l-4 border-midGreen rounded-xl px-4 py-3 text-sm text-darkSlate leading-relaxed">
        <span className="font-semibold text-midGreen">Zo gebruik je dit: </span>
        Doorloop de vier delen op volgorde. Genereer de kernovertuigingen aan het einde van deel 3, laat je klant de resonerende overtuigingen aanvinken, en sluit daarna pas de sessie af.
      </div>
      <div className="text-center">
        <h1 className="font-salmon text-3xl text-darkSlate mb-1">Flauwekul Filter: LiefdesLek</h1>
        <p className="text-orange italic text-sm">"Je kunt niet geven wat je niet hebt. Begin bij jezelf."</p>
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
                <SliderRijLiefde
                  label="Bewust" waarde={d1[i].bewust} soort="slider-bewust" kleur="text-darkRed"
                  onChange={(v) => setD1((p) => p.map((x, idx) => idx === i ? { ...x, bewust: v } : x))}
                />
                <SliderRijLiefde
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
        <h2 className="font-salmon text-xl text-darkSlate mb-1">Deel 2: Liefdessstrategieën</h2>
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
              <div key={s.label} className="flex flex-col gap-0.5 text-xs leading-snug sm:grid sm:grid-cols-[180px_1fr] sm:gap-x-2">
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
          <span className="italic">Dit zijn de diepste stemmen over wie jij bent en wat jij verdient aan liefde.</span>
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
          disabled={loading || kernOvertuigingen.length === 0}
          className="px-8 py-3 rounded-xl bg-darkGreen text-cream font-salmon text-lg hover:bg-darkGreen/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Bezig…' : 'Maak mijn analyse'}
        </button>
        {fout && <p className="text-darkRed text-sm">{fout}</p>}
      </div>

      {analyse && (
        <>
          <AnalyseResultaat tekst={analyse} titel="Liefdes Lek" isLoading={loading} verbergPrintKnop />
          {!loading && (
            <div className="flex justify-center pt-2">
              <LiefdesLekPdfKnop
                d1={d1}
                gekozenStrategieen={gekozenStrategieen}
                aangevinktOv={aangevinktOv}
                slidersOv={slidersOv}
                kernOvertuigingen={kernOvertuigingen}
                aangevinktKern={aangevinktKern}
                slidersKern={slidersKern}
                analyse={analyse}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SliderRijLiefde({ label, waarde, soort, kleur, onChange }: {
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
        style={{ background: sliderBackground(waarde, 100, trackColor, C.lightBg) }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-[10px] text-darkSlate/50 mt-0.5">
        <span>{ankerLinks}</span>
        <span>{ankerRechts}</span>
      </div>
    </div>
  );
}
