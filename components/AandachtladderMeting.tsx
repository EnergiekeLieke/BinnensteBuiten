'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { sliderBackground, kleuren as C } from '@/lib/huisstijl';

const AandachtladderMetingPdfKnop = dynamic(
  () => import('./AandachtladderMetingPdf').then(m => m.AandachtladderMetingPdfKnop),
  { ssr: false, loading: () => <span className="text-sm text-midGreen">PDF laden…</span> }
);

// ── Data ──────────────────────────────────────────────────────────────────────

const LADDER = [
  { id: 10, naam: 'Inspiratie/FLOW', sub: 'aandacht bij creatie, energie en plezier, verbinding voelen met jezelf en anderen', groep: 'groen' },
  { id:  9, naam: 'Dankbaarheid',    sub: 'aandacht bij wat er nu al is',              groep: 'groen' },
  { id:  8, naam: 'Vertrouwen',      sub: 'aandacht bij wat wél werkt',                groep: 'groen' },
  { id:  7, naam: 'Mogelijkheden',   sub: 'aandacht bij kansen en oplossingen',        groep: 'groen' },
  { id:  6, naam: 'Keuze maken',     sub: 'je kunt je aandacht bewust verplaatsen',    groep: 'oranje' },
  { id:  5, naam: 'Bewust worden',   sub: 'je merkt op waar je aandacht zit',          groep: 'oranje' },
  { id:  4, naam: 'Controle',        sub: 'aandacht bij alles willen regelen',         groep: 'rood' },
  { id:  3, naam: 'Zorgen',          sub: 'aandacht bij wat er mis kan gaan',          groep: 'rood' },
  { id:  2, naam: 'Problemen',       sub: 'aandacht bij wat niet goed gaat',           groep: 'rood' },
  { id:  1, naam: 'Overleven',       sub: 'aandacht bij stress, moeten, druk',         groep: 'rood' },
] as const;

export type Trede = typeof LADDER[number];

