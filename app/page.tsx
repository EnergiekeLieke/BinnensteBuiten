'use client';

import { useState } from 'react';
import Link from 'next/link';


export default function Home() {
  const [flauwOpen, setFlauwOpen] = useState(false);
  const [ondernOpen, setOndernOpen] = useState(false);

  return (
    <div>
      <div className="mb-12">
        <h1 className="font-salmon text-4xl text-darkSlate mb-3">BinnensteBuiten Spel</h1>
        <p className="text-midGreen text-sm">Kom los van die innerlijke stemmetjes die je laten geloven dat er geen ruimte is voor wat jou écht blij maakt.</p>
        <p className="text-midGreen text-sm">Met rake vragen, praktische tools en speelse experimenten breng je jezelf stap voor stap terug in contact met wat jij nodig hebt.</p>
        <p className="text-midGreen text-sm mt-3">Kies hieronder een tool of Flauwekul Filter en zet jouw eerste stap richting vrijheid en genieten!</p>
      </div>

      <h2 className="font-bold text-xs uppercase tracking-widest text-darkSlate mb-3">Tools</h2>

      <p className="text-sm font-bold text-darkSlate mb-3">Hoe sta je ervoor?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <Link href="/levenswiel" className="block h-full bg-white rounded-2xl border-l-4 border-darkRed p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="text-4xl mb-3">🌐</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-2">Levenswiel Analyse</h2>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Het spinnenweb maakt zichtbaar hoe tevreden jij bewust en onbewust bent over 8 levensgebieden. De analyse toont welke patronen je te doorbreken hebt én geeft je concrete tips.</p>
        </Link>
        <Link href="/verbindingswiel" className="block h-full bg-white rounded-2xl border-l-4 border-midGreen p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="text-4xl mb-3">💞</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-2">Verbindingswiel</h2>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Ontdek hoe verbonden jullie écht zijn op 10 dimensies. Inclusief biotensor-scores, reflectievragen en concrete tips in een warm rapport voor koppels.</p>
        </Link>
      </div>

      <p className="text-sm font-bold text-darkSlate mb-3">Wat wil je écht?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <Link href="/basisverlangens" className="block h-full bg-white rounded-2xl border-l-4 border-orange p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="text-4xl mb-3">💡</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-2">Basisverlangens Werkblad</h2>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Ontdek welke basisverlangens jou drijven per levensgebied en wat dat onthult over jouw patronen. Een krachtig inzicht in wat jou écht beweegt en waarom je doet wat je doet.</p>
        </Link>
        <Link href="/future-self" className="relative block h-full bg-white rounded-2xl border-l-4 border-midGreen p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <span className="absolute top-3 right-4 text-[10px] font-bold uppercase tracking-wide bg-midGreen text-white rounded px-2 py-0.5">Nieuw!</span>
          <div className="text-4xl mb-3">🌟</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-2">Future Self Visualisatie</h2>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Ontmoet wie jij al aan het worden bent. Kies je tijdlijn, thema en sfeer, en ontvang een persoonlijke geleide visualisatie om te lezen of in te spreken.</p>
        </Link>
      </div>

      {/* Voor ondernemers */}
      <div className="rounded-2xl border-2 border-darkGreen overflow-hidden mb-8">
        <button
          onClick={() => setOndernOpen((s) => !s)}
          className="w-full bg-darkGreen px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center text-left"
        >
          <p className="text-lg font-bold text-white mt-0.5">Voor ondernemers</p>
          <span className={`text-white text-base opacity-80 transition-transform duration-200 ${ondernOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        <div className="bg-cream relative">
          <div className={`px-4 sm:px-6 py-5 overflow-hidden transition-all duration-300 ${ondernOpen ? 'max-h-[2000px]' : 'max-h-[210px]'}`}>
            <p className="text-sm text-darkSlate leading-relaxed mb-3">
              Naast persoonlijke groei bevat het BinnensteBuiten Spel™ ook tools speciaal voor ondernemers. Zodat je niet alleen bewust wordt van wat er in jouw leven speelt, maar ook in jouw bedrijf.
            </p>
            <p className="text-sm text-darkSlate leading-relaxed mb-5">
              <strong>Werk jij met ondernemers?</strong> Dan kun je deze tools ook inzetten in jouw coachings/NEI-sessies!
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/business-scan"
                className="block bg-white rounded-2xl border-l-4 border-darkGreen p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform"
              >
                <div className="text-4xl mb-3">📊</div>
                <h2 className="font-salmon text-xl text-darkSlate mb-2">Business Scan</h2>
                <p className="text-sm text-darkSlate/70 leading-relaxed">Snel overzicht van 12 bedrijfscategorieën met bewust/onbewust scores en het ONE THING om nu op te focussen.</p>
              </Link>
              <Link
                href="/business-scan-gedetailleerd"
                className="block bg-white rounded-2xl border-l-4 border-darkGreen p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform"
              >
                <div className="text-4xl mb-3">🔍</div>
                <h2 className="font-salmon text-xl text-darkSlate mb-2">Business Scan · uitgebreid</h2>
                <p className="text-sm text-darkSlate/70 leading-relaxed">Diepgaande business scan met scores per subonderdeel, uitgebreide analyse en het ONE THING om op te focussen.</p>
              </Link>
            </div>
          </div>
          {!ondernOpen && (
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-cream to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* Flauwekul Filter */}
      <div className="rounded-2xl border-2 border-orange overflow-hidden mb-8">
        <button
          onClick={() => setFlauwOpen((s) => !s)}
          className="w-full bg-orange px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center text-left"
        >
          <div>
            <p className="text-lg font-bold text-white mt-0.5">Flauwekul Filter</p>
          </div>
          <span className={`text-white text-base opacity-80 transition-transform duration-200 ${flauwOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        <div className="bg-cream relative">
          <div className={`px-4 sm:px-6 py-5 overflow-hidden transition-all duration-300 ${flauwOpen ? 'max-h-[2000px]' : 'max-h-[210px]'}`}>
            <p className="text-sm text-darkSlate leading-relaxed mb-3">
              Je hoofd is soms een drukke markt vol overtuigingen die al járen hetzelfde kraampje runnen:
            </p>
            <ul className="text-sm text-darkSlate leading-relaxed mb-3 list-disc list-inside">
              <li><em>"Niet genoeg."</em></li>
              <li><em>"Te laat."</em></li>
              <li><em>"Dat bestaat niet voor mij."</em></li>
            </ul>
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
              <Link
                href="/geldgedoe"
                className="relative block bg-white rounded-2xl border-l-4 border-darkRed p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform"
              >
                <span className="absolute top-3 right-4 text-[10px] font-bold uppercase tracking-wide bg-darkRed text-white rounded px-2 py-0.5">Nieuw!</span>
                <div className="text-4xl mb-3">💸</div>
                <h2 className="font-salmon text-xl text-darkSlate mb-2">Geld Gedoe</h2>
                <p className="text-sm text-darkSlate/70 leading-relaxed">Spoor je geldblokkades op en ontdek welk verhaal jij jezelf vertelt.</p>
              </Link>

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
                  aria-hidden="true"
                >
                  <span className="absolute top-3 right-4 text-[10px] font-bold uppercase tracking-wide bg-darkGreen text-white rounded px-2 py-0.5">Binnenkort beschikbaar</span>
                  <div className="text-4xl mb-3">{f.icon}</div>
                  <h2 className="font-salmon text-xl text-[#999] mb-2">{f.titel}</h2>
                  <p className="text-sm text-[#aaa]">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
          {!flauwOpen && (
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-cream to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* Human Design */}
      <h2 className="font-bold text-xs uppercase tracking-widest text-darkSlate mb-3">Human Design</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/human-design-affirmaties"
          className="block h-full bg-white rounded-2xl border-l-4 border-blauw p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform"
        >
          <div className="text-4xl mb-3">🧬</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Human Design Affirmaties</h2>
          <p className="text-xs text-blauw font-semibold mb-2">Laat los wat niet van jou is</p>
          <p className="text-sm text-darkSlate/70 leading-relaxed"></p>
        </Link>
      </div>

    </div>
  );
}
