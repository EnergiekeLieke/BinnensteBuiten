'use client';

import { useState, useRef, useMemo } from 'react';
import { exporteerAlsPdf } from '@/lib/huisstijl';
import { HD_AFFIRMATIES, HD_PATRONEN, HD_TYPE_TEKSTEN, HD_PROFIEL_TEKSTEN } from '@/lib/hdAffirmatiesData';

const HD_AFFIRMATIES_MAP = new Map(HD_AFFIRMATIES.map(c => [c.key, c]));

const TYPES: { naam: string; toelichting: string }[] = [
  { naam: 'Generator',            toelichting: 'Bron van creatiekracht en levensenergie. Jouw energie is er om te reageren op je omgeving. Volg wat jou plezier/enthousiasme brengt.' },
  { naam: 'Manifesting Generator', toelichting: 'Multi-gepassioneerd en snel. Combineer levensenergie met initiatief en volg wat jouw onderbuik je vertelt.' },
  { naam: 'Manifestor',           toelichting: 'Jij bent hier om te initiëren. Informeer anderen zodat ze ruimte maken voor jouw beweging.' },
  { naam: 'Projector',            toelichting: 'Geboren om te gidsen. Jouw gave is mensen en systemen doorgronden. Wacht bij het delen van jouw wijsheid op de uitnodiging/erkenning.' },
  { naam: 'Reflector',            toelichting: 'Jij bent een spiegel van de omgeving, de thermometer van de groep. Jouw wijsheid ontvouwt zich in de loop van een maancyclus.' },
];

const PROFIEL_ONBEWUST: Record<string, string[]> = {
  '1': ['3', '4'],
  '2': ['4', '5'],
  '3': ['5', '6'],
  '4': ['6', '1'],
  '5': ['1', '2'],
  '6': ['2', '3'],
};

const CENTRA = [
  { key: 'hoofd',      label: 'Hoofd',          toelichting: 'Mentale inspiratie en druk. De vragen die om antwoorden vragen.',                              thema: 'mentale inspiratie en druk' },
  { key: 'ajna',       label: 'Ajna',            toelichting: 'Het analytische denkcentrum. Verwerkt informatie, vormt concepten en perspectief.', thema: 'mentale zekerheid en concepten' },
  { key: 'keel',       label: 'Keel',            toelichting: 'Expressie en manifestatie. Zet energie om in woorden en actie.',                                thema: 'manifestatie en communicatie' },
  { key: 'identiteit', label: 'Identiteit (G)',  toelichting: 'Het centrum van richting en (zelf)liefde. Verbonden met jouw kern en levenspad / richting.',                     thema: 'richting, liefde en identiteit' },
  { key: 'hart',       label: 'Hart / Ego',      toelichting: 'Wilskracht en eigenwaarde. Beheert toezeggingen en wat jij bereid bent te geven.',              thema: 'wilskracht en eigenwaarde' },
  { key: 'sacraal',    label: 'Sacraal',         toelichting: 'Krachtige motor. Bron van levenskracht, seksualiteit en plezier.',                               thema: 'levensenergie en daadkracht' },
  { key: 'milt',       label: 'Milt',            toelichting: 'Intuïtie en veiligheid. Reageert in het moment op wat goed (veilig) voelt voor jou.',          thema: 'intuïtie en veiligheid' },
  { key: 'emotie',     label: 'Emotiecentrum',   toelichting: 'Emoties en gevoel. Beïnvloedt beslissingen via een emotionele golf die eb en vloed kent.',     thema: 'emoties en gevoelens' },
  { key: 'wortel',     label: 'Wortel',          toelichting: 'Adrenaline en doe-druk. Beheert de drang om te handelen, in actie te komen en stress te verwerken.', thema: 'adrenaline en stressdruk' },
] as const;

// Compleet open eerst
const STAAT_OPTIES = [
  { id: 'compleet_open',  label: 'Compleet open'  },
  { id: 'ongedefinieerd', label: 'Ongedefinieerd' },
  { id: 'gedefinieerd',   label: 'Gedefinieerd'   },
] as const;

