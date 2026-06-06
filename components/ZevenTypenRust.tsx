'use client';

import { useState, useRef, useEffect } from 'react';
import { ZevenTypenRustPdfKnop } from './ZevenTypenRustPdf';

export type RustTyp = {
  id: string;
  icon: string;
  naam: string;
  beschrijving: string;
  affirmaties: string[];
  olieen: string[];
};

export const RUST_TYPEN: RustTyp[] = [
  {
    id: 'fysiek',
    icon: '😴',
    naam: 'Fysieke rust',
    beschrijving: 'Je lichaam heeft rust nodig: slaap, ontspanning, stilzitten. Dit gaat over herstel van het lichaam op zowel actieve manier (yoga, stretching) als passieve manier (slapen, dutjes doen).',
    affirmaties: [
      'Mijn lichaam mag ontspannen en herstellen.',
      'Ik geef mezelf toestemming om te rusten zonder schuldgevoel.',
    ],
    olieen: ['Lavender', 'Blue Relief', 'PanAway'],
  },
  {
    id: 'mentaal',
    icon: '🧠',
    naam: 'Mentale rust',
    beschrijving: 'Je hoofd staat vol met gedachten, lijstjes en zorgen. Mentale rust gaat over het leeglopen van gedachten: minder piekeren, meer aanwezig zijn in het moment.',
    affirmaties: [
      'Ik laat mijn gedachten tot rust komen.',
      'Ik hoef niet alles nu op te lossen.',
      'Stilte en leegte zijn helpend voor mij.',
    ],
    olieen: ['Vetiver', 'Peace & Calming', 'Idaho Blue Spruce'],
  },
  {
    id: 'sensorisch',
    icon: '🔕',
    naam: 'Sensorische rust',
    beschrijving: 'Je zintuigen worden overspoeld door schermen, geluid, licht en drukte. Sensorische rust vraagt om bewust minder prikkels: minder schermtijd, stilte opzoeken, ogen sluiten.',
    affirmaties: [
      'Ik kies voor momenten zonder prikkels.',
      'Mijn zintuigen mogen pauzeren en herstellen.',
    ],
    olieen: ['Lavender', 'Frankincense', 'Roman Chamomile'],
  },
  {
    id: 'creatief',
    icon: '🎨',
    naam: 'Creatieve rust',
    beschrijving: 'Je creativiteit en inspiratie zijn op. Creatieve rust is jezelf laten raken door schoonheid: natuur, kunst, muziek of gewoon verwondering voor wat er al is.',
    affirmaties: [
      'Ik mag mij laten inspireren zonder druk.',
      'In stilte vind ik nieuwe ideeën en helderheid.',
    ],
    olieen: ['Citrus Fresh', 'Inspiration', 'Clarity'],
  },
  {
    id: 'emotioneel',
    icon: '💛',
    naam: 'Emotionele rust',
    beschrijving: 'Je draagt gevoelens met je mee die je niet durft uit te spreken. Emotionele rust is eerlijk zijn over hoe je je voelt, zonder masker, zonder "het gaat wel" zeggen.',
    affirmaties: [
      'Ik mag mijn emoties voelen zonder ze te verbergen.',
      'Mijn binnenwereld verdient liefdevolle aandacht.',
    ],
    olieen: ['Rose', 'Release', 'Harmony'],
  },
  {
    id: 'sociaal',
    icon: '🤝',
    naam: 'Sociale rust',
    beschrijving: 'Niet alle sociale contacten vullen je op. Sommige kosten energie. Sociale rust is meer kwaliteitscontact en minder verplichtingsgesprekken, en bewust kiezen met wie je tijd doorbrengt.',
    affirmaties: [
      'Ik mag afstand nemen van relaties die mij uitputten.',
      'Stilte en alleen zijn is helpend voor mij.',
    ],
    olieen: ['Cedarwood', 'Vetiver', 'Grounding'],
  },
  {
    id: 'spiritueel',
    icon: '✨',
    naam: 'Spirituele rust',
    beschrijving: 'Je mist het gevoel van betekenis, verbinding of richting. Spirituele rust gaat over de verbinding met iets groters dan jezelf: je waarden, de natuur, je geloof of je levensvisie.',
    affirmaties: [
      'Ik ben verbonden met iets groters dan mijzelf.',
      'Ik vertrouw erop dat ik het juiste pad loop. Ik ben precies waar ik op dit moment moet zijn.',
    ],
    olieen: ['Frankincense', 'Sacred Frankincense', 'Magnify Your Purpose'],
  },
];

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

