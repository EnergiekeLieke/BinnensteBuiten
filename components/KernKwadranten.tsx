'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AnalyseResultaat from './AnalyseResultaat';
import { roepAnalyseAan, streamAnalyse, vervangMDashes } from '@/lib/huisstijl';

const KernKwadrantenPdfKnop = dynamic(
  () => import('./KernKwadrantenPdf').then((m) => m.KernKwadrantenPdfKnop),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);

export type Kwadrant = {
  id: string;
  label: string;
  startpunt: 'kwaliteit' | 'valkuil' | 'uitdaging' | 'allergie' | null;
  stap: 0 | 1 | 2;
  kwaliteit: string;
  kwaliteitToelichting: string;
  valkuil: string;
  valkuilToelichting: string;
  uitdaging: string;
  uitdagingToelichting: string;
  allergie: string;
  allergieToelichting: string;
  suggestieLoading: boolean;
  suggestieFout: string;
  analyse: string;
  analyseLoading: boolean;
};

const GROEI_AFFIRMATIES = [
  'Ik leer de balans vinden tussen het inzetten van mijn kwaliteit: [kwaliteit] en op een gezonde manier kiezen voor [uitdaging].',
  'Ik leer mijn [kwaliteit] bewust in te zetten, in plaats van automatisch.',
  'Ik leer dat mijn [valkuil] mij niet definieert, maar mij iets leert.',
  'Elke dag herken ik één moment waarop ik mijn [kwaliteit] vanuit kracht inzet.',
  'Ik leer dat [allergie] in anderen mij ook iets vertelt over mijn eigen verlangen naar [uitdaging].',
  'Elke dag word ik me iets meer bewust van wanneer ik doorschiet in [valkuil].',
  'Ik leer dat groei klein mag beginnen, en dat is precies goed.',
  'Elke dag oefen ik met [uitdaging] in kleine, concrete momenten.',
  'Ik leer dat echte kracht niet zit in hoeveel ik doe, maar in hoe bewust ik het doe.',
  'Elke dag ontdek ik meer van wie ik ben als ik vanuit kracht handel.',
];

function maakKwadrant(index: number): Kwadrant {
  return {
    id: `kw-${Date.now()}-${index}`,
    label: '',
    startpunt: null,
    stap: 0,
    kwaliteit: '', kwaliteitToelichting: '',
    valkuil: '', valkuilToelichting: '',
    uitdaging: '', uitdagingToelichting: '',
    allergie: '', allergieToelichting: '',
    suggestieLoading: false,
    suggestieFout: '',
    analyse: '', analyseLoading: false,
  };
}

// Auto-resizing textarea — groeit mee met de inhoud
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
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className={className}
      style={{ resize: 'none', overflow: 'hidden' }}
    />
  );
}

