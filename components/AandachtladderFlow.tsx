'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { sliderBackground, kleuren as C } from '@/lib/huisstijl';
import type { FlowOvertuiging } from './AandachtladderPdf';

const AandachtladderPdfKnop = dynamic(
  () => import('./AandachtladderPdf').then((m) => m.AandachtladderPdfKnop),
  { ssr: false, loading: () => <span className="text-midGreen text-sm">PDF laden…</span> }
);

const STELLINGEN = [
  'Ik voel me licht en energiek bij wat ik doe.',
  'Ik ben gefocust zonder mezelf te forceren.',
  'Ik verlies de tijd uit het oog omdat ik helemaal opga in mijn taak.',
  'Mijn hoofd voelt rustig en helder.',
  'Ik voel innerlijke rust en beweeg moeiteloos met de stroom mee (ik ervaar weinig tot geen innerlijke weerstand).',
  'Ik handel vanuit vertrouwen in plaats van controle.',
  'Ik voel me creatief en geïnspireerd.',
  'Ik maak keuzes moeiteloos en intuïtief.',
  'Ik ervaar plezier in wat ik doe.',
  'Ik heb het gevoel dat het leven met me meebeweegt.',
];

const OVERTUIGINGEN: { tekst: string; positief: string; groei: string; experiment: string; experimentGroei: string }[] = [
  {
    tekst: 'Ik moet hard werken om iets te bereiken.',
    positief: 'moeiteloos handelen ook tot mooie resultaten leidt',
    groei: 'Ik leer dat moeiteloos handelen ook tot mooie resultaten leidt.',
    experiment: 'Kies vandaag één taak die je normaal zwaar aanpakt en doe hem met bewust minder inspanning. Wat merk je? Lukt het toch?',
    experimentGroei: 'Merk vandaag op wanneer je de drang voelt om harder te werken. Schrijf op: wat ben je bang dat er gebeurt als je het wat rustiger aandoet?',
  },
  {
    tekst: 'Als ik het niet onder controle heb, gaat het mis.',
    positief: 'ik vertrouwen kan hebben in het leven en in mezelf',
    groei: 'Ik leer vertrouwen op het leven en loslaten waar dat mag.',
    experiment: 'Laat vandaag één kleine beslissing over aan iemand anders of aan het toeval. Observeer wat er daarna écht gebeurt.',
    experimentGroei: 'Observeer vandaag één moment waarop je controle wil pakken. Schrijf op: wat ben ik eigenlijk bang om te verliezen?',
  },
  {
    tekst: 'Plezier maken is niet productief.',
    positief: 'plezier en productiviteit prachtig samengaan',
    groei: 'Ik wen aan het idee dat plezier en productiviteit hand in hand gaan.',
    experiment: 'Zet vandaag 15 minuten puur plezier in je agenda als vaste afspraak. Geen uitleg nodig. Kijk hoe de rest van je dag aanvoelt.',
    experimentGroei: 'Schrijf op: welk voordeel brengt het idee dat plezier niet productief is jou? Wat beschermt deze overtuiging jou voor?',
  },
  {
    tekst: 'Ik moet het eerst verdienen voordat ik iets (geld, hulp, liefde, een compliment etc.) mag ontvangen.',
    positief: 'ik mag ontvangen gewoon door wie ik ben',
    groei: 'Ik leer dat ik mag ontvangen gewoon door wie ik ben.',
    experiment: 'Accepteer vandaag één compliment of aanbod volledig zonder iets terug te geven. Zeg gewoon: "Dankjewel." En laat het landen.',
    experimentGroei: 'Merk vandaag op hoe het voelt als iemand iets aan je geeft of aanbiedt. Wat is het eerste gevoel dat opkomt? Schrijf het op.',
  },
  {
    tekst: 'Anderen weten beter wat goed voor mij is.',
    positief: 'ik mijn eigen wijsheid en innerlijk gevoel kan vertrouwen',
    groei: 'Ik leer vertrouwen op mijn eigen wijsheid en innerlijk gevoel.',
    experiment: 'Maak vandaag één keuze puur op basis van wat jíj voelt, zonder iemand te vragen wat zij ervan vinden. Hoe voelt dat?',
    experimentGroei: 'Schrijf op: wanneer vertrouwde je wél op jezelf en had je het bij het rechte eind? Wat vertelt dat over jouw eigen wijsheid?',
  },
  {
    tekst: 'Rust nemen is lui.',
    positief: 'rust een essentieel onderdeel is van mijn kracht en groei',
    groei: 'Ik leer dat rust een essentieel onderdeel is van mijn kracht en groei.',
    experiment: 'Plan vandaag een rustmoment van 10 minuten en noem het in je hoofd "opladen" in plaats van "niets doen". Merk je het verschil?',
    experimentGroei: 'Merk vandaag op hoe je innerlijk reageert als je een moment stilzit. Welke gedachten komen er op? Schrijf ze op zonder oordeel.',
  },
  {
    tekst: 'Ik mag pas ontspannen als alles af is.',
    positief: 'ik mag ontspannen en genieten, ook als er nog dingen openstaan',
    groei: 'Ik werk aan ontspannen en genieten, ook als er nog dingen openstaan.',
    experiment: 'Stop vandaag met werken terwijl er nog iets openstaat. Noteer na 30 minuten ontspanning hoe het écht ging met die openstaande taak.',
    experimentGroei: 'Maak een lijst van dingen die "af moeten" zijn. Is die lijst ooit écht helemaal leeg? Wat zegt dat over je?',
  },
  {
    tekst: 'Mijn waarde hangt af van wat ik presteer.',
    positief: 'mijn waarde er gewoon is, los van wat ik doe of presteer',
    groei: 'Ik leer dat mijn waarde er gewoon is, los van wat ik doe of presteer.',
    experiment: 'Schrijf aan het einde van vandaag drie dingen op die jou waardevol maken die niets met prestaties of productiviteit te maken hebben.',
    experimentGroei: 'Denk aan iemand van wie je houdt. Is jouw liefde voor diegene gebaseerd op wat hij of zij presteert? Wat vertelt dat jou over jouw eigen waarde?',
  },
  {
    tekst: 'Het is gevaarlijk om fouten te maken.',
    positief: 'fouten maken hoort bij groeien en ik daarin volkomen veilig ben',
    groei: 'Ik leer dat fouten maken hoort bij groeien, en dat ik daar veilig in ben.',
    experiment: 'Doe vandaag bewust iets imperfects: stuur een berichtje zonder het te corrigeren, of lever een taak in op 80%. Wat gebeurt er echt?',
    experimentGroei: 'Denk aan een fout die je eerder maakte. Wat leerde het je? Schrijf op wat die fout je uiteindelijk heeft opgeleverd. Welke kwaliteit ontwikkel je hierdoor?',
  },
  {
    tekst: 'Ik kan niet op mijn intuïtie vertrouwen.',
    positief: 'ik mijn intuïtie kan vertrouwen en haar wijsheid mag volgen',
    groei: 'Ik leer luisteren naar mijn intuïtie en haar steeds meer te vertrouwen.',
    experiment: 'Maak vandaag één kleine beslissing volledig op gevoel, zonder nadenken. Noteer achteraf: was je blij met de uitkomst?',
    experimentGroei: 'Merk vandaag op wanneer je je intuïtie of onderbuik voelt aangeven dat iets goed voelt, of juist foute boel is. Schrijf je gevoel op zonder er iets mee te doen. Check aan het einde van de dag of je gevoel klopte.',
  },
];

