'use client';

import { useState } from 'react';
import { HD_AFFIRMATIES, HD_PATRONEN, HD_TYPE_TEKSTEN, type CentrumAffirmaties } from '@/lib/hdAffirmatiesData';

type SectieKey = keyof Omit<CentrumAffirmaties, 'key' | 'label'>;

const SECTIES: { key: SectieKey; label: string; kleur: string }[] = [
  { key: 'gedefinieerd',         label: 'Gedefinieerd · omarmen wat van jou is',         kleur: 'bg-darkGreen text-white' },
  { key: 'gedefinieerd_groei',   label: 'Gedefinieerd · groei',                           kleur: 'bg-orange text-white' },
  { key: 'gedefinieerd_gave',    label: 'Gedefinieerd · gave',                            kleur: 'bg-midGreen text-white' },
  { key: 'ongedefinieerd',       label: 'Ongedefinieerd · loslaten wat niet van jou is',  kleur: 'bg-white border border-darkGreen text-darkGreen' },
  { key: 'ongedefinieerd_groei', label: 'Ongedefinieerd · groei',                         kleur: 'bg-orange text-white' },
  { key: 'ongedefinieerd_gave',  label: 'Ongedefinieerd · gave',                          kleur: 'bg-midGreen text-white' },
  { key: 'compleetOpen',         label: 'Compleet open · diepste loslaten (drie lagen)',  kleur: 'bg-cream border border-dashed border-gray-400 text-darkSlate' },
  { key: 'compleetOpen_groei',   label: 'Compleet open · groei',                          kleur: 'bg-orange text-white' },
  { key: 'compleetOpen_gave',    label: 'Compleet open · gave',                           kleur: 'bg-midGreen text-white' },
];

const ALLE_KEYS = [...HD_AFFIRMATIES.map(c => c.key), '__combinaties__', '__types__'];

