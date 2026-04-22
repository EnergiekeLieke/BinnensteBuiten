'use client';

import { useState } from 'react';

const C = {
  darkRed: '#9e3816', darkGreen: '#3b5633', midGreen: '#758d69',
  lightBg: '#f4c293', lightBg2: '#fde8d0', cream: '#fcebdc',
  darkSlate: '#2a3a3c', orange: '#d56119',
  blauw: '#1a4a7a',
};

const aspecten = [
  { id: 'emotioneel', label: 'Emotionele verbinding', omschr: 'Veiligheid, openheid, gezien worden' },
  { id: 'recreatief', label: 'Recreatieve verbinding', omschr: 'Samen plezier, spelen en ontspannen' },
  { id: 'economisch', label: 'Economische verbinding', omschr: 'Financiën, doelen en verantwoordelijkheid' },
  { id: 'familiair', label: 'Familiaire verbinding', omschr: 'Gezin, ouderschap, familie en thuis' },
  { id: 'spiritueel', label: 'Spirituele verbinding', omschr: 'Zingeving, waarden en levensmissie' },
  { id: 'fysiek', label: 'Fysieke verbinding', omschr: 'Aanraking, nabijheid en lichaamstaal' },
  { id: 'intellectueel', label: 'Intellectuele verbinding', omschr: 'Gesprekken, nieuwsgierigheid en groei' },
  { id: 'passioneel', label: 'Passionele verbinding', omschr: 'Verlangen, romantiek en intimiteit' },
  { id: 'cultureel', label: 'Culturele verbinding', omschr: 'Tradities, achtergrond en wereldbeeld' },
  { id: 'esthetisch', label: 'Esthetische verbinding', omschr: 'Smaak, schoonheid en gedeelde beleving' },
];

type Score = { belang: number; vervullingBewust: number; vervullingOnbewust: number };
type Sterkte = { aspect: string; inzicht: string };
type Aandacht = { aspect: string; type: string; inzicht: string };
type Groei = { aspect: string; tip: string };
type Reflectie = { vraag1: string; vraag2: string; vraag3: string };
type Analyse = {
  error?: string;
  samenvatting?: string;
  sterktes?: Sterkte[];
  aandacht?: Aandacht[];
  groei?: Groei[];
  reflectie?: Reflectie;
  afsluiting?: string;
};

const initScores = (): Score[] => aspecten.map(() => ({ belang: 5, vervullingBewust: 5, vervullingOnbewust: 5 }));

