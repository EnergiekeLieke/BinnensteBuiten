'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const OlieKeuzehulpPdfKnop = dynamic(
  () => import('./OlieKeuzehulpPdf').then(m => m.OlieKeuzehulpPdfKnop),
  { ssr: false }
);

// --- Stap ID's ---
const S = {
  HOOFDMETHODE: 1,
  SUBMETHODE: 2,
  INADEMING_DETAIL: 3,        // diffuser stand
  DIFFUSER_SAMENSTELLING: 4,
  DIFFUSER_DRUPPELS: 7,
  SNIFFLE_SAMENSTELLING: 8,
  SNIFFLE_DRUPPELS: 9,
  SPRAY_SAMENSTELLING: 13,
  CAPSULE_SAMENSTELLING: 14,
  CAPSULE_DRUPPELS: 15,
  SPRAY_DRUPPELS: 5,
  SPRAY_GEBRUIK: 6,
  ROLLER_SAMENSTELLING: 10,
  ROLLER_METHODE: 11,
  ROLLER_DRUPPELS: 12,        // opgeslagen inline, geen navigatiestap
  DRAAGOLIE: 20,
  LOCATIE_TYPE: 30,
  LOCATIE_ORGAAN: 31,
  LOCATIE_LICHAAM: 32,
  FREQUENTIE: 40,
  DUUR: 41,
  FREQUENTIE_MOMENT: 42,
  FREQUENTIE_NACHTRUST: 43,
} as const;

const SAMENVATTING_STAP = 99;

const SAMENVATTING_VOLGORDE = [
  S.HOOFDMETHODE, S.SUBMETHODE,
  S.INADEMING_DETAIL, S.DIFFUSER_SAMENSTELLING, S.DIFFUSER_DRUPPELS,
  S.SNIFFLE_SAMENSTELLING, S.SNIFFLE_DRUPPELS,
  S.SPRAY_SAMENSTELLING, S.SPRAY_DRUPPELS, S.SPRAY_GEBRUIK,
  S.CAPSULE_SAMENSTELLING, S.CAPSULE_DRUPPELS,
  S.ROLLER_SAMENSTELLING, S.ROLLER_METHODE, S.ROLLER_DRUPPELS,
  S.DRAAGOLIE, S.LOCATIE_ORGAAN, S.LOCATIE_LICHAAM,
  S.FREQUENTIE, S.FREQUENTIE_MOMENT, S.FREQUENTIE_NACHTRUST, S.DUUR,
];

// --- Data ---

const SUBMETHODEN: Record<string, string[]> = {
  'Inademen': [
    'Diffuser',
    'Sniffle stick',
    'Direct uit het flesje inademen',
    'Cuppen (1 druppel op handen wrijven en inademen)',
  ],
  'Op de huid': [
    'Roller maken',
    'Massage (opgesmeerd)',
    'Spray maken',
    'Op diffuserarmbandje bij je dragen',
  ],
  'Innemen (Let op: alleen plus-oliën zijn geschikt voor consumptie!)': [
    'In water',
    'In thee',
    'In capsule (afgevuld met olijfolie)',
    'In NingXia',
    'Druppel onder de tong smeren',
  ],
};

const DRAAGOLIE_OPTIES = [
  'V-6 draagolie',
  'Druivenpitolie',
  'Zoete amandelolie',
  'Kokosolie',
  'Anders',
];

const SPRAY_GEBRUIK_OPTIES: Record<string, string[]> = {
  'Roomspray': ['Slaapkamer', 'Werkplek', 'Badkamer', 'Woonkamer', 'Auto'],
  'Lichaam / textiel': ['Kussen / beddengoed', 'Kleding', 'Haar', 'Huid (gezicht / lichaam)', 'Voeten', 'Om je heen (aura spray)'],
};

const ORGAAN_OPTIES = [
  'Schildklier', 'Long', 'Hart', 'Maag', 'Lever', 'Galblaas',
  'Nier', 'Milt', 'Darmen', 'Baarmoeder / Prostaat', 'Eierstokken / Testikels', 'Blaas',
];

const LICHAAM_OPTIES = [
  'Nek / hals / achter oren',
  'Polsen / onderarm',
  'Op de (onder)buik',
  'Langs ruggengraat',
  'Op het stuitje',
  'Onder de voeten',
];

const FREQUENTIE_OPTIES = [
  "1x per dag, 's ochtends",
  "1x per dag, 's avonds",
  'Ochtend én avond',
  '2-3x per dag',
  'Meerdere keren per dag',
  'Alleen wanneer nodig',
  'Op een vaste intentie-moment',
];

const DUUR_OPTIES = [
  '1-3 dagen', '1 week', '2-3 weken', '1 maand', 'Zo lang als het goed voelt',
];

