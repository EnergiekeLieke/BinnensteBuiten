'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { streamAnalyse, roepAnalyseAan, vervangMDashes } from '@/lib/huisstijl';

const LoyaliteitsBriefPdfKnop = dynamic(
  () => import('./LoyaliteitsBriefPdf').then((m) => m.LoyaliteitsBriefPdfKnop),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);

type Status = 'leeft' | 'geen-contact' | 'overleden';

export default function LoyaliteitsBrief() {
  const [naam, setNaam] = useState('');
  const [relatie, setRelatie] = useState('');
  const [status, setStatus] = useState<Status>('leeft');
  const [patroon, setPatroon] = useState('');
  const [herinnering, setHerinnering] = useState('');
  const [dankbaar, setDankbaar] = useState('');
  const [verboden, setVerboden] = useState('');
  const [keuze, setKeuze] = useState('');
  const [loslaten, setLoslaten] = useState('');
  const [jouwNaam, setJouwNaam] = useState('');
  const [systemischeZinnen, setSystemischeZinnen] = useState<string[]>([]);
  const [geselecteerdeZinnen, setGeselecteerdeZinnen] = useState<string[]>([]);
  const [zinnenLoading, setZinnenLoading] = useState(false);
  const [zinnenFout, setZinnenFout] = useState('');
  const [brief, setBrief] = useState('');
  const [loading, setLoading] = useState(false);
  const [fout, setFout] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const kanGenereren = naam.trim() && relatie.trim() && dankbaar.trim() && keuze.trim();

  function toggleZin(zin: string) {
    setGeselecteerdeZinnen((prev) =>
      prev.includes(zin) ? prev.filter((z) => z !== zin) : [...prev, zin]
    );
  }

  async function geneerZinnen() {
    if (!kanGenereren) return;
    abortRef.current?.abort();
    setZinnenLoading(true);
    setZinnenFout('');
    setSystemischeZinnen([]);
    setGeselecteerdeZinnen([]);
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const prompt = `Genereer 6 systemische zinnen in het Nederlands die passen bij de onderstaande situatie.

Gebruik als achtergrondkennis en inspiratiebron:
- "Zinnen die de ziel raken" van Elmer Hendrix: korte, directe zinnen die een systemische waarheid uitspreken en het zenuwstelsel tot rust brengen.
- Het werk van Els van Steijn (o.a. de Fonteijn): systemisch werk met loyaliteitspatronen, familiesystemen en het herstellen van de juiste volgorde.
- "Het is niet met jou begonnen" en het bijbehorende werkboek van Mark Wolynn: geïnternaliseerd trauma dat via de familielijn is doorgegeven. De kerngedachte: veel van onze patronen, angsten en beperkingen begonnen niet bij onszelf, maar bij onze ouders of grootouders. Helende zinnen geven het patroon terug aan de oorsprong en maken ruimte voor een nieuw verhaal.

Kenmerken van goede systemische zinnen:
- Kort en krachtig, zelden meer dan 1-2 zinnen
- Benoemen een eerlijke waarheid over verbinding, loyaliteit of overname
- Geven iets terug aan de oorsprong zonder oordeel
- Erkennen wat was, zonder erin vast te blijven
- Zijn liefdevol en bevrijdend tegelijk
- Geschreven in de ik-persoon

Situatie:
Persoon: ${naam} (${relatie})
Overgenomen patroon: ${patroon || 'niet ingevuld'}
Wat verboden was uit loyaliteit: ${verboden || 'niet ingevuld'}
Kiest nu voor: ${keuze}
Laat achter: ${loslaten || 'niet ingevuld'}

Geef uitsluitend JSON terug, geen andere tekst. Formaat: {"zinnen":["zin 1","zin 2","zin 3","zin 4","zin 5","zin 6"]}

Geen m-dashes. Begin geen zin met "En". Schrijf in de ik-persoon.`;

    try {
      const raw = await roepAnalyseAan(prompt, 400, ctrl.signal);
      const match = raw.match(/\{[\s\S]*?\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed.zinnen)) {
          setSystemischeZinnen(parsed.zinnen.map(vervangMDashes));
        } else {
          setZinnenFout('Onverwacht antwoord. Probeer opnieuw.');
        }
      } else {
        setZinnenFout('Kon geen zinnen ophalen. Probeer opnieuw.');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setZinnenFout('Zinnen genereren mislukt. Probeer opnieuw.');
      }
    } finally {
      setZinnenLoading(false);
    }
  }

  async function schrijfBrief() {
    if (!kanGenereren) return;
    abortRef.current?.abort();
    setLoading(true);
    setBrief('');
    setFout('');
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const statusZin =
      status === 'overleden'
        ? `${naam} is al overleden`
        : status === 'geen-contact'
        ? `${naam} is nog in leven maar er is geen contact meer`
        : `${naam} leeft nog en er is contact`;

    const prompt = `Schrijf een persoonlijke brief in het Nederlands. De stijl is warm en poëtisch: zinnen mogen vloeiend zijn en 1-2 volledige zinnen per gedachte bevatten. Gebruik witruimte tussen gedachteblokken, maar schrijf geen losse 3-woordfragmenten. De brief voelt intiem, zacht en oprecht, niet als een lijst.

Begin geen enkele zin met het woord "En". Gebruik geen m-dashes. Geen markdown, geen sterretjes, gewone tekst met regelafbrekingen.

De brief volgt deze emotionele boog:
1. Herkenning: ik zie jou, ik begrijp je (gebruik de herinnering als ankerpunt als die er is)
2. Dankbaarheid: wat ik van jou heb meegekregen
3. De loyaliteit: hoe ik jou heb meegedragen, bewust of onbewust, het patroon benoemen zonder oordeel
4. De kosten: wat ik mezelf daardoor heb ontzegd
5. De keuze: wat ik nu kies, niet als verraad maar als eerbetoon aan wie ik word
6. Warme afsluiting (2-3 regels)

Begin met: Lieve ${naam},
Sluit af met een lege regel en dan: Liefs, ${jouwNaam || '...'}

Schrijf in de ik-persoon. Spreek de persoon aan met "je/jij".

Context:
Persoon: ${naam} (${relatie}). ${statusZin}.
Overgenomen patroon: ${patroon || 'niet ingevuld'}
Concreet beeld of herinnering: ${herinnering || 'niet ingevuld'}
Dankbaar voor: ${dankbaar}
Verboden uit loyaliteit: ${verboden || 'niet ingevuld'}
Kiest nu voor: ${keuze}
Laat achter: ${loslaten || 'niet ingevuld'}${geselecteerdeZinnen.length > 0 ? `

Verwerk de volgende systemische zinnen op een natuurlijke plek in de brief. Laat ze landen waar ze het meest kloppen, niet als opsomming maar als deel van de tekst:
${geselecteerdeZinnen.map((z) => `- "${z}"`).join('\n')}` : ''}`;

    try {
      let acc = '';
      await streamAnalyse(
        prompt,
        1500,
        (chunk) => { acc += chunk; setBrief(acc); },
        undefined,
        ctrl.signal
      );
      setBrief(vervangMDashes(acc));
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setFout('Brief schrijven mislukt. Probeer het opnieuw.');
      }
    } finally {
      setLoading(false);
    }
  }

  function opnieuwBeginnen() {
    if (!window.confirm('Weet je zeker dat je opnieuw wilt beginnen? Je brief en invoer gaan verloren.')) return;
    abortRef.current?.abort();
    setBrief('');
    setLoading(false);
    setZinnenLoading(false);
    setNaam(''); setRelatie(''); setStatus('leeft');
    setPatroon(''); setHerinnering(''); setDankbaar('');
    setVerboden(''); setKeuze(''); setLoslaten(''); setJouwNaam('');
    setSystemischeZinnen([]); setGeselecteerdeZinnen([]);
    setZinnenFout('');
  }

  const inputKlasse = 'w-full rounded-xl border border-lightBg px-3 py-2 text-sm text-darkSlate placeholder-darkSlate/30 bg-white focus:outline-none focus:border-orange/60';
  const textareaKlasse = `${inputKlasse} resize-none`;

  return (
    <div className="space-y-6 max-w-lg mx-auto">

      <div className="flex items-center gap-3 mb-1">
        <Link href="/keuze-kompas/oost" className="text-xs text-midGreen hover:text-darkGreen underline underline-offset-2">
          ← Richting Oost
        </Link>
      </div>

      <div className="text-center">
        <h1 className="font-salmon text-2xl text-darkSlate mb-1">Loyaliteitsbrief</h1>
        <p className="text-midGreen italic text-sm">Richting Oost · Keuze Kompas</p>
      </div>

      <div className="bg-lightBg2 rounded-2xl p-4 border border-orange/20 text-sm text-darkSlate space-y-2">
        <p>Soms draag je iemand mee die je liefhebt, en houd je jezelf daardoor klein. Niet met opzet, maar uit loyaliteit.</p>
        <p>Schrijf een brief aan die persoon. Erken wat je van hen hebt meegekregen, benoem wat je jezelf daardoor ontzegt, en geef jezelf toestemming om verder te gaan.</p>
      </div>

      <div className="space-y-4">

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-darkSlate mb-1">Naam van de persoon</label>
            <input type="text" value={naam} onChange={(e) => setNaam(e.target.value)} placeholder="bijv. mama" className={inputKlasse} />
          </div>
          <div>
            <label className="block text-xs font-medium text-darkSlate mb-1">Jouw relatie tot hen</label>
            <input type="text" value={relatie} onChange={(e) => setRelatie(e.target.value)} placeholder="bijv. mijn moeder" className={inputKlasse} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-darkSlate mb-2">Is deze persoon er nog?</label>
          <div className="flex flex-col gap-2">
            {([
              ['leeft', 'Ja, we hebben contact'] as [Status, string],
              ['geen-contact', 'Ja, maar we hebben geen contact meer'] as [Status, string],
              ['overleden', 'Nee, hij/zij is overleden'] as [Status, string],
            ]).map(([val, label]) => (
              <label key={val} className="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name="status" value={val} checked={status === val} onChange={() => setStatus(val)} className="accent-darkRed" />
                <span className="text-sm text-darkSlate">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-darkSlate mb-1">Welk patroon heb je onbewust van hen overgenomen?</label>
          <textarea value={patroon} onChange={(e) => setPatroon(e.target.value)} placeholder="bijv. altijd doorgaan, niet genieten, voor iedereen zorgen…" rows={2} className={textareaKlasse} />
        </div>

        <div>
          <label className="block text-xs font-medium text-darkSlate mb-1">Een concreet beeld of herinnering bij deze persoon</label>
          <textarea value={herinnering} onChange={(e) => setHerinnering(e.target.value)} placeholder="bijv. hoe ze altijd klaarstond voor iedereen, nooit stilzat…" rows={2} className={textareaKlasse} />
        </div>

        <div>
          <label className="block text-xs font-medium text-darkSlate mb-1">Wat heb je van hen geleerd, of waarvoor wil je bedanken? <span className="text-darkRed">*</span></label>
          <textarea value={dankbaar} onChange={(e) => setDankbaar(e.target.value)} placeholder="bijv. doorzettingsvermogen, het gevoel van geborgenheid…" rows={2} className={textareaKlasse} />
        </div>

        <div>
          <label className="block text-xs font-medium text-darkSlate mb-1">Wat heb je jezelf verboden uit loyaliteit aan hen?</label>
          <textarea value={verboden} onChange={(e) => setVerboden(e.target.value)} placeholder="bijv. genieten, rusten, voor mezelf kiezen…" rows={2} className={textareaKlasse} />
        </div>

        <div>
          <label className="block text-xs font-medium text-darkSlate mb-1">Waarvoor kies jij nu? <span className="text-darkRed">*</span></label>
          <textarea value={keuze} onChange={(e) => setKeuze(e.target.value)} placeholder="bijv. vrijheid, plezier, mijn leven voluit leven…" rows={2} className={textareaKlasse} />
        </div>

        <div>
          <label className="block text-xs font-medium text-darkSlate mb-1">Welk oud gedrag of gevoel laat je achter je?</label>
          <textarea value={loslaten} onChange={(e) => setLoslaten(e.target.value)} placeholder="bijv. de overtuiging dat ik moet doorgaan tot ik breek…" rows={2} className={textareaKlasse} />
        </div>

        <div>
          <label className="block text-xs font-medium text-darkSlate mb-1">Jouw naam (voor de ondertekening)</label>
          <input type="text" value={jouwNaam} onChange={(e) => setJouwNaam(e.target.value)} placeholder="bijv. Lieke" className={inputKlasse} />
        </div>

      </div>

      {/* Systemische zinnen */}
      <div className="border-t border-lightBg pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-darkSlate">Systemische zinnen</p>
            <p className="text-xs text-darkSlate/50">Optioneel: laat AI zinnen genereren die passen bij jouw situatie</p>
          </div>
          <button
            onClick={geneerZinnen}
            disabled={!kanGenereren || zinnenLoading}
            className="flex-shrink-0 ml-3 px-3 py-1.5 rounded-lg border border-darkGreen text-darkGreen text-xs hover:bg-darkGreen/5 transition-colors disabled:opacity-40"
          >
            {zinnenLoading ? 'Bezig…' : systemischeZinnen.length > 0 ? 'Opnieuw genereren' : 'Genereer zinnen'}
          </button>
        </div>

        {zinnenFout && <p className="text-xs text-darkRed">{zinnenFout}</p>}

        {systemischeZinnen.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-darkSlate/50">Vink aan welke zinnen je in de brief wilt verwerken</p>
            {systemischeZinnen.map((zin, i) => {
              const geselecteerd = geselecteerdeZinnen.includes(zin);
              return (
                <button
                  key={i}
                  onClick={() => toggleZin(zin)}
                  className={`w-full text-left flex items-start gap-3 rounded-xl border px-3 py-2.5 transition-all ${
                    geselecteerd
                      ? 'border-darkGreen bg-darkGreen/10'
                      : 'border-lightBg bg-white hover:border-darkGreen/30'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                    geselecteerd ? 'bg-darkGreen border-darkGreen' : 'border-darkSlate/30'
                  }`}>
                    {geselecteerd && <span className="text-white text-[10px] leading-none">✓</span>}
                  </div>
                  <span className="text-sm text-darkSlate italic leading-snug">{zin}</span>
                </button>
              );
            })}
            {geselecteerdeZinnen.length > 0 && (
              <p className="text-xs text-darkGreen">{geselecteerdeZinnen.length} zin{geselecteerdeZinnen.length !== 1 ? 'nen' : ''} geselecteerd</p>
            )}
          </div>
        )}
      </div>

      <button
        onClick={schrijfBrief}
        disabled={!kanGenereren || loading}
        className="w-full py-3 rounded-xl bg-darkRed text-white text-sm font-medium hover:bg-darkRed/80 transition-colors disabled:opacity-40"
      >
        {loading ? 'Brief wordt geschreven…' : '✦ Schrijf mijn brief'}
      </button>

      {!kanGenereren && !brief && (
        <p className="text-xs text-darkSlate/40 text-center">Vul minimaal naam, relatie, dankbaarheid en keuze in</p>
      )}

      {fout && <p className="text-sm text-darkRed text-center">{fout}</p>}

      {brief && (
        <div className="space-y-3">
          <p className="text-xs text-darkSlate/50 text-center">Je kunt de brief hieronder nog aanpassen</p>
          <div className="bg-cream/60 rounded-2xl border border-orange/20 overflow-hidden">
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={22}
              className="w-full bg-transparent px-5 py-4 text-sm text-darkSlate leading-loose focus:outline-none resize-none"
              style={{ fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap' }}
            />
          </div>
          {!loading && (
            <div className="flex justify-center pt-1">
              <LoyaliteitsBriefPdfKnop naam={naam} brief={brief} />
            </div>
          )}
          <div className="flex justify-center pt-1">
            <button onClick={opnieuwBeginnen} className="text-sm text-midGreen hover:text-darkGreen underline underline-offset-2">
              Nieuwe brief schrijven
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