function Spider({ scoresA, scoresB, fase }: { scoresA: Score[]; scoresB: Score[]; fase: string }) {
  const n = aspecten.length;
  const size = 420, cx = 210, cy = 210, r = 110;
  const angles = aspecten.map((_, i) => (2 * Math.PI * i) / n - Math.PI / 2);
  const pt = (val: number, i: number) => { const rr = (val / 10) * r; return [cx + rr * Math.cos(angles[i]), cy + rr * Math.sin(angles[i])]; };
  const poly = (scores: Score[], key: keyof Score) => scores.map((s, i) => pt(s[key], i).join(',')).join(' ');
  const avgPoly = () => aspecten.map((_, i) => {
    const avg = ((scoresA[i].vervullingBewust + scoresA[i].vervullingOnbewust + scoresB[i].vervullingBewust + scoresB[i].vervullingOnbewust) / 4);
    return pt(avg, i).join(',');
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', maxWidth: 420 }}>
      {[2, 4, 6, 8, 10].map(v => (
        <polygon key={v} points={aspecten.map((_, i) => pt(v, i).join(',')).join(' ')} fill="none" stroke="rgba(59,86,51,0.15)" strokeWidth="0.8" />
      ))}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="rgba(59,86,51,0.15)" strokeWidth="0.8" />
      ))}
      {fase === 'analyse' && (
        <polygon points={avgPoly()} fill="rgba(213,97,25,0.15)" stroke={C.orange} strokeWidth="2" strokeDasharray="5,3" strokeLinejoin="round" />
      )}
      {/* Partner A: doorgetrokken — rood=bewust, groen=onbewust */}
      <polygon points={poly(scoresA, 'vervullingOnbewust')} fill={C.darkGreen} fillOpacity="0.08" stroke={C.darkGreen} strokeWidth="2" strokeLinejoin="round" />
      <polygon points={poly(scoresA, 'vervullingBewust')} fill={C.darkRed} fillOpacity="0.1" stroke={C.darkRed} strokeWidth="2" strokeLinejoin="round" />
      {fase !== 'A' && (
        <>
          {/* Partner B: gestippeld — rood=bewust, groen=onbewust */}
          <polygon points={poly(scoresB, 'vervullingOnbewust')} fill="none" stroke={C.darkGreen} strokeWidth="2" strokeLinejoin="round" strokeDasharray="5,4" />
          <polygon points={poly(scoresB, 'vervullingBewust')} fill="none" stroke={C.darkRed} strokeWidth="2" strokeLinejoin="round" strokeDasharray="5,4" />
        </>
      )}
      {angles.map((a, i) => {
        const lx = cx + (r + 40) * Math.cos(a);
        const ly = cy + (r + 40) * Math.sin(a);
        const hoofdwoord = aspecten[i].label.replace(' verbinding', '');
        return (
          <g key={i}>
            <text x={lx} y={ly - 6} textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="sans-serif" fill="white" stroke="white" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke">
              <tspan x={lx} dy="0">{hoofdwoord}</tspan>
              <tspan x={lx} dy="13">verbinding</tspan>
            </text>
            <text x={lx} y={ly - 6} textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="sans-serif" fill={C.darkSlate}>
              <tspan x={lx} dy="0">{hoofdwoord}</tspan>
              <tspan x={lx} dy="13">verbinding</tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ScoreBlok({ scores, onUpdate, showGap }: { scores: Score; onUpdate: (key: keyof Score, val: number) => void; showGap: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {([
        ['belang', 'Belang', C.blauw],
        ['vervullingBewust', 'Vervulling bewust', C.darkRed],
        ['vervullingOnbewust', 'Vervulling onbewust', C.darkGreen],
      ] as [keyof Score, string, string][]).map(([key, label, kleur]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: kleur, width: 110, flexShrink: 0 }}>{label}</span>
          <input type="range" min="0" max="10" step="1" value={scores[key]}
            onChange={e => onUpdate(key, Number(e.target.value))}
            className="vw-slider"
            style={{ flex: 1, '--slider-color': sliderColors[key], '--slider-pct': `${scores[key] * 10}%` } as React.CSSProperties} />
          <span style={{ fontSize: 13, fontWeight: 700, minWidth: 20, color: kleur }}>{scores[key]}</span>
        </div>
      ))}
      {showGap && scores.belang >= 4 && (() => {
        const gapB = scores.belang - scores.vervullingBewust;
        const gapO = scores.belang - scores.vervullingOnbewust;
        const dieper = gapO - gapB >= 3;

        const icon = (gap: number) => gap >= 4 ? '⚠' : gap >= 2 ? '○' : gap <= -2 ? '✓' : null;
        const kleur = (gap: number) => gap >= 4 ? C.darkRed : gap >= 2 ? C.orange : C.darkGreen;
        const label = (gap: number, type: 'bewust' | 'onbewust') => {
          const prefix = type === 'bewust' ? 'Bewust' : 'Onbewust';
          if (gap <= -2) {
            if (type === 'bewust' && gapO > -2) return `✓ ${prefix} meer dan vervuld — het hoofd zegt 'prima', kijk ook wat de biotensor zegt`;
            return `✓ ${prefix} meer dan vervuld — hier zit ruimte en overvloed`;
          }
          if (gap >= 4) return `⚠ ${prefix} gat: ${gap}`;
          return `○ ${prefix} gat: ${gap}`;
        };

        const iB = icon(gapB), iO = icon(gapO);
        if (!iB && !iO) return null;

        const beidenOvervuld = gapB <= -2 && gapO <= -2;
        const onbewustBeter = gapO <= -2 && gapB > -2;

        return (
          <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: '6px 14px', alignItems: 'center' }}>
            {beidenOvervuld
              ? <span style={{ fontSize: 11, fontWeight: 600, color: C.darkGreen }}>✓ Meer dan vervuld — hier zit ruimte en overvloed</span>
              : onbewustBeter
              ? <>
                  {iB && <span style={{ fontSize: 11, fontWeight: 600, color: kleur(gapB) }}>{label(gapB, 'bewust')}</span>}
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.darkGreen }}>✓ Onbewust meer dan vervuld — het gaat beter dan je denkt, focus je aandacht eens bewust op wat er al wél is!</span>
                </>
              : <>
                  {iB && <span style={{ fontSize: 11, fontWeight: 600, color: kleur(gapB) }}>{label(gapB, 'bewust')}</span>}
                  {iO && <span style={{ fontSize: 11, fontWeight: 600, color: kleur(gapO) }}>{label(gapO, 'onbewust')}</span>}
                </>
            }
            {dieper && <span style={{ fontSize: 11, color: C.darkSlate, fontStyle: 'italic', opacity: 0.75 }}>speelt dieper dan je denkt</span>}
          </div>
        );
      })()}
    </div>
  );
}