export default function HDAffirmatiesOverzicht() {
  const [toelichtingOpen, setToelichtingOpen] = useState(false);
  const [gesloten, setGesloten] = useState<Set<string>>(new Set());

  function toggleCentrum(key: string) {
    setGesloten(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  const allesGesloten = ALLE_KEYS.every(k => gesloten.has(k));

  function toggleAlles() {
    if (allesGesloten) {
      setGesloten(new Set());
    } else {
      setToelichtingOpen(false);
      setGesloten(new Set(ALLE_KEYS));
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 z-10 bg-cream/90 backdrop-blur-sm py-2 -mx-4 px-4 mb-4 flex justify-end">
        <button
          onClick={toggleAlles}
          className="text-xs font-bold uppercase tracking-widest text-darkGreen border border-darkGreen rounded-lg px-3 py-1.5 bg-white hover:bg-darkGreen hover:text-white transition-colors"
        >
          {allesGesloten ? 'Alles uitklappen' : 'Alles inklappen'}
        </button>
      </div>

      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-darkGreen uppercase mb-1">Human Design · Intern overzicht</p>
        <h1 className="font-salmon text-3xl text-darkSlate mb-1">Affirmaties overzicht</h1>
        <p className="text-sm text-midGreen italic">Alle affirmaties per centrum en staat, ter inzage en aanvulling</p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="bg-white border border-lightBg rounded-2xl overflow-hidden">
          <button
            onClick={() => setToelichtingOpen(s => !s)}
            className="w-full flex justify-between items-center px-5 py-3 text-left cursor-pointer bg-white"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-darkGreen">Toelichting</span>
            <span className={`text-darkGreen text-sm opacity-70 transition-transform duration-200 ${toelichtingOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${toelichtingOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
          <div className="px-5 pb-5 flex flex-col gap-4 text-sm text-darkSlate leading-relaxed">

            <div>
              <span className="inline-block bg-darkGreen text-white text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2">Gedefinieerd</span>
              <p className="m-0 mb-2">Een gedefinieerd centrum heeft constante, betrouwbare energie. Jij bent de <strong>zender</strong> op dit thema: je straalt het uit naar je omgeving.</p>
              <p className="m-0 mb-2">De valkuil is tweeledig:</p>
              <ul className="m-0 pl-0 list-none flex flex-col gap-1.5 mb-2">
                <li className="flex gap-2"><span className="text-darkGreen shrink-0">·</span><span>De omgeving reageert soms overweldigd of ongemakkelijk, waardoor je de druk kunt voelen om jezelf in te houden. "Ik ben te veel."</span></li>
                <li className="flex gap-2"><span className="text-darkGreen shrink-0">·</span><span>Tegelijk kun je ook de druk (projectie) voelen dat anderen van jou verwachten dat je deze energie blijft leveren, altijd en overal.</span></li>
              </ul>
              <p className="m-0">De affirmaties helpen je beide los te laten en je energie te omarmen als gave, op jouw voorwaarden.</p>
            </div>

            <div>
              <span className="inline-block bg-white border border-darkGreen text-darkGreen text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2">Ongedefinieerd</span>
              <p className="m-0 mb-2">Een ongedefinieerd centrum betekent dat je de energie van dat centrum variabel en inconsistent ervaart. Je bent <strong>ontvanger</strong> van energie: je absorbeert en vergroot wat anderen op dit thema meebrengen, maar hebt er zelf geen consistente toegang toe.</p>
              <p className="m-0 mb-2">Dit is de energie waar je uitdagingen en valkuilen liggen, voornamelijk in je "uit je kracht" thema. Én het is waar je grootste potentiële wijsheid ligt: door te ervaren wat echt van jou is en wat niet.</p>
              <p className="m-0">De valkuil is dat je door die omgevingsenergie geconditioneerd raakt en hard je best gaat doen om dit thema te leveren. "Ik ben anders niet goed genoeg." De affirmaties helpen je loslaten wat niet van jou is. Dit geldt ook voor compleet open centra, want compleet open is een subgroep van ongedefinieerd.</p>
            </div>

            <div>
              <span className="inline-block bg-cream border border-dashed border-gray-400 text-darkSlate text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2">Compleet open</span>
              <p className="m-0 mb-2">Een compleet open centrum heeft geen enkele vaste poort of kanaal. Jij bent een <strong>spiegel van alle smaakjes</strong>: je kunt alle varianten van dit thema ervaren en vertegenwoordigt daardoor het grootste wijsheidspotentieel, maar ook de diepste conditionering.</p>
              <p className="m-0 mb-3">De valkuil is de diepste conditionering van alle drie. Die uit zich op drie manieren:</p>
              <ul className="m-0 pl-0 list-none flex flex-col gap-1.5">
                <li className="flex gap-2"><span className="text-darkGreen shrink-0">1.</span><span><strong>Ongedefinieerd gedrag:</strong> dezelfde patronen als bij een ongedefinieerd centrum. Energie van anderen overnemen en hard werken om dit thema te leveren, om te bewijzen dat je 'goed genoeg' bent.</span></li>
                <li className="flex gap-2"><span className="text-darkGreen shrink-0">2.</span><span><strong>Blinde vlek / volledige identificatie:</strong> je herkent jezelf volledig in de not-self gedachte, zonder dat je doorhebt dat het conditionering is. Bijv. open Wortel: "Ik ben nou eenmaal iemand die altijd haast heeft." Open Sacraal: "Ik kan echt keihard werken hoor!"</span></li>
                <li className="flex gap-2"><span className="text-darkGreen shrink-0">3.</span><span><strong>Transpersoonlijke conditionering:</strong> je projecteert het thema op anderen en verwijt hen het gedrag dat eigenlijk jouw conditionering weerspiegelt. Bijv. open Sacraal: "Anderen werken niet hard genoeg." Open Wortel: "Waarom heeft niemand hier haast?"</span></li>
              </ul>
            </div>

            <div>
              <span className="inline-block bg-orange text-white text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2">Groei</span>
              <p className="m-0">De groei-affirmaties zijn kleinere, haalbaardere versies van de declaratieve affirmaties. Voor wanneer de grote versie nog te groots voelt. Denk aan: "Ik leer...", "Elke dag een beetje meer...", "Ik oefen met..."</p>
            </div>

            <div>
              <span className="inline-block bg-midGreen text-white text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2">Gave</span>
              <p className="m-0">De gave-affirmaties benoemen de unieke wijsheid die voortkomt uit dit centrum. Voor gedefinieerde centra: jouw constante gave voor de wereld. Voor open/ongedefinieerde centra: de diepte die je hebt opgebouwd door dit thema in alle varianten te kennen.</p>
            </div>

          </div>
          </div>
        </div>
      </div>

      {/* Type teksten */}
      <div className="mb-8">
        <div className="bg-white border border-lightBg rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleCentrum('__types__')}
            className="w-full bg-darkSlate px-5 py-3 flex justify-between items-center text-left cursor-pointer"
          >
            <div>
              <p className="font-salmon text-xl text-white m-0">Vaste teksten per type</p>
              <p className="text-white/70 text-xs mt-0.5 m-0">Introductietekst per HD type voor in het rapport</p>
            </div>
            <span className={`text-white/70 text-sm mt-1 shrink-0 transition-transform duration-200 ${gesloten.has('__types__') ? '' : 'rotate-180'}`}>▼</span>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${gesloten.has('__types__') ? 'max-h-0' : 'max-h-[5000px]'}`}>
            <div className="p-5 flex flex-col gap-3">
              {HD_TYPE_TEKSTEN.map(({ type, tekst }) => (
                <div key={type} className="bg-cream border border-lightBg rounded-2xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-darkGreen mb-2">{type}</p>
                  <p className="text-sm text-darkSlate leading-relaxed m-0">{tekst}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {HD_AFFIRMATIES.map(c => {
          const isOpen = !gesloten.has(c.key);
          return (
            <div key={c.key} className="bg-white border border-lightBg rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleCentrum(c.key)}
                className="w-full bg-darkGreen px-5 py-3 flex justify-between items-center text-left cursor-pointer"
              >
                <h2 className="font-salmon text-xl text-white m-0">{c.label}</h2>
                <span className={`text-white/70 text-sm shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[3000px]' : 'max-h-0'}`}>
                <div className="p-5 flex flex-col gap-5">
                  {SECTIES.map(({ key, label, kleur }) => (
                    <div key={key}>
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2 ${kleur}`}>
                        {label}
                      </span>
                      <ul className="flex flex-col gap-1 m-0 pl-0 list-none">
                        {c[key].map((a, i) => (
                          <li key={i} className="text-sm text-darkSlate leading-relaxed flex gap-2">
                            <span className="text-darkGreen shrink-0 mt-0.5">·</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interessante combinaties */}
      <div className="mt-10">
        <div className="bg-white border border-lightBg rounded-2xl overflow-hidden">
          <button
            onClick={() => setGesloten(prev => {
              const next = new Set(prev);
              if (next.has('__combinaties__')) next.delete('__combinaties__'); else next.add('__combinaties__');
              return next;
            })}
            className="w-full bg-orange px-5 py-3 flex justify-between items-start text-left cursor-pointer"
          >
            <div>
              <p className="font-salmon text-xl text-white m-0">Tegenstellingen & spanningsvelden</p>
              <p className="text-white/70 text-xs mt-0.5 m-0">Patronen die opvallen, centra die tegenstellingen vormen in jouw energie</p>
            </div>
            <span className={`text-white/70 text-sm mt-1 shrink-0 transition-transform duration-200 ${gesloten.has('__combinaties__') ? '' : 'rotate-180'}`}>▼</span>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${gesloten.has('__combinaties__') ? 'max-h-0' : 'max-h-[5000px]'}`}>
          <div className="p-5 flex flex-col gap-4">
          {HD_PATRONEN.map(({ titel, tekst }) => (
            <div key={titel} className="bg-cream border border-lightBg rounded-2xl p-4">
              <p className="text-sm font-bold text-darkGreen mb-1">{titel}</p>
              <p className="text-sm text-darkSlate leading-relaxed m-0">{tekst}</p>
            </div>
          ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
