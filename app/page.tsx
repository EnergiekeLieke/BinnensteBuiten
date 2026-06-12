'use client';

import { useState } from 'react';
import Link from 'next/link';
import AandachtBingo from '@/components/AandachtBingo';


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

      {/* Stemmetje leadmagnet */}
      <Link href="/stemmetje" className="relative block bg-darkRed rounded-2xl p-6 mb-10 shadow-md hover:shadow-lg transition-shadow hover:-translate-y-0.5 transform">
        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide bg-white text-darkRed rounded px-2 py-0.5">Gratis</span>
        <div className="text-4xl mb-3">🎭</div>
        <h2 className="font-salmon text-xl text-cream mb-1">Wie fluistert er in jouw hoofd?</h2>
        <p className="text-xs text-cream/70 italic mb-2">Ontdek en benoem jouw strenge stemmetje</p>
        <p className="text-sm text-cream/80 leading-relaxed">Dat stemmetje dat zegt dat het niet goed genoeg is. In 6 vragen ontdek je wie het is en krijgt het een naam. Want een stemmetje met een naam heeft minder grip op jou.</p>
      </Link>

      <h2 className="font-bold text-xs uppercase tracking-widest text-darkSlate mb-3">Tools</h2>

      <p className="text-sm font-bold text-darkSlate mb-3">Ontdek wat er speelt: Hoe sta je ervoor?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <Link href="/levenswiel" className="block h-full bg-white rounded-2xl border-l-4 border-darkRed p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="text-4xl mb-3">🌐</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Levenswiel Analyse</h2>
          <p className="text-xs text-midGreen italic mb-2">Bekijk je leven vanuit helikopterview.</p>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Het spinnenweb maakt zichtbaar hoe tevreden jij bewust en onbewust bent over 8 levensgebieden. De analyse toont welke patronen je te doorbreken hebt én geeft je concrete tips.</p>
        </Link>
        <Link href="/verbindingswiel" className="block h-full bg-white rounded-2xl border-l-4 border-midGreen p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="text-4xl mb-3">💞</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Verbindingswiel</h2>
          <p className="text-xs text-midGreen italic mb-2">Voor koppels die hun onderlinge verbinding willen doorvoelen.</p>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Ontdek hoe verbonden jullie écht zijn op 10 dimensies. Inclusief biotensor-scores, reflectievragen en concrete tips in een warm rapport voor koppels.</p>
        </Link>
        <Link href="/me-time-meter" className="block h-full bg-white rounded-2xl border-l-4 border-midGreen p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="text-4xl mb-3">🛀</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Me-time Meter</h2>
          <p className="text-xs text-midGreen italic mb-2">Maak je echt tijd voor jezelf, of komt het er nooit van?</p>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Scoor 10 stellingen op het spectrum tussen uitputting en zelfzorg en ontdek of je in overlevingsstand staat, bewust maar inconsistent bent, of je energie goed bewaakt.</p>
        </Link>
        <Link href="/draagkracht-test" className="block h-full bg-white rounded-2xl border-l-4 border-darkGreen p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="text-4xl mb-3">🌿</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Draagkracht Test</h2>
          <p className="text-xs text-midGreen italic mb-2">Hoeveel kan jouw systeem op dit moment aan?</p>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Scoor 10 stellingen vanuit je onderbewustzijn en ontdek of je in herstel, balans of veerkracht zit. Met thema en interpretatie op maat.</p>
        </Link>
        <Link href="/congruentie-checker" className="block h-full bg-white rounded-2xl border-l-4 border-orange p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Congruentie Checker</h2>
          <p className="text-xs text-midGreen italic mb-2">Kloppen jouw woorden, daden en zichtbaarheid met elkaar?</p>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Meet met de biotensor hoe congruent je bent op drie niveaus. Ontdek waar de grootste gap zit en wat de Tolteekse inzichten je spiegelen.</p>
        </Link>
      </div>

      <p className="text-sm font-bold text-darkSlate mb-3">Spelen met verlangen: Wat wil je écht?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <Link href="/basisverlangens" className="block h-full bg-white rounded-2xl border-l-4 border-orange p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="text-4xl mb-3">💡</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Basisverlangens Werkblad</h2>
          <p className="text-xs text-midGreen italic mb-2">Je weet niet wat je écht wilt, of je maakt steeds keuzes die niet kloppen.</p>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Ontdek welke basisverlangens jou drijven per levensgebied en wat dat onthult over jouw patronen. Een krachtig inzicht in wat jou écht beweegt en waarom je doet wat je doet.</p>
        </Link>
        <Link href="/zeven-typen-rust" className="block h-full bg-white rounded-2xl border-l-4 border-darkGreen p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="text-4xl mb-3">😴</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">7 Typen Rust</h2>
          <p className="text-xs text-midGreen italic mb-2">Welk type rust heeft jouw lichaam en geest nu nodig?</p>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Kies met de biotensor welke rusttypen nu het meest nodig zijn. Selecteer affirmaties per type en schrijf op wat je deze week gaat doen.</p>
        </Link>
      </div>

      <p className="text-sm font-bold text-darkSlate mb-3">Speel het anders: nieuw gedrag laten zien</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <Link href="/kernkwadranten" className="block h-full bg-white rounded-2xl border-l-4 border-darkGreen p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="text-4xl mb-3">🔷</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Kernkwadranten</h2>
          <p className="text-xs text-midGreen italic mb-2">Ontdek jouw kwaliteit, valkuil, uitdaging en allergie</p>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Bouw jouw persoonlijk Ofman-kernkwadrant. Start vanuit je kwaliteit of vanuit wat jou irriteert in anderen. De AI vult het kwadrant aan en geeft je groei-affirmaties en een eerste stap voor vandaag.</p>
        </Link>
        <Link href="/grenzen-gids" className="block h-full bg-white rounded-2xl border-l-4 border-darkGreen p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="text-4xl mb-3">🧭</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Grenzen Gids</h2>
          <p className="text-xs text-midGreen italic mb-2">Jouw cheat sheet voor het stellen van grenzen</p>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Ontdek 12 manieren om een grens te stellen, van direct tot non-verbaal. Kies wat bij jou past, claim je eigen zinnen en schrijf op in welke situatie jij dit deze week toepast.</p>
        </Link>
      </div>

      <p className="text-sm font-bold text-darkSlate mb-3">Naar vrij spel: Hoe vrij stroomt jouw energie?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <Link href="/flowtest" className="block h-full bg-white rounded-2xl border-l-4 border-darkGreen p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="text-4xl mb-3">🌊</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">FLOW-test</h2>
          <p className="text-xs text-midGreen italic mb-2">Ontdek wat jou tegenhoudt om echt in flow te komen.</p>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Meet hoe vrij de energie stroomt, spoor belemmerende overtuigingen op en ontvang persoonlijke affirmaties om de blokkades los te laten.</p>
        </Link>
        <Link href="/aandachtladder" className="block h-full bg-white rounded-2xl border-l-4 border-darkGreen p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
          <div className="text-4xl mb-3">🪜</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Aandachtladder</h2>
          <p className="text-xs text-midGreen italic mb-2">Waar zit je met je aandacht?</p>
          <p className="text-sm text-darkSlate/70 leading-relaxed">Ontdek op welke trede van de aandachtladder jij staat en wat je nodig hebt om een stap hoger te komen. Gebruik je biotensor als journalling-buddy.</p>
        </Link>
      </div>

      <div className="mb-8">
        <AandachtBingo />
      </div>

      {/* Spelen met Richting */}
      <div className="rounded-2xl border-2 border-darkGreen overflow-hidden mb-8">
        <div className="bg-darkGreen px-4 sm:px-6 py-3 sm:py-4">
          <p className="text-lg font-bold text-white mt-0.5">Spelen met Richting</p>
          <p className="text-xs text-white/70 mt-0.5">Vind jouw persoonlijke spelregels voor een fijn leven. Een ontdekkingstocht langs jouw verlangens, keuzes en grenzen.</p>
        </div>
        <div className="bg-cream px-4 sm:px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/keuze-kompas" className="block h-full bg-white rounded-2xl border-l-4 border-darkGreen p-5 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
              <div className="text-3xl mb-2">🧭</div>
              <h2 className="font-salmon text-lg text-darkSlate mb-1">Keuze Kompas</h2>
              <p className="text-xs text-midGreen italic mb-2">Ontdek jouw persoonlijke spelregels aan de hand van de 4 windrichtingen</p>
              <p className="text-sm text-darkSlate/70 leading-relaxed">Ontdek waar je naartoe wilt, wat je meeneemt, wie je draagt en aan wie je nog loyaal bent. Vier richtingen, één kompas.</p>
            </Link>
            <Link href="/future-self" className="relative block h-full bg-white rounded-2xl border-l-4 border-midGreen p-5 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
              <div className="text-3xl mb-2">🌟</div>
              <h2 className="font-salmon text-lg text-darkSlate mb-1">Future Self Visualisatie</h2>
              <p className="text-xs text-midGreen italic mb-2">Voel de energie van jouw toekomstige zelf</p>
              <p className="text-sm text-darkSlate/70 leading-relaxed">Ontmoet wie jij al aan het worden bent. Kies je tijdlijn, thema en sfeer, en ontvang een persoonlijke geleide visualisatie.</p>
            </Link>
          </div>
        </div>
      </div>

      {/* De wortels van jouw verhaal */}
      <div className="rounded-2xl border-2 border-darkRed overflow-hidden mb-8">
        <div className="bg-darkRed px-4 sm:px-6 py-3 sm:py-4">
          <p className="text-lg font-bold text-white mt-0.5">De wortels van jouw verhaal</p>
          <p className="text-xs text-white/70 mt-0.5">Patronen uit je jeugd die nog steeds doorwerken in wie je nu bent.</p>
        </div>

        <div className="bg-cream px-4 sm:px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/moedertype" className="block h-full bg-white rounded-2xl border-l-4 border-darkRed p-5 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
              <div className="text-3xl mb-2">🌿</div>
              <h2 className="font-salmon text-lg text-darkSlate mb-1">Moederwond</h2>
              <p className="text-xs text-midGreen italic mb-2">Welk type moeder ben jij?</p>
              <p className="text-sm text-darkSlate/70 leading-relaxed">Ontdek via de biotensor welk moederpatroon het meest actief is én waar jouw kracht als moeder al volop aanwezig is.</p>
            </Link>

            <Link href="/vadertype" className="block h-full bg-white rounded-2xl border-l-4 border-darkRed p-5 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
              <div className="text-3xl mb-2">🦁</div>
              <h2 className="font-salmon text-lg text-darkSlate mb-1">Vaderwond</h2>
              <p className="text-xs text-midGreen italic mb-2">Welk vaderpatroon draag jij mee?</p>
              <p className="text-sm text-darkSlate/70 leading-relaxed">Ontdek welk vaderpatroon het meest actief is in jouw leven en wat dat zegt over wie je bent geworden.</p>
            </Link>

            <Link href="/innerlijk-kind" className="block h-full bg-white rounded-2xl border-l-4 border-darkRed p-5 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
              <div className="text-3xl mb-2">🧸</div>
              <h2 className="font-salmon text-lg text-darkSlate mb-1">Jouw innerlijk kind</h2>
              <p className="text-xs text-midGreen italic mb-2">Welke wond draag jij al van kinds af aan?</p>
              <p className="text-sm text-darkSlate/70 leading-relaxed">Ontdek welke van de vijf basiswonden het sterkst aanwezig is in jouw leven, naar het werk van Lise Bourbeau.</p>
            </Link>

            <Link href="/trauma-talent" className="block h-full bg-white rounded-2xl border-l-4 border-darkRed p-5 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform">
              <div className="text-3xl mb-2">🌀</div>
              <h2 className="font-salmon text-lg text-darkSlate mb-1">Trauma-talent</h2>
              <p className="text-xs text-midGreen italic mb-2">Van elastiek naar jouw kernkwaliteit</p>
              <p className="text-sm text-darkSlate/70 leading-relaxed">Ontdek welk onbewust patroon jou terughoudt én welk talent er onder schuilt. Bouw je persoonlijke Ofman-kernkwadrant.</p>
            </Link>
          </div>
        </div>
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
                <h2 className="font-salmon text-xl text-darkSlate mb-1">Business Scan</h2>
                <p className="text-xs text-midGreen italic mb-2">Snel zien waar jouw energie als ondernemer weglekt.</p>
                <p className="text-sm text-darkSlate/70 leading-relaxed">Snel overzicht van 12 bedrijfscategorieën met bewust/onbewust scores en het ONE THING om nu op te focussen.</p>
              </Link>
              <Link
                href="/business-scan-gedetailleerd"
                className="block bg-white rounded-2xl border-l-4 border-darkGreen p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform"
              >
                <div className="text-4xl mb-3">🔍</div>
                <h2 className="font-salmon text-xl text-darkSlate mb-1">Business Scan · uitgebreid</h2>
                <p className="text-xs text-midGreen italic mb-2">Je wilt dieper dan de snelle scan en zoekt de precieze blokkade per subonderdeel.</p>
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
                <h2 className="font-salmon text-xl text-darkSlate mb-1">Geld Gedoe</h2>
                <p className="text-xs text-midGreen italic mb-2">Geld voelt beladen, of je wilt jouw geldenergie doorvoelen.</p>
                <p className="text-sm text-darkSlate/70 leading-relaxed">Spoor je geldblokkades op en ontdek welk verhaal jij jezelf vertelt.</p>
              </Link>

              <Link
                href="/liefdeslek"
                className="relative block bg-white rounded-2xl border-l-4 border-darkRed p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform"
              >
                <span className="absolute top-3 right-4 text-[10px] font-bold uppercase tracking-wide bg-darkRed text-white rounded px-2 py-0.5">Nieuw!</span>
                <div className="text-4xl mb-3">💔</div>
                <h2 className="font-salmon text-xl text-darkSlate mb-1">Liefdes Lek</h2>
                <p className="text-xs text-midGreen italic mb-2">Moeite met zelfliefde, verbinding of intimiteit speelt een rol in jouw leven.</p>
                <p className="text-sm text-darkSlate/70 leading-relaxed">Herken de overtuigingen die jou van échte verbinding en zelfliefde weerhouden.</p>
              </Link>

              {[
                { titel: 'Tijd Tekort', icon: '⏳', sub: 'Ontdek waarom je agenda voller voelt dan ie is.' },
                { titel: 'Batterij Blokkade', icon: '🔋', sub: 'Spoor op waar jouw energie weglekt, en ontdek hoe je dat stopt.' },
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
      <h2 className="font-bold text-xs uppercase tracking-widest text-darkSlate mb-3">Speel het anders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/human-design-affirmaties"
          className="block h-full bg-white rounded-2xl border-l-4 border-darkGreen p-6 shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform"
        >
          <svg viewBox="0 0 40 50" className="w-10 h-10 mb-3" fill="none" stroke="#3b5633" strokeWidth="1.5" strokeLinejoin="round">
            <polygon points="20,1 13,11 27,11" />
            <polygon points="20,12 13,22 27,22" />
            <rect x="14" y="23" width="12" height="6" />
            <polygon points="20,30 13,37 20,44 27,37" />
            <rect x="12" y="45" width="16" height="5" />
          </svg>
          <h2 className="font-salmon text-xl text-darkSlate mb-1">Human Design Affirmaties</h2>
          <p className="text-xs text-midGreen italic mb-2">Je klant kent haar Human Design en wil werken met haar energiecentra.</p>
          <p className="text-sm text-darkSlate/70 leading-relaxed italic">Laat los wat niet van jou is</p>
        </Link>
      </div>

    </div>
  );
}
