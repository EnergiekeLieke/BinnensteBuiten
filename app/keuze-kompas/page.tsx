import Link from 'next/link';

const RICHTINGEN = [
  {
    letter: 'N',
    naam: 'Noord',
    thema: 'Future Self',
    beschrijving: 'Waar wil ik naartoe?',
    vragen: ['Wat is mijn grootste verlangen of intentie?', 'Wat klopt nu echt voor mij?', 'Welk gevoel geeft mij dat?'],
    kleur: 'darkGreen',
    actief: false,
    href: '/keuze-kompas/noord',
  },
  {
    letter: 'O',
    naam: 'Oost',
    thema: 'Loyaliteit',
    beschrijving: 'Wie mag er met jou mee?',
    vragen: ['Aan wie ben je nog loyaal?', 'Kunnen zij meegroeien naar jouw volgende level?', 'Of houd jij jezelf klein uit loyaliteit?'],
    kleur: 'darkRed',
    actief: true,
    href: '/keuze-kompas/oost',
  },
  {
    letter: 'W',
    naam: 'West',
    thema: 'Omgeving',
    beschrijving: 'Wie zit er in jouw support team?',
    vragen: ['Van wie mag jij hulp ontvangen?', 'Van wie wil jij het advies horen?', 'En van wie juist niet?'],
    kleur: 'midGreen',
    actief: false,
    href: '/keuze-kompas/west',
  },
  {
    letter: 'Z',
    naam: 'Zuid',
    thema: 'Loslaten of meenemen',
    beschrijving: 'Wat neem ik mee uit het verleden?',
    vragen: ['Welke lessen en krachten wil ik bewust meenemen?', 'Als je rugzak beperkte ruimte heeft: wat past erin?', 'Wat laat ik achter me?'],
    kleur: 'orange',
    actief: false,
    href: '/keuze-kompas/zuid',
  },
];

const kleurMap: Record<string, string> = {
  darkGreen: 'border-darkGreen text-darkGreen bg-darkGreen/10',
  darkRed:   'border-darkRed text-darkRed bg-darkRed/10',
  midGreen:  'border-midGreen text-midGreen bg-midGreen/10',
  orange:    'border-orange text-orange bg-orange/10',
};

export default function KeuzKompasPagina() {
  return (
    <div className="space-y-6 max-w-lg mx-auto">

      <div className="text-center">
        <div className="text-4xl mb-2">🧭</div>
        <h1 className="font-salmon text-2xl text-darkSlate mb-1">Keuze Kompas</h1>
        <p className="text-midGreen italic text-sm">Spelen met Richting</p>
      </div>

      <div className="bg-lightBg2 rounded-2xl p-4 border border-orange/20 text-sm text-darkSlate space-y-2">
        <p>Het Keuze Kompas helpt je bewuste keuzes te maken vanuit vier richtingen. Elke richting stelt andere vragen, maar samen wijzen ze naar hetzelfde: wie jij wordt.</p>
        <p className="text-darkSlate/60 text-xs">Kies een richting om te verkennen. Richting Oost is nu beschikbaar.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {RICHTINGEN.map((r) => {
          const klasse = kleurMap[r.kleur];
          const inhoud = (
            <>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-3 font-bold text-lg ${klasse}`}>
                {r.letter}
              </div>
              <p className="font-salmon text-base text-darkSlate mb-0.5">{r.naam}</p>
              <p className={`text-xs font-medium mb-2 text-${r.kleur}`}>{r.thema}</p>
              <p className="text-xs text-darkSlate/70 italic mb-2">{r.beschrijving}</p>
              <ul className="space-y-1">
                {r.vragen.map((v, i) => (
                  <li key={i} className="text-xs text-darkSlate/55 flex items-start gap-1.5">
                    <span className={`text-${r.kleur} mt-0.5 flex-shrink-0`}>·</span>{v}
                  </li>
                ))}
              </ul>
            </>
          );

          if (r.actief) {
            return (
              <Link
                key={r.naam}
                href={r.href}
                className={`rounded-2xl border-2 p-4 transition-all hover:shadow-md hover:-translate-y-0.5 transform bg-white border-${r.kleur}`}
              >
                {inhoud}
              </Link>
            );
          }

          return (
            <div key={r.naam} className="rounded-2xl border-2 border-lightBg bg-[#f0eeeb] p-4 opacity-60 relative">
              <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wide bg-darkSlate/20 text-darkSlate/60 rounded px-1.5 py-0.5">Binnenkort</span>
              {inhoud}
            </div>
          );
        })}
      </div>

    </div>
  );
}
