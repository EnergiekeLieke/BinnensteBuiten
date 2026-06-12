'use client';

import { useState, useRef, useEffect } from 'react';
import { GrenzenGidsPdfKnop } from './GrenzenGidsPdf';

export type GrensManier = {
  id: string;
  icon: string;
  naam: string;
  wanneer: string;
  type: 'zin' | 'actie' | 'innerlijk';
  voorbeelden: string[];
  kracht: string;
  letOp?: string;
};

export const GRENS_MANIEREN: GrensManier[] = [
  {
    id: 'direct',
    icon: '🧭',
    naam: 'De directe manier',
    wanneer: 'Gebruik dit als je helder wilt zijn zonder uitleg.',
    type: 'zin',
    voorbeelden: [
      'Nee, dat wil ik niet.',
      'Dit voelt niet goed voor mij.',
      'Daar heb ik nu geen ruimte voor.',
      'Ik kies ervoor om dit niet te doen.',
    ],
    kracht: 'Duidelijk, geen verwarring.',
    letOp: 'Je hoeft je niet te verantwoorden.',
  },
  {
    id: 'zacht',
    icon: '💬',
    naam: 'De zachte manier',
    wanneer: 'Fijn als je de relatie belangrijk vindt.',
    type: 'zin',
    voorbeelden: [
      'Ik snap dat je dit vraagt, en toch kies ik voor mezelf.',
      'Ik wil je graag helpen, maar nu lukt het niet.',
      'Voor mij werkt dit niet, wat wel kan is…',
    ],
    kracht: 'Begrip én grens. Ideaal voor gezin, klanten, vrienden.',
    letOp: 'Zorg dat je grens niet verdwijnt achter de lieve toon.',
  },
  {
    id: 'uitstel',
    icon: '⏳',
    naam: 'De uitstel-manier',
    wanneer: 'Als je voelt dat je over je grens gaat, maar nog geen antwoord hebt.',
    type: 'zin',
    voorbeelden: [
      'Ik kom hier later op terug.',
      'Ik wil hier even over nadenken.',
      'Mag ik je straks laten weten wat ik besluit?',
    ],
    kracht: 'Je voelt ruimte om te ontdekken wat JIJ wilt.',
    letOp: 'Kom er later ook echt op terug.',
  },
  {
    id: 'herhaal',
    icon: '🔁',
    naam: 'De herhaal-manier',
    wanneer: 'Voor als iemand over je grens heen blijft gaan.',
    type: 'zin',
    voorbeelden: [
      'Zoals ik al zei, dat ga ik niet doen.',
      'Mijn antwoord blijft nee.',
      'Ik begrijp je, en mijn keuze blijft hetzelfde.',
    ],
    kracht: 'Standvastigheid.',
    letOp: 'Blijf rustig, je hoeft geen discussie te voeren.',
  },
  {
    id: 'praktisch',
    icon: '🧱',
    naam: 'De praktische grens',
    wanneer: 'Je koppelt woorden aan gedrag.',
    type: 'zin',
    voorbeelden: [
      'Als dit zo doorgaat, ga ik weg.',
      'Ik stop dit gesprek als de toon zo blijft.',
      'Ik neem hier afstand van.',
    ],
    kracht: 'Je laat zien dat je het meent.',
    letOp: 'Essentie: je volgt je grens ook echt op.',
  },
  {
    id: 'energetisch',
    icon: '💛',
    naam: 'De energetische grens',
    wanneer: 'Voor het innerlijke werk, ook zonder dat je iets hoeft uit te spreken.',
    type: 'innerlijk',
    voorbeelden: [
      'Dit is niet van mij.',
      'Ik kies wat goed is voor mijn energie.',
      'Ik laat los wat niet bij mij hoort.',
    ],
    kracht: 'Werkt ook zonder woorden.',
    letOp: 'Mooi te combineren met biotensor of bodyscan.',
  },
  {
    id: 'ikboodschap',
    icon: '🎯',
    naam: 'De ik-boodschap',
    wanneer: 'Net iets persoonlijker en bewuster: je neemt eigenaarschap.',
    type: 'zin',
    voorbeelden: [
      'Ik merk dat ik hier onrustig van word.',
      'Ik heb behoefte aan rust.',
      'Ik voel dat dit teveel voor me is.',
    ],
    kracht: 'Je blijft bij jezelf, minder kans op conflict.',
    letOp: 'Een ik-boodschap is een opening, geen grens op zich: benoem ook wat je nodig hebt of gaat doen.',
  },
  {
    id: 'alternatief',
    icon: '🚧',
    naam: 'De grens + alternatief',
    wanneer: 'Je zegt nee, maar biedt iets anders aan.',
    type: 'zin',
    voorbeelden: [
      'Vandaag lukt het niet, morgen wel.',
      'Dit kan ik niet doen, maar ik kan je wel hiermee helpen.',
      'Ik doe niet mee, maar ik denk graag even met je mee over wie je in plaats van mij kunt vragen.',
    ],
    kracht: 'Vooral fijn voor pleasers, voelt minder hard.',
    letOp: 'Bied alleen een alternatief aan als je dat ook echt wilt, niet om de nee te verzachten.',
  },
  {
    id: 'nonverbaal',
    icon: '🔕',
    naam: 'De non-verbale grens',
    wanneer: 'Super interessant en vaak onderschat.',
    type: 'actie',
    voorbeelden: [
      'Niet reageren, stilte laten vallen.',
      'Fysiek afstand nemen.',
      'Je lichaam wegdraaien.',
      'Oogcontact verbreken.',
    ],
    kracht: 'Je energie spreekt vóór je woorden.',
    letOp: 'Dit is vaak al voelbaar in de bodyscan.',
  },
  {
    id: 'stopzin',
    icon: '⛔',
    naam: 'De stopzin',
    wanneer: 'Voor het moment zelf, als iets te snel gaat of overweldigend voelt.',
    type: 'zin',
    voorbeelden: [
      'Stop, dit gaat me te snel.',
      'Wacht even.',
      'Hier wil ik even pauze op.',
    ],
    kracht: 'Creëert direct veiligheid in het moment.',
  },
  {
    id: 'verantwoordelijkheid',
    icon: '🧩',
    naam: 'De begrenzing van verantwoordelijkheid',
    wanneer: 'Heel belangrijk, zeker als je snel zorgt voor anderen.',
    type: 'zin',
    voorbeelden: [
      'Dit is niet mijn verantwoordelijkheid.',
      'Dit mag jij zelf oplossen.',
      'Ik laat dit bij jou.',
    ],
    kracht: 'Voorkomt leegtrekken en overzorgen.',
  },
  {
    id: 'innerlijk',
    icon: '🪶',
    naam: 'De innerlijke grens',
    wanneer: 'Nog een laagje dieper dan energetisch, zonder iets uit te spreken.',
    type: 'innerlijk',
    voorbeelden: [
      'Tot hier en niet verder.',
      'Ik hoef hier niets mee.',
      'Ik stap hier niet in.',
    ],
    kracht: 'Je gedrag verandert automatisch mee.',
    letOp: 'Mooi te testen met de biotensor: klopt mijn innerlijke "nee"?',
  },
];

