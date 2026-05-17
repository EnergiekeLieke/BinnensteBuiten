'use client';

import { useState, useRef, useEffect } from 'react';
import { roepAnalyseAan } from '@/lib/huisstijl';

const VRAGEN = [
  {
    vraag: 'Wat zegt jouw stemmetje het vaakst?',
    hint: 'Kies wat het meest klopt. Max 3.',
    opties: [
      '"Dat was niet goed genoeg"',
      '"Wat zullen anderen wel denken?"',
      '"Je bent te veel!"',
      '"Doe maar gewoon, dan doe je al gek genoeg"',
      '"Dit had je allang moeten weten"',
      '"Pas op, dit gaat vast fout"',
    ],
  },
  {
    vraag: 'Wanneer is het het hardst?',
    hint: 'Kies de momenten die het meest herkenbaar zijn. Max 3.',
    opties: [
      'Als ik iets nieuws begin of mezelf laat zien',
      'Als ik fouten maak of iets misloopt',
      'Als ik rust neem en niets productiefs doe',
      'Als ik mezelf vergelijk met anderen',
      'Als ik nee zeg, of wil zeggen',
      'Als ik iets voor mezelf wil zonder duidelijke reden',
    ],
  },
  {
    vraag: 'Hoe klinkt het stemmetje?',
    hint: 'Wat past het best bij de toon? Max 3.',
    opties: [
      'Streng en kortaf',
      'Zeurend en altijd aanwezig',
      'Paniekerig en alarmerend',
      'Zuchtend en teleurgesteld',
      'Koud en afstandelijk',
      'Sarcastisch, een beetje cynisch',
    ],
  },
  {
    vraag: 'Wat doet het stemmetje met je?',
    hint: 'Hoe reageer jij als het begint? Max 3.',
    opties: [
      'Ik ga harder werken om het te bewijzen',
      'Ik trek me terug of stel dingen uit',
      'Ik ga voor anderen zorgen in plaats van voor mezelf',
      'Ik word klein en zwijg',
      'Ik ga pleasen en aanpassen',
      'Ik ga twijfelen en piekeren',
    ],
  },
];

const PERSONAGES = [
  { label: 'De strenge schooljuf met een liniaal', emoji: '📏' },
  { label: 'De zuchtende tante die altijd weet hoe het beter kan', emoji: '😮‍💨' },
  { label: 'De paniekerige buurvrouw die altijd het ergste verwacht', emoji: '😰' },
  { label: 'De koude baas die nooit tevreden is', emoji: '🧊' },
  { label: 'De bezorgde oma die je constant waarschuwt', emoji: '👵' },
];

interface Resultaat {
  naam: string;
  karakter: string;
  uitspraak: string;
  cliffhanger: string;
}

function parseResultaat(tekst: string): Resultaat {
  // Markdown code blocks weghalen als de AI die toevoegt
  const schoon = tekst.replace(/```[\s\S]*?```/g, '').replace(/`/g, '').trim();

  const velden: Record<string, string> = {};
  let huidig: string | null = null;
  const buffer: string[] = [];

  const opslaan = () => {
    if (!huidig || buffer.length === 0) return;
    velden[huidig] = buffer.join('\n').trim().replace(/^["']|["']$/g, '');
  };

  for (const regel of schoon.split('\n')) {
    const match = regel.match(/^(NAAM|KARAKTER|UITSPRAAK|CLIFFHANGER):\s*(.*)/i);
    if (match) {
      opslaan();
      huidig = match[1].toUpperCase();
      buffer.length = 0;
      if (match[2].trim()) buffer.push(match[2].trim());
    } else if (huidig) {
      buffer.push(regel);
    }
  }
  opslaan();

  return {
    naam:        velden['NAAM']        || 'Jouw stemmetje',
    karakter:    velden['KARAKTER']    || '',
    uitspraak:   velden['UITSPRAAK']   || '',
    cliffhanger: velden['CLIFFHANGER'] || '',
  };
}

function MultiSelect({ opties, selecties, onChange }: {
  opties: string[];
  selecties: string[];
  onChange: (s: string[]) => void;
}) {
  const toggle = (optie: string) => {
    if (selecties.includes(optie)) {
      onChange(selecties.filter(s => s !== optie));
    } else if (selecties.length < 3) {
      onChange([...selecties, optie]);
    }
  };

  return (
    <div className="space-y-2">
      {opties.map((optie) => {
        const idx = selecties.indexOf(optie);
        const geselecteerd = idx !== -1;
        const vol = selecties.length >= 3;
        return (
          <button
            key={optie}
            type="button"
            onClick={() => toggle(optie)}
            disabled={!geselecteerd && vol}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${
              geselecteerd
                ? 'border-darkGreen bg-darkGreen/5 text-darkSlate'
                : vol
                  ? 'border-lightBg bg-white text-darkSlate/40 cursor-not-allowed'
                  : 'border-lightBg bg-white text-darkSlate hover:border-midGreen hover:bg-midGreen/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold transition-colors ${
                geselecteerd ? 'bg-darkGreen text-cream' : 'border-2 border-lightBg'
              }`}>
                {geselecteerd ? idx + 1 : ''}
              </span>
              <span>{optie}</span>
            </div>
          </button>
        );
      })}
      <p className="text-xs text-darkSlate/40 text-center pt-1">{selecties.length}/3 gekozen</p>
    </div>
  );
}

