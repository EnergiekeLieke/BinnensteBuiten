'use client';

import { useState, useRef } from 'react';
import { streamAnalyse, exporteerAlsPdf } from '@/lib/huisstijl';
import { HD_AFFIRMATIES } from '@/lib/hdAffirmatiesData';

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
      <line x1="82"  y1="117" x2="78" y2="117" stroke="#d1cec9" strokeWidth="1.2" />
      <line x1="118" y1="117" x2="122" y2="117" stroke="#d1cec9" strokeWidth="1.2" />
      <line x1="100" y1="135" x2="100" y2="139" stroke="#d1cec9" strokeWidth="1.2" />
      <line x1="100" y1="161" x2="100" y2="165" stroke="#d1cec9" strokeWidth="1.2" />
      <line x1="120" y1="117" x2="124" y2="125" stroke="#d1cec9" strokeWidth="1.2" />

      <Rect  cKey="hoofd"      x={82}  y={5}   w={36} h={24} lx={100} ly={21}  label="Hoofd" />
      <Poly  cKey="ajna"       points="82,35 118,35 100,65"    lx={100} ly={55}  label="Ajna" />
      <Rect  cKey="keel"       x={82}  y={71}  w={36} h={22}  lx={100} ly={86}  label="Keel" />
      <Poly  cKey="identiteit" points="100,99 80,117 100,135 120,117" lx={100} ly={121} label="G" />
      <Poly  cKey="hart"       points="122,99 148,117 122,135" lx={136} ly={122} label="Hart" fontSize={6} />
      <Poly  cKey="milt"       points="78,99 52,117 78,135"    lx={64}  ly={122} label="Milt" fontSize={6} />
      <Poly  cKey="emotie"     points="122,122 150,144 122,166" lx={137} ly={149} label="Emotie" fontSize={5.5} />
      <Rect  cKey="sacraal"    x={82}  y={139} w={36} h={22}  lx={100} ly={154} label="Sacraal" />
      <Rect  cKey="wortel"     x={82}  y={165} w={36} h={22}  lx={100} ly={180} label="Wortel" />
    </svg>
  );
}


// ── Prompt ────────────────────────────────────────────────────────────────────

function bouwPrompt(form: {
  type: string; profielBewust: string; profielOnbewust: string; centra: CentraState;
}): string {
  const profiel = `${form.profielBewust}/${form.profielOnbewust}`;
  const open         = CENTRA.filter(c => form.centra[c.key] === 'ongedefinieerd');
  const compleetOpen = CENTRA.filter(c => form.centra[c.key] === 'compleet_open');
  const gedefinieerd = CENTRA.filter(c => form.centra[c.key] === 'gedefinieerd');

  const emotieOpen  = ['ongedefinieerd', 'compleet_open'].includes(form.centra['emotie']  ?? '');
  const sacraалOpen = ['ongedefinieerd', 'compleet_open'].includes(form.centra['sacraal'] ?? '');
  const sacraalAutoriteit = emotieOpen && form.centra['sacraal'] === 'gedefinieerd';
  const miltAutoriteit    = emotieOpen && sacraалOpen && form.centra['milt'] === 'gedefinieerd';

  function affirmaties(key: string, staat: 'ongedefinieerd' | 'compleetOpen' | 'gedefinieerd') {
    const data = HD_AFFIRMATIES.find(c => c.key === key);
    if (!staat || !data) return '';
    const lijst = data[staat];
    return lijst.map(a => `     - "${a}"`).join('\n');
  }

  const openBlok = open.length ? `
ONGEDEFINIEERDE CENTRA — neem onderstaande affirmaties letterlijk over in het rapport. Voeg per centrum een korte inleidende zin toe in dezelfde warme toon, maar verander de affirmaties zelf niet.
${open.map(c => `  ${c.label}:\n${affirmaties(c.key, 'ongedefinieerd')}`).join('\n\n')}` : '';

  const coBlok = compleetOpen.length ? `
COMPLEET OPEN CENTRA — neem onderstaande affirmaties letterlijk over in het rapport. Voeg per centrum een korte inleidende zin toe. Adresseer alle drie conditioneringslagen (loslaten, identificatie herkennen, projectie herkennen).
${compleetOpen.map(c => `  ${c.label}:\n${affirmaties(c.key, 'compleetOpen')}`).join('\n\n')}` : '';

  const autoriteitInstr = sacraalAutoriteit ? `
  Let op: sacraalautoriteit. Het emotiecentrum is open/ongedefinieerd en het sacraal is gedefinieerd. Benoem bij het Sacraalcentrum dat deze persoon direct en lichamelijk weet — in het moment, via gesloten vragen (ja/nee).` : miltAutoriteit ? `
  Let op: miltautoriteit. Het emotiecentrum en sacraal zijn open/ongedefinieerd, de Milt is gedefinieerd. Benoem bij het Miltcentrum dat deze persoon het weet via intuïtie, zacht en eenmalig — in het moment.` : '';

  const defBlok = gedefinieerd.length ? `
GEDEFINIEERDE CENTRA — neem onderstaande affirmaties letterlijk over in het rapport. Voeg per centrum een korte inleidende zin toe. Kernboodschap: dit is jouw consistente energie — omarm het.${autoriteitInstr}
${gedefinieerd.map(c => `  ${c.label}:\n${affirmaties(c.key, 'gedefinieerd')}`).join('\n\n')}` : '';

  return `Je bent een expert in Human Design en het schrijven van krachtige, persoonlijke affirmaties.
Schrijf een gepersonaliseerd affirmatierapport in het Nederlands.

TYPE: ${form.type}
PROFIEL: ${profiel}

RAPPORT IN DEZE VOLGORDE:

1. INTRODUCTIE (2-3 zinnen): Warm en herkenbaar voor dit Type. Hoe ervaart dit Type de wereld en wat is hun kracht? Schrijf niet "jij bent een Generator" maar "jij hebt het type Generator" — het is een gebruiksaanwijzing, geen identiteit.

2. PROFIEL ${profiel} (2-3 zinnen): Inzicht in de levensstrategie en het levensthema van dit profiel.

3. AFFIRMATIES PER CENTRUM — gebruik uitsluitend de onderstaande affirmaties. Neem ze letterlijk over als lijst. Geen uitleg per centrum, geen toelichting over wat het centrum betekent — alleen de naam van het centrum als kopje en daarna de affirmaties als losse regels.
${openBlok}${coBlok}${defBlok}

SCHRIJFINSTRUCTIES:
- Nederlands, spreek de lezer aan als "jij" of "je"
- Warm, direct en krachtig maar zacht
- De introductie en het profielstuk zijn doorlopende tekst (2-3 zinnen elk)
- De affirmaties per centrum zijn een eenvoudige lijst: centrumnaam op een regel, daarna elke affirmatie op een nieuwe regel beginnend met "- "
- Geen uitleg, geen ##-markeringen of asterisken
- Geen zinnen beginnen met "En"
- Geen streepjes in lopende tekst`;
}