export default function KernKwadranten() {
  const [kwadranten, setKwadranten] = useState<Kwadrant[]>([maakKwadrant(0)]);
  const abortRefs = useRef<Map<string, AbortController>>(new Map());

  useEffect(() => {
    const refs = abortRefs.current;
    return () => { refs.forEach((ctrl) => ctrl.abort()); };
  }, []);

  function updateKwadrant(id: string, updates: Partial<Kwadrant>) {
    setKwadranten((prev) => prev.map((k) => (k.id === id ? { ...k, ...updates } : k)));
  }

  async function suggereerAanvulling(id: string, kwadrant: Kwadrant) {
    abortRefs.current.get(id)?.abort();
    const ctrl = new AbortController();
    abortRefs.current.set(id, ctrl);
    updateKwadrant(id, { suggestieLoading: true, suggestieFout: '' });

    try {
      const prompt =
        kwadrant.startpunt === 'kwaliteit' ? bouwKwaliteitPrompt(kwadrant) :
        kwadrant.startpunt === 'allergie'  ? bouwAllergiePrompt(kwadrant) :
        kwadrant.startpunt === 'valkuil'   ? bouwValkuilPrompt(kwadrant) :
        bouwUitdagingPrompt(kwadrant);

      const raw = await roepAnalyseAan(prompt, 500, ctrl.signal);
      const match = raw.match(/\{[\s\S]*?\}/);
      if (!match) {
        updateKwadrant(id, { suggestieLoading: false, suggestieFout: 'AI gaf een onverwacht antwoord. Probeer opnieuw.' });
        return;
      }

      const parsed = JSON.parse(match[0]);
      updateKwadrant(id, {
        kwaliteit: parsed.kwaliteit ?? kwadrant.kwaliteit,
        kwaliteitToelichting: parsed.kwaliteitToelichting ?? kwadrant.kwaliteitToelichting,
        valkuil: parsed.valkuil ?? kwadrant.valkuil,
        valkuilToelichting: parsed.valkuilToelichting ?? kwadrant.valkuilToelichting,
        uitdaging: parsed.uitdaging ?? kwadrant.uitdaging,
        uitdagingToelichting: parsed.uitdagingToelichting ?? kwadrant.uitdagingToelichting,
        allergie: parsed.allergie ?? kwadrant.allergie,
        allergieToelichting: parsed.allergieToelichting ?? kwadrant.allergieToelichting,
        suggestieLoading: false,
        suggestieFout: '',
      });
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') {
        updateKwadrant(id, { suggestieLoading: false, suggestieFout: 'Er ging iets mis. Probeer opnieuw.' });
      }
    }
  }

  async function genereerAnalyse(id: string, kwadrant: Kwadrant) {
    abortRefs.current.get(id)?.abort();
    const ctrl = new AbortController();
    abortRefs.current.set(id, ctrl);
    updateKwadrant(id, { analyseLoading: true, analyse: '', stap: 2 });

    try {
      const prompt = bouwAnalysePrompt(kwadrant);
      let acc = '';
      await streamAnalyse(
        prompt,
        1500,
        (chunk) => { acc += chunk; updateKwadrant(id, { analyse: acc }); },
        'Schrijf in correct Nederlands: grammaticaal juist, correcte spelling, correcte woordkeuze en geen anglicismen.',
        ctrl.signal
      );
      // Zorg dat ✨ altijd op een eigen regel staat, ook als de AI ze aan elkaar plakt
      const geordend = vervangMDashes(acc)
        .replace(/([^\n])✨/g, '$1\n✨')
        // Verwijder eventuele opmaak (haakjes, sterretjes) rond een affirmatie
        .replace(/^(✨\s*)[*(]+(.*?)[*)]+\s*$/gm, '$1$2');
      updateKwadrant(id, { analyse: geordend, analyseLoading: false });
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') {
        updateKwadrant(id, { analyseLoading: false });
      }
    }
  }

  const heeftAnalyse = kwadranten.some((k) => k.analyse);

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <div className="text-center">
        <h1 className="font-salmon text-2xl text-darkSlate mb-1">Kernkwadranten</h1>
        <p className="text-midGreen italic text-sm">naar Daniel Ofman</p>
      </div>

      <div className="bg-lightBg2 rounded-2xl p-4 border border-orange/20 text-sm text-darkSlate space-y-2">
        <p>Het Ofman-kernkwadrant laat zien hoe jouw kwaliteit, valkuil, uitdaging en allergie samenhangen. Start vanuit wat je al weet.</p>
        <p className="text-darkSlate/60 text-xs border-t border-orange/20 pt-2">Wat jou irriteert in anderen is bijna altijd een spiegel: je allergie is het positieve tegendeel van je kwaliteit.</p>
      </div>

      {kwadranten.map((k, idx) => (
        <KwadrantKaart
          key={k.id}
          kwadrant={k}
          index={idx}
          onUpdate={(updates) => updateKwadrant(k.id, updates)}
          onSuggestie={() => suggereerAanvulling(k.id, k)}
          onAnalyse={() => genereerAnalyse(k.id, k)}
        />
      ))}

      <div className="flex flex-col items-center gap-4 pb-6">
        <button
          onClick={() => setKwadranten((prev) => [...prev, maakKwadrant(prev.length)])}
          className="px-5 py-2.5 rounded-xl border-2 border-midGreen text-midGreen text-sm hover:bg-midGreen/5 transition-colors"
        >
          + Voeg een kwadrant toe
        </button>
        {heeftAnalyse && (
          <KernKwadrantenPdfKnop kwadranten={kwadranten.filter((k) => k.analyse)} />
        )}
      </div>
    </div>
  );
}