function tredeBg(id: number): string {
  const t = (id - 1) / 9; // 0 = trede 1 (rood) → 1 = trede 10 (groen)
  const hue   = Math.round(15 + t * 95);  // 15° rood → 110° groen
  const sat   = Math.round(72 - t * 50);  // 72% → 22%
  const light = Math.round(36 - t * 9);   // 36% → 27%
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

export type Duo = {
  links: string;
  rechts: string;
  uitleg: string;
  vragen: [string, string, string];
  tip?: string;
  subkeuze?: { vraag: string; opties: string[] };
};

export const DUOS: Duo[] = [
  {
    links: 'Problemen', rechts: 'Oplossingen',
    uitleg: 'Je kunt met je biotensor je huidige percentage **optimisme** meten. Laat gevoelens van oordeel zoveel mogelijk los!',
    vragen: [
      'Wat gebeurt er als ik mijn aandacht meer op oplossingen richt?',
      'Waarvoor zou je graag een oplossing vinden?',
      'Hoe zou je je voelen als die oplossing er is?',
    ],
  },
  {
    links: 'Verleden / Toekomst', rechts: 'Het hier en nu',
    uitleg: '**Tijdreizen** is menselijk. In ons hoofd zijn we vaak bezig met wat er in het verleden is gebeurd (misschien bang dat iets opnieuw misgaat?) of met wat er mogelijk in de toekomst zal gebeuren (controledrang?).',
    vragen: [
      'Wat gebeurt er als je je aandacht meer op hier en nu richt?',
      'Welke dingen laat je liever achter je?',
      'Hoe kun jij jouw toekomstige jij (Future Self) nú al BLIJ maken?',
    ],
    tip: 'Discipline is "zorgen voor dopamine voor je toekomstige zelf!"',
    subkeuze: { vraag: 'Gaat het bij jou voornamelijk om...', opties: ['Verleden', 'Toekomst', 'Allebei'] },
  },
  {
    links: 'Tekorten', rechts: 'Mogelijkheden',
    uitleg: 'Richt jij je aandacht vaak op dat wat er ontbreekt? Of ben je ook in staat te zien welke mogelijkheden er zijn? Als je je aandacht en **dankbaarheid** richt op wat er nu al is, kan het groeien!',
    vragen: [
      'Wat gebeurt er als je je aandacht meer op overvloed richt?',
      'Waarvoor voel je je vandaag dankbaar?',
      'Waarop verheug jij je nu al? (iets wat momenteel nog naar jou onderweg is)',
    ],
    tip: '"Ik kijk uit naar momenten van lachen, spelen en genieten!"',
  },
  {
    links: 'Controle', rechts: 'Vertrouwen',
    uitleg: 'Handel jij vanuit vertrouwen? Durf je te **springen**, ook al weet je de uitkomst niet? Of houd je liever alles onder controle en wil je de uitkomst het liefst zeker weten?',
    vragen: [
      'Wat gebeurt er als je je aandacht meer op vertrouwen richt?',
      'Wat gebeurt er met mijn energielevel als ik angst en controle loslaat?',
      'Wat heb ik nodig om meer vertrouwen te voelen?',
    ],
    tip: 'Wat als het wél lukt?',
  },
  {
    links: 'Anderen', rechts: 'Eigen behoeften',
    uitleg: 'Veel bezig met anderen? Constant voelen hoe het met ze gaat? Kun je je aandacht zachtjes terugbewegen naar jouw eigen **binnenwereld**, zodat je ook je eigen behoeften goed kunt voelen?',
    vragen: [
      'Wat gebeurt er als ik mijn aandacht meer op mijn eigen gevoel richt?',
      'Wat gebeurt er als ik me wat minder bezighoud met anderen?',
      'Wat heb ik nodig om goed te kunnen voelen wat ik zelf nodig heb?',
    ],
  },
  {
    links: 'Energievreters', rechts: 'Energiegevers',
    uitleg: 'Bij weglekkende energie heb je altijd drie keuzes: accepteren, veranderen, of (beperkt) afstand nemen. **Klagen** over wat energie kost, is niet per se helpend.',
    vragen: [
      'Wat gebeurt er als ik mijn aandacht richt op wat mij energie geeft?',
      'Welke keuze maak ik? Waarom?',
      'Op welke dingen ga ik me voortaan meer focussen?',
    ],
  },
  {
    links: 'Vermijden', rechts: 'Voelen',
    uitleg: 'Door je te verzetten en je emoties te vermijden, maak je het lijden eigenlijk alleen maar erger. Emoties willen gevoeld worden. Leer jezelf dat voelen **veilig** is.',
    vragen: [
      'Wat gebeurt er als ik mijn emoties de ruimte geef, in plaats van wegstop?',
      'Welke emoties ben ik geneigd uit de weg te gaan?',
      'Hoe kan ik deze pijn erkennen, accepteren en betekenis geven?',
    ],
  },
  {
    links: 'Afleiding', rechts: 'Focus',
    uitleg: 'Afleiding zoeken is vaak **coping**: een overlevingsmechanisme om niet te hoeven voelen. Welk ongemak of welke emotie probeer je te vermijden door afleiding te zoeken?',
    vragen: [
      'Wat gebeurt er als ik alle afleiding even weghaal, zodat ik me kan concentreren?',
      'Welke emoties of ongemakken probeer ik te vermijden?',
      'Hoe kan ik zorgen dat ik goed kan voelen wat er speelt in mijn binnenwereld?',
    ],
  },
  {
    links: 'Afschuiven', rechts: 'Verantwoordelijk',
    uitleg: 'Jouw cirkel van betrokkenheid is altijd groter dan je cirkel van **invloed**. Doen wat binnen jouw cirkel van invloed ligt, is altijd meer helpend dan wijzen naar anderen.',
    vragen: [
      'Wat gebeurt er als ik de juiste verantwoordelijkheid neem?',
      'Waar wijs ik naar anderen, terwijl ik eigenlijk beter naar mezelf kan kijken?',
      'Wat ligt er binnen mijn cirkel van invloed? Waarvoor ben ik zelf verantwoordelijk?',
    ],
  },
  {
    links: 'Rationaliseren', rechts: 'Voelen',
    uitleg: 'Ons hoofd is geneigd een heel **verhaal** te bouwen rondom wat zich afspeelt in onze binnenwereld. Emoties willen gevoeld worden. Rationaliseren kan een overlevingsmechanisme zijn om maar niet te hoeven voelen.',
    vragen: [
      'Wat gebeurt er als ik er geen verhaal omheen bouw, maar gewoon voel?',
      'Waar in mijn lichaam wil er graag iets gevoeld worden?',
      'Wat gebeurt er als ik stop met analyseren van dit gevoel?',
    ],
  },
  {
    links: 'Oordeel', rechts: 'Mildheid',
    uitleg: 'Streng zijn voor jezelf en je eigen gevoelens **veroordelen**, is vaak coping. Hierdoor mag je gevoel er eigenlijk niet zijn, stop je het weg en hoef je het niet te voelen.',
    vragen: [
      'Wat gebeurt er als ik wat milder ben voor mezelf?',
      'Waarover ben ik vaak streng voor mezelf?',
      'Zou een ander net zo streng voor mij zijn als ik zelf? Waarom (niet)?',
    ],
  },
  {
    links: 'Haasten', rechts: 'Vertragen',
    uitleg: 'De haast en stress die je voelt kan van jouzelf zijn, maar je kunt je ook onder druk gezet voelen door de buitenwereld. Kun jij duidelijk onderscheid maken tussen jouw eigen **tempo** en dat van de ander?',
    vragen: [
      'Wat gebeurt er als ik wat rustiger aan doe?',
      'Als niet alle TO DO\'s af zijn, wat gebeurt er dan?',
      'Welke dingen kunnen ook later? Wat kan ik delegeren of overslaan?',
    ],
  },
  {
    links: 'Opkroppen', rechts: 'Emoties uiten',
    uitleg: 'Als je emoties laat komen en gaan als golven, bewegen ze vanzelf weer door. Maar als je ze tegenhoudt of wegdrukt, is het net als een **strandbal** onder water houden: die bal komt altijd weer omhoog.',
    vragen: [
      'Wat gebeurt er als ik mijn emoties wat duidelijker toon aan de buitenwereld?',
      'Welke emoties vind ik lastig om te uiten?',
      'Wat heb ik vroeger geleerd over het uiten en tonen van emoties?',
    ],
  },
  {
    links: 'Gemak', rechts: 'Moeite doen',
    uitleg: 'Soms is kiezen voor gemak een kwaliteit. Maar als je gemak bedoeld is om emoties of verantwoordelijkheid te **ontwijken**, werkt het tegen je.',
    vragen: [
      'Wat gebeurt er als ik wat meer moeite doe? Of juist wat minder?',
      'Waar mag ik wat meer moeite voor doen?',
      'Wanneer ben ik (te) hard aan het werk en mag ik juist kiezen voor gemak?',
    ],
  },
  {
    links: 'Serieus', rechts: 'Speelsheid',
    uitleg: 'Soms zit je zo in het moeten, regelen en doorgaan dat alles zwaar en serieus voelt. Speelsheid brengt lucht, ontspanning en creativiteit. Het voelt **licht**, want je haalt de druk eraf.',
    vragen: [
      'Wat gebeurt er in mijn lichaam als ik alles heel serieus neem?',
      'Waar mag ik vandaag iets lichter en speelser maken? Waar doe ik dat al?',
      'Wat zou ik doen als het niet perfect hoefde, maar gewoon leuk mocht zijn?',
    ],
  },
  {
    links: 'Jezelf klein maken', rechts: 'Je plek innemen',
    uitleg: 'Iemand anders maakt zich groot door woorden, energie of aanwezigheid. Voor je het weet maak jij jezelf **kleiner**. Je plek innemen betekent: blijven staan, juist op dat moment!',
    vragen: [
      'Maak ik mezelf momenteel (onbewust) kleiner? Waar doe ik dat?',
      'Wat zou er gebeuren als ik iets meer ruimte inneem?',
      'Wat helpt mij vandaag om te blijven staan, als een ander zich groot maakt?',
    ],
  },
  {
    links: 'Afwachten', rechts: 'Eigenaarschap nemen',
    uitleg: 'Zit je in de **wachtstand**? Wachtend op meer tijd, het juiste moment, of een teken van buitenaf? Jij bent degene die een kleine beweging mag maken!',
    vragen: [
      'Waar ben ik op aan het wachten?',
      'Als je voelt "Dit is van mij" — wat zou je dan zeggen, kiezen of (niet meer) doen?',
      'Wat is één kleine eerste stap in die richting, die ik vandaag al kan zetten?',
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function AandachtladderMeting() {
  const [stap, setStap]                   = useState<1|2|3|4>(1);
  const [trede, setTrede]                 = useState<Trede | null>(null);
  const [duo, setDuo]                     = useState<Duo | null>(null);
  const [subkeuzeKeuze, setSubkeuzeKeuze] = useState<string | null>(null);
  const [percentage, setPercentage]       = useState(50);
  const [antwoorden, setAntwoorden]       = useState<[string, string, string]>(['', '', '']);

  const vorige = () => setStap(s => (s > 1 ? (s - 1) as 1|2|3|4 : s));

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="font-salmon text-3xl text-darkSlate mb-1">Aandachtladder</h1>
        <p className="text-midGreen text-sm italic">Waar zit je met je aandacht?</p>
      </div>

      <div className="bg-lightBg2 border-l-4 border-midGreen rounded-xl px-4 py-3 text-sm text-darkSlate leading-relaxed">
        <span className="font-semibold text-midGreen">Zo gebruik je dit: </span>
        Test met de biotensor op welke trede je vandaag staat. Kies het duo dat nu jouw aandacht vraagt. Meet je huidige score en gebruik de journallingvragen om dieper te gaan.
      </div>

      {/* Stap indicator */}
      <div className="flex gap-2">
        {([1,2,3,4] as const).map(n => (
          <div key={n} className={`flex-1 h-1.5 rounded-full transition-colors ${stap >= n ? 'bg-darkGreen' : 'bg-lightBg'}`} />
        ))}
      </div>
      <p className="text-xs text-midGreen -mt-6 text-right">Stap {stap} van 4</p>

      {stap === 1 && <Stap1Ladder trede={trede} setTrede={setTrede} onVolgende={() => setStap(2)} />}
      {stap === 2 && <Stap2Duo duo={duo} setDuo={d => { setDuo(d); setSubkeuzeKeuze(null); }} subkeuzeKeuze={subkeuzeKeuze} setSubkeuzeKeuze={setSubkeuzeKeuze} onVolgende={() => setStap(3)} onVorige={vorige} />}
      {stap === 3 && duo && (
        <Stap3Meting duo={duo} percentage={percentage} setPercentage={setPercentage} onVolgende={() => setStap(4)} onVorige={vorige} />
      )}
      {stap === 4 && duo && trede && (
        <Stap4Journalling
          trede={trede} duo={duo} subkeuzeKeuze={subkeuzeKeuze} percentage={percentage}
          antwoorden={antwoorden} setAntwoorden={setAntwoorden}
          onVorige={vorige}
        />
      )}
    </div>
  );
}

// ── Stap 1: Ladder ────────────────────────────────────────────────────────────

function Stap1Ladder({ trede, setTrede, onVolgende }: {
  trede: Trede | null;
  setTrede: (t: Trede) => void;
  onVolgende: () => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-salmon text-xl text-darkSlate">Op welke trede sta jij vandaag?</h2>

      <div className="rounded-xl bg-lightBg2 px-5 py-4 space-y-2 text-sm text-darkSlate/80 leading-relaxed">
        <p>Je zenuwstelsel heeft twee standen:</p>
        <ul className="space-y-1.5 pl-1">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-darkRed">●</span>
            <span>In de <span className="font-semibold text-darkRed">overleefstand</span> reageert je lijf op (ervaren) gevaar: je vecht <span className="text-darkRed/70 text-xs">(fight)</span>, vlucht <span className="text-darkRed/70 text-xs">(flight)</span>, bevriest <span className="text-darkRed/70 text-xs">(freeze)</span> of past je aan om erbij te horen <span className="text-darkRed/70 text-xs">(fawn)</span>. Je aandacht vernauwt zich automatisch naar het probleem.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-darkGreen">●</span>
            <span>In de <span className="font-semibold text-darkGreen">FLOW-stand</span> voelt je systeem zich veilig. Je kunt rusten <span className="text-darkGreen/70 text-xs">(rest)</span>, verteren <span className="text-darkGreen/70 text-xs">(digest)</span>, creëren <span className="text-darkGreen/70 text-xs">(create)</span> en verbinden <span className="text-darkGreen/70 text-xs">(connect)</span>. Je aandacht opent zich voor wat mogelijk is.</span>
          </li>
        </ul>
        <p className="text-xs text-midGreen italic">De ladder laat zien waar jouw aandacht vandaag zit, en helpt je stap voor stap richting FLOW te bewegen.</p>
      </div>

      <p className="text-sm text-midGreen">Test met de biotensor of kies intuïtief. Bekijk en accepteer waar jij nu staat, zonder erover te oordelen. Alles is informatie.</p>

      <div className="space-y-2">
        {LADDER.map(t => {
          const geselecteerd = trede?.id === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTrede(t)}
              style={{ backgroundColor: tredeBg(t.id) }}
              className={`w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 transition-all border-2 text-cream ${geselecteerd ? 'ring-2 ring-offset-2 ring-white/60 border-transparent scale-[1.01]' : 'border-transparent opacity-80 hover:opacity-100'}`}
            >
              <span className="font-bold text-lg w-7 shrink-0 opacity-70">{t.id}</span>
              <div>
                <p className="font-salmon text-base leading-tight">{t.naam}</p>
                <p className="text-xs opacity-80 leading-tight">{t.sub}</p>
              </div>
              {geselecteerd && <span className="ml-auto text-lg">✓</span>}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onVolgende}
          disabled={!trede}
          className="px-6 py-2.5 rounded-xl bg-darkGreen text-cream font-salmon hover:bg-darkGreen/90 transition-colors disabled:opacity-40"
        >
          Volgende stap →
        </button>
      </div>
    </div>
  );
}

// ── Stap 2: Duo kiezen ────────────────────────────────────────────────────────

function UitlegTekst({ tekst }: { tekst: string }) {
  const delen = tekst.split(/\*\*(.+?)\*\*/g);
  return (
    <p className="text-sm text-darkSlate leading-relaxed">
      {delen.map((deel, i) =>
        i % 2 === 1
          ? <strong key={i} className="font-semibold">{deel}</strong>
          : <span key={i}>{deel}</span>
      )}
    </p>
  );
}

function Stap2Duo({ duo, setDuo, subkeuzeKeuze, setSubkeuzeKeuze, onVolgende, onVorige }: {
  duo: Duo | null;
  setDuo: (d: Duo) => void;
  subkeuzeKeuze: string | null;
  setSubkeuzeKeuze: (v: string | null) => void;
  onVolgende: () => void;
  onVorige: () => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-salmon text-xl text-darkSlate">Welk onderwerp mag vandaag jouw aandacht?</h2>
      <p className="text-sm text-midGreen">Kies het duo dat het meest bij dit moment past.</p>

      <div className="flex flex-col gap-2">
        {DUOS.map((d, i) => {
          const geselecteerd = duo === d;
          const kanDoorgaan = !d.subkeuze || subkeuzeKeuze !== null;
          return (
            <div key={i} className={`rounded-xl border-2 transition-all ${geselecteerd ? 'border-darkGreen bg-darkGreen/10' : 'border-lightBg bg-white'}`}>
              <button
                onClick={() => setDuo(d)}
                className="w-full text-left px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-darkRed uppercase tracking-wide">{d.links}</span>
                  <span className="text-darkSlate/30 text-xs">↔</span>
                  <span className="text-xs font-bold text-darkGreen uppercase tracking-wide">{d.rechts}</span>
                  {geselecteerd && <span className="ml-auto text-[10px] text-darkGreen font-medium">✓</span>}
                </div>
              </button>

              {geselecteerd && (
                <div className="px-4 pb-4 space-y-3">
                  <UitlegTekst tekst={d.uitleg} />
                  {d.tip && <p className="text-sm italic text-midGreen border-l-2 border-midGreen pl-3">{d.tip}</p>}

                  {d.subkeuze && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-darkSlate">{d.subkeuze.vraag}</p>
                      <div className="flex gap-2 flex-wrap">
                        {d.subkeuze.opties.map(optie => (
                          <button
                            key={optie}
                            onClick={() => setSubkeuzeKeuze(optie === subkeuzeKeuze ? null : optie)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                              subkeuzeKeuze === optie
                                ? 'bg-darkGreen text-cream border-darkGreen'
                                : 'bg-white text-darkSlate border-lightBg hover:border-darkGreen/40'
                            }`}
                          >
                            {optie}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={onVolgende}
                    disabled={!kanDoorgaan}
                    className="w-full px-6 py-2.5 rounded-xl bg-darkGreen text-cream font-salmon hover:bg-darkGreen/90 transition-colors text-sm disabled:opacity-40"
                  >
                    Ga naar de meting en journallingvragen →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <button onClick={onVorige} className="px-5 py-2 rounded-xl border border-midGreen text-midGreen hover:bg-midGreen/10 transition-colors text-sm">
          ← Terug
        </button>
      </div>
    </div>
  );
}

// ── Stap 3: Meting ────────────────────────────────────────────────────────────

function Stap3Meting({ duo, percentage, setPercentage, onVolgende, onVorige }: {
  duo: Duo;
  percentage: number;
  setPercentage: (v: number) => void;
  onVolgende: () => void;
  onVorige: () => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-salmon text-xl text-darkSlate">Meet je huidige score</h2>

      <div className="bg-white rounded-2xl p-5 border border-lightBg shadow-sm space-y-4">
        <UitlegTekst tekst={duo.uitleg} />
        {duo.tip && (
          <p className="text-sm italic text-midGreen border-l-2 border-midGreen pl-3">{duo.tip}</p>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5 border border-lightBg shadow-sm space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-sm font-bold text-darkRed">{duo.links}</span>
          <span className="text-2xl font-bold text-darkGreen">{percentage}%</span>
          <span className="text-sm font-bold text-darkGreen">{duo.rechts}</span>
        </div>
        <input
          type="range"
          min={0} max={100} step={5}
          value={percentage}
          aria-label={`${duo.links} naar ${duo.rechts}`}
          className="w-full slider-onbewust"
          style={{ background: sliderBackground(percentage, 100, C.darkGreen) }}
          onChange={e => setPercentage(Number(e.target.value))}
        />
        <div className="flex justify-between text-[10px] text-darkSlate/50">
          <span>0% = volledig {duo.links.toLowerCase()}</span>
          <span>100% = volledig {duo.rechts.toLowerCase()}</span>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onVorige} className="px-5 py-2 rounded-xl border border-midGreen text-midGreen hover:bg-midGreen/10 transition-colors text-sm">
          ← Terug
        </button>
        <button onClick={onVolgende} className="px-6 py-2.5 rounded-xl bg-darkGreen text-cream font-salmon hover:bg-darkGreen/90 transition-colors">
          Volgende stap →
        </button>
      </div>
    </div>
  );
}

// ── Stap 4: Journalling ───────────────────────────────────────────────────────

function Stap4Journalling({ trede, duo, subkeuzeKeuze, percentage, antwoorden, setAntwoorden, onVorige }: {
  trede: Trede;
  duo: Duo;
  subkeuzeKeuze: string | null;
  percentage: number;
  antwoorden: [string, string, string];
  setAntwoorden: (a: [string, string, string]) => void;
  onVorige: () => void;
}) {
  const setAntwoord = (i: number, v: string) => {
    const nieuw = [...antwoorden] as [string, string, string];
    nieuw[i] = v;
    setAntwoorden(nieuw);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-salmon text-xl text-darkSlate">Journalling</h2>

      {/* Samenvatting */}
      <div className="bg-white rounded-2xl p-4 border border-lightBg shadow-sm space-y-2">
        <div className="flex items-center gap-3">
          <span style={{ backgroundColor: tredeBg(trede.id) }} className="px-3 py-1 rounded-lg text-xs font-bold text-cream">
            Trede {trede.id}: {trede.naam}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-darkSlate">
          <span className="font-bold text-darkRed">{duo.links}</span>
          <span className="text-darkSlate/40 text-xs">↔</span>
          <span className="font-bold text-darkGreen">{duo.rechts}</span>
          <span className="ml-auto text-xl font-bold text-darkGreen">{percentage}%</span>
        </div>
        {subkeuzeKeuze && (
          <p className="text-xs text-darkSlate/60">
            {duo.subkeuze?.vraag} <span className="font-semibold text-darkSlate">{subkeuzeKeuze}</span>
          </p>
        )}
      </div>

      {/* Vragen */}
      <div className="space-y-4">
        {duo.vragen.map((vraag, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-lightBg shadow-sm">
            <label className="block text-sm font-medium text-darkSlate mb-2">
              <span className="text-midGreen mr-2">✍️</span>{vraag}
            </label>
            <textarea
              value={antwoorden[i]}
              onChange={e => setAntwoord(i, e.target.value)}
              rows={3}
              placeholder="Schrijf hier je antwoord…"
              className="w-full rounded-lg border border-lightBg px-3 py-2 text-sm bg-cream focus:outline-none focus:border-darkGreen resize-none"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={onVorige} className="px-5 py-2 rounded-xl border border-midGreen text-midGreen hover:bg-midGreen/10 transition-colors text-sm">
          ← Terug
        </button>
        <AandachtladderMetingPdfKnop
          trede={trede}
          duo={duo}
          subkeuzeKeuze={subkeuzeKeuze}
          percentage={percentage}
          antwoorden={antwoorden}
        />
      </div>
    </div>
  );
}