export default function StemmetjeQuiz() {
  const [stap, setStap] = useState(0);
  const [selecties, setSelecties] = useState<string[][]>([[], [], [], []]);
  const [eigenWoorden, setEigenWoorden] = useState('');
  const [personage, setPersonage] = useState('');
  const [voornaam, setVoornaam] = useState('');
  const [emailAdres, setEmailAdres] = useState('');
  const [akkoord, setAkkoord] = useState(false);
  const [resultaat, setResultaat] = useState<Resultaat | null>(null);
  const [loading, setLoading] = useState(false);
  const [fout, setFout] = useState('');

  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  // stap 0=intro, 1-4=vragen, 5=eigen woorden, 6=personage, 7=emailgate
  const TOTAAL = 7;
  const voortgang = Math.round((Math.min(stap, TOTAAL) / TOTAAL) * 100);

  const genereer = async () => {
    if (!voornaam.trim() || !emailAdres.trim()) { setFout('Vul je naam en e-mailadres in.'); return; }
    if (!emailAdres.includes('@')) { setFout('Vul een geldig e-mailadres in.'); return; }
    if (!akkoord) { setFout('Vink het vakje aan om door te gaan.'); return; }
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setFout('');
    try {
      const prompt = `Je bent een speelse Nederlandse schrijver. Genereer het karakter van het 'strenge stemmetje' van ${voornaam.trim()}.

Wat het stemmetje het vaakst zegt: ${selecties[0].join(' / ') || 'niet ingevuld'}
Wanneer het het hardst is: ${selecties[1].join(' / ') || 'niet ingevuld'}
Hoe het klinkt: ${selecties[2].join(' / ') || 'niet ingevuld'}
Wat het doet: ${selecties[3].join(' / ') || 'niet ingevuld'}
${eigenWoorden.trim() ? `In eigen woorden: "${eigenWoorden.trim()}"` : ''}
${personage ? `Lijkt het meest op: ${personage}` : ''}

Geef dit stemmetje een naam en karakter. Gebruik bij voorkeur een vrouwelijke Nederlandse naam die past bij de toon. Alleen een mannelijke naam als de toon daar echt om vraagt. Combineer met een beschrijvend bijvoeglijk naamwoord dat begint met dezelfde letter als de naam (alliteratie). Voorbeelden van goede namen: "Strenge Stella", "Giftige Gerda", "Kritische Katrien", "Haastige Jet", "Malle Beppie". Zorg dat de alliteratie klinkt en de naam direct herkenbaar is. De naam begint NOOIT met een lidwoord ("de", "het", "een").

Stijlregels:
- Speels, warm en een beetje humoristisch. Nooit kwetsend.
- Gebruik NOOIT een m-dash (—). Gebruik een komma of een dubbele punt.
- Spreek ${voornaam.trim()} aan als dat past.

Geef EXACT dit format terug, niets anders, geen extra tekst:

NAAM: [naam + descriptor, bijv. "Strenge Stella"]
KARAKTER: [2-3 levendige zinnen: wie is dit personage, hoe ziet het eruit, wat is zijn/haar typische manier van doen]
UITSPRAAK: "[één zin die dit stemmetje typisch zegt, in de directe stem van het stemmetje zelf]"
CLIFFHANGER: [1-2 zinnen die nieuwsgierigheid wekken naar waar dit stemmetje vandaan komt en wat het betekent dat je haar nu herkent]`;

      // Stemmetje genereren
      const tekst = await roepAnalyseAan(prompt, 800, controller.signal);
      const res = parseResultaat(tekst);

      // Tag afleiden: eerste woord dat geen lidwoord is ("Strenge Stella" → "stemmetje-strenge")
      const lidwoorden = new Set(['de', 'het', 'een']);
      const adjective = res.naam.split(' ').find(w => !lidwoorden.has(w.toLowerCase())) ?? res.naam.split(' ')[0];
      const tag = `stemmetje-${adjective.toLowerCase()}`;

      // MailBlue registreren met tag (niet-blokkerend)
      fetch('/api/mailblue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voornaam: voornaam.trim(), email: emailAdres.trim(), tag, naam: res.naam }),
      }).catch(() => null);

      setResultaat(res);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') return;
      setFout(e instanceof Error ? e.message : 'Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const opnieuw = () => {
    setResultaat(null); setStap(0);
    setSelecties([[], [], [], []]); setEigenWoorden(''); setPersonage('');
    setVoornaam(''); setEmailAdres(''); setAkkoord(false); setFout('');
  };

  // Resultaatscherm
  if (resultaat) {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="text-center space-y-1">
          <p className="text-xs text-midGreen uppercase tracking-widest font-bold">Maak kennis met...</p>
          <h1 className="font-salmon text-4xl text-darkRed leading-tight">{resultaat.naam}</h1>
          <p className="text-sm text-darkSlate/60 italic">het stemmetje van {voornaam}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-lightBg">
          <p className="text-sm text-darkSlate leading-relaxed">{resultaat.karakter}</p>
        </div>

        {resultaat.uitspraak && (
          <div className="bg-darkRed/5 rounded-2xl p-5 border-l-4 border-darkRed">
            <p className="text-[10px] font-bold text-darkRed uppercase tracking-widest mb-2">Typische uitspraak</p>
            <p className="text-sm text-darkSlate italic leading-relaxed">"{resultaat.uitspraak}"</p>
          </div>
        )}

        {resultaat.cliffhanger && (
          <div className="bg-lightBg2 rounded-2xl p-5 border border-orange/20 space-y-4">
            <p className="text-sm text-darkSlate leading-relaxed">{resultaat.cliffhanger}</p>
            <a
              href="/"
              className="block w-full text-center py-3.5 rounded-xl bg-darkGreen text-cream font-salmon text-base hover:bg-darkGreen/90 transition-colors"
            >
              Aan de slag met jouw stemmetje →
            </a>
          </div>
        )}

        <div className="flex justify-center">
          <button onClick={opnieuw} className="text-sm text-midGreen hover:text-darkGreen underline underline-offset-2">
            Opnieuw beginnen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">

      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="font-salmon text-2xl text-darkSlate">Wie fluistert er in jouw hoofd?</h1>
        <p className="text-midGreen italic text-sm">Ontdek en benoem jouw strenge stemmetje</p>
      </div>

      {/* Voortgang */}
      {stap > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-darkSlate/50">
            <span>
              {stap <= 4 ? `Vraag ${stap} van 4`
                : stap === 5 ? 'Jouw eigen woorden'
                : stap === 6 ? 'Het uiterlijk'
                : 'Bijna klaar'}
            </span>
            <span>{voortgang}%</span>
          </div>
          <div className="w-full bg-lightBg rounded-full h-2">
            <div className="bg-darkRed h-2 rounded-full transition-all duration-300" style={{ width: `${voortgang}%` }} />
          </div>
        </div>
      )}

      {/* Stap 0: Intro */}
      {stap === 0 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-lightBg space-y-3">
            <div className="text-4xl">🎭</div>
            <p className="text-sm text-darkSlate leading-relaxed">
              Dat stemmetje dat fluistert: niet goed genoeg, te laat, anderen doen het beter. Je kent het.
            </p>
            <p className="text-sm text-darkSlate leading-relaxed">
              In 6 korte vragen ontdek je wie dat stemmetje is, en krijgt het een naam. Want een stemmetje met een naam heeft minder grip op jou.
            </p>
            <p className="text-sm font-bold text-darkRed">Wie woont er in jouw hoofd?</p>
          </div>
          <button
            onClick={() => setStap(1)}
            className="w-full py-4 rounded-xl bg-darkRed text-cream font-salmon text-lg hover:bg-darkRed/90 transition-colors"
          >
            Ik wil het weten →
          </button>
        </div>
      )}

      {/* Stap 1-4: Meerkeuzevragen */}
      {stap >= 1 && stap <= 4 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-lightBg space-y-4">
          <div>
            <h2 className="font-salmon text-xl text-darkSlate mb-1">{VRAGEN[stap - 1].vraag}</h2>
            <p className="text-xs text-midGreen">{VRAGEN[stap - 1].hint}</p>
          </div>
          <MultiSelect
            opties={VRAGEN[stap - 1].opties}
            selecties={selecties[stap - 1]}
            onChange={(s) => setSelecties(prev => prev.map((x, i) => i === stap - 1 ? s : x))}
          />
        </div>
      )}

      {/* Stap 5: Eigen woorden */}
      {stap === 5 && (
        <div className="bg-lightBg2 rounded-2xl p-5 border border-orange/20 space-y-3">
          <div>
            <h2 className="font-salmon text-xl text-darkSlate mb-1">Jouw eigen woorden</h2>
            <p className="text-sm text-midGreen">Optioneel, maar hoe concreter, hoe persoonlijker de naam wordt.</p>
          </div>
          <label className="text-sm font-medium text-darkSlate block">
            💛 Wat zegt jouw stemmetje woordelijk als het echt loslaat?
          </label>
          <textarea
            value={eigenWoorden}
            onChange={(e) => setEigenWoorden(e.target.value)}
            className="w-full rounded-xl border border-lightBg bg-white p-3 text-sm text-darkSlate resize-none focus:outline-none focus:ring-2 focus:ring-midGreen"
            rows={3}
            placeholder={`Bijv: "Je denkt toch niet dat dit gaat lukken? Anderen zijn zoveel beter dan jij."`}
          />
        </div>
      )}

      {/* Stap 6: Personage */}
      {stap === 6 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-lightBg space-y-4">
          <div>
            <h2 className="font-salmon text-xl text-darkSlate mb-1">Wie lijkt het meest op haar?</h2>
            <p className="text-sm text-midGreen">Optioneel. Kies het personage dat het best bij jouw stemmetje past.</p>
          </div>
          <div className="space-y-2">
            {PERSONAGES.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setPersonage(personage === p.label ? '' : p.label)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                  personage === p.label
                    ? 'border-darkGreen bg-darkGreen/5 text-darkSlate'
                    : 'border-lightBg bg-white text-darkSlate hover:border-midGreen'
                }`}
              >
                <span className="mr-2">{p.emoji}</span>{p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stap 7: E-mailgate */}
      {stap === 7 && (
        <div className="space-y-4">
          <div className="bg-darkRed/5 rounded-2xl p-5 border border-darkRed/20 text-center space-y-2">
            <div className="text-4xl">🎭</div>
            <h2 className="font-salmon text-xl text-darkSlate">Jouw stemmetje heeft een naam...</h2>
            <p className="text-sm text-darkSlate/70">Vul je gegevens in om kennis te maken.</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-lightBg space-y-4">
            <div>
              <label className="text-sm font-medium text-darkSlate block mb-1.5">Voornaam</label>
              <input
                type="text"
                value={voornaam}
                onChange={(e) => setVoornaam(e.target.value)}
                placeholder="Jouw voornaam"
                className="w-full rounded-xl border border-lightBg bg-lightBg2 px-3 py-2.5 text-sm text-darkSlate focus:outline-none focus:ring-2 focus:ring-midGreen"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-darkSlate block mb-1.5">E-mailadres</label>
              <input
                type="email"
                value={emailAdres}
                onChange={(e) => setEmailAdres(e.target.value)}
                placeholder="jouw@email.nl"
                className="w-full rounded-xl border border-lightBg bg-lightBg2 px-3 py-2.5 text-sm text-darkSlate focus:outline-none focus:ring-2 focus:ring-midGreen"
              />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={akkoord}
                onChange={(e) => setAkkoord(e.target.checked)}
                className="mt-0.5 shrink-0 w-4 h-4 accent-darkGreen cursor-pointer"
              />
              <span className="text-xs text-darkSlate/60 leading-relaxed">
                Ja, ik geef Energieke Lieke toestemming om mij e-mails te sturen over het BinnensteBuiten Spel™. Ik kan me op elk moment uitschrijven via de link onderaan elke mail.
              </span>
            </label>
          </div>
          {fout && <p className="text-darkRed text-sm text-center">{fout}</p>}
        </div>
      )}

      {/* Navigatie */}
      <div className="flex gap-3">
        {stap > 0 && (
          <button
            onClick={() => { setStap(s => s - 1); setFout(''); }}
            disabled={loading}
            className="flex-1 py-3.5 rounded-xl border border-midGreen text-midGreen font-salmon text-base hover:bg-midGreen/10 transition-colors disabled:opacity-50"
          >
            ← Vorige
          </button>
        )}
        {stap >= 1 && stap < 7 && (
          <button
            onClick={() => setStap(s => s + 1)}
            disabled={stap >= 1 && stap <= 4 && selecties[stap - 1].length === 0}
            className="flex-1 py-3.5 rounded-xl bg-darkGreen text-cream font-salmon text-base hover:bg-darkGreen/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Volgende →
          </button>
        )}
        {stap === 7 && (
          <button
            onClick={genereer}
            disabled={loading || !voornaam.trim() || !emailAdres.trim() || !akkoord}
            className="flex-1 py-3.5 rounded-xl bg-darkRed text-cream font-salmon text-base hover:bg-darkRed/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Jouw stemmetje wordt geboren...' : 'Ontmoet mijn stemmetje →'}
          </button>
        )}
      </div>

    </div>
  );
}