const TYPE_LABEL: Record<GrensManier['type'], string> = {
  zin: 'Kies de zinnen die bij jou passen:',
  actie: 'Kies wat bij jou past:',
  innerlijk: 'Kies de innerlijke uitspraken die kloppen voor jou:',
};

function AutoTextarea({ value, onChange, placeholder, className }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={1}
      style={{ resize: 'none', overflow: 'hidden' }}
      className={className}
    />
  );
}

export default function GrenzenGids() {
  const [stap, setStap] = useState<0 | 1>(0);
  const [geselecteerd, setGeselecteerd] = useState<string[]>([]);
  const [gekozenVoorbeelden, setGekozenVoorbeelden] = useState<Record<string, boolean[]>>({});
  const [situaties, setSituaties] = useState<Record<string, string>>({});
  const [gekopieerd, setGekopieerd] = useState(false);

  function toggleManier(id: string) {
    setGeselecteerd((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleVoorbeeld(manierId: string, index: number) {
    setGekozenVoorbeelden((prev) => {
      const manier = GRENS_MANIEREN.find((m) => m.id === manierId)!;
      const huidig = prev[manierId] || manier.voorbeelden.map(() => false);
      const nieuw = [...huidig];
      nieuw[index] = !nieuw[index];
      return { ...prev, [manierId]: nieuw };
    });
  }

  function naarStap1() {
    setGekozenVoorbeelden((prev) => {
      const nieuw = { ...prev };
      for (const id of geselecteerd) {
        if (!nieuw[id]) {
          const manier = GRENS_MANIEREN.find((m) => m.id === id)!;
          nieuw[id] = manier.voorbeelden.map(() => false);
        }
      }
      return nieuw;
    });
    setStap(1);
  }

  function bouwKopieertekst(): string {
    return GRENS_MANIEREN
      .filter((m) => geselecteerd.includes(m.id))
      .map((manier) => {
        const gekozen = gekozenVoorbeelden[manier.id] || manier.voorbeelden.map(() => false);
        const regels = manier.voorbeelden.filter((_, i) => gekozen[i]);
        const situatie = situaties[manier.id];
        return [
          manier.naam,
          ...regels,
          situatie ? `Situatie: ${situatie}` : '',
        ].filter(Boolean).join('\n');
      })
      .join('\n\n');
  }

  async function kopieer() {
    try {
      await navigator.clipboard.writeText(bouwKopieertekst());
      setGekopieerd(true);
      setTimeout(() => setGekopieerd(false), 2000);
    } catch {
      // clipboard niet beschikbaar
    }
  }

  const geselecteerdeManieren = GRENS_MANIEREN.filter((m) => geselecteerd.includes(m.id));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">Grenzen Gids</h1>
        <p className="text-sm text-midGreen italic mb-4">Jouw cheat sheet voor het stellen van grenzen</p>
        <p className="text-sm text-darkSlate/70 leading-relaxed mb-3">
          Een grens stellen verloopt in vier stappen: van <strong>voelen</strong>, via een <strong>innerlijk besluit</strong>, naar <strong>uitspreken</strong> en uiteindelijk <strong>handelen</strong>. Veel mensen slaan stappen over, bijvoorbeeld meteen praten zonder eerst te voelen, en daar gaat het vaak mis.
        </p>
        <ul className="text-sm text-darkSlate/70 leading-relaxed mb-3 list-disc list-inside">
          <li>Je grens hoeft niet perfect geformuleerd te zijn.</li>
          <li>&ldquo;Nee&rdquo; is een volledige zin.</li>
          <li>Je mag eerst voelen, daarna spreken.</li>
          <li>Grenzen aangeven is zelfliefde in actie.</li>
        </ul>
        <p className="text-sm text-darkSlate/70 leading-relaxed">
          Hieronder vind je 12 manieren om een grens te stellen. Kies welke manieren bij jou passen, dat mogen er ook meerdere zijn.
        </p>
      </div>

      {stap === 0 && (
        <>
          <p className="text-xs text-darkSlate/60 mb-5 leading-relaxed bg-cream/60 rounded-xl px-4 py-3 border border-lightBg">
            Pak je biotensor en vraag voor elke manier: &ldquo;Past dit bij mij?&rdquo; Vink aan wat resoneert.
          </p>
          <div className="flex flex-col gap-3 mb-8">
            {GRENS_MANIEREN.map((manier) => {
              const actief = geselecteerd.includes(manier.id);
              return (
                <button
                  key={manier.id}
                  onClick={() => toggleManier(manier.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                    actief
                      ? 'border-darkGreen bg-darkGreen/5'
                      : 'border-lightBg bg-white hover:border-midGreen'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
                      actief ? 'bg-darkGreen border-darkGreen' : 'border-midGreen bg-white'
                    }`}>
                      {actief && (
                        <svg viewBox="0 0 10 8" className="w-2.5 h-2.5">
                          <path d="M1 4l2.5 2.5L9 1" stroke="#fcebdc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      )}
                    </span>
                    <span className="text-2xl -mt-0.5 flex-shrink-0">{manier.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm mb-1 ${actief ? 'text-darkGreen' : 'text-darkSlate'}`}>
                        {manier.naam}
                      </p>
                      <p className="text-xs text-darkSlate/70 leading-relaxed">{manier.wanneer}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <button
            onClick={naarStap1}
            disabled={geselecteerd.length === 0}
            className="w-full py-3 rounded-xl bg-darkGreen text-cream text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-darkGreen/80 transition-colors"
          >
            Aan de slag met mijn manieren →
          </button>
        </>
      )}

      {stap === 1 && (
        <>
          <button
            onClick={() => setStap(0)}
            className="text-sm text-midGreen hover:text-darkGreen mb-6 inline-flex items-center gap-1 transition-colors"
          >
            ← Terug naar selectie
          </button>

          <div className="flex flex-col gap-6 mb-8">
            {geselecteerdeManieren.map((manier) => {
              const gekozen = gekozenVoorbeelden[manier.id] || manier.voorbeelden.map(() => false);
              return (
                <div key={manier.id} className="bg-white rounded-2xl p-5 shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{manier.icon}</span>
                    <h2 className="font-salmon text-lg text-darkSlate">{manier.naam}</h2>
                  </div>
                  <p className="text-xs text-darkSlate/60 mb-4 leading-relaxed">{manier.wanneer}</p>
                  <p className="text-xs font-semibold text-darkSlate/50 uppercase tracking-wider mb-2">
                    {TYPE_LABEL[manier.type]}
                  </p>
                  <div className="flex flex-col gap-2 mb-4">
                    {manier.voorbeelden.map((voorbeeld, i) => (
                      <button
                        key={i}
                        onClick={() => toggleVoorbeeld(manier.id, i)}
                        className={`w-full text-left p-3 rounded-xl border text-sm leading-relaxed transition-colors flex items-start gap-3 ${
                          gekozen[i]
                            ? 'bg-darkGreen text-cream border-darkGreen'
                            : 'border-lightBg text-darkSlate hover:border-midGreen bg-white'
                        }`}
                      >
                        <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
                          gekozen[i]
                            ? 'bg-cream border-cream'
                            : 'border-midGreen bg-white'
                        }`}>
                          {gekozen[i] && (
                            <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-darkGreen">
                              <path d="M1 4l2.5 2.5L9 1" stroke="#3b5633" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                          )}
                        </span>
                        <span>{voorbeeld}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1 mb-1 text-xs text-darkSlate/70 leading-relaxed">
                    <p><span className="font-semibold text-darkGreen">Kracht:</span> {manier.kracht}</p>
                    {manier.letOp && (
                      <p><span className="font-semibold text-orange">Let op:</span> {manier.letOp}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="text-xs text-darkSlate/50 block mb-1">In welke situatie ga jij dit deze week toepassen?</label>
                    <AutoTextarea
                      value={situaties[manier.id] || ''}
                      onChange={(v) => setSituaties((prev) => ({ ...prev, [manier.id]: v }))}
                      placeholder="Schrijf hier jouw situatie op…"
                      className="w-full text-sm text-darkSlate border border-lightBg rounded-lg px-3 py-2 bg-cream/40 focus:outline-none focus:border-midGreen"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={kopieer}
              className="text-sm px-4 py-2 rounded-xl border border-darkGreen text-darkGreen hover:bg-darkGreen/5 transition-colors"
            >
              {gekopieerd ? 'Gekopieerd!' : 'Kopieer mijn grenzen-gids'}
            </button>
            <GrenzenGidsPdfKnop
              geselecteerd={geselecteerd}
              manieren={GRENS_MANIEREN}
              gekozenVoorbeelden={gekozenVoorbeelden}
              situaties={situaties}
            />
          </div>
        </>
      )}
    </div>
  );
}