type Staat = (typeof STAAT_OPTIES)[number]['id'];
type CentraState = Partial<Record<string, Staat>>;

const CYCLE: (Staat | undefined)[] = [undefined, 'compleet_open', 'ongedefinieerd', 'gedefinieerd'];

function volgende(huidig: Staat | undefined): Staat | undefined {
  return CYCLE[(CYCLE.indexOf(huidig) + 1) % CYCLE.length];
}

// darkGreen = #3b5633
function centrumKleur(staat: Staat | undefined) {
  if (staat === 'gedefinieerd')   return { fill: '#3b5633', stroke: '#3b5633', text: '#ffffff', dash: '' };
  if (staat === 'ongedefinieerd') return { fill: '#ffffff', stroke: '#3b5633', text: '#3b5633', dash: '' };
  if (staat === 'compleet_open')  return { fill: '#ffffff', stroke: '#9ca3af', text: '#6b7280', dash: '4 2' };
  return                                 { fill: '#f0ede8', stroke: '#c5bfb5', text: '#a0998f', dash: '' };
}

// ── Bodygraph SVG ─────────────────────────────────────────────────────────────

function BodygraphSVG({ centra, onKlik }: { centra: CentraState; onKlik: (key: string) => void }) {
  function k(key: string) { return centrumKleur(centra[key]); }

  function Rect({ cKey, x, y, w, h, lx, ly, label }: {
    cKey: string; x: number; y: number; w: number; h: number;
    lx: number; ly: number; label: string;
  }) {
    const c = k(cKey);
    return (
      <g onClick={() => onKlik(cKey)} className="cursor-pointer select-none">
        <rect x={x} y={y} width={w} height={h} rx="2"
          fill={c.fill} stroke={c.stroke} strokeWidth="1.5" strokeDasharray={c.dash} />
        <text x={lx} y={ly} textAnchor="middle" fontSize="7"
          fill={c.text} fontFamily="sans-serif" pointerEvents="none">{label}</text>
      </g>
    );
  }

  function Poly({ cKey, points, lx, ly, label, fontSize = 7 }: {
    cKey: string; points: string; lx: number; ly: number;
    label: string; fontSize?: number;
  }) {
    const c = k(cKey);
    return (
      <g onClick={() => onKlik(cKey)} className="cursor-pointer select-none">
        <polygon points={points}
          fill={c.fill} stroke={c.stroke} strokeWidth="1.5" strokeDasharray={c.dash} />
        <text x={lx} y={ly} textAnchor="middle" fontSize={fontSize}
          fill={c.text} fontFamily="sans-serif" pointerEvents="none">{label}</text>
      </g>
    );
  }

  return (
    <svg viewBox="0 0 200 215" className="w-full max-w-[260px] mx-auto block">
      {/* verbindingslijnen */}
      <line x1="100" y1="29" x2="100" y2="35" stroke="#d1cec9" strokeWidth="1.2" />
      <line x1="100" y1="65" x2="100" y2="71" stroke="#d1cec9" strokeWidth="1.2" />
      <line x1="100" y1="93" x2="100" y2="99" stroke="#d1cec9" strokeWidth="1.2" />
      <line x1="118" y1="117" x2="125" y2="113" stroke="#d1cec9" strokeWidth="1.2" />
      <line x1="100" y1="135" x2="100" y2="139" stroke="#d1cec9" strokeWidth="1.2" />
      <line x1="82"  y1="150" x2="74"  y2="150" stroke="#d1cec9" strokeWidth="1.2" />
      <line x1="118" y1="150" x2="126" y2="150" stroke="#d1cec9" strokeWidth="1.2" />
      <line x1="100" y1="161" x2="100" y2="165" stroke="#d1cec9" strokeWidth="1.2" />

      <Poly  cKey="hoofd"      points="100,5 82,29 118,29"       lx={100} ly={22}  label="Hoofd" />
      <Poly  cKey="ajna"       points="82,35 118,35 100,65"      lx={100} ly={55}  label="Ajna" />
      <Rect  cKey="keel"       x={82}  y={71}  w={36} h={22}    lx={100} ly={86}  label="Keel" />
      <Poly  cKey="identiteit" points="100,99 80,117 100,135 120,117" lx={100} ly={121} label="G" />
      <Poly  cKey="hart"       points="126,103 141,113 122,127"  lx={132} ly={116} label="Hart" fontSize={6} />
      <Poly  cKey="milt"       points="52,141 74,151 52,161"     lx={61}  ly={153} label="Milt" fontSize={6} />
      <Poly  cKey="emotie"     points="148,141 126,151 148,161"  lx={140} ly={153} label="Emotie" fontSize={5.5} />
      <Rect  cKey="sacraal"    x={82}  y={139} w={36} h={22}    lx={100} ly={154} label="Sacraal" />
      <Rect  cKey="wortel"     x={82}  y={165} w={36} h={22}    lx={100} ly={180} label="Wortel" />
    </svg>
  );
}



