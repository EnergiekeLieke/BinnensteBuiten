'use client';

import { useState } from 'react';

const tools = [
  {
    href: 'https://energiekelieke.kennis.shop/watch/2946/39496',
    title: 'Levenswiel Analyse',
    desc: 'Het spinnenweb maakt zichtbaar hoe tevreden jij bewust en onbewust bent over 8 levensgebieden. De analyse toont welke patronen je te doorbreken hebt én geeft je concrete tips over wat je nu kunt doen.',
    icon: '🌐',
    color: 'border-darkRed',
  },
  {
    href: 'https://energiekelieke.kennis.shop/watch/2946/39501',
    title: 'Basisverlangens Werkblad',
    desc: 'Ontdek welke basisverlangens jou drijven per levensgebied en wat dat onthult over jouw patronen.',
    icon: '💡',
    color: 'border-orange',
  },
  {
    href: 'https://energiekelieke.kennis.shop/watch/2946/39497',
    title: 'Business Scan',
    desc: 'Snel overzicht van 12 bedrijfscategorieën met bewust/onbewust scores en het ONE THING om nu op te focussen.',
    icon: '📊',
    color: 'border-darkGreen',
  },
  {
    href: 'https://energiekelieke.kennis.shop/watch/2946/39498',
    title: 'Business Scan Gedetailleerd',
    desc: 'Diepgaande versie met scores per subonderdeel, uitklapbare categorieën en WHAT/WHY/HOW/WHEN oefening.',
    icon: '🔍',
    color: 'border-darkGreen',
  },
];

export default function PreviewPage() {
  const [flauwOpen, setFlauwOpen] = useState(false);

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="font-salmon text-4xl text-darkSlate mb-3">BinnensteBuiten Spel</h1>
        <p className="text-midGreen text-sm">Kom los van die innerlijke stemmetjes die je laten geloven dat er geen ruimte is voor wat jou écht blij maakt.</p>
        <p className="text-midGreen text-sm">Met rake vragen, praktische tools en speelse experimenten breng je jezelf stap voor stap terug in contact met wat jij nodig hebt.</p>
        <p className="text-midGreen text-sm mt-3">Kies hieronder een tool of Flauwekul Filter en zet jouw eerste stap richting vrijheid en genieten!</p>
      </div>

      <h2 className="font-bold text-xs uppercase tracking-widest text-darkSlate mb-3">Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {tools.map((t) => (
          <a
            key={t.href}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`block bg-white rounded-2xl border-l-4 ${t.color} p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform`}
          >
            <div className="text-4xl mb-3">{t.icon}</div>
            <h2 className="font-salmon text-xl text-darkSlate mb-2">{t.title}</h2>
            <p className="text-sm text-darkSlate/70 leading-relaxed">{t.desc}</p>
          </a>
        ))}
      </div>

      {/* Flauwekul Filter */}
      <div className="rounded-2xl border-2 border-orange overflow-hidden">
        <button
          onClick={() => setFlauwOpen((s) => !s)}
          className="w-full bg-orange px-6 py-4 flex justify-between items-center text-left"
        >
          <div>
<p className="text-lg font-bold text-white mt-0.5">Flauwekul Filter</p>
          </div>
          <span className="text-white text-xl opacity-80">{flauwOpen ? '▲' : '▼'}</span>
        </button>

        {flauwOpen && (
          <div className="bg-cream px-6 py-5">
            <p className="text-sm text-darkSlate leading-relaxed mb-3">
              Je hoofd is soms een drukke markt vol overtuigingen die al járen hetzelfde kraampje runnen:
            </p>
            <ul className="text-sm text-darkSlate leading-relaxed mb-3 list-disc list-inside">
              <li><em>"Niet genoeg."</em></li>
              <li><em>"Te laat."</em></li>
              <li><em>"Dat bestaat niet voor mij."</em></li>
            </ul>
            <p className="text-sm text-darkSlate leading-relaxed mb-3 hidden">
            </p>
            <p className="text-sm text-darkSlate leading-relaxed mb-3">
              Schaarstedenken verstopt zich overal! In hoe je werkt, hoe je ontspant, hoe je naar je bankrekening kijkt, en zelfs in hoe je 's ochtends wakker wordt.
            </p>
            <p className="text-sm text-darkSlate leading-relaxed mb-3">
              Het Flauwekul Filter helpt je om die sluipende schaarstegedachten op te sporen op <strong>álle vlakken van je leven</strong>: Tijd, Geld, Energie, Liefde, Plezier, Jezelf laten zien (authenticiteit), etc.
            </p>
            <p className="text-sm text-darkSlate leading-relaxed mb-3">
              Je onderbewustzijn weet allang de weg naar groei. De biotensor helpt je om die wijsheid op te sporen. Eerlijk, direct en soms verrassend helder.
            </p>
            <p className="text-sm font-bold text-darkRed leading-relaxed mb-5">
              Zet die automatische piloot maar aan de kant en ontdek wat er écht speelt!
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="https://energiekelieke.kennis.shop/watch/2946/39500"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block bg-white rounded-2xl border-l-4 border-darkRed p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform"
              >
                <span className="absolute top-3 right-4 text-[10px] font-bold uppercase tracking-wide bg-darkRed text-white rounded px-2 py-0.5">Nieuw!</span>
                <div className="text-4xl mb-3">💸</div>
                <h2 className="font-salmon text-xl text-darkSlate mb-2">Geld Gedoe</h2>
                <p className="text-sm text-darkSlate/70 leading-relaxed">Spoor je geldblokkades op en ontdek welk verhaal jij jezelf vertelt.</p>
              </a>

              {[
                { titel: 'Tijd Tekort', icon: '⏳', sub: 'Ontdek waarom je agenda voller voelt dan ie is.' },
                { titel: 'Batterij Blokkade', icon: '🔋', sub: 'Spoor op waar jouw energie weglekt, en ontdek hoe je dat stopt.' },
                { titel: 'Liefdes Lek', icon: '💔', sub: 'Herken de overtuigingen die jou van échte verbinding en zelfliefde weerhouden.' },
                { titel: 'Geniet Gebrek', icon: '🎉', sub: 'Ontdek wat er nog in de weg staat tussen jou en écht genieten.' },
                { titel: 'Masker Moe', icon: '🎭', sub: 'Zet je masker af en laat jezelf zien zoals je écht bent!' },
              ].map((f) => (
                <div
                  key={f.titel}
                  className="relative bg-[#e8e6e1] rounded-2xl border-l-4 border-[#ccc] p-6 opacity-65 cursor-not-allowed"
                >
                  <span className="absolute top-3 right-4 text-[10px] font-bold uppercase tracking-wide bg-darkGreen text-white rounded px-2 py-0.5">Binnenkort</span>
                  <div className="text-4xl mb-3">{f.icon}</div>
                  <h2 className="font-salmon text-xl text-[#999] mb-2">{f.titel}</h2>
                  <p className="text-sm text-[#aaa]">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