const LABELS: Record<number, [string, string]> = {
  [S.HOOFDMETHODE]:           ['Methode', '🌿'],
  [S.SUBMETHODE]:             ['Toepassing', '✋'],
  [S.INADEMING_DETAIL]:       ['Diffuser stand', '🔧'],
  [S.DIFFUSER_SAMENSTELLING]: ['Diffuser: samenstelling', '🧪'],
  [S.DIFFUSER_DRUPPELS]:      ['Diffuser: druppels', '💧'],
  [S.SNIFFLE_SAMENSTELLING]:  ['Sniffle stick: samenstelling', '🧪'],
  [S.SNIFFLE_DRUPPELS]:       ['Sniffle stick: druppels', '💧'],
  [S.SPRAY_SAMENSTELLING]:    ['Spray: samenstelling', '🧪'],
  [S.CAPSULE_SAMENSTELLING]:  ['Capsule: samenstelling', '🧪'],
  [S.CAPSULE_DRUPPELS]:       ['Capsule: druppels per olie', '💧'],
  [S.SPRAY_DRUPPELS]:         ['Spray: druppels per 100 ml', '💧'],
  [S.SPRAY_GEBRUIK]:          ['Spray: waarvoor?', '🌸'],
  [S.ROLLER_SAMENSTELLING]:   ['Roller: samenstelling', '🧪'],
  [S.ROLLER_METHODE]:         ['Roller: hoe?', '⚗️'],
  [S.ROLLER_DRUPPELS]:        ['Druppels per 10 ml', '💧'],
  [S.DRAAGOLIE]:              ['Draagolie', '🫙'],
  [S.LOCATIE_ORGAAN]:         ['Orgaan of voetreflexpunt', '🫀'],
  [S.LOCATIE_LICHAAM]:        ['Lichaamsdeel', '🧍'],
  [S.FREQUENTIE]:             ['Hoe vaak', '⏰'],
  [S.FREQUENTIE_MOMENT]:      ['Wanneer', '🕐'],
  [S.FREQUENTIE_NACHTRUST]:   ['Effect op nachtrust', '🌙'],
  [S.DUUR]:                   ['Hoe lang', '📅'],
};

// --- Logica ---

function getActieveStapIds(keuzes: Record<number, string>): number[] {
  const hoofdmethode = keuzes[S.HOOFDMETHODE] ?? '';
  const submethode = keuzes[S.SUBMETHODE] ?? '';
  const locatieType = keuzes[S.LOCATIE_TYPE] ?? '';

  const ids: number[] = [S.HOOFDMETHODE];

  if (hoofdmethode !== 'Indraaien (energetisch)') {
    ids.push(S.SUBMETHODE);

    if (hoofdmethode === 'Inademen') {
      if (submethode === 'Diffuser') {
        ids.push(S.INADEMING_DETAIL, S.DIFFUSER_SAMENSTELLING, S.DIFFUSER_DRUPPELS);
      } else if (submethode === 'Sniffle stick') {
        ids.push(S.SNIFFLE_SAMENSTELLING, S.SNIFFLE_DRUPPELS);
      }
    }

    if (submethode === 'In capsule (afgevuld met olijfolie)') {
      ids.push(S.CAPSULE_SAMENSTELLING, S.CAPSULE_DRUPPELS);
    }

    if (hoofdmethode === 'Op de huid') {
      if (submethode === 'Spray maken') {
        ids.push(S.SPRAY_SAMENSTELLING, S.SPRAY_DRUPPELS, S.SPRAY_GEBRUIK);
      }

      if (submethode === 'Roller maken') {
        ids.push(S.ROLLER_SAMENSTELLING, S.ROLLER_METHODE);
      }

      if (['Roller maken', 'Massage (opgesmeerd)'].includes(submethode)) {
        ids.push(S.DRAAGOLIE, S.LOCATIE_TYPE);
        if (locatieType === 'Orgaan of voetreflexpunt') ids.push(S.LOCATIE_ORGAAN);
        else if (locatieType === 'Lichaamsdeel') ids.push(S.LOCATIE_LICHAAM);
      }
    }
  }

  ids.push(S.FREQUENTIE, S.DUUR);
  return ids;
}

function bepaalVolgendStap(vanStap: number, nieuweKeuzes: Record<number, string>): number {
  const actief = getActieveStapIds(nieuweKeuzes);
  const idx = actief.indexOf(vanStap);
  if (idx === -1 || idx === actief.length - 1) return SAMENVATTING_STAP;
  return actief[idx + 1];
}

function bepaalVorigeStap(huidigStap: number, keuzes: Record<number, string>): number {
  const actief = getActieveStapIds(keuzes);
  const idx = actief.indexOf(huidigStap);
  if (idx <= 0) return 0;
  return actief[idx - 1];
}

interface OlieItem {
  naam: string;
  druppels: number;
}

function formatteerDruppels(lijst: OlieItem[], suffix = ''): string {
  if (lijst.length === 1) {
    const { naam, druppels } = lijst[0];
    const dr = `${druppels} ${druppels === 1 ? 'druppel' : 'druppels'}`;
    return naam.trim() ? `${naam.trim()}: ${dr}${suffix}` : `${dr}${suffix}`;
  }
  return lijst.map(({ naam, druppels }) =>
    naam.trim() ? `${naam.trim()}: ${druppels} dr` : `${druppels} dr`
  ).join(' + ') + suffix;
}

interface StapData {
  emoji: string;
  vraag: string;
  opties: string[];
}