export default function ZevenTypenRust() {
  const [stap, setStap] = useState<0 | 1>(0);
  const [geselecteerd, setGeselecteerd] = useState<string[]>([]);
  const [gekozenAffirmaties, setGekozenAffirmaties] = useState<Record<string, boolean[]>>({});
  const [notities, setNotities] = useState<Record<string, string>>({});
  const [gekopieerd, setGekopieerd] = useState(false);
  const [openOlie, setOpenOlie] = useState<Record<string, boolean>>({});
  const [gekozenOlieen, setGekozenOlieen] = useState<Record<string, string[]>>({});

  function toggleTyp(id: string) {
    setGeselecteerd((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleAffirmatie(typId: string, index: number) {
    setGekozenAffirmaties((prev) => {
      const typ = RUST_TYPEN.find((t) => t.id === typId)!;
      const huidig = prev[typId] || typ.affirmaties.map(() => false);
      const nieuw = [...huidig];
      nieuw[index] = !nieuw[index];
      return { ...prev, [typId]: nieuw };
    });
  }

  function naarStap1() {
    setGekozenAffirmaties((prev) => {
      const nieuw = { ...prev };
      for (const id of geselecteerd) {
        if (!nieuw[id]) {
          const typ = RUST_TYPEN.find((t) => t.id === id)!;
          nieuw[id] = typ.affirmaties.map(() => false);
        }
      }
      return nieuw;
    });
    setStap(1);
  }

  function bouwKopieertekst(): string {
    return RUST_TYPEN
      .filter((t) => geselecteerd.includes(t.id))
      .map((typ) => {
        const gekozen = gekozenAffirmaties[typ.id] || [false, false];
        const regels = typ.affirmaties.filter((_, i) => gekozen[i]);
        const notitie = notities[typ.id];
        const olieen = gekozenOlieen[typ.id] || [];
        return [
          typ.naam,
          ...regels,
          notitie ? `Actie: ${notitie}` : '',
          olieen.length ? `Olie: ${olieen.join(', ')}` : '',
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

  const geselecteerdeTypen = RUST_TYPEN.filter((t) => geselecteerd.includes(t.id));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">7 Typen Rust</h1>
        <p className="text-sm text-midGreen italic mb-2">Naar het werk van Dr. Saundra Dalton-Smith</p>
        <p className="text-sm text-darkSlate/70 leading-relaxed">
          Er zijn 7 soorten rust die mensen nodig hebben om zich echt hersteld te voelen.
          Gebruik je biotensor om te ontdekken welke typen rust jij nu het meest nodig hebt.
        </p>
      </div>

      {stap === 0 && (
        <>
          <p className="text-xs text-darkSlate/60 mb-5 leading-relaxed bg-cream/60 rounded-xl px-4 py-3 border border-lightBg">
            Houd je biotensor vast en vraag voor elk type rust: "Heb ik dit type rust nu nodig?" Vink aan wat resoneert.
          </p>
          <div className="flex flex-col gap-3 mb-8">
            {RUST_TYPEN.map((typ) => {
              const actief = geselecteerd.includes(typ.id);
              return (
                <button
                  key={typ.id}
                  onClick={() => toggleTyp(typ.id)}
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
                    <span className="text-2xl -mt-0.5 flex-shrink-0">{typ.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm mb-1 ${actief ? 'text-darkGreen' : 'text-darkSlate'}`}>
                        {typ.naam}
                      </p>
                      <p className="text-xs text-darkSlate/70 leading-relaxed">{typ.beschrijving}</p>
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
            Bekijk mijn affirmaties →
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
            {geselecteerdeTypen.map((typ) => {
              const gekozen = gekozenAffirmaties[typ.id] || typ.affirmaties.map(() => false);
              return (
                <div key={typ.id} className="bg-white rounded-2xl p-5 shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{typ.icon}</span>
                    <h2 className="font-salmon text-lg text-darkSlate">{typ.naam}</h2>
                  </div>
                  <p className="text-xs text-darkSlate/60 mb-4 leading-relaxed">{typ.beschrijving}</p>
                  <p className="text-xs font-semibold text-darkSlate/50 uppercase tracking-wider mb-2">
                    {typ.affirmaties.length > 2 ? 'Kies een of meer affirmaties:' : 'Kies een of beide affirmaties:'}
                  </p>
                  <div className="flex flex-col gap-2 mb-4">
                    {typ.affirmaties.map((aff, i) => (
                      <button
                        key={i}
                        onClick={() => toggleAffirmatie(typ.id, i)}
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
                        <span>{aff}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mb-4">
                    <label className="text-xs text-darkSlate/50 block mb-1">Wat ga ik deze week doen?</label>
                    <AutoTextarea
                      value={notities[typ.id] || ''}
                      onChange={(v) => setNotities((prev) => ({ ...prev, [typ.id]: v }))}
                      placeholder="Schrijf een kleine, concrete actie op…"
                      className="w-full text-sm text-darkSlate border border-lightBg rounded-lg px-3 py-2 bg-cream/40 focus:outline-none focus:border-midGreen"
                    />
                  </div>

                  <button
                    onClick={() => setOpenOlie((prev) => ({ ...prev, [typ.id]: !prev[typ.id] }))}
                    className="w-full flex items-center justify-between text-xs text-darkSlate/60 border border-lightBg rounded-lg px-3 py-2 bg-white hover:border-midGreen transition-colors"
                  >
                    <span>Welke olie past hierbij?</span>
                    <span className="text-midGreen">{openOlie[typ.id] ? '▲' : '▼'}</span>
                  </button>
                  {openOlie[typ.id] && (
                    <div className="mt-2 px-3 py-3 bg-cream/50 rounded-lg border border-lightBg">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {typ.olieen.map((olie) => {
                          const gekozen = (gekozenOlieen[typ.id] || []).includes(olie);
                          return (
                            <button
                              key={olie}
                              onClick={() => setGekozenOlieen((prev) => {
                                const huidig = prev[typ.id] || [];
                                return {
                                  ...prev,
                                  [typ.id]: gekozen
                                    ? huidig.filter((o) => o !== olie)
                                    : [...huidig, olie],
                                };
                              })}
                              className={`text-xs px-2.5 py-1 rounded-full font-medium border transition-colors ${
                                gekozen
                                  ? 'bg-darkGreen text-cream border-darkGreen'
                                  : 'bg-white border-midGreen text-darkGreen hover:border-darkGreen'
                              }`}
                            >
                              {olie}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-darkSlate/60 leading-relaxed">
                        Test met je biotensor welke olie nu het beste bij je past.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-cream/60 border border-lightBg rounded-xl px-4 py-3 mb-6 text-sm text-darkSlate/70 leading-relaxed">
            <span className="font-semibold text-darkSlate">Tip:</span> Wil je weten welke etherische olie jou het beste ondersteunt bij jouw type(n) rust? Pak je biotensor en test het!
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={kopieer}
              className="text-sm px-4 py-2 rounded-xl border border-darkGreen text-darkGreen hover:bg-darkGreen/5 transition-colors"
            >
              {gekopieerd ? 'Gekopieerd!' : 'Kopieer affirmaties'}
            </button>
            <ZevenTypenRustPdfKnop
              geselecteerd={geselecteerd}
              typen={RUST_TYPEN}
              gekozenAffirmaties={gekozenAffirmaties}
              notities={notities}
              gekozenOlieen={gekozenOlieen}
            />
          </div>
        </>
      )}
    </div>
  );
}