// ── Prompts ───────────────────────────────────────────────────────────────────

function bouwKwaliteitPrompt(k: Kwadrant): string {
  return `Schrijf in correct Nederlands: grammaticaal juist, correcte spelling, correcte woordkeuze en geen anglicismen.

Iemand werkt met het Ofman-kernkwadrant en start vanuit de kwaliteit "${k.kwaliteit}".
${k.kwaliteitToelichting ? `Toelichting: "${k.kwaliteitToelichting}"` : 'Geen toelichting gegeven.'}

Genereer de drie andere hoeken. Geef UITSLUITEND JSON terug, geen andere tekst:
{"valkuil":"...","valkuilToelichting":"...","uitdaging":"...","uitdagingToelichting":"...","allergie":"...","allergieToelichting":"..."}

Regels:
- Valkuil = te veel van de kwaliteit (de doorgeslagen versie)
- Uitdaging = het positieve tegendeel van de valkuil (wat je kunt leren)
- Allergie = te veel van de uitdaging (wat je stoort in anderen)
- Gebruik 1 tot 4 woorden per label
- Eén zin per toelichting, maximaal 12 woorden
- Geen m-dash. Gebruik "je" (niet "jij" of "u").`;
}

function bouwAllergiePrompt(k: Kwadrant): string {
  return `Schrijf in correct Nederlands: grammaticaal juist, correcte spelling, correcte woordkeuze en geen anglicismen.

Iemand werkt met het Ofman-kernkwadrant en start vanuit de allergie "${k.allergie}".
${k.allergieToelichting ? `Toelichting: "${k.allergieToelichting}"` : 'Geen toelichting gegeven.'}

In het Ofman-model geldt: allergie = te veel van de uitdaging. Kwaliteit = positief tegendeel van allergie.
Redeneer zo: kwaliteit = positief tegendeel van allergie; valkuil = te veel van kwaliteit; uitdaging = positief tegendeel van valkuil.

Genereer de drie andere hoeken. Geef UITSLUITEND JSON terug, geen andere tekst:
{"kwaliteit":"...","kwaliteitToelichting":"...","valkuil":"...","valkuilToelichting":"...","uitdaging":"...","uitdagingToelichting":"..."}

Regels:
- Gebruik 1 tot 4 woorden per label
- Eén zin per toelichting, maximaal 12 woorden
- Geen m-dash. Gebruik "je" (niet "jij" of "u").`;
}

function bouwValkuilPrompt(k: Kwadrant): string {
  return `Schrijf in correct Nederlands: grammaticaal juist, correcte spelling, correcte woordkeuze en geen anglicismen.

Iemand werkt met het Ofman-kernkwadrant en start vanuit de valkuil "${k.valkuil}".
${k.valkuilToelichting ? `Toelichting: "${k.valkuilToelichting}"` : 'Geen toelichting gegeven.'}

In het Ofman-model: valkuil = te veel van een kwaliteit. Kwaliteit is de positieve basis achter de valkuil.
Uitdaging = het positieve tegendeel van de valkuil. Allergie = te veel van de uitdaging.

Genereer de drie andere hoeken. Geef UITSLUITEND JSON terug, geen andere tekst:
{"kwaliteit":"...","kwaliteitToelichting":"...","uitdaging":"...","uitdagingToelichting":"...","allergie":"...","allergieToelichting":"..."}

Regels:
- Kwaliteit: de positieve kern achter de valkuil (de goede bedoeling erachter)
- Uitdaging: het positieve tegendeel van de valkuil (wat te leren is)
- Allergie: te veel van de uitdaging (wat dan stoort in anderen)
- Gebruik 1 tot 4 woorden per label
- Eén zin per toelichting, maximaal 12 woorden
- Geen m-dash. Gebruik "je" (niet "jij" of "u").`;
}