function Legenda() {
  return (
    <div style={{ background: C.lightBg2, borderRadius: 10, padding: '12px 14px', marginBottom: '1.25rem', fontSize: 12 }}>
      <p style={{ margin: '0 0 8px', fontWeight: 700, color: C.darkGreen, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Hoe werken de sliders?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {([
          [C.blauw, 'Belang', 'Hoe belangrijk is dit aspect voor jou in een relatie?', '0 = helemaal niet belangrijk · 10 = essentieel voor mij'],
          [C.darkRed, 'Vervulling bewust', 'In hoeverre voel je je op dit moment op dit gebied verbonden?', '0 = helemaal niet aanwezig · 10 = volledig vervuld'],
          [C.darkGreen, 'Vervulling onbewust', 'Meet met de biotensor: wat zegt je onderbewustzijn over hoe vervuld dit aspect werkelijk is?', '0 = helemaal niet aanwezig · 10 = volledig vervuld'],
        ] as [string, string, string, string][]).map(([kleur, titel, omschr, sub]) => (
          <div key={titel} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: kleur, flexShrink: 0, marginTop: 2 }}></span>
            <span style={{ color: C.darkSlate }}><strong style={{ color: kleur }}>{titel}</strong> — {omschr}<br /><span style={{ opacity: 0.75 }}>{sub}</span></span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid ' + C.lightBg, paddingTop: 8, marginTop: 2, color: C.darkSlate, opacity: 0.8 }}>
          Het verschil tussen <strong>belang</strong> en <strong>vervulling</strong> is het <em>verlangengat</em> — hoe groter het gat, hoe meer dit aspect aandacht vraagt.
        </div>
      </div>
    </div>
  );
}

const typeKleur: Record<string, { bg: string; border: string; text: string; label: string }> = {
  groot_verlangengat: { bg: '#fdf0e8', border: C.darkRed, text: '#6b2410', label: 'Groot verlangengat' },
  belangverschil: { bg: '#fef9e8', border: C.orange, text: '#7a3609', label: 'Verschil in belang' },
  onbewust_lager: { bg: '#edf4e9', border: C.darkGreen, text: '#2a3d22', label: 'Onbewust lager' },
  beiden_laag: { bg: '#f0eef8', border: '#7a5c99', text: '#4a2d6b', label: 'Beiden laag' },
};

const sliderColors: Record<string, string> = {
  belang: '#1a4a7a',
  vervullingBewust: '#9e3816',
  vervullingOnbewust: '#3b5633',
};

const sliderStyles = `
  input[type=range].vw-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
    background: linear-gradient(to right, var(--slider-color) var(--slider-pct), #d8d0c8 var(--slider-pct));
  }
  input[type=range].vw-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--slider-color);
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
  input[type=range].vw-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--slider-color);
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
  input[type=range].vw-slider::-moz-range-track {
    height: 6px;
    border-radius: 3px;
    background: transparent;
  }
`;

export default function Verbindingswiel() {
  const [fase, setFase] = useState<'A' | 'B' | 'analyse'>('A');
  const [naamA, setNaamA] = useState('');
  const [naamB, setNaamB] = useState('');
  const [scoresA, setScoresA] = useState<Score[]>(initScores());
  const [scoresB, setScoresB] = useState<Score[]>(initScores());
  const [analyse, setAnalyse] = useState<Analyse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showText, setShowText] = useState(false);

  const updateScore = (setter: React.Dispatch<React.SetStateAction<Score[]>>, i: number, key: keyof Score, val: number) =>
    setter(s => s.map((r, idx) => idx === i ? { ...r, [key]: val } : r));

  const labelA = naamA || 'Partner A';
  const labelB = naamB || 'Partner B';
  const scores = fase === 'A' ? scoresA : scoresB;
  const setter = fase === 'A' ? setScoresA : setScoresB;

  async function doAnalyse() {
    setLoading(true);
    setAnalyse(null);

    const lines = aspecten.map((a, i) => {
      const gapA = scoresA[i].belang - scoresA[i].vervullingBewust;
      const gapB = scoresB[i].belang - scoresB[i].vervullingBewust;
      const partnerGap = Math.abs(scoresA[i].vervullingBewust - scoresB[i].vervullingBewust);
      const belangGap = Math.abs(scoresA[i].belang - scoresB[i].belang);
      return a.label + ':\n' +
        '  ' + labelA + ': belang ' + scoresA[i].belang + ', vervulling bewust ' + scoresA[i].vervullingBewust + ', vervulling onbewust ' + scoresA[i].vervullingOnbewust + ' (verlangengat: ' + gapA + ')\n' +
        '  ' + labelB + ': belang ' + scoresB[i].belang + ', vervulling bewust ' + scoresB[i].vervullingBewust + ', vervulling onbewust ' + scoresB[i].vervullingOnbewust + ' (verlangengat: ' + gapB + ')\n' +
        '  Verschil in vervulling tussen partners: ' + partnerGap + ' | Verschil in belang: ' + belangGap;
    }).join('\n\n');

    const prompt = 'Je bent een warme, professionele relatiecoach bij Energieke Lieke. ' +
      'Een koppel heeft het Verbindingswiel ingevuld. Per verbindingsaspect gaven beiden drie scores: ' +
      'belang (hoe belangrijk is dit voor mij?), vervulling bewust (hoe vervuld voel ik me hier nu?) en vervulling onbewust (via biotensor).\n\n' +
      'Het verlangengat = belang minus vervulling bewust. Hoe groter dit gat, hoe meer pijn of gemis hier zit. ' +
      'Let ook op aspecten waar het belang laag is — een lage vervulling daar is minder urgent. ' +
      'Een groot verschil in belang tussen partners verklaart vaak misverstanden: ze leven in verschillende prioriteiten.\n\n' +
      'SCORES:\n' + lines + '\n\n' +
      'Gebruik als leidraad:\n' +
      '- Welke verbindingen zijn belangrijk voor beiden? Welke zijn voor de een essentieel maar voor de ander minder?\n' +
      '- Waar zitten de grootste verlangengaten? Wat betekent dit voor het koppel?\n' +
      '- Wat zegt het verschil tussen bewuste en onbewuste vervulling — speelt er iets onder de oppervlakte?\n' +
      '- Zijn er verbindingen die vroeger misschien meer aanwezig waren?\n' +
      '- Aan welke verbinding wil dit koppel de komende tijd aandacht geven?\n\n' +
      'Wees warm, hoopvol, speels en niet-oordelend — alsof een goede vriendin die toevallig ook relatiecoach is met jullie aan tafel zit. ' +
      'Gebruik beeldende taal en spreek het koppel direct aan als \'jullie\'. Geen droog rapport — een warm gesprek op papier.\n\n' +
      'Schrijf in het NEDERLANDS. Antwoord ALLEEN met geldige JSON zonder markdown:\n' +
      '{"samenvatting":"3-4 zinnen over het patroon van dit koppel — wat springt eruit, wat is de rode draad? Speels en warm.",' +
      '"sterktes":[{"aspect":"naam","inzicht":"wat dit koppel hier goed doet of wat ze kunnen koesteren — concreet en warm"}],' +
      '"aandacht":[{"aspect":"naam","type":"groot_verlangengat|belangverschil|onbewust_lager|beiden_laag","inzicht":"wat dit zegt over de verbinding, zonder oordeel — met een vleugje humor of beeldende taal"}],' +
      '"groei":[{"aspect":"naam","tip":"concrete warme groeisuggestie voor dit koppel samen, praktisch en haalbaar"}],' +
      '"reflectie":{"vraag1":"een diepe open vraag over hun sterkste verbinding","vraag2":"een zachte vraag over het aspect met het grootste verlangengat","vraag3":"een vooruitkijkende vraag: aan welke verbinding willen jullie de komende tijd aandacht geven?"},' +
      '"afsluiting":"warme, hoopvolle afsluitzin gericht aan het koppel samen"}';

    try {
      const res = await fetch('/api/verbindingswiel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fout bij analyse');
      setAnalyse(data as Analyse);
    } catch (err) {
      setAnalyse({ error: err instanceof Error ? err.message : 'Onbekende fout' });
    }
    setLoading(false);
    setFase('analyse');
  }

  function buildText() {
    if (!analyse || analyse.error) return '';
    const lines = aspecten.map((a, i) =>
      a.label + ':\n  ' + labelA + ': belang ' + scoresA[i].belang + ' | vervulling B' + scoresA[i].vervullingBewust + '/O' + scoresA[i].vervullingOnbewust +
      '\n  ' + labelB + ': belang ' + scoresB[i].belang + ' | vervulling B' + scoresB[i].vervullingBewust + '/O' + scoresB[i].vervullingOnbewust
    ).join('\n');
    const sterktes = (analyse.sterktes || []).map(s => '- ' + s.aspect + ': ' + s.inzicht).join('\n');
    const aandacht = (analyse.aandacht || []).map(a => '- ' + a.aspect + ': ' + a.inzicht).join('\n');
    const groei = (analyse.groei || []).map(g => '- ' + g.aspect + ': ' + g.tip).join('\n');
    return 'VERBINDINGSWIEL — ' + labelA + ' & ' + labelB + '\n------------------------------\n\n' +
      'SCORES\n' + lines + '\n\n------------------------------\n\n' +
      'SAMENVATTING\n' + analyse.samenvatting + '\n\n' +
      'STERKTES\n' + sterktes + '\n\n' +
      'AANDACHT\n' + aandacht + '\n\n' +
      'GROEI\n' + groei + '\n\n' +
      'REFLECTIEVRAGEN\n1. ' + analyse.reflectie?.vraag1 + '\n2. ' + analyse.reflectie?.vraag2 + '\n3. ' + analyse.reflectie?.vraag3 + '\n\n' +
      analyse.afsluiting;
  }

  return (
    <div style={{ background: C.cream, minHeight: '100vh' }}>
      <style>{sliderStyles}</style>
      <div style={{ display: 'flex', gap: 0, marginBottom: '1.5rem', borderRadius: 10, overflow: 'hidden', border: '1px solid ' + C.lightBg }}>
        {(['A', 'B', 'analyse'] as const).map((f, i) => {
          const active = fase === f;
          const done = (f === 'A' && (fase === 'B' || fase === 'analyse')) || (f === 'B' && fase === 'analyse');
          const tabLabel = f === 'A' ? labelA : f === 'B' ? labelB : 'Analyse';
          return (
            <div key={f} style={{ flex: 1, padding: '10px 8px', textAlign: 'center', background: active ? C.darkGreen : done ? C.lightBg2 : '#fff', borderRight: i < 2 ? '1px solid ' + C.lightBg : 'none' }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: active ? '#fff' : done ? C.darkGreen : C.darkSlate, opacity: active ? 1 : done ? 1 : 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>{tabLabel}</p>
            </div>
          );
        })}
      </div>

      {fase === 'A' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1.25rem' }}>
          {([['naamA', 'Naam partner A', setNaamA, naamA], ['naamB', 'Naam partner B', setNaamB, naamB]] as [string, string, React.Dispatch<React.SetStateAction<string>>, string][]).map(item => (
            <div key={item[0]}>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.darkSlate, display: 'block', marginBottom: 4 }}>{item[1]}</label>
              <input type="text" value={item[3]} onChange={e => item[2](e.target.value)} placeholder="Optioneel..."
                style={{ width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1px solid ' + C.lightBg, boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
      )}

      {fase !== 'analyse' && (
        <>
          <Legenda />

          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid ' + C.lightBg, marginBottom: '1.25rem' }}>
            {aspecten.map((a, i) => (
              <div key={a.id} style={{ background: i % 2 === 0 ? '#fff' : C.cream, padding: '14px 16px', borderBottom: i < aspecten.length - 1 ? '1px solid ' + C.lightBg : 'none' }}>
                <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: 14, color: C.darkSlate }}>{a.label}</p>
                <p style={{ margin: '0 0 10px', fontSize: 11, color: C.darkSlate, opacity: 0.6 }}>{a.omschr}</p>
                <ScoreBlok scores={scores[i]} onUpdate={(key, val) => updateScore(setter, i, key, val)} showGap={true} />
              </div>
            ))}
          </div>

          <div style={{ background: C.lightBg2, borderRadius: 12, padding: '1rem 0.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>
            <Spider scoresA={scoresA} scoresB={scoresB} fase={fase} />
          </div>

          {fase === 'A' && (
            <button onClick={() => setFase('B')}
              style={{ width: '100%', padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', borderRadius: 10, border: 'none', background: C.darkGreen, color: '#fff' }}>
              {labelA} is klaar — door naar {labelB}
            </button>
          )}
          {fase === 'B' && (
            <button onClick={doAnalyse} disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 10, border: 'none', background: C.darkRed, color: '#fff', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Analyse wordt opgesteld...' : 'Genereer gecombineerde analyse'}
            </button>
          )}
        </>
      )}

      {fase === 'analyse' && analyse && (
        <div>
          {analyse.error ? (
            <p style={{ color: C.darkRed, fontSize: 13 }}>{analyse.error}</p>
          ) : (
            <div>
              <div style={{ background: C.lightBg2, borderRadius: 12, padding: '1rem 0.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <Spider scoresA={scoresA} scoresB={scoresB} fase="analyse" />
              </div>

              <p style={{ fontSize: 15, lineHeight: 1.75, margin: '0 0 1.5rem', color: C.darkSlate }}>{analyse.samenvatting}</p>

              {(analyse.sterktes?.length ?? 0) > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: C.darkGreen, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 0.75rem' }}>Verbindingssterktes</h3>
                  <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid ' + C.lightBg }}>
                    {analyse.sterktes!.map((s, i) => (
                      <div key={i} style={{ background: i % 2 === 0 ? '#fff' : C.cream, padding: '10px 14px', borderBottom: i < analyse.sterktes!.length - 1 ? '1px solid ' + C.lightBg : 'none' }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: C.darkGreen }}>{s.aspect}</span>
                        <p style={{ margin: '4px 0 0', fontSize: 13, color: C.darkSlate, lineHeight: 1.65 }}>{s.inzicht}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(analyse.aandacht?.length ?? 0) > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: C.darkGreen, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 0.75rem' }}>Aandachtsgebieden</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {analyse.aandacht!.map((a, i) => {
                      const kl = typeKleur[a.type] || typeKleur.beiden_laag;
                      return (
                        <div key={i} style={{ background: kl.bg, borderLeft: '4px solid ' + kl.border, borderRadius: '0 8px 8px 0', padding: '10px 14px' }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: kl.text }}>{a.aspect}</span>
                            <span style={{ fontSize: 10, background: kl.border, color: '#fff', borderRadius: 4, padding: '2px 7px', fontWeight: 600 }}>{kl.label}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: 13, color: kl.text, lineHeight: 1.65 }}>{a.inzicht}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {(analyse.groei?.length ?? 0) > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: C.darkGreen, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 0.75rem' }}>Groeikansen samen</h3>
                  <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid ' + C.lightBg }}>
                    {analyse.groei!.map((g, i) => (
                      <div key={i} style={{ background: i % 2 === 0 ? '#fff' : C.cream, padding: '10px 14px', borderBottom: i < analyse.groei!.length - 1 ? '1px solid ' + C.lightBg : 'none' }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: C.darkRed }}>{g.aspect}</span>
                        <p style={{ margin: '4px 0 0', fontSize: 13, color: C.darkSlate, lineHeight: 1.65 }}>{g.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analyse.reflectie && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: C.darkGreen, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 0.75rem' }}>Reflectievragen voor jullie samen</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[analyse.reflectie.vraag1, analyse.reflectie.vraag2, analyse.reflectie.vraag3].filter(Boolean).map((v, i) => (
                      <div key={i} style={{ background: C.darkGreen, borderRadius: 10, padding: '12px 16px' }}>
                        <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: C.lightBg, textTransform: 'uppercase', letterSpacing: 0.5 }}>Vraag {i + 1}</p>
                        <p style={{ margin: 0, fontSize: 14, color: '#fff', lineHeight: 1.7, fontStyle: 'italic' }}>"{v}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analyse.afsluiting && (
                <div style={{ background: C.lightBg2, borderRadius: 10, padding: '14px 16px', marginBottom: '1rem' }}>
                  <p style={{ margin: 0, fontSize: 14, color: C.darkSlate, lineHeight: 1.7, fontStyle: 'italic' }}>{analyse.afsluiting}</p>
                </div>
              )}

              <button onClick={() => setShowText(s => !s)}
                style={{ width: '100%', padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', borderRadius: 10, marginBottom: 10, background: C.lightBg, color: C.darkSlate, border: '2px solid ' + C.lightBg }}>
                {showText ? 'Verberg tekst' : 'Kopieer analyse — toon tekst'}
              </button>
              {showText && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 12, color: C.darkGreen, fontWeight: 600, margin: '0 0 6px' }}>Klik in het vak, selecteer alles (Ctrl+A) en kopieer (Ctrl+C):</p>
                  <textarea readOnly rows={14} defaultValue={buildText()} onClick={e => (e.target as HTMLTextAreaElement).select()}
                    style={{ width: '100%', fontSize: 12, padding: '10px', borderRadius: 8, border: '1px solid ' + C.lightBg, background: C.cream, resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }} />
                </div>
              )}

              <button onClick={() => { setScoresA(initScores()); setScoresB(initScores()); setAnalyse(null); setFase('A'); setShowText(false); }}
                style={{ width: '100%', padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', borderRadius: 10, background: 'transparent', color: C.darkGreen, border: '2px solid ' + C.darkGreen }}>
                Opnieuw beginnen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