type SectieConfig = { key: keyof import('@/lib/hdAffirmatiesData').CentrumAffirmaties; label: string; kleur: string };

const SECTIES_PER_STAAT: Record<string, SectieConfig[]> = {
  gedefinieerd: [
    { key: 'gedefinieerd',       label: 'Gedefinieerd · omarmen wat van jou is',        kleur: 'bg-darkGreen text-white' },
    { key: 'gedefinieerd_groei', label: 'Gedefinieerd · groei',                          kleur: 'bg-orange text-white' },
    { key: 'gedefinieerd_gave',  label: 'Gedefinieerd · gave',                           kleur: 'bg-midGreen text-white' },
  ],
  ongedefinieerd: [
    { key: 'ongedefinieerd',       label: 'Ongedefinieerd · loslaten wat niet van jou is', kleur: 'bg-white border border-darkGreen text-darkGreen' },
    { key: 'ongedefinieerd_groei', label: 'Ongedefinieerd · groei',                        kleur: 'bg-orange text-white' },
    { key: 'ongedefinieerd_gave',  label: 'Ongedefinieerd · gave',                         kleur: 'bg-midGreen text-white' },
  ],
  compleet_open: [
    { key: 'compleetOpen',       label: 'Compleet open · diepste loslaten (drie lagen)',  kleur: 'bg-cream border border-dashed border-gray-400 text-darkSlate' },
    { key: 'compleetOpen_groei', label: 'Compleet open · groei',                          kleur: 'bg-orange text-white' },
    { key: 'compleetOpen_gave',  label: 'Compleet open · gave',                           kleur: 'bg-midGreen text-white' },
  ],
};

// ── Hoofdcomponent ────────────────────────────────────────────────────────────

const initForm = { type: '', profielBewust: '', profielOnbewust: '', centra: {} as CentraState };