function bouwUitdagingPrompt(k: Kwadrant): string {
  return `Schrijf in correct Nederlands: grammaticaal juist, correcte spelling, correcte woordkeuze en geen anglicismen.

Iemand werkt met het Ofman-kernkwadrant en start vanuit de uitdaging "${k.uitdaging}".
${k.uitdagingToelichting ? `Toelichting: "${k.uitdagingToelichting}"` : 'Geen toelichting gegeven.'}

In het Ofman-model: uitdaging = het positieve tegendeel van de valkuil. Allergie = te veel van de uitdaging.
Valkuil = positief tegendeel van uitdaging (omgekeerd). Kwaliteit = de positieve basis achter de valkuil.

Genereer de drie andere hoeken. Geef UITSLUITEND JSON terug, geen andere tekst:
{"kwaliteit":"...","kwaliteitToelichting":"...","valkuil":"...","valkuilToelichting":"...","allergie":"...","allergieToelichting":"..."}

Regels:
- Allergie: te veel van de uitdaging (doorgeslagen versie)
- Valkuil: het positieve tegendeel van de uitdaging (tegenovergesteld patroon)
- Kwaliteit: de positieve kern achter de valkuil
- Gebruik 1 tot 4 woorden per label
- Eén zin per toelichting, maximaal 12 woorden
- Geen m-dash. Gebruik "je" (niet "jij" of "u").`;
}

function bouwAnalysePrompt(k: Kwadrant): string {
  const labelContext = k.label ? `Context voor dit kwadrant: ${k.label}\n\n` : '';
  return `${labelContext}Schrijf een persoonlijke, warme tekst voor iemand die werkt met hun Ofman-kernkwadrant.

Kernkwadrant:
- Kwaliteit: ${k.kwaliteit}${k.kwaliteitToelichting ? ` (${k.kwaliteitToelichting})` : ''}
- Valkuil: ${k.valkuil}${k.valkuilToelichting ? ` (${k.valkuilToelichting})` : ''}
- Uitdaging: ${k.uitdaging}${k.uitdagingToelichting ? ` (${k.uitdagingToelichting})` : ''}
- Allergie: ${k.allergie}${k.allergieToelichting ? ` (${k.allergieToelichting})` : ''}

Gebruik "je" (niet "jij" of "u"). Geen m-dash. Gebruik dubbele punt in subkoppen. Begin zinnen niet met "En".

## Jouw kwaliteit in volle kracht
2 tot 3 zinnen over wat de kwaliteit "${k.kwaliteit}" uniek maakt en wat het anderen brengt.

## Van valkuil naar inzicht
2 tot 3 zinnen: wanneer schiet de kwaliteit door naar de valkuil "${k.valkuil}"? Geef één concreet alledaags voorbeeld.

## Jouw uitdaging: ${k.uitdaging}
2 tot 3 zinnen over wat de uitdaging "${k.uitdaging}" jou vraagt en hoe die er in de praktijk uitziet.

## Groei-affirmaties
Kies 4 passende affirmaties uit onderstaande lijst. Komt [kwaliteit], [valkuil], [uitdaging] of [allergie] voor in een gekozen affirmatie, vervang dit door respectievelijk "${k.kwaliteit}", "${k.valkuil}", "${k.uitdaging}" en "${k.allergie}" (kleine letter). Deze waarden kunnen een zelfstandig naamwoord zijn (bijv. "rust") of een werkwoordsvorm/zin (bijv. "voor jezelf kiezen", "nee zeggen"). Herschrijf de zin waar nodig zo dat hij natuurlijk en grammaticaal correct loopt, ook als dat betekent dat je woorden als "voor" of "naar" weglaat of de zinsconstructie aanpast. Bijvoorbeeld: "kiezen voor [uitdaging]" met uitdaging "voor jezelf kiezen" wordt "kiezen voor jezelf", en "verlangen naar [uitdaging]" wordt dan "verlangen om voor jezelf te kiezen". Schrijf de 4 gekozen affirmaties daarna elk op een nieuwe regel, beginnend met ✨, zonder aanhalingstekens, haakjes of sterretjes eromheen.

Beschikbare groei-affirmaties:
${GROEI_AFFIRMATIES.join('\n')}

## Jouw actie voor vandaag
Begin met: "Vandaag doe je:" Beschrijf één kleine, concrete actie voor vandaag. Maximaal 2 zinnen. Houd het klein en specifiek, geen vage tips.`;
}