type SliderOv = { overtuigd: number; loslaten: number };

function scoreband(totaal: number): { tekst: string; kleur: string; bg: string } {
  if (totaal >= 80) return {
    tekst: 'Je zit stevig in de flow.',
    kleur: 'text-darkGreen',
    bg: 'bg-darkGreen/10',
  };
  if (totaal >= 50) return {
    tekst: 'Je hebt momenten van flow, maar er is ruimte voor meer moeiteloosheid.',
    kleur: 'text-orange',
    bg: 'bg-orange/10',
  };
  return {
    tekst: 'Tijd om blokkades te onderzoeken en meer ruimte te maken voor rust en inspiratie.',
    kleur: 'text-darkRed',
    bg: 'bg-darkRed/10',
  };
}

export default function AandachtladderFlow() {
  const [scores, setScores] = useState<number[]>(STELLINGEN.map(() => 0));
  const [aangevinkt, setAangevinkt] = useState<boolean[]>(OVERTUIGINGEN.map(() => false));
  const [sliders, setSliders] = useState<SliderOv[]>(OVERTUIGINGEN.map(() => ({ overtuigd: 50, loslaten: 50 })));

  const totaal = scores.reduce((s, x) => s + x, 0);
  const band = scoreband(totaal);

  const actieveOvertuigingen: FlowOvertuiging[] = OVERTUIGINGEN
    .map((ov, i) => ({ ...ov, overtuigd: sliders[i].overtuigd, loslaten: sliders[i].loslaten }))
    .filter((_, i) => aangevinkt[i]);

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="font-salmon text-3xl text-darkSlate mb-1">FLOW-test</h1>
        <p className="text-midGreen italic text-sm">"Hoe vrij stroomt jouw energie op dit moment?"</p>
      </div>

      {/* Deel 1: flowmeting */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
        <h2 className="font-salmon text-xl text-darkSlate mb-2">Flowmeting</h2>
        <p className="text-sm text-midGreen mb-1">Vraag met de biotensor aan jouw onderbewustzijn:</p>
        <p className="text-sm text-darkSlate italic mb-6 pl-3 border-l-2 border-midGreen">
          "Op een schaal van 0 tot 10, hoe waar is deze stelling op dit moment voor mij?"
        </p>

        <div className="space-y-5">
          {STELLINGEN.map((stelling, i) => (
            <div key={i} className="border-b border-lightBg pb-4 last:border-0 last:pb-0">
              <p className="text-sm text-darkSlate mb-2">
                <span className="text-midGreen font-bold mr-1">{i + 1}.</span>
                {stelling}
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={scores[i]}
                  aria-label={stelling}
                  className="flex-1 slider-onbewust"
                  style={{ background: sliderBackground(scores[i], 10, C.darkGreen) }}
                  onChange={(e) =>
                    setScores((p) => p.map((x, idx) => (idx === i ? Number(e.target.value) : x)))
                  }
                />
                <span className="text-sm font-bold w-5 text-right text-darkGreen">{scores[i]}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-6 rounded-xl p-5 text-center ${band.bg}`}>
          <div className={`text-4xl font-bold ${band.kleur}`}>
            {totaal}
            <span className="text-xl text-darkSlate/40">/100</span>
          </div>
          <div className={`mt-2 text-sm font-medium ${band.kleur}`}>{band.tekst}</div>
          <div className="mt-2 text-[11px] text-darkSlate/50 space-x-3">
            <span>80-100: stevig in flow</span>
            <span>·</span>
            <span>50-79: momenten van flow</span>
            <span>·</span>
            <span>0-49: blokkades onderzoeken</span>
          </div>
        </div>
      </section>

      {/* Deel 2: belemmerende overtuigingen */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
        <h2 className="font-salmon text-xl text-darkSlate mb-1">Belemmerende overtuigingen</h2>
        <p className="text-sm text-midGreen mb-4">
          Vraag de biotensor: "Is deze overtuiging nu actief in mij?" Vink aan wat resoneert.
        </p>

        <div className="space-y-3">
          {OVERTUIGINGEN.map((ov, i) => (
            <div
              key={i}
              className={`rounded-xl p-3 border transition-colors ${
                aangevinkt[i] ? 'border-orange bg-lightBg2' : 'border-lightBg'
              }`}
            >
              <label htmlFor={`ov-${i}`} className="flex items-start gap-3 cursor-pointer">
                <input
                  id={`ov-${i}`}
                  type="checkbox"
                  checked={aangevinkt[i]}
                  onChange={(e) =>
                    setAangevinkt((p) => p.map((x, idx) => (idx === i ? e.target.checked : x)))
                  }
                  className="mt-0.5 accent-orange"
                />
                <span className="text-sm text-darkSlate">
                  <span className="text-midGreen font-bold mr-1">{i + 1}.</span>
                  {ov.tekst}
                </span>
              </label>

              {aangevinkt[i] && (
                <div className="mt-3 pl-6 space-y-3">
                  <SliderPercentage
                    label="% overtuigd"
                    sublabel="hoe diep gelooft jouw systeem dat dit waar is?"
                    waarde={sliders[i].overtuigd}
                    isLoslaten={false}
                    onChange={(v) =>
                      setSliders((p) =>
                        p.map((x, idx) => (idx === i ? { ...x, overtuigd: v } : x))
                      )
                    }
                  />
                  <SliderPercentage
                    label="% bereid tot loslaten"
                    sublabel="hoe klaar ben jij om dit los te laten?"
                    waarde={sliders[i].loslaten}
                    isLoslaten={true}
                    onChange={(v) =>
                      setSliders((p) =>
                        p.map((x, idx) => (idx === i ? { ...x, loslaten: v } : x))
                      )
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Affirmaties voor de hardnekkigste 3 */}
      <AffirmatieBlok aangevinkt={aangevinkt} sliders={sliders} />

      <div className="flex justify-center">
        <AandachtladderPdfKnop
          totaal={totaal}
          bandTekst={band.tekst}
          stellingen={STELLINGEN.map((tekst, i) => ({ tekst, score: scores[i] }))}
          overtuigingen={actieveOvertuigingen}
        />
      </div>
    </div>
  );
}

function SliderPercentage({
  label,
  sublabel,
  waarde,
  isLoslaten,
  onChange,
}: {
  label: string;
  sublabel: string;
  waarde: number;
  isLoslaten: boolean;
  onChange: (v: number) => void;
}) {
  const trackColor = isLoslaten ? C.darkGreen : C.darkRed;
  const kleur = isLoslaten ? 'text-darkGreen' : 'text-darkRed';
  const ankerLinks = isLoslaten ? 'nog niet klaar' : 'helemaal niet';
  const ankerRechts = isLoslaten ? 'helemaal klaar' : 'zit diep verankerd';

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline text-xs">
        <span className="text-midGreen font-medium">
          {label}{' '}
          <span className="text-darkSlate/50 font-normal">{sublabel}</span>
        </span>
        <span className={`font-bold ${kleur}`}>{waarde}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={waarde}
        aria-label={label}
        className={`w-full ${isLoslaten ? 'slider-onbewust' : 'slider-bewust'}`}
        style={{ background: sliderBackground(waarde, 100, trackColor) }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-[10px] text-darkSlate/50">
        <span>{ankerLinks}</span>
        <span>{ankerRechts}</span>
      </div>
    </div>
  );
}

function AffirmatieBlok({
  aangevinkt,
  sliders,
}: {
  aangevinkt: boolean[];
  sliders: SliderOv[];
}) {
  const top3 = OVERTUIGINGEN
    .map((ov, i) => ({ ov, i, overtuigd: sliders[i].overtuigd, loslaten: sliders[i].loslaten }))
    .filter(({ i }) => aangevinkt[i])
    .sort((a, b) => b.overtuigd - a.overtuigd)
    .slice(0, 3);

  if (top3.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
      <h2 className="font-salmon text-xl text-darkSlate mb-3">Tijd voor een doorbraak!</h2>
      <div className="text-sm text-darkSlate/80 leading-relaxed mb-3 space-y-2">
        <p>De meest hardnekkige overtuigingen vragen jou om een <strong>bewuste keuze</strong> te maken.</p>
        <ul className="list-disc list-outside pl-4 space-y-1">
          <li>Als je al meer dan 50% bereid bent tot loslaten van je oude verhaal, dan kom je met positieve affirmaties (en kleine acties of gedragsexperimentjes die daarbij passen) vaak al een heel eind.</li>
          <li>Soms heb je eerst nog te werken aan het vergroten van de bereidheid tot het loslaten van je overtuiging, omdat die overtuiging je ook nog steeds een voordeel brengt. In dat geval is een groei-affirmatie fijner. Daarmee laat je je lichaam wennen aan het idee van verandering (dat voelt veilig, want een groei-affirmatie voelt minder groots). Affirmaties die compleet ongeloofwaardig voelen doen namelijk weinig of niets voor je.</li>
        </ul>
      </div>
      <p className="text-sm text-midGreen mb-4">
        Spreek onderstaande affirmaties hardop uit (met of zonder je biotensor), of schrijf ze op.
      </p>
      <h3 className="font-salmon text-lg text-darkSlate mb-3">Jouw affirmaties</h3>
      <div className="space-y-3">
        {top3.map(({ ov, i, loslaten }) => {
          const klaar = loslaten >= 50;
          const tekst = ov.tekst.endsWith('.')
            ? ov.tekst.slice(0, -1).toLowerCase()
            : ov.tekst.toLowerCase();
          return (
            <div
              key={i}
              className={`rounded-xl p-4 border-l-4 ${
                klaar ? 'border-darkGreen bg-darkGreen/5' : 'border-orange bg-orange/5'
              }`}
            >
              <p className="text-sm italic text-darkSlate leading-relaxed">
                {klaar ? (
                  <>
                    "Ik kies ervoor om de overtuiging{' '}
                    <span className="font-semibold not-italic">{tekst}</span>{' '}
                    los te laten, omdat ik weet dat {ov.positief}. Dankjewel overtuiging, dat je me al die tijd hebt beschermd. Ik kies er nu voor om te vertrouwen op mijn natuurlijke flow."
                  </>
                ) : (
                  <span>{ov.groei}</span>
                )}
              </p>
              <p className={`text-[10px] mt-2 mb-3 ${klaar ? 'text-darkGreen' : 'text-orange'}`}>
                {klaar ? `${loslaten}% bereid: klaar om los te laten` : `${loslaten}% bereid: groei-affirmatie`}
              </p>
              <div className="rounded-lg bg-white/70 border border-darkSlate/10 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-darkSlate/40 mb-1">Speel het anders!</p>
                <div className="flex gap-2 items-start">
                  <span className="text-base leading-none mt-0.5">🧪</span>
                  <p className="text-xs text-darkSlate/70 leading-relaxed">{klaar ? ov.experiment : ov.experimentGroei}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