export default function HumanDesignAffirmaties() {
  const [form, setForm]                   = useState(initForm);
  const [generatedForm, setGeneratedForm] = useState<typeof initForm | null>(null);
  const [gesloten, setGesloten]           = useState<Set<string>>(new Set());
  const [fout, setFout]                   = useState('');
  const [pdfLoading, setPdfLoading]       = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  function toggleAccordion(key: string) {
    setGesloten(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  const resultaatKeys = useMemo((): string[] => {
    if (!generatedForm) return [];
    const keys: string[] = CENTRA.filter(c => generatedForm.centra[c.key]).map(c => c.key);
    if (HD_PATRONEN.some(p => p.match(generatedForm.centra))) keys.push('__patronen__');
    return keys;
  }, [generatedForm]);

  function toggleAllesResultaat() {
    const alleGesloten = resultaatKeys.every(k => gesloten.has(k));
    if (alleGesloten) {
      setGesloten(new Set());
    } else {
      setGesloten(new Set(resultaatKeys));
    }
  }

  function setCentrum(key: string, staat: Staat) {
    setForm(f => ({ ...f, centra: { ...f.centra, [key]: staat } }));
  }

  function toggleCentrum(key: string) {
    setForm(f => {
      const nieuw = volgende(f.centra[key]);
      const centra = { ...f.centra };
      if (nieuw === undefined) delete centra[key]; else centra[key] = nieuw;
      return { ...f, centra };
    });
  }

  function setBewust(val: string) {
    setForm(f => ({ ...f, profielBewust: val, profielOnbewust: '' }));
  }

  const onbewustOpties = form.profielBewust ? PROFIEL_ONBEWUST[form.profielBewust] ?? [] : [];
  const alleCentraIngevuld = CENTRA.every(c => form.centra[c.key]);
  const alleFilled = !!(form.type && form.profielBewust && form.profielOnbewust && alleCentraIngevuld);

  const geselecteerdType = TYPES.find(t => t.naam === form.type);

  function genereer() {
    setFout('');
    setGeneratedForm(form);
    setGesloten(new Set());
  }

  async function downloadPdf() {
    if (!resultRef.current) return;
    setPdfLoading(true);
    try { await exporteerAlsPdf(resultRef.current.innerHTML, 'Human Design Affirmaties'); }
    catch { setFout('PDF exporteren mislukt. Probeer het opnieuw.'); }
    finally { setPdfLoading(false); }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="m-0 text-xs font-semibold tracking-widest text-darkGreen uppercase">Human Design · BinnensteBuiten Spel</p>
        <h1 className="font-salmon text-3xl text-darkSlate mt-1 mb-1">Human Design Affirmaties</h1>
        <p className="text-sm text-midGreen italic m-0">Laat los wat niet van jou is</p>
      </div>

      {/* Type */}
      <div className="bg-white border border-lightBg rounded-xl p-4 mb-4">
        <p className="text-xs font-bold text-darkGreen uppercase tracking-widest mb-3">Jouw Type</p>
        <div className="flex flex-wrap gap-2">
          {TYPES.map(t => (
            <button key={t.naam} onClick={() => setForm(f => ({ ...f, type: t.naam }))}
              className={`px-4 py-2 rounded-full text-sm border transition-colors cursor-pointer ${
                form.type === t.naam
                  ? 'bg-darkGreen border-darkGreen text-white font-bold'
                  : 'bg-white border-lightBg text-darkSlate hover:border-darkGreen/40'
              }`}>
              {t.naam}
            </button>
          ))}
        </div>
        {geselecteerdType && (
          <p className="mt-3 text-xs text-darkSlate/70 leading-relaxed">{geselecteerdType.toelichting}</p>
        )}
      </div>

      {/* Profiel — twee dropdowns */}
      <div className="bg-cream border border-lightBg rounded-xl p-4 mb-4">
        <p className="text-xs font-bold text-darkGreen uppercase tracking-widest mb-3">Profiel</p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-darkSlate/60 mb-1">Bewust</p>
            <select value={form.profielBewust} onChange={e => setBewust(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-lightBg bg-white text-darkSlate focus:outline-none focus:border-darkGreen">
              <option value="">—</option>
              {(['1 – Onderzoeker','2 – Kluizenaar','3 – Experimenteerder','4 – Netwerker','5 – Probleemoplosser','6 – Rolmodel'] as const).map((l, i) => <option key={l} value={String(i + 1)}>{l}</option>)}
            </select>
          </div>
          <span className="text-xl font-bold text-darkSlate/40 mt-5">/</span>
          <div className="flex-1">
            <p className="text-xs text-darkSlate/60 mb-1">Onbewust</p>
            <select value={form.profielOnbewust}
              onChange={e => setForm(f => ({ ...f, profielOnbewust: e.target.value }))}
              disabled={!form.profielBewust}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-lightBg bg-white text-darkSlate focus:outline-none focus:border-darkGreen disabled:opacity-40 disabled:cursor-not-allowed">
              <option value="">—</option>
              {onbewustOpties.map(l => {
                const namen: Record<string, string> = { '1': 'Onderzoeker', '2': 'Kluizenaar', '3': 'Experimenteerder', '4': 'Netwerker', '5': 'Probleemoplosser', '6': 'Rolmodel' };
                return <option key={l} value={l}>{l} – {namen[l]}</option>;
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Energiecentra */}
      <div className="bg-white border border-lightBg rounded-xl p-4 mb-6">
        <p className="text-xs font-bold text-darkGreen uppercase tracking-widest mb-3">Energiecentra</p>

        {/* Legenda */}
        <div className="bg-cream rounded-lg p-3 mb-5 flex flex-col gap-1.5 text-xs text-darkSlate/70">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm border-2 border-dashed border-gray-400 bg-white shrink-0" />
            <span><strong className="text-darkSlate">Compleet open</strong> — wit, geen enkele poort is geactiveerd</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm border-2 border-darkGreen bg-white shrink-0" />
            <span><strong className="text-darkSlate">Ongedefinieerd</strong> — wit, maar met actieve (gekleurde) poorten</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-sm bg-darkGreen shrink-0" />
            <span><strong className="text-darkSlate">Gedefinieerd</strong> — ingekleurd via een kanaal van/naar dit centrum</span>
          </div>
        </div>

        {/* Bodygraph diagram */}
        <div className="mb-5">
          <p className="text-xs text-darkSlate/50 text-center mb-2">Klik op een centrum om de staat in te stellen</p>
          <BodygraphSVG centra={form.centra} onKlik={toggleCentrum} />
        </div>

        {/* Knoppenrij per centrum */}
        <div className="flex flex-col gap-4">
          {CENTRA.map(c => (
            <div key={c.key}>
              <p className="text-sm font-semibold text-darkSlate mb-0.5">{c.label}</p>
              <p className="text-xs text-darkSlate/55 mb-2">{c.toelichting}</p>
              <div className="flex flex-wrap gap-2">
                {STAAT_OPTIES.map(opt => {
                  const sel = form.centra[c.key] === opt.id;
                  return (
                    <button key={opt.id} onClick={() => setCentrum(c.key, opt.id)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors cursor-pointer ${
                        sel
                          ? 'bg-darkGreen border-darkGreen text-white font-bold'
                          : 'bg-white border-lightBg text-darkSlate hover:border-darkGreen/40'
                      }`}>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button disabled={!alleFilled} onClick={genereer}
        className={`w-full py-3.5 text-sm font-bold rounded-xl border-none text-white tracking-wide transition-colors ${
          alleFilled ? 'bg-darkGreen cursor-pointer hover:bg-darkGreen/90' : 'bg-[#ccc] cursor-not-allowed'
        }`}>
        Genereer mijn affirmatierapport
      </button>

      {!alleFilled && (
        <p className="text-xs text-darkSlate/60 text-center mt-2">
          Vul type, profiel en alle energiecentra in om je rapport te genereren.
        </p>
      )}

      {fout && (
        <div className="mt-6 bg-[#fff0ee] border border-darkRed rounded-xl p-4">
          <p className="m-0 text-sm text-darkRed">{fout}</p>
        </div>
      )}

      {generatedForm && (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 40 50" className="w-6 h-6 shrink-0 text-darkGreen" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                <polygon points="20,1 13,11 27,11" /><polygon points="20,12 13,22 27,22" />
                <rect x="14" y="23" width="12" height="6" /><polygon points="20,30 13,37 20,44 27,37" />
                <rect x="12" y="45" width="16" height="5" />
              </svg>
              <h3 className="m-0 text-base font-bold text-darkGreen">Jouw Human Design Affirmaties</h3>
            </div>
            <button onClick={downloadPdf} disabled={pdfLoading}
              className="shrink-0 px-3 py-1.5 rounded-full border border-darkGreen text-darkGreen text-xs cursor-pointer hover:bg-darkGreen hover:text-white transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-darkGreen focus:ring-offset-2">
              {pdfLoading ? 'Bezig...' : 'Download PDF'}
            </button>
          </div>
          <div className="flex justify-end mb-4">
            <button onClick={toggleAllesResultaat}
              className="text-xs font-bold uppercase tracking-widest text-darkGreen border border-darkGreen rounded-lg px-3 py-1.5 bg-white hover:bg-darkGreen hover:text-white transition-colors">
              {resultaatKeys.every(k => gesloten.has(k)) ? 'Alles uitklappen' : 'Alles inklappen'}
            </button>
          </div>

          <div ref={resultRef} className="flex flex-col gap-4">
            {/* Vaste typetekst */}
            {(() => {
              const typeTekst = HD_TYPE_TEKSTEN.find(t => t.type === generatedForm.type)?.tekst;
              if (!typeTekst) return null;
              return (
                <div className="bg-white border border-lightBg rounded-2xl p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-darkGreen mb-2">{generatedForm.type}</p>
                  <p className="text-sm text-darkSlate leading-[1.85] m-0">{typeTekst}</p>
                </div>
              );
            })()}

            {/* Vaste profieltekst */}
            {(() => {
              const profiel = `${generatedForm.profielBewust}/${generatedForm.profielOnbewust}`;
              const profielTekst = HD_PROFIEL_TEKSTEN.find(p => p.profiel === profiel)?.tekst;
              if (!profielTekst) return null;
              return (
                <div className="bg-white border border-lightBg rounded-2xl p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-darkGreen mb-2">Profiel {profiel}</p>
                  <p className="text-sm text-darkSlate leading-[1.85] m-0">{profielTekst}</p>
                </div>
              );
            })()}

            {/* Accordeon per centrum */}
            {generatedForm && CENTRA.map(c => {
              const staat = generatedForm.centra[c.key];
              if (!staat) return null;
              const secties = SECTIES_PER_STAAT[staat];
              if (!secties) return null;
              const data = HD_AFFIRMATIES_MAP.get(c.key);
              if (!data) return null;
              const isOpen = !gesloten.has(c.key);

              return (
                <div key={c.key} className="border border-lightBg rounded-2xl overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(c.key)}
                    className="w-full bg-darkGreen px-4 py-3 flex justify-between items-start text-left cursor-pointer"
                  >
                    <div>
                      <p className="font-salmon text-base text-white m-0">{c.label}</p>
                      <p className="text-white/70 text-xs mt-0.5 m-0">{c.toelichting}</p>
                    </div>
                    <span className={`text-white/70 text-sm mt-1 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
                    <div className="p-4 flex flex-col gap-4">
                      {secties.map(({ key, label, kleur }) => (
                        <div key={key}>
                          <span className={`inline-block text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2 ${kleur}`}>
                            {label}
                          </span>
                          <ul className="flex flex-col gap-1.5 pl-0 list-none m-0">
                            {(data[key] as string[]).map((a, i) => (
                              <li key={i} className="flex gap-2 text-sm text-darkSlate leading-relaxed">
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

            {/* Tegenstellingen & spanningsvelden */}
            {generatedForm && (() => {
              const patronen = HD_PATRONEN.filter(p => p.match(generatedForm.centra));
              if (!patronen.length) return null;
              const isOpen = !gesloten.has('__patronen__');
              return (
                <div className="border border-lightBg rounded-2xl overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('__patronen__')}
                    className="w-full bg-orange px-4 py-3 flex justify-between items-start text-left cursor-pointer"
                  >
                    <div>
                      <p className="font-salmon text-base text-white m-0">Tegenstellingen & spanningsvelden</p>
                      <p className="text-white/70 text-xs mt-0.5 m-0">Patronen die opvallen, centra die tegenstellingen vormen in jouw energie</p>
                    </div>
                    <span className={`text-white/70 text-sm mt-1 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[3000px]' : 'max-h-0'}`}>
                    <div className="p-4 flex flex-col gap-3">
                      {patronen.map(({ titel, tekst }) => (
                        <div key={titel} className="bg-cream border border-lightBg rounded-2xl p-4">
                          <p className="text-sm font-bold text-darkGreen mb-1">{titel}</p>
                          <p className="text-sm text-darkSlate leading-relaxed m-0">{tekst}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <button onClick={() => { setGeneratedForm(null); }}
            className="mt-4 px-4 py-2 rounded-full border border-lightBg bg-white text-darkSlate text-xs cursor-pointer hover:border-darkSlate/40 transition-colors">
            Opnieuw genereren
          </button>
        </div>
      )}
    </div>
  );
}