// ── KwadrantKaart ─────────────────────────────────────────────────────────────

const STARTPUNT_LABEL: Record<NonNullable<Kwadrant['startpunt']>, string> = {
  kwaliteit: 'kwaliteit',
  valkuil:   'valkuil',
  uitdaging: 'uitdaging',
  allergie:  'allergie',
};

function KwadrantKaart({ kwadrant: k, index, onUpdate, onSuggestie, onAnalyse }: {
  kwadrant: Kwadrant;
  index: number;
  onUpdate: (updates: Partial<Kwadrant>) => void;
  onSuggestie: () => void;
  onAnalyse: () => void;
}) {
  const alleFeldenIngevuld = !!(k.kwaliteit.trim() && k.valkuil.trim() && k.uitdaging.trim() && k.allergie.trim());

  return (
    <div className="bg-white rounded-2xl border border-lightBg shadow-sm overflow-hidden">
      <div className="bg-darkSlate px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-salmon text-cream text-sm">
            Kwadrant {index + 1}{k.label ? `: ${k.label}` : ''}
          </p>
          {k.startpunt && k.stap > 0 && (
            <p className="text-[10px] text-midGreen/70 mt-0.5">
              Gestart vanuit {STARTPUNT_LABEL[k.startpunt]}
            </p>
          )}
        </div>
        <div className="flex gap-1.5">
          {([0, 1, 2] as const).map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${s <= k.stap ? 'bg-midGreen' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </div>

      <div className="p-4">
        {k.stap === 0 && (
          <Stap0 kwadrant={k} onUpdate={onUpdate} />
        )}

        {k.stap === 1 && (
          <div className="space-y-4">
            <KwadrantGrid kwadrant={k} onUpdate={onUpdate} />

            <button
              onClick={onSuggestie}
              disabled={k.suggestieLoading}
              className="w-full py-2.5 rounded-xl border-2 border-orange text-orange text-sm hover:bg-orange/5 transition-colors disabled:opacity-50"
            >
              {k.suggestieLoading ? 'AI denkt na…' : '✦ Laat AI de andere velden suggereren'}
            </button>
            {k.suggestieFout && (
              <p className="text-xs text-darkRed/70 text-center">{k.suggestieFout}</p>
            )}

            <div className="space-y-1.5">
              <button
                onClick={onAnalyse}
                disabled={!alleFeldenIngevuld}
                className="w-full py-2.5 rounded-xl bg-darkGreen text-cream text-sm font-salmon hover:bg-darkGreen/80 transition-colors disabled:opacity-40"
              >
                Genereer mijn groei-affirmaties →
              </button>
              {!alleFeldenIngevuld && (
                <p className="text-xs text-darkSlate/50 text-center">Vul alle vier de velden in om verder te gaan.</p>
              )}
            </div>

            <button
              onClick={() => onUpdate({ stap: 0 })}
              className="text-xs text-midGreen hover:text-darkGreen underline underline-offset-2 block"
            >
              ← Terug naar startpunt
            </button>
          </div>
        )}

        {k.stap === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'Kwaliteit', waarde: k.kwaliteit, bg: 'bg-darkGreen/10', kleur: 'text-darkGreen' },
                { label: 'Valkuil',   waarde: k.valkuil,   bg: 'bg-darkRed/10',   kleur: 'text-darkRed'   },
                { label: 'Allergie',  waarde: k.allergie,  bg: 'bg-orange/10',    kleur: 'text-orange'    },
                { label: 'Uitdaging', waarde: k.uitdaging, bg: 'bg-midGreen/10',  kleur: 'text-midGreen'  },
              ].map(({ label, waarde, bg, kleur }) => (
                <div key={label} className={`rounded-lg p-2.5 ${bg}`}>
                  <p className={`text-[9px] font-medium uppercase tracking-wide ${kleur} mb-0.5`}>{label}</p>
                  <p className="text-sm font-semibold text-darkSlate break-words">{waarde}</p>
                </div>
              ))}
            </div>

            <AnalyseResultaat tekst={k.analyse} titel="Kernkwadrant" isLoading={k.analyseLoading} verbergPrintKnop />

            {!k.analyseLoading && (
              <button
                onClick={() => onUpdate({ stap: 1 })}
                className="text-xs text-midGreen hover:text-darkGreen underline underline-offset-2 block"
              >
                ← Bewerk kwadrant
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stap 0 ────────────────────────────────────────────────────────────────────

type StartpuntOptie = {
  id: NonNullable<Kwadrant['startpunt']>;
  label: string;
  omschrijving: string;
  placeholder: string;
  toelichtingKey: 'kwaliteitToelichting' | 'valkuilToelichting' | 'uitdagingToelichting' | 'allergieToelichting';
  actief: string;
  hover: string;
  labelKleur: string;
};

const STARTPUNT_OPTIES: StartpuntOptie[] = [
  {
    id: 'kwaliteit',
    label: 'Mijn kwaliteit',
    omschrijving: 'Wat ik van nature goed kan of waar anderen mij op aanspreken.',
    placeholder: 'bijv. Empathie, Doorzettingsvermogen, Nauwkeurigheid…',
    toelichtingKey: 'kwaliteitToelichting',
    actief: 'border-darkGreen bg-darkGreen/10',
    hover: 'hover:border-midGreen/40',
    labelKleur: 'text-darkGreen',
  },
  {
    id: 'valkuil',
    label: 'Mijn valkuil',
    omschrijving: 'Waar ik weleens in doorschiet of wat anderen mij teruggeven.',
    placeholder: 'bijv. Te emotioneel, Perfectionisme, Alles overnemen…',
    toelichtingKey: 'valkuilToelichting',
    actief: 'border-darkRed bg-darkRed/10',
    hover: 'hover:border-darkRed/30',
    labelKleur: 'text-darkRed',
  },
  {
    id: 'uitdaging',
    label: 'Mijn uitdaging',
    omschrijving: 'Wat ik wil leren of waar ik nog in kan groeien.',
    placeholder: 'bijv. Afstand nemen, Loslaten, Flexibiliteit…',
    toelichtingKey: 'uitdagingToelichting',
    actief: 'border-midGreen bg-midGreen/10',
    hover: 'hover:border-midGreen/40',
    labelKleur: 'text-midGreen',
  },
  {
    id: 'allergie',
    label: 'Mijn allergie',
    omschrijving: 'Wat mij irriteert in anderen. Dat is bijna altijd een spiegel.',
    placeholder: 'bijv. Koppigheid, Onverschilligheid, Nonchalance…',
    toelichtingKey: 'allergieToelichting',
    actief: 'border-orange bg-orange/10',
    hover: 'hover:border-orange/30',
    labelKleur: 'text-orange',
  },
];

function Stap0({ kwadrant: k, onUpdate }: {
  kwadrant: Kwadrant;
  onUpdate: (updates: Partial<Kwadrant>) => void;
}) {
  const actief = STARTPUNT_OPTIES.find((o) => o.id === k.startpunt) ?? null;
  const startWaarde = k.startpunt ? (k[k.startpunt] as string) : '';

  function kiesStartpunt(id: NonNullable<Kwadrant['startpunt']>) {
    // Wis alle vier velden behalve het gekozen startpunt
    const leeg: Partial<Kwadrant> = {
      startpunt: id,
      kwaliteit: '', kwaliteitToelichting: '',
      valkuil: '', valkuilToelichting: '',
      uitdaging: '', uitdagingToelichting: '',
      allergie: '', allergieToelichting: '',
    };
    delete (leeg as Record<string, unknown>)[id];
    delete (leeg as Record<string, unknown>)[id + 'Toelichting'];
    onUpdate(leeg);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-darkSlate/50 uppercase tracking-wide block mb-1.5">
          Naam voor dit kwadrant (optioneel)
        </label>
        <input
          type="text"
          value={k.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="bijv. Werk, Relaties, Ouderschap…"
          className="w-full text-sm text-darkSlate bg-lightBg2/50 border border-lightBg rounded-lg px-3 py-2 outline-none focus:border-midGreen"
        />
      </div>

      <p className="text-sm font-medium text-darkSlate">Waar wil je starten?</p>
      <div className="grid grid-cols-2 gap-2">
        {STARTPUNT_OPTIES.map((o) => (
          <button
            key={o.id}
            onClick={() => kiesStartpunt(o.id)}
            className={`text-left rounded-xl border-2 p-3 transition-all ${
              k.startpunt === o.id ? o.actief : `border-lightBg ${o.hover}`
            }`}
          >
            <p className={`text-sm font-semibold ${o.labelKleur} mb-0.5`}>{o.label}</p>
            <p className="text-xs text-darkSlate/60 leading-snug">{o.omschrijving}</p>
          </button>
        ))}
      </div>

      {actief && (
        <div className="space-y-3 pt-1">
          <div>
            <label className="text-xs font-medium text-darkSlate/50 uppercase tracking-wide block mb-1.5">
              {actief.label}
            </label>
            <input
              type="text"
              value={startWaarde}
              onChange={(e) => onUpdate({ [actief.id]: e.target.value } as Partial<Kwadrant>)}
              placeholder={actief.placeholder}
              className="w-full text-sm text-darkSlate border border-lightBg rounded-lg px-3 py-2 outline-none focus:border-midGreen"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-darkSlate/50 uppercase tracking-wide block mb-1.5">
              Korte toelichting (optioneel)
            </label>
            <AutoTextarea
              value={k[actief.toelichtingKey]}
              onChange={(v) => onUpdate({ [actief.toelichtingKey]: v } as Partial<Kwadrant>)}
              placeholder="Beschrijf kort wat je bedoelt, of geef een voorbeeld…"
              className="w-full text-sm text-darkSlate/70 border border-lightBg rounded-lg px-3 py-2 outline-none focus:border-midGreen leading-relaxed"
            />
          </div>
          <button
            onClick={() => onUpdate({ stap: 1 })}
            disabled={!startWaarde.trim()}
            className="w-full py-2.5 rounded-xl bg-darkRed text-white text-sm font-salmon hover:bg-darkRed/80 transition-colors disabled:opacity-40"
          >
            Naar het kwadrant →
          </button>
        </div>
      )}
    </div>
  );
}

// ── KwadrantGrid ──────────────────────────────────────────────────────────────

function KwadrantGrid({ kwadrant: k, onUpdate }: {
  kwadrant: Kwadrant;
  onUpdate: (updates: Partial<Kwadrant>) => void;
}) {
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: '1fr 3rem 1fr', gridTemplateRows: 'auto 3.5rem auto' }}
    >
      <VakBlok
        label="Kwaliteit" afgerond="rounded-tl-xl"
        kleurBorder="border-darkGreen" kleurBg="bg-darkGreen/10" kleurLabel="text-darkGreen" kleurNotitie="text-darkGreen/60"
        notitie="Bewust, vanuit kracht"
        waarde={k.kwaliteit} toelichting={k.kwaliteitToelichting}
        placeholder="Mijn kwaliteit" toelichtingPlaceholder="Wanneer straal ik dit uit?"
        onWaarde={(v) => onUpdate({ kwaliteit: v })} onToelichting={(v) => onUpdate({ kwaliteitToelichting: v })}
      />
      <div className="flex flex-col items-center justify-center text-center">
        <span className="text-[9px] font-medium text-darkSlate/40 leading-none">te veel</span>
        <span className="text-base text-darkSlate/25 leading-none mt-0.5">→</span>
      </div>
      <VakBlok
        label="Valkuil" afgerond="rounded-tr-xl"
        kleurBorder="border-darkRed" kleurBg="bg-darkRed/10" kleurLabel="text-darkRed" kleurNotitie="text-darkRed/60"
        notitie="Onbewust, vanuit angst"
        waarde={k.valkuil} toelichting={k.valkuilToelichting}
        placeholder="Doorgeslagen versie" toelichtingPlaceholder="Wanneer schiet het door?"
        onWaarde={(v) => onUpdate({ valkuil: v })} onToelichting={(v) => onUpdate({ valkuilToelichting: v })}
      />

      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm text-darkSlate/25 leading-none">↑</span>
          <span className="text-[9px] text-darkSlate/40 italic leading-none text-center">positief</span>
          <span className="text-[9px] text-darkSlate/40 italic leading-none text-center">tegendeel</span>
        </div>
      </div>
      <div />
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[9px] text-darkSlate/40 italic leading-none text-center">positief</span>
          <span className="text-[9px] text-darkSlate/40 italic leading-none text-center">tegendeel</span>
          <span className="text-sm text-darkSlate/25 leading-none">↓</span>
        </div>
      </div>

      <VakBlok
        label="Allergie" afgerond="rounded-bl-xl"
        kleurBorder="border-orange" kleurBg="bg-orange/10" kleurLabel="text-orange" kleurNotitie="text-orange/60"
        notitie="Wat jou irriteert in anderen"
        waarde={k.allergie} toelichting={k.allergieToelichting}
        placeholder="Wat irriteert mij" toelichtingPlaceholder="Hoe ziet dit eruit?"
        onWaarde={(v) => onUpdate({ allergie: v })} onToelichting={(v) => onUpdate({ allergieToelichting: v })}
      />
      <div className="flex flex-col items-center justify-center text-center">
        <span className="text-base text-darkSlate/25 leading-none mb-0.5">←</span>
        <span className="text-[9px] font-medium text-darkSlate/40 leading-none">te veel</span>
      </div>
      <VakBlok
        label="Uitdaging" afgerond="rounded-br-xl"
        kleurBorder="border-midGreen" kleurBg="bg-midGreen/10" kleurLabel="text-midGreen" kleurNotitie="text-midGreen/60"
        notitie="Positieve tegenhanger"
        waarde={k.uitdaging} toelichting={k.uitdagingToelichting}
        placeholder="Wat ik wil leren" toelichtingPlaceholder="Wat vraagt dit van mij?"
        onWaarde={(v) => onUpdate({ uitdaging: v })} onToelichting={(v) => onUpdate({ uitdagingToelichting: v })}
      />
    </div>
  );
}

function VakBlok({ label, kleurBorder, kleurBg, kleurLabel, kleurNotitie, notitie, afgerond, waarde, toelichting, placeholder, toelichtingPlaceholder, onWaarde, onToelichting }: {
  label: string;
  kleurBorder: string; kleurBg: string; kleurLabel: string; kleurNotitie: string;
  notitie: string; afgerond: string;
  waarde: string; toelichting: string;
  placeholder: string; toelichtingPlaceholder: string;
  onWaarde: (v: string) => void; onToelichting: (v: string) => void;
}) {
  return (
    <div className={`${afgerond} border-2 ${kleurBorder} ${kleurBg} p-3`}>
      <p className={`text-xs font-medium ${kleurLabel} uppercase tracking-wide mb-1.5`}>{label}</p>
      <AutoTextarea
        value={waarde}
        onChange={onWaarde}
        placeholder={placeholder}
        className="w-full text-sm font-semibold text-darkSlate bg-transparent outline-none placeholder-darkSlate/30 leading-snug"
      />
      <AutoTextarea
        value={toelichting}
        onChange={onToelichting}
        placeholder={toelichtingPlaceholder}
        className="w-full text-xs text-darkSlate/60 bg-transparent outline-none placeholder-darkSlate/20 mt-1.5 leading-relaxed"
      />
      <p className={`text-[10px] ${kleurNotitie} mt-2 italic`}>{notitie}</p>
    </div>
  );
}
