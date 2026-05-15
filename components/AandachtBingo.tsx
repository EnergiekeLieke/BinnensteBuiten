'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

const GEVERS = [
  'Aandacht gegeven aan wat wél goed gaat',
  'Mijn aandacht naar het moment teruggebracht',
  'Even niets gedaan (zonder schuldgevoel)',
  'Geluisterd naar wat ik nodig had',
  'Iets niet perfect gedaan (en dat was oké!)',
  'Even bewust ademgehaald',
  'Mezelf iets gegund',
  'Mijn grens gevoeld en aangegeven',
  'Iets gedaan waar ik BLIJ van werd',
  'Dankbaarheid gevoeld voor iets kleins',
  'Gelachen om iets kleins',
  'Iets speelser aangepakt',
  'Mijn lichaam even gevoeld',
  'Een moment van rust genomen',
  'Iets gedaan vanuit plezier i.p.v. moeten',
  'Mezelf mild toegesproken',
  'Bewust mijn aandacht verlegd',
  'Iets losgelaten waar ik geen controle over had',
  'Mezelf toegestaan om te vertragen',
  'Me verheugd op iets leuks',
  'Mijn plek ingenomen',
  'Vertrouwd op mijn eerste gevoel',
  'Even stilgestaan bij mezelf',
  'Gevoeld: "het is goed zo"',
  'Teruggedacht aan iets fijns',
];

const VRETERS = [
  'Vergeten wat ik eigenlijk aan het doen was',
  'Mezelf vergeleken met iemand anders',
  'Eerst gezorgd voor een ander, mezelf vergeten',
  'Op de automatische piloot doorgerend',
  'Iets gedaan wat "moest" terwijl ik geen zin had',
  'Gedacht: "Ik doe het niet goed genoeg"',
  'Afgeleid door mijn telefoon zonder reden',
  '10 minuten gedacht aan iets wat misschien mis kan gaan',
  'Gesprek in mijn hoofd geoefend, dat nooit plaatsvond',
  'Me druk gemaakt om iets kleins',
  'Blijven hangen in twijfel',
  'Iets uitgesteld wat eigenlijk 2 min. kost',
  'Serieus gedaan, terwijl het ook lichter kon',
  'Mijn aandacht bij 10 dingen tegelijk gehad',
  'Geprobeerd alles onder controle te houden',
  'Niet geluisterd naar mijn gevoel',
  'Gedacht aan wat anderen van mij vinden',
  'Mijn eigen behoefte genegeerd',
  'In de toekomst geleefd in plaats van nu',
  'Te streng geweest voor mezelf',
  'Vergeten te genieten van een moment',
  'Gedacht: "ik moet dit nog, en dat nog…"',
  "M'n aandacht laten kapen door iets onbelangrijks",
  'Gedacht: "ik heb geen tijd"',
  'Teruggedacht aan iets wat ik anders had willen doen',
];

function heeftBingo(aangevinkt: Set<number>): boolean {
  for (let r = 0; r < 5; r++) {
    if ([0, 1, 2, 3, 4].every(c => aangevinkt.has(r * 5 + c))) return true;
  }
  for (let c = 0; c < 5; c++) {
    if ([0, 1, 2, 3, 4].every(r => aangevinkt.has(r * 5 + c))) return true;
  }
  if ([0, 6, 12, 18, 24].every(i => aangevinkt.has(i))) return true;
  if ([4, 8, 12, 16, 20].every(i => aangevinkt.has(i))) return true;
  return false;
}

function BingoKaart({ titel, subtitel, items, thema }: {
  titel: string;
  subtitel?: string;
  items: string[];
  thema: 'groen' | 'rood';
}) {
  const [aangevinkt, setAangevinkt] = useState<Set<number>>(new Set());
  const bingo = heeftBingo(aangevinkt);

  const toggle = (i: number) => setAangevinkt(prev => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  const checked = thema === 'groen'
    ? 'bg-darkGreen text-cream border-darkGreen'
    : 'bg-darkRed text-cream border-darkRed';
  const headerBg = thema === 'groen' ? 'bg-darkGreen' : 'bg-darkRed';
  const accentText = thema === 'groen' ? 'text-darkGreen' : 'text-darkRed';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-lightBg flex flex-col">
      <div className={`${headerBg} px-4 py-3 flex flex-col justify-center min-h-[72px]`}>
        <h3 className="font-salmon text-base text-cream leading-tight">{titel}</h3>
        {subtitel && <p className="text-[10px] text-cream/75 mt-1 leading-snug">{subtitel}</p>}
      </div>

      <div className="p-2.5">
        <div className="grid grid-cols-5 gap-1 mb-2.5">
          {items.map((item, i) => {
            const isChecked = aangevinkt.has(i);
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                className={`text-[8.5px] leading-tight text-center rounded-lg px-1 py-1.5 min-h-[54px] transition-all border-2 flex flex-col items-center justify-center gap-0.5 ${
                  isChecked
                    ? `${checked} font-semibold`
                    : 'bg-lightBg2/60 border-lightBg text-darkSlate/70 hover:border-midGreen/40 hover:bg-lightBg2'
                }`}
              >
                {isChecked && <span className="text-xs leading-none">✓</span>}
                <span>{item}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-0.5">
          <span className={`text-[11px] font-semibold ${accentText}`}>
            {aangevinkt.size} / 25 afgevinkt
          </span>
          {bingo && (
            <span className="text-sm font-bold text-orange">🎉 BINGO!</span>
          )}
          {aangevinkt.size > 0 && (
            <button
              onClick={() => setAangevinkt(new Set())}
              className="text-[10px] text-midGreen hover:text-darkSlate transition-colors underline underline-offset-2"
            >
              Wis alles
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AandachtBingo() {
  const params = useSearchParams();
  const [open, setOpen] = useState(params.get('embed') === 'true');

  return (
    <div className="rounded-2xl overflow-hidden border border-lightBg shadow-sm">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-lightBg2 hover:bg-lightBg transition-colors text-left"
      >
        <div>
          <span className="font-salmon text-lg text-darkSlate">AandachtBINGO</span>
          <span className="text-xs text-midGreen ml-3 italic">Hoeveel herken jij vandaag?</span>
        </div>
        <span className="text-midGreen text-sm font-bold shrink-0 ml-3">{open ? '▲' : '▼'}</span>
      </button>

      <div className={`relative ${!open ? 'max-h-[152px] overflow-hidden' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-lightBg2/30">
          <BingoKaart
            titel="AandachtBINGO: Energie-gevers"
            subtitel="Vink af wat er nú al gelukt is en geef jezelf even een schouderklopje! · Bewustzijn = winst."
            items={GEVERS}
            thema="groen"
          />
          <BingoKaart
            titel="AandachtBINGO: Energie-vreters"
            subtitel="Kruis aan zónder oordeel! · Bewustzijn = winst."
            items={VRETERS}
            thema="rood"
          />
        </div>

        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="absolute inset-x-0 bottom-0 h-20 flex flex-col items-center justify-end pb-3 bg-gradient-to-t from-lightBg2 to-transparent"
          >
            <span className="text-xs font-semibold text-darkGreen bg-white/80 rounded-full px-4 py-1 shadow-sm border border-lightBg">
              Klik om de kaarten te openen ▼
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