function getStapData(stap: number, keuzes: Record<number, string>): StapData | null {
  switch (stap) {
    case S.HOOFDMETHODE:
      return {
        emoji: '🌿',
        vraag: 'Hoe gebruik je de olie?',
        opties: ['Inademen', 'Op de huid', 'Innemen (Let op: alleen plus-oliën zijn geschikt voor consumptie!)', 'Indraaien (energetisch)'],
      };
    case S.SUBMETHODE:
      return {
        emoji: '✋',
        vraag: 'Hoe wil je de olie toepassen?',
        opties: SUBMETHODEN[keuzes[S.HOOFDMETHODE] ?? ''] ?? [],
      };
    case S.INADEMING_DETAIL:
      return { emoji: '🔧', vraag: 'Op welke stand?', opties: ['Laag', 'Hoog', 'Interval'] };
    case S.DIFFUSER_SAMENSTELLING:
      return { emoji: '🧪', vraag: 'Gebruik je één olie of een blend?', opties: ['1 olie', 'Blend (meerdere oliën)'] };
    case S.SNIFFLE_SAMENSTELLING:
      return { emoji: '🧪', vraag: 'Gebruik je één olie of een blend?', opties: ['1 olie', 'Blend (meerdere oliën)'] };
    case S.SPRAY_SAMENSTELLING:
      return { emoji: '🧪', vraag: 'Gebruik je één olie of een blend?', opties: ['1 olie', 'Blend (meerdere oliën)'] };
    case S.CAPSULE_SAMENSTELLING:
      return { emoji: '🧪', vraag: 'Gebruik je één olie of een blend?', opties: ['1 olie', 'Blend (meerdere oliën)'] };
    case S.ROLLER_SAMENSTELLING:
      return { emoji: '🧪', vraag: 'Gebruik je één olie of een blend?', opties: ['1 olie', 'Blend (meerdere oliën)'] };
    case S.DRAAGOLIE:
      return { emoji: '🫙', vraag: 'Welke draagolie gebruik je?', opties: DRAAGOLIE_OPTIES };
    case S.LOCATIE_TYPE:
      return { emoji: '📍', vraag: 'Waar breng je de olie aan?', opties: ['Orgaan of voetreflexpunt', 'Lichaamsdeel'] };
    case S.LOCATIE_ORGAAN:
      return { emoji: '🫀', vraag: 'Welk orgaan of voetreflexpunt?', opties: ORGAAN_OPTIES };
    case S.LOCATIE_LICHAAM:
      return { emoji: '🧍', vraag: 'Welk lichaamsdeel?', opties: LICHAAM_OPTIES };
    case S.FREQUENTIE:
      return { emoji: '⏰', vraag: 'Hoe vaak en wanneer?', opties: FREQUENTIE_OPTIES };
    case S.DUUR:
      return { emoji: '📅', vraag: 'Hoe lang gebruik je de olie?', opties: DUUR_OPTIES };
    default:
      return null;
  }
}

// --- BlendSliderLijst ---

interface BlendSliderProps {
  lijst: OlieItem[];
  setLijst: (l: OlieItem[]) => void;
  min: number;
  max: number;
  midden: number;
  standaard: number;
  isBlend: boolean;
}

