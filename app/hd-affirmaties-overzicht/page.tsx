'use client';

import { useState } from 'react';
import { HD_AFFIRMATIES, type CentrumAffirmaties } from '@/lib/hdAffirmatiesData';

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

  return (
    <div className="max-w-2xl mx-auto">
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
        <p className="text-xs font-semibold tracking-widest text-darkGreen uppercase mb-1">Interessante combinaties</p>
        <h2 className="font-salmon text-2xl text-darkSlate mb-1">Tegenstellingen & spanningsvelden</h2>
        <p className="text-sm text-midGreen italic mb-6">Mogelijke patronen die opvallen als centra elkaars tegengestelde lijken te spreken</p>

        <div className="flex flex-col gap-4">
          {[
            {
              titel: 'Gedefinieerde Milt + Open/Ongedefinieerd Ajna',
              tekst: 'Je lijf weet het al, meteen, zeker, geen twijfel. Maar je hoofd wil het kunnen uitleggen, beredeneren, de ander overtuigen. Interessant: de zekerheid zit in je lichaam, en de onzekerheid zit in je denken. Twee heel verschillende signalen.',
            },
            {
              titel: 'Open/Ongedefinieerd Wortel + Open/Ongedefinieerd Hoofd',
              tekst: 'De \'snelkookpan\': Jij voelt van buitenaf doe-druk én denk-druk tegelijk. Allebei willen ze ergens naartoe, het liefst richting de Keel, om eruit te komen als woorden of actie.',
            },
            {
              titel: 'Gedefinieerd Hart + Open/Ongedefinieerd Sacraal',
              tekst: 'Je maakt toezeggingen vanuit wilskracht en meent het ook echt. Maar de consistente energie om het vol te houden, die heb je niet altijd. Je wil is groter dan je brandstoftank. Het hartcentrum werkt als een pulserende motor, start-stop energie.',
            },
            {
              titel: 'Open/Ongedefinieerd Hart + Gedefinieerd Sacraal',
              tekst: 'Alle energie om te doen wat je blij maakt, maar soms voelt het stiekem alsof die energie iets moet bewijzen. Let eens op wanneer je hard werkt om jouw eigenwaarde te verdienen, in plaats van werken vanuit plezier en lichtheid.',
            },
            {
              titel: 'Gedefinieerd Emotiecentrum + Open/Ongedefinieerd Sacraal of Wortel',
              tekst: 'Jouw golf zegt: neem de tijd, laat het zakken. Maar een open Sacraal of Wortel pikt de doe-druk van buitenaf op. De druk om te beginnen voelt heel reëel, ook al is die niet van jou. Een beetje een innerlijk touwtrekken tussen geduld en actie.',
            },
            {
              titel: 'Gedefinieerde Keel + Open/Ongedefinieerd Identiteit (G)',
              tekst: 'Je hebt een stem die gehoord wil worden, consistent en aanwezig. Maar de richting erachter is vloeiend. Soms weet je pas wie je bent ná wat je zegt. Dat is niet fout, wel interessant om te weten.',
            },
            {
              titel: 'Open/Ongedefinieerd Milt + Gedefinieerd Emotiecentrum',
              tekst: 'Je emotionele golf is van jou. De angst en onrust die je daarin voelt, is dat niet altijd. Juist in de laagte van de wave pik je andermans onveiligheid op, wat de laagte zwaarder maakt dan ie hoeft te zijn.',
            },
            {
              titel: 'Open/Ongedefinieerd G + Open/Ongedefinieerd Emotiecentrum',
              tekst: 'Geen vaste identiteit én geen vaste emoties. Je bent heel gevoelig voor wat er om je heen speelt. Mensen en omgevingen kleuren alles. Dat maakt omgevingskeuze voor jou geen luxe maar noodzaak.',
            },
            {
              titel: 'Gedefinieerd Hoofd + Open/Ongedefinieerd Ajna',
              tekst: 'Non-stop inspiratie en vragen, daar zit geen stop-knop op. Maar een vast perspectief of conclusie? Dat is minder vanzelfsprekend. Je genereert ideeën sneller dan je ze kunt vasthouden. Rijkdom én onrust tegelijk.',
            },
            {
              titel: 'Alle motorcentra gedefinieerd (Sacraal + Hart + Emotie + Wortel)',
              tekst: 'Je hebt alle vier de motoren aan boord. Dat is heel wat brandstof. De uitdaging is niet energie vinden, maar weten waar je het op zet. Het is handig te weten dat niet iedereen zo\'n brandstoftank heeft als jij. Anderen kunnen je tempo als overweldigend ervaren, zonder dat je dat zo bedoelt.',
            },
            {
              titel: 'Geen enkel motorcentrum gedefinieerd',
              tekst: 'Geen van de vier motorcentra is gedefinieerd. Dat betekent dat je geen constante eigen energiebron hebt, maar de energie van je omgeving oppikt en vergroot. In goed gezelschap voel je je energiek. In zware omgevingen loop je leeg. Jouw grootste les: rust is geen luxe maar een serieuze vereiste.',
            },
          ].map(({ titel, tekst }) => (
            <div key={titel} className="bg-white border border-lightBg rounded-2xl p-5">
              <p className="text-sm font-bold text-darkGreen mb-1">{titel}</p>
              <p className="text-sm text-darkSlate leading-relaxed m-0">{tekst}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
