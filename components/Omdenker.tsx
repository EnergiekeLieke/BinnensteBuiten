'use client';

import { useState, useRef, useEffect } from 'react';
import { roepAnalyseAan } from '@/lib/huisstijl';

const LICHAAMSSIGNALEN = [
  { id: 'hartslag', label: 'Hartslag die omhoog gaat' },
  { id: 'kriebels', label: 'Kriebels of fladderen in je buik' },
  { id: 'ademhaling', label: 'Ademhaling die sneller of hoger gaat' },
  { id: 'kaak', label: 'Spanning in kaak, schouders of nek' },
  { id: 'handen', label: 'Warme of zweterige handen' },
  { id: 'onrust', label: 'Onrust of trillerigheid in je lijf' },
];

type Resultaat = {
  gevaarZin: string;
  kansZinnen: string[];
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
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className={className}
      style={{ resize: 'none', overflow: 'hidden' }}
    />
  );
}

export default function Omdenker({ initialSituatie = '', gevoel = '' }: { initialSituatie?: string; gevoel?: string }) {
  const [situatie, setSituatie] = useState(initialSituatie);
  const [signalen, setSignalen] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fout, setFout] = useState('');
  const [resultaat, setResultaat] = useState<Resultaat | null>(null);
  const [gekozenKans, setGekozenKans] = useState<string | null>(null);
  const [gekopieerd, setGekopieerd] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  function toggleSignaal(id: string) {
    setSignalen((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function omdenken() {
    if (!situatie.trim()) return;
    abortRef.current?.abort();
    setLoading(true);
    setFout('');
    setResultaat(null);
    setGekozenKans(null);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const signaalLabels = LICHAAMSSIGNALEN
        .filter((s) => signalen.includes(s.id))
        .map((s) => s.label.toLowerCase());

      const prompt = `Schrijf in correct Nederlands: grammaticaal juist, correcte spelling, correcte woordkeuze en geen anglicismen.

Geef uitsluitend JSON terug, geen andere tekst. Voorbeeld:
{"gevaarZin":"Dit voelt spannend, er kan iets misgaan","kansZinnen":["Mijn lichaam maakt zich klaar voor iets nieuws","Ik ben benieuwd wat dit gaat brengen","Deze energie helpt me zodra ik begin"]}

Iemand voelt lichamelijke spanning (zoals een hogere hartslag, kriebels of verhoogde alertheid) bij de volgende situatie: "${situatie}"
${signaalLabels.length ? `Lichaamssignalen die opspelen: ${signaalLabels.join(', ')}.` : ''}
${gevoel ? `Achtergrond: deze spanning hangt samen met het gevoel dat iemand normaal gesproken vermijdt, namelijk: ${gevoel}` : ''}

Spanning en excitement voelen fysiologisch bijna identiek. Het verschil zit in het label dat je aan de sensatie geeft.

gevaarZin = één korte, herkenbare zin (max 15 woorden) die verwoordt hoe deze spanning nu vaak wordt geïnterpreteerd, vanuit "gevaar" of "ik ben zenuwachtig".
kansZinnen = 3 korte alternatieve zinnen (max 15 woorden elk), in de ik-vorm, die dezelfde lichamelijke sensatie herlabelen vanuit "mijn lichaam maakt zich klaar" of "ik ben benieuwd, dit is een kans". Varieer in toon zodat iemand er een kan claimen als eigen sleutelzin.
Gebruik nooit een m-dash.`;

      const raw = await roepAnalyseAan(prompt, 500, ctrl.signal);
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.gevaarZin && Array.isArray(parsed.kansZinnen) && parsed.kansZinnen.length > 0) {
          setResultaat({ gevaarZin: parsed.gevaarZin, kansZinnen: parsed.kansZinnen.slice(0, 3) });
        } else {
          setFout('AI gaf een onverwacht antwoord. Probeer het opnieuw.');
        }
      } else {
        setFout('AI gaf een onverwacht antwoord. Probeer het opnieuw.');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setFout('Omdenken mislukt. Probeer het opnieuw.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function kopieerSleutelzin() {
    if (!gekozenKans) return;
    try {
      await navigator.clipboard.writeText(gekozenKans);
      setGekopieerd(true);
      setTimeout(() => setGekopieerd(false), 2000);
    } catch {
      // clipboard niet beschikbaar
    }
  }

  function opnieuw() {
    setSituatie('');
    setSignalen([]);
    setResultaat(null);
    setGekozenKans(null);
    setFout('');
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="text-center">
        <h1 className="font-salmon text-2xl text-darkSlate mb-1">Omdenker</h1>
        <p className="text-midGreen italic text-sm">Spanning of excitement? Het verschil zit in het label.</p>
      </div>

      <div className="bg-lightBg2 rounded-2xl p-4 border border-orange/20 text-sm text-darkSlate space-y-2">
        <p>Spanning en excitement voelen in je lijf bijna hetzelfde: een hartslag die omhoogschiet, kriebels in je buik, verhoogde alertheid.</p>
        <p>Het verschil zit in het label dat je erop plakt. &ldquo;Dit voelt spannend&rdquo; of &ldquo;ik ben zenuwachtig&rdquo; voelt als gevaar. &ldquo;Mijn lichaam maakt zich klaar&rdquo; of &ldquo;ik ben benieuwd&rdquo; voelt als een kans.</p>
        <p>Dezelfde sensatie, een ander verhaal.</p>
      </div>

      {!resultaat && !loading && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-darkSlate/50 block mb-2">Welke lichaamssignalen merk je op? (optioneel)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LICHAAMSSIGNALEN.map((s) => {
                const actief = signalen.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSignaal(s.id)}
                    className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                      actief ? 'border-darkGreen bg-darkGreen/10 text-darkGreen' : 'border-lightBg text-darkSlate/70 hover:border-midGreen'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs text-darkSlate/50 block mb-1">Waarin voel je dit nu, of straks?</label>
            <AutoTextarea
              value={situatie}
              onChange={setSituatie}
              placeholder="Bijv. een moeilijk gesprek, een nieuwe stap, een presentatie…"
              className="w-full text-sm text-darkSlate border border-lightBg rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-midGreen"
            />
          </div>

          {fout && <p className="text-sm text-darkRed text-center">{fout}</p>}

          <button
            onClick={omdenken}
            disabled={!situatie.trim()}
            className="w-full py-3 rounded-xl bg-darkRed text-cream text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-darkRed/80 transition-colors"
          >
            ✦ Denk deze spanning om
          </button>
        </div>
      )}

      {loading && (
        <p className="text-center text-sm text-midGreen italic">De omdenker denkt na…</p>
      )}

      {resultaat && (
        <div className="space-y-4">
          <div className="bg-darkRed/10 rounded-xl p-4 border border-darkRed/20">
            <p className="text-[10px] font-medium text-darkRed uppercase tracking-wide mb-1">Zo voelt het nu</p>
            <p className="text-sm text-darkSlate/80 italic">&ldquo;{resultaat.gevaarZin}&rdquo;</p>
          </div>

          <div>
            <p className="text-xs text-darkSlate/50 mb-2">Dezelfde sensatie, een andere lezing. Kies de zin die het beste bij je past:</p>
            <div className="flex flex-col gap-2">
              {resultaat.kansZinnen.map((zin, i) => (
                <button
                  key={i}
                  onClick={() => setGekozenKans(zin)}
                  className={`text-left text-sm p-3 rounded-xl border transition-colors ${
                    gekozenKans === zin ? 'bg-darkGreen text-cream border-darkGreen' : 'border-lightBg text-darkSlate hover:border-midGreen bg-white'
                  }`}
                >
                  {zin}
                </button>
              ))}
            </div>
          </div>

          {gekozenKans && (
            <div className="bg-darkGreen/10 rounded-xl p-4 border border-darkGreen/20 text-center space-y-2">
              <p className="text-[10px] font-medium text-darkGreen uppercase tracking-wide">Jouw sleutelzin</p>
              <p className="text-sm text-darkGreen font-medium italic">&ldquo;{gekozenKans}&rdquo;</p>
              <button
                onClick={kopieerSleutelzin}
                className="text-xs text-darkGreen underline underline-offset-2 hover:text-darkGreen/70"
              >
                {gekopieerd ? 'Gekopieerd!' : 'Kopieer sleutelzin'}
              </button>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              onClick={opnieuw}
              className="text-sm text-midGreen hover:text-darkGreen underline underline-offset-2"
            >
              Opnieuw beginnen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
