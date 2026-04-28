'use client';

import Link from 'next/link';

function huidigSeizoen(): 'lente' | 'zomer' | 'herfst' | 'winter' {
  const m = new Date().getMonth() + 1;
  const d = new Date().getDate();
  if ((m === 3 && d >= 21) || m === 4 || m === 5 || (m === 6 && d <= 20)) return 'lente';
  if ((m === 6 && d >= 21) || m === 7 || m === 8 || (m === 9 && d <= 22)) return 'zomer';
  if ((m === 9 && d >= 23) || m === 10 || m === 11 || (m === 12 && d <= 20)) return 'herfst';
  return 'winter';
}

const seizoenLabel: Record<string, string> = {
  lente: 'Lente',
  zomer: 'Zomer',
  herfst: 'Herfst',
  winter: 'Winter',
};

const seizoenEmoji: Record<string, string> = {
  lente: '🌸',
  zomer: '☀️',
  herfst: '🍂',
  winter: '❄️',
};

export default function OliePage() {
  const seizoen = huidigSeizoen();

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-salmon text-4xl text-darkSlate mb-3">Oliën</h1>
        <p className="text-midGreen text-sm leading-relaxed">
          Essentiële oliën als ondersteuning voor je lichaam, hoofd en gevoel. Ontdek welke olie past bij wat jij nodig hebt.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <Link
          href="/olie/zoek"
          className="flex overflow-hidden bg-white rounded-2xl border-l-4 border-midGreen shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform"
        >
          <div className="p-6 flex-1">
            <div className="text-4xl mb-3">🔍</div>
            <h2 className="font-salmon text-xl text-darkSlate mb-2">Welke olie past bij wat ik zoek?</h2>
            <p className="text-sm text-darkSlate/70 leading-relaxed">
              Klik een categorie open en ontdek welke oliën jou kunnen ondersteunen, van luchtwegen tot motivatie.
            </p>
          </div>
          <div className="w-28 flex-shrink-0">
            <img src="/fotos/KofferOlie.jpg" alt="Koffer met oliën" className="w-full h-full object-cover" />
          </div>
        </Link>

        <Link
          href={`/olie/seizoen/${seizoen}`}
          className="flex overflow-hidden bg-white rounded-2xl border-l-4 border-orange shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform"
        >
          <div className="p-6 flex-1">
            <div className="text-4xl mb-3">{seizoenEmoji[seizoen]}</div>
            <h2 className="font-salmon text-xl text-darkSlate mb-2">Seizoenstips · {seizoenLabel[seizoen]}</h2>
            <p className="text-sm text-darkSlate/70 leading-relaxed">
              Welke oliën passen bij dit seizoen? Praktische tips voor {seizoenLabel[seizoen].toLowerCase()}.
            </p>
          </div>
          <div className="w-28 flex-shrink-0">
            <img src="/fotos/LiekeCuptOlie.jpg" alt="Lieke cupt een olie" className="w-full h-full object-cover" />
          </div>
        </Link>

        <Link
          href="/olie/biotensor"
          className="flex overflow-hidden bg-white rounded-2xl border-l-4 border-darkRed shadow hover:shadow-md transition-shadow hover:-translate-y-0.5 transform"
        >
          <div className="p-6 flex-1">
            <div className="text-4xl mb-3">🎯</div>
            <h2 className="font-salmon text-xl text-darkSlate mb-2">Biotensor-stappenplan</h2>
            <p className="text-sm text-darkSlate/70 leading-relaxed">
              Zo test je vanuit je onderbewustzijn welke olie jij op dit moment nodig hebt.
            </p>
          </div>
          <div className="w-28 flex-shrink-0">
            <img src="/fotos/LiekeTestOlieBT.jpg" alt="Lieke test olie met biotensor" className="w-full h-full object-cover" />
          </div>
        </Link>

        <div className="bg-white rounded-2xl border-l-4 border-darkGreen p-6 shadow">
          <div className="text-4xl mb-3">🎲</div>
          <h2 className="font-salmon text-xl text-darkSlate mb-2">Speel de quiz</h2>
          <p className="text-sm text-darkSlate/70 leading-relaxed mb-4">
            Beantwoord een paar vragen en ontdek welke oliën jou aanspreken.
          </p>
          <div className="flex gap-3 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wide bg-darkGreen text-white rounded px-3 py-1.5 opacity-50 cursor-not-allowed">
              Beginner · binnenkort
            </span>
            <span className="text-xs font-bold uppercase tracking-wide bg-darkGreen text-white rounded px-3 py-1.5 opacity-50 cursor-not-allowed">
              Gevorderd · binnenkort
            </span>
          </div>
        </div>

        <div className="relative bg-[#e8e6e1] rounded-2xl border-l-4 border-[#ccc] p-6 opacity-65 cursor-not-allowed col-span-1 sm:col-span-2">
          <span className="absolute top-3 right-4 text-[10px] font-bold uppercase tracking-wide bg-darkGreen text-white rounded px-2 py-0.5">
            Versie 2.0
          </span>
          <div className="text-4xl mb-3">✨</div>
          <h2 className="font-salmon text-xl text-[#999] mb-2">Human Design &amp; Olie</h2>
          <p className="text-sm text-[#aaa] leading-relaxed">
            Oliën afgestemd op jouw Human Design type, autoriteit en profiel.
          </p>
        </div>

      </div>
    </div>
  );
}