// ── Hoofdcomponent ────────────────────────────────────────────────────────────

const initForm = { type: '', profielBewust: '', profielOnbewust: '', centra: {} as CentraState };

export default function HumanDesignAffirmaties() {
  const [form, setForm]             = useState(initForm);
  const [resultaat, setResultaat]   = useState('');
  const [loading, setLoading]       = useState(false);
  const [fout, setFout]             = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

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

  async function genereer() {
    setLoading(true); setFout(''); setResultaat('');
    try {
      await streamAnalyse(
        bouwPrompt(form),
        4000,
        chunk => setResultaat(prev => prev + chunk),
        'Je bent een expert in Human Design en het schrijven van krachtige, persoonlijke affirmaties. ' +
        'Je schrijft in het Nederlands, persoonlijk en bemoedigend, en spreekt de gebruiker aan als "jij" of "je". ' +
        'Gebruik geen namen. Schrijf warm, direct en krachtig maar zacht. ' +
        'Gebruik geen ##-koppen, geen asterisken en geen markdown-opmaak. Schrijf doorlopende alinea\'s.',
      );
    } catch (e: unknown) {
      setFout(e instanceof Error ? e.message : 'Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
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

      <button disabled={!alleFilled || loading} onClick={genereer}
        className={`w-full py-3.5 text-sm font-bold rounded-xl border-none text-white tracking-wide transition-colors ${
          alleFilled && !loading ? 'bg-darkGreen cursor-pointer hover:bg-darkGreen/90' : 'bg-[#ccc] cursor-not-allowed'
        }`}>
        {loading ? 'Affirmaties worden gegenereerd...' : 'Genereer mijn affirmatierapport'}
      </button>

      {!alleFilled && !loading && (
        <p className="text-xs text-darkSlate/60 text-center mt-2">
          Vul type, profiel en alle energiecentra in om je rapport te genereren.
        </p>
      )}

      {fout && (
        <div className="mt-6 bg-[#fff0ee] border border-darkRed rounded-xl p-4">
          <p className="m-0 text-sm text-darkRed">{fout}</p>
        </div>
      )}

      {resultaat && (
        <div className="mt-8 bg-white border border-lightBg rounded-2xl p-6">
          <div className="flex items-center justify-between gap-2 mb-5 pb-4 border-b border-lightBg">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 40 50" className="w-6 h-6 shrink-0 text-darkGreen" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                <polygon points="20,1 13,11 27,11" /><polygon points="20,12 13,22 27,22" />
                <rect x="14" y="23" width="12" height="6" /><polygon points="20,30 13,37 20,44 27,37" />
                <rect x="12" y="45" width="16" height="5" />
              </svg>
              <h3 className="m-0 text-base font-bold text-darkGreen">Jouw Human Design Affirmaties</h3>
            </div>
            <button onClick={downloadPdf} disabled={pdfLoading || loading}
              className="shrink-0 px-3 py-1.5 rounded-full border border-darkGreen text-darkGreen text-xs cursor-pointer hover:bg-darkGreen hover:text-white transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-darkGreen focus:ring-offset-2">
              {pdfLoading ? 'Bezig...' : 'Download PDF'}
            </button>
          </div>
          <div ref={resultRef}>
            {resultaat.split('\n\n').filter(Boolean).map((blok, i) => {
              const regels = blok.split('\n').filter(Boolean);
              const isLijst = regels.some(r => r.startsWith('- '));
              if (isLijst) {
                const kopje = regels.find(r => !r.startsWith('- '));
                const items = regels.filter(r => r.startsWith('- '));
                return (
                  <div key={i} className="mb-5 last:mb-0">
                    {kopje && <p className="text-xs font-bold uppercase tracking-widest text-darkGreen mb-2">{kopje}</p>}
                    <ul className="flex flex-col gap-1.5 pl-0 list-none m-0">
                      {items.map((item, j) => (
                        <li key={j} className="flex gap-2 text-sm text-darkSlate leading-relaxed">
                          <span className="text-darkGreen shrink-0 mt-0.5">·</span>
                          <span>{item.replace(/^- /, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return <p key={i} className="text-sm text-darkSlate leading-[1.85] mb-4 last:mb-0">{blok}</p>;
            })}
          </div>
          <button onClick={() => setResultaat('')}
            className="mt-4 px-4 py-2 rounded-full border border-lightBg bg-white text-darkSlate text-xs cursor-pointer hover:border-darkSlate/40 transition-colors">
            Opnieuw genereren
          </button>
        </div>
      )}
    </div>
  );
}