function BlendSliderLijst({ lijst, setLijst, min, max, midden, standaard, isBlend }: BlendSliderProps) {
  function updateItem(i: number, patch: Partial<OlieItem>) {
    const nieuw = lijst.map((item, j) => j === i ? { ...item, ...patch } : item);
    setLijst(nieuw);
  }

  return (
    <div className="space-y-3">
      {lijst.map((item, i) => (
        <div key={i} className="bg-lightBg2 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={item.naam}
              onChange={(e) => updateItem(i, { naam: e.target.value })}
              placeholder="Naam van de olie..."
              className="flex-1 bg-white border border-lightBg rounded-lg px-3 py-2 text-sm text-darkSlate focus:outline-none focus:ring-2 focus:ring-darkGreen/30"
            />
            {lijst.length > 1 && (
              <button
                onClick={() => setLijst(lijst.filter((_, j) => j !== i))}
                className="text-xs text-midGreen/50 hover:text-darkRed transition-colors px-1"
                aria-label="Verwijder"
              >
                ✕
              </button>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-midGreen">Druppels</span>
              <span className="font-salmon text-darkRed text-lg">
                {item.druppels} {item.druppels === 1 ? 'druppel' : 'druppels'}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={item.druppels}
              onChange={(e) => updateItem(i, { druppels: Number(e.target.value) })}
              className="w-full slider-bewust"
              style={{ background: `linear-gradient(to right, #9e3816 0%, #9e3816 ${((item.druppels - min) / (max - min)) * 100}%, #f4c293 ${((item.druppels - min) / (max - min)) * 100}%, #f4c293 100%)` }}
            />
            <div className="flex justify-between text-xs text-midGreen/60">
              <span>{min}</span>
              <span>{midden}</span>
              <span>{max}</span>
            </div>
          </div>
        </div>
      ))}
      {isBlend && (
        <button
          onClick={() => setLijst([...lijst, { naam: '', druppels: standaard }])}
          className="w-full py-2.5 rounded-xl border border-dashed border-midGreen/40 text-sm text-midGreen hover:bg-lightBg2 transition-colors"
        >
          + Voeg olie toe
        </button>
      )}
    </div>
  );
}

// --- Component ---

export default function OlieKeuzehulp() {
  const [stap, setStap] = useState(0);
  const [olie, setOlie] = useState('');
  const [keuzes, setKeuzes] = useState<Record<number, string>>({});
  const [animatie, setAnimatie] = useState<string | null>(null);
  const [diffuserDruppels, setDiffuserDruppels] = useState<OlieItem[]>([{ naam: '', druppels: 3 }]);
  const [sniffleDruppels, setSniffleDruppels] = useState<OlieItem[]>([{ naam: '', druppels: 2 }]);
  const [sprayDruppels, setSprayDruppels] = useState<OlieItem[]>([{ naam: '', druppels: 5 }]);
  const [capsuleDruppels, setCapsuleDruppels] = useState<OlieItem[]>([{ naam: '', druppels: 1 }]);
  const [sprayGebruikType, setSprayGebruikType] = useState<'Roomspray' | 'Lichaam / textiel' | ''>('');
  const [rollerDruppels, setRollerDruppels] = useState<OlieItem[]>([{ naam: '', druppels: 5 }]);
  const [orgaanSubType, setOrgaanSubType] = useState<'Orgaan' | 'Voetreflexpunt' | ''>('');
  const [frequentieKeerPerDag, setFrequentieKeerPerDag] = useState(1);
  const [frequentieMoment, setFrequentieMoment] = useState<string[]>([]);
  const [frequentieNachtrust, setFrequentieNachtrust] = useState('');
  const [frequentieNachtrustEffect, setFrequentieNachtrustEffect] = useState('');

  const actieveStapIds = getActieveStapIds(keuzes);
  const huidigIndex = actieveStapIds.indexOf(stap);
  const totaalActief = actieveStapIds.length;

  const progress =
    stap === 0 ? 0
    : stap >= SAMENVATTING_STAP ? 100
    : huidigIndex >= 0 ? Math.round(((huidigIndex + 1) / (totaalActief + 1)) * 100)
    : 0;

  function kiesOptie(stapId: number, optie: string) {
    setAnimatie(optie);
    const nieuweKeuzes = { ...keuzes, [stapId]: optie };

    if (stapId === S.HOOFDMETHODE) {
      [S.SUBMETHODE, S.INADEMING_DETAIL,
       S.DIFFUSER_SAMENSTELLING, S.DIFFUSER_DRUPPELS,
       S.SNIFFLE_SAMENSTELLING, S.SNIFFLE_DRUPPELS,
       S.SPRAY_SAMENSTELLING, S.SPRAY_DRUPPELS, S.SPRAY_GEBRUIK,
       S.CAPSULE_SAMENSTELLING, S.CAPSULE_DRUPPELS,
       S.ROLLER_SAMENSTELLING, S.ROLLER_METHODE, S.ROLLER_DRUPPELS,
       S.DRAAGOLIE, S.LOCATIE_TYPE, S.LOCATIE_ORGAAN, S.LOCATIE_LICHAAM]
        .forEach(id => delete nieuweKeuzes[id]);
    } else if (stapId === S.SUBMETHODE) {
      [S.INADEMING_DETAIL,
       S.DIFFUSER_SAMENSTELLING, S.DIFFUSER_DRUPPELS,
       S.SNIFFLE_SAMENSTELLING, S.SNIFFLE_DRUPPELS,
       S.SPRAY_SAMENSTELLING, S.SPRAY_DRUPPELS, S.SPRAY_GEBRUIK,
       S.CAPSULE_SAMENSTELLING, S.CAPSULE_DRUPPELS,
       S.ROLLER_SAMENSTELLING, S.ROLLER_METHODE, S.ROLLER_DRUPPELS,
       S.DRAAGOLIE, S.LOCATIE_TYPE, S.LOCATIE_ORGAAN, S.LOCATIE_LICHAAM]
        .forEach(id => delete nieuweKeuzes[id]);
    } else if (stapId === S.INADEMING_DETAIL) {
      delete nieuweKeuzes[S.DIFFUSER_SAMENSTELLING];
      delete nieuweKeuzes[S.DIFFUSER_DRUPPELS];
    } else if (stapId === S.DIFFUSER_SAMENSTELLING) {
      delete nieuweKeuzes[S.DIFFUSER_DRUPPELS];
      setDiffuserDruppels([{ naam: optie === '1 olie' ? olie.trim() : '', druppels: 3 }]);
    } else if (stapId === S.SNIFFLE_SAMENSTELLING) {
      delete nieuweKeuzes[S.SNIFFLE_DRUPPELS];
      setSniffleDruppels([{ naam: optie === '1 olie' ? olie.trim() : '', druppels: 2 }]);
    } else if (stapId === S.SPRAY_SAMENSTELLING) {
      delete nieuweKeuzes[S.SPRAY_DRUPPELS];
      setSprayDruppels([{ naam: optie === '1 olie' ? olie.trim() : '', druppels: 5 }]);
    } else if (stapId === S.CAPSULE_SAMENSTELLING) {
      delete nieuweKeuzes[S.CAPSULE_DRUPPELS];
      setCapsuleDruppels([{ naam: optie === '1 olie' ? olie.trim() : '', druppels: 1 }]);
    } else if (stapId === S.ROLLER_SAMENSTELLING) {
      delete nieuweKeuzes[S.ROLLER_METHODE];
      delete nieuweKeuzes[S.ROLLER_DRUPPELS];
      setRollerDruppels([{ naam: optie === '1 olie' ? olie.trim() : '', druppels: 5 }]);
    } else if (stapId === S.ROLLER_METHODE) {
      delete nieuweKeuzes[S.ROLLER_DRUPPELS];
      setRollerDruppels([{ naam: '', druppels: 5 }]);
    } else if (stapId === S.LOCATIE_TYPE) {
      delete nieuweKeuzes[S.LOCATIE_ORGAAN];
      delete nieuweKeuzes[S.LOCATIE_LICHAAM];
    }

    setKeuzes(nieuweKeuzes);
    setTimeout(() => {
      setAnimatie(null);
      if (stapId === S.ROLLER_METHODE && optie === 'Dosering uitmeten') return;
      setStap(bepaalVolgendStap(stapId, nieuweKeuzes));
    }, 350);
  }

  function gaVervolgFrequentie() {
    const nieuweKeuzes: Record<number, string> = {
      ...keuzes,
      [S.FREQUENTIE]: `${frequentieKeerPerDag}x per dag`,
      [S.FREQUENTIE_MOMENT]: frequentieMoment.join(' + '),
    };
    if (frequentieMoment.includes('Avond') && frequentieNachtrust === 'Ja' && frequentieNachtrustEffect) {
      nieuweKeuzes[S.FREQUENTIE_NACHTRUST] = `${frequentieNachtrustEffect} effect`;
    } else {
      delete nieuweKeuzes[S.FREQUENTIE_NACHTRUST];
    }
    setKeuzes(nieuweKeuzes);
    setStap(bepaalVolgendStap(S.FREQUENTIE, nieuweKeuzes));
  }

  function gaVervolgCapsuleDruppels() {
    const nieuweKeuzes = { ...keuzes, [S.CAPSULE_DRUPPELS]: formatteerDruppels(capsuleDruppels) };
    setKeuzes(nieuweKeuzes);
    setStap(bepaalVolgendStap(S.CAPSULE_DRUPPELS, nieuweKeuzes));
  }

  function gaVervolgDiffuserDruppels() {
    const nieuweKeuzes = { ...keuzes, [S.DIFFUSER_DRUPPELS]: formatteerDruppels(diffuserDruppels) };
    setKeuzes(nieuweKeuzes);
    setStap(bepaalVolgendStap(S.DIFFUSER_DRUPPELS, nieuweKeuzes));
  }

  function gaVervolgSniffleDruppels() {
    const nieuweKeuzes = { ...keuzes, [S.SNIFFLE_DRUPPELS]: formatteerDruppels(sniffleDruppels) };
    setKeuzes(nieuweKeuzes);
    setStap(bepaalVolgendStap(S.SNIFFLE_DRUPPELS, nieuweKeuzes));
  }

  function gaVervolgSprayDruppels() {
    const nieuweKeuzes = { ...keuzes, [S.SPRAY_DRUPPELS]: formatteerDruppels(sprayDruppels, ' per 100 ml') };
    setKeuzes(nieuweKeuzes);
    setStap(bepaalVolgendStap(S.SPRAY_DRUPPELS, nieuweKeuzes));
  }

  function gaVervolgDosering() {
    const nieuweKeuzes = { ...keuzes, [S.ROLLER_DRUPPELS]: formatteerDruppels(rollerDruppels, ' per 10 ml') };
    setKeuzes(nieuweKeuzes);
    setStap(bepaalVolgendStap(S.ROLLER_METHODE, nieuweKeuzes));
  }

  function opnieuw() {
    setStap(0);
    setOlie('');
    setKeuzes({});
    setAnimatie(null);
    setDiffuserDruppels([{ naam: '', druppels: 3 }]);
    setSniffleDruppels([{ naam: '', druppels: 2 }]);
    setSprayDruppels([{ naam: '', druppels: 5 }]);
    setCapsuleDruppels([{ naam: '', druppels: 1 }]);
    setSprayGebruikType('');
    setRollerDruppels([{ naam: '', druppels: 5 }]);
    setOrgaanSubType('');
    setFrequentieKeerPerDag(1);
    setFrequentieMoment([]);
    setFrequentieNachtrust('');
    setFrequentieNachtrustEffect('');
  }

  const navBalk = (
    <div className="flex items-center justify-between">
      <Link href="/olie" className="text-xs text-midGreen hover:underline">← Oliën</Link>
      <button onClick={() => setStap(bepaalVorigeStap(stap, keuzes))} className="text-xs text-midGreen hover:underline">
        ← Vorige
      </button>
    </div>
  );

  const progressBalk = (
    <div className="w-full bg-lightBg rounded-full h-2">
      <div className="bg-darkRed h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
    </div>
  );

  // Samenvatting
  if (stap === SAMENVATTING_STAP) {
    const getoond = SAMENVATTING_VOLGORDE.filter(id => keuzes[id]);

    return (
      <div className="space-y-5">
        <Link href="/olie" className="text-xs text-midGreen hover:underline">← Oliën</Link>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
          <div className="text-3xl mb-3">🌿</div>
          <h2 className="font-salmon text-2xl text-darkSlate mb-1">Jouw inzetplan</h2>
          <p className="text-sm text-midGreen font-medium mb-6">{olie}</p>

          <div className="space-y-3">
            {getoond.map(id => {
              const [label, emoji] = LABELS[id] ?? ['', ''];
              return (
                <div key={id} className="flex items-start gap-3 p-3 bg-lightBg2 rounded-xl">
                  <span className="text-xl leading-none mt-0.5">{emoji}</span>
                  <div>
                    <div className="text-xs text-midGreen mb-0.5">{label}</div>
                    <div className="text-sm text-darkSlate font-medium">{keuzes[id]}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <OlieKeuzehulpPdfKnop olie={olie} keuzes={keuzes} getoond={getoond} labels={LABELS} />

        <button onClick={opnieuw} className="w-full py-3 rounded-xl border border-lightBg text-darkSlate text-sm hover:bg-lightBg2 transition-colors">
          Opnieuw beginnen
        </button>
      </div>
    );
  }

  // Olie invoer
  if (stap === 0) {
    return (
      <div className="space-y-5">
        <Link href="/olie" className="text-xs text-midGreen hover:underline">← Oliën</Link>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
          <div className="text-3xl mb-3">🧭</div>
          <h1 className="font-salmon text-2xl text-darkSlate mb-2">Olie Keuzehulp</h1>
          <p className="text-sm text-darkSlate/70 leading-relaxed">
            Je hebt je olie uitgemeten. Nu bepalen we samen hoe je hem het beste kunt inzetten.
            Ga per stap langs de opties met je biotensor en ontdek wat jouw onderbewustzijn aangeeft.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
          <label className="block font-salmon text-lg text-darkSlate mb-3">
            Welke olie (of oliën) kwam(en) er uit je biotensormeting?
          </label>
          <input
            type="text"
            value={olie}
            onChange={(e) => setOlie(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && olie.trim()) setStap(1); }}
            placeholder="bijv. Lavender, Peppermint, Lemon"
            className="w-full border border-lightBg rounded-xl px-4 py-3 text-darkSlate text-sm focus:outline-none focus:ring-2 focus:ring-darkGreen/30 bg-lightBg2"
          />
        </div>

        <button
          onClick={() => { if (olie.trim()) setStap(1); }}
          disabled={!olie.trim()}
          className="w-full py-3.5 rounded-xl bg-darkGreen text-cream font-salmon text-lg disabled:opacity-40 hover:bg-darkGreen/90 transition-colors"
        >
          Verder
        </button>
      </div>
    );
  }

  // Speciale stap: Capsule druppels
  if (stap === S.CAPSULE_DRUPPELS) {
    const isBlend = keuzes[S.CAPSULE_SAMENSTELLING] === 'Blend (meerdere oliën)';
    return (
      <div className="space-y-5">
        {navBalk}
        {progressBalk}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
          <div className="text-3xl mb-2">💧</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Hoeveel druppels per olie in de capsule?</h2>
          <p className="text-xs text-midGreen italic mb-5">
            Scan met je biotensor en ontdek wat jouw onderbewustzijn aangeeft.
          </p>
          <BlendSliderLijst
            lijst={capsuleDruppels} setLijst={setCapsuleDruppels}
            min={1} max={3} midden={2} standaard={1} isBlend={isBlend}
          />
        </div>
        <button
          onClick={gaVervolgCapsuleDruppels}
          className="w-full py-3.5 rounded-xl bg-darkGreen text-cream font-salmon text-lg hover:bg-darkGreen/90 transition-colors"
        >
          Verder
        </button>
      </div>
    );
  }

  // Speciale stap: Diffuser druppels
  if (stap === S.DIFFUSER_DRUPPELS) {
    const isBlend = keuzes[S.DIFFUSER_SAMENSTELLING] === 'Blend (meerdere oliën)';
    return (
      <div className="space-y-5">
        {navBalk}
        {progressBalk}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
          <div className="text-3xl mb-2">💧</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Hoeveel druppels in de diffuser?</h2>
          <p className="text-xs text-midGreen italic mb-5">
            Scan met je biotensor en ontdek wat jouw onderbewustzijn aangeeft.
          </p>
          <BlendSliderLijst
            lijst={diffuserDruppels} setLijst={setDiffuserDruppels}
            min={1} max={10} midden={5} standaard={3} isBlend={isBlend}
          />
        </div>
        <button
          onClick={gaVervolgDiffuserDruppels}
          className="w-full py-3.5 rounded-xl bg-darkGreen text-cream font-salmon text-lg hover:bg-darkGreen/90 transition-colors"
        >
          Verder
        </button>
      </div>
    );
  }

  // Speciale stap: Sniffle stick druppels
  if (stap === S.SNIFFLE_DRUPPELS) {
    const isBlend = keuzes[S.SNIFFLE_SAMENSTELLING] === 'Blend (meerdere oliën)';
    return (
      <div className="space-y-5">
        {navBalk}
        {progressBalk}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
          <div className="text-3xl mb-2">💧</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Hoeveel druppels in de sniffle stick?</h2>
          <p className="text-xs text-midGreen italic mb-5">
            Scan met je biotensor en ontdek wat jouw onderbewustzijn aangeeft.
          </p>
          <BlendSliderLijst
            lijst={sniffleDruppels} setLijst={setSniffleDruppels}
            min={1} max={6} midden={3} standaard={2} isBlend={isBlend}
          />
        </div>
        <button
          onClick={gaVervolgSniffleDruppels}
          className="w-full py-3.5 rounded-xl bg-darkGreen text-cream font-salmon text-lg hover:bg-darkGreen/90 transition-colors"
        >
          Verder
        </button>
      </div>
    );
  }

  // Speciale stap: Spray druppels
  if (stap === S.SPRAY_DRUPPELS) {
    const isBlend = keuzes[S.SPRAY_SAMENSTELLING] === 'Blend (meerdere oliën)';
    return (
      <div className="space-y-5">
        {navBalk}
        {progressBalk}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
          <div className="text-3xl mb-2">💧</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Hoeveel druppels per 100 ml water?</h2>
          <p className="text-xs text-midGreen italic mb-5">
            Scan met je biotensor en ontdek wat jouw onderbewustzijn aangeeft.
          </p>
          <BlendSliderLijst
            lijst={sprayDruppels} setLijst={setSprayDruppels}
            min={1} max={20} midden={10} standaard={5} isBlend={isBlend}
          />
        </div>
        <button
          onClick={gaVervolgSprayDruppels}
          className="w-full py-3.5 rounded-xl bg-darkGreen text-cream font-salmon text-lg hover:bg-darkGreen/90 transition-colors"
        >
          Verder
        </button>
      </div>
    );
  }

  // Speciale stap: Spray gebruik (roomspray / lichaam+textiel)
  if (stap === S.SPRAY_GEBRUIK) {
    return (
      <div className="space-y-5">
        {navBalk}
        {progressBalk}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
          <div className="text-3xl mb-2">🌸</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Waarvoor gebruik je de spray?</h2>
          <p className="text-xs text-midGreen italic mb-4">
            Scan de lijst met je biotensor en ontdek wat jouw onderbewustzijn aangeeft.
          </p>
          <div className="flex gap-2 mb-4">
            {(['Roomspray', 'Lichaam / textiel'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSprayGebruikType(type)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  sprayGebruikType === type
                    ? 'bg-darkRed text-cream border-darkRed'
                    : 'bg-white border-lightBg text-darkSlate hover:bg-lightBg2'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {sprayGebruikType && (
            <div className="space-y-2">
              {SPRAY_GEBRUIK_OPTIES[sprayGebruikType].map(optie => {
                const vollLabel = `${optie} (${sprayGebruikType.toLowerCase()})`;
                const geselecteerd = keuzes[S.SPRAY_GEBRUIK] === vollLabel || animatie === vollLabel;
                return (
                  <button
                    key={optie}
                    onClick={() => {
                      setAnimatie(vollLabel);
                      const nieuweKeuzes = { ...keuzes, [S.SPRAY_GEBRUIK]: vollLabel };
                      setKeuzes(nieuweKeuzes);
                      setTimeout(() => {
                        setAnimatie(null);
                        setStap(bepaalVolgendStap(S.SPRAY_GEBRUIK, nieuweKeuzes));
                      }, 350);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      geselecteerd
                        ? 'bg-darkRed text-cream border-darkRed'
                        : 'bg-white border-lightBg text-darkSlate hover:bg-lightBg2'
                    }`}
                  >
                    {optie}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Speciale stap: Roller methode met inline dosering-slider(s)
  if (stap === S.ROLLER_METHODE) {
    const gekozenPuur = keuzes[S.ROLLER_METHODE] === 'Puur (rollerdopje op het flesje)';
    const gekozenDosering = keuzes[S.ROLLER_METHODE] === 'Dosering uitmeten';
    const isBlend = keuzes[S.ROLLER_SAMENSTELLING] === 'Blend (meerdere oliën)';

    return (
      <div className="space-y-5">
        {navBalk}
        {progressBalk}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
          <div className="text-3xl mb-2">⚗️</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Hoe gebruik je de roller?</h2>
          <p className="text-xs text-midGreen italic mb-5">
            Scan de lijst met je biotensor en ontdek wat jouw onderbewustzijn aangeeft.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => kiesOptie(S.ROLLER_METHODE, 'Puur (rollerdopje op het flesje)')}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                gekozenPuur
                  ? 'bg-darkRed text-cream border-darkRed'
                  : 'bg-white border-lightBg text-darkSlate hover:bg-lightBg2'
              }`}
            >
              Puur (rollerdopje op het flesje)
            </button>
            <button
              onClick={() => kiesOptie(S.ROLLER_METHODE, 'Dosering uitmeten')}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                gekozenDosering
                  ? 'bg-darkRed text-cream border-darkRed'
                  : 'bg-white border-lightBg text-darkSlate hover:bg-lightBg2'
              }`}
            >
              Dosering uitmeten
            </button>
            {gekozenDosering && (
              <div className="pt-1">
                <p className="text-xs text-midGreen mb-3">Per 10 ml draagolie</p>
                <BlendSliderLijst
                  lijst={rollerDruppels} setLijst={setRollerDruppels}
                  min={1} max={15} midden={8} standaard={5} isBlend={isBlend}
                />
              </div>
            )}
          </div>
        </div>
        {gekozenDosering && (
          <button
            onClick={gaVervolgDosering}
            className="w-full py-3.5 rounded-xl bg-darkGreen text-cream font-salmon text-lg hover:bg-darkGreen/90 transition-colors"
          >
            Verder
          </button>
        )}
      </div>
    );
  }

  // Speciale stap: Orgaan of voetreflexpunt
  if (stap === S.LOCATIE_ORGAAN) {
    return (
      <div className="space-y-5">
        {navBalk}
        {progressBalk}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
          <div className="text-3xl mb-2">🫀</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Welk orgaan of voetreflexpunt?</h2>
          <p className="text-xs text-midGreen italic mb-4">
            Scan de lijst met je biotensor en ontdek wat jouw onderbewustzijn aangeeft.
          </p>
          <div className="flex gap-2 mb-4">
            {(['Orgaan', 'Voetreflexpunt'] as const).map(type => (
              <button
                key={type}
                onClick={() => setOrgaanSubType(type)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  orgaanSubType === type
                    ? 'bg-darkRed text-cream border-darkRed'
                    : 'bg-white border-lightBg text-darkSlate hover:bg-lightBg2'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {orgaanSubType && (
            <div className="space-y-2">
              {ORGAAN_OPTIES.map(optie => {
                const vollLabel = `${optie} (${orgaanSubType.toLowerCase()})`;
                const geselecteerd = keuzes[S.LOCATIE_ORGAAN] === vollLabel || animatie === vollLabel;
                return (
                  <button
                    key={optie}
                    onClick={() => {
                      setAnimatie(vollLabel);
                      const nieuweKeuzes = { ...keuzes, [S.LOCATIE_ORGAAN]: vollLabel };
                      setKeuzes(nieuweKeuzes);
                      setTimeout(() => {
                        setAnimatie(null);
                        setStap(bepaalVolgendStap(S.LOCATIE_ORGAAN, nieuweKeuzes));
                      }, 350);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      geselecteerd
                        ? 'bg-darkRed text-cream border-darkRed'
                        : 'bg-white border-lightBg text-darkSlate hover:bg-lightBg2'
                    }`}
                  >
                    {optie}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Speciale stap: Frequentie
  if (stap === S.FREQUENTIE) {
    const avondGekozen = frequentieMoment.includes('Avond');
    const kanVerder = frequentieMoment.length > 0 && (
      !avondGekozen ||
      frequentieNachtrust === 'Nee' ||
      (frequentieNachtrust === 'Ja' && frequentieNachtrustEffect !== '')
    );

    return (
      <div className="space-y-5">
        {navBalk}
        {progressBalk}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
          <div className="text-3xl mb-2">⏰</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Hoe vaak en wanneer?</h2>
          <p className="text-xs text-midGreen italic mb-5">
            Scan de opties met je biotensor en ontdek wat jouw onderbewustzijn aangeeft.
          </p>
          <div className="mb-6">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm text-darkSlate font-medium">Keer per dag</span>
              <span className="font-salmon text-darkRed text-xl">{frequentieKeerPerDag}x</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={frequentieKeerPerDag}
              onChange={(e) => setFrequentieKeerPerDag(Number(e.target.value))}
              className="w-full slider-bewust"
              style={{ background: `linear-gradient(to right, #9e3816 0%, #9e3816 ${((frequentieKeerPerDag - 1) / 4) * 100}%, #f4c293 ${((frequentieKeerPerDag - 1) / 4) * 100}%, #f4c293 100%)` }}
            />
            <div className="flex justify-between text-xs text-midGreen/60 mt-1">
              {[1, 2, 3, 4, 5].map(n => <span key={n}>{n}x</span>)}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-darkSlate font-medium mb-2">Wanneer?</p>
            <div className="flex gap-2">
              {['Ochtend', 'Middag', 'Avond'].map(moment => (
                <button
                  key={moment}
                  onClick={() => {
                    const geselecteerd = frequentieMoment.includes(moment);
                    setFrequentieMoment(prev =>
                      geselecteerd ? prev.filter(m => m !== moment) : [...prev, moment]
                    );
                    if (moment === 'Avond' && geselecteerd) {
                      setFrequentieNachtrust('');
                      setFrequentieNachtrustEffect('');
                    }
                  }}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    frequentieMoment.includes(moment)
                      ? 'bg-darkRed text-cream border-darkRed'
                      : 'bg-white border-lightBg text-darkSlate hover:bg-lightBg2'
                  }`}
                >
                  {moment}
                </button>
              ))}
            </div>
          </div>
          {avondGekozen && (
            <div className="bg-lightBg2 rounded-xl p-4 space-y-3">
              <p className="text-sm text-darkSlate font-medium">
                Heeft deze olie een effect op mijn nachtrust?
              </p>
              <div className="flex gap-2">
                {['Ja', 'Nee'].map(antwoord => (
                  <button
                    key={antwoord}
                    onClick={() => {
                      setFrequentieNachtrust(antwoord);
                      if (antwoord === 'Nee') setFrequentieNachtrustEffect('');
                    }}
                    className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                      frequentieNachtrust === antwoord
                        ? 'bg-darkRed text-cream border-darkRed'
                        : 'bg-white border-lightBg text-darkSlate hover:bg-lightBg2'
                    }`}
                  >
                    {antwoord}
                  </button>
                ))}
              </div>
              {frequentieNachtrust === 'Ja' && (
                <>
                  <div className="flex gap-2">
                    {['Positief', 'Negatief'].map(effect => (
                      <button
                        key={effect}
                        onClick={() => setFrequentieNachtrustEffect(effect)}
                        className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                          frequentieNachtrustEffect === effect
                            ? 'bg-darkRed text-cream border-darkRed'
                            : 'bg-white border-lightBg text-darkSlate hover:bg-lightBg2'
                        }`}
                      >
                        {effect}
                      </button>
                    ))}
                  </div>
                  {frequentieNachtrustEffect === 'Negatief' && (
                    <p className="text-xs text-darkRed leading-relaxed">
                      Meet met je biotensor tot hoe laat je de olie maximaal kunt gebruiken, zonder dat je slaap hierdoor beïnvloed wordt.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <button
          onClick={gaVervolgFrequentie}
          disabled={!kanVerder}
          className="w-full py-3.5 rounded-xl bg-darkGreen text-cream font-salmon text-lg disabled:opacity-40 hover:bg-darkGreen/90 transition-colors"
        >
          Verder
        </button>
      </div>
    );
  }

  // Generieke keuze stap
  const stapData = getStapData(stap, keuzes);
  if (!stapData) return null;

  return (
    <div className="space-y-5">
      {navBalk}
      {progressBalk}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg">
        <div className="text-3xl mb-2">{stapData.emoji}</div>
        <h2 className="font-salmon text-xl text-darkSlate mb-1">{stapData.vraag}</h2>
        <p className="text-xs text-midGreen italic mb-5">
          Scan de lijst met je biotensor en ontdek wat jouw onderbewustzijn aangeeft.
        </p>
        <div className="space-y-2">
          {stapData.opties.map((optie) => {
            const geselecteerd = keuzes[stap] === optie || animatie === optie;
            return (
              <button
                key={optie}
                onClick={() => kiesOptie(stap, optie)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  geselecteerd
                    ? 'bg-darkRed text-cream border-darkRed'
                    : 'bg-white border-lightBg text-darkSlate hover:bg-lightBg2'
                }`}
              >
                {optie}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
