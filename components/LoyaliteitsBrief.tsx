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
type LoyaliteitType = 'patroon' | 'gemis';

const RAKE_VRAGEN = [
  {
    id: 'dragen',
    vraag: 'Wanneer ben je voor het eerst begonnen deze persoon te dragen?',
    uitleg: 'Dit moment toont wanneer jouw rol van drager begon. Het maakt het patroon concreet en geeft de brief een ankerpunt in de tijd.',
    voorbeeld: 'bijv. toen mijn vader ziek werd en ik zag hoe mijn moeder dat alleen droeg',
  },
  {
    id: 'goedHad',
    vraag: 'Wat zou het voor hem/haar betekend hebben als jij het wél goed had?',
    uitleg: 'Achter loyaliteit schuilt vaak de overtuiging dat jouw succes of vreugde iets wegneemt bij de ander. Deze vraag maakt dat zichtbaar.',
    voorbeeld: 'bijv. dan had zij zich misschien tekortgeschoten gevoeld als moeder',
  },
  {
    id: 'gelukkig',
    vraag: 'Mag jij gelukkig zijn terwijl zij het moeilijk had (of heeft)?',
    uitleg: 'Dit raakt de kern van loyaliteitsconflicten: het gevoel dat je eigen geluk ontrouw is aan hun pijn. Het eerlijke antwoord maakt ruimte in de brief.',
    voorbeeld: 'bijv. nee, blij zijn voelde altijd als haar pijn negeren',
  },
  {
    id: 'identiteit',
    vraag: 'Wie ben jij als je deze persoon niet meer draagt?',
    uitleg: 'Loslaten raakt ook aan identiteit. Wie je bent zonder dit patroon is soms onbekend terrein. Toch is dit het eerlijkste antwoord op de vraag: waarheen ga ik eigenlijk?',
    voorbeeld: 'bijv. iemand die mijn eigen dromen serieus neemt, zonder schuldgevoel',
  },
  {
    id: 'gebracht',
    vraag: 'Heeft jouw loyaliteit hem/haar iets gebracht?',
    uitleg: 'Een eerlijke vraag, want het antwoord kan beide kanten op. Heeft het hem/haar geholpen? Of was het eigenlijk voor jou, om de verbinding te houden? Beide antwoorden zijn waardevol in de brief.',
    voorbeeld: 'bijv. ik denk het niet, ze had liever gehad dat ik voor mezelf koos',
  },
];

const RAKE_VRAGEN_GEMIS = [
  {
    id: 'eersteGemis',
    vraag: 'Wanneer merkte je voor het eerst dat je jezelf vreugde ontzegde vanuit je gemis?',
    uitleg: 'Dit moment toont wanneer het gemis overgaat in een verbod op vreugde. Het maakt zichtbaar waar de grens ligt die je onbewust trok.',
    voorbeeld: 'bijv. toen ik voor het eerst weer hardop lachte en me daarna schuldig voelde',
  },
  {
    id: 'gewild',
    vraag: 'Zou hij/zij gewild hebben dat jij gelukkig bent?',
    uitleg: 'Een van de krachtigste vragen in rouw: wat zou de ander jou gunnen? Het antwoord maakt ruimte voor toestemming die je misschien nog niet aan jezelf hebt gegeven.',
    voorbeeld: 'bijv. ja, dat weet ik eigenlijk wel, hij wilde altijd het beste voor mij',
  },
  {
    id: 'magGelukkig',
    vraag: 'Mag jij gelukkig zijn nu hij/zij er niet meer is?',
    uitleg: 'Dit raakt de kern: vreugde voelen voelt als ontrouw aan het verlies. Maar het verlies is van jou, niet van hem/haar. Het eerlijke antwoord maakt de brief eerlijker.',
    voorbeeld: 'bijv. ik weet het eigenlijk niet, het voelt als hem loslaten',
  },
  {
    id: 'naastVerdriet',
    vraag: 'Wie ben jij als je naast je verdriet ook vreugde toelaat?',
    uitleg: 'Vreugde en verdriet kunnen tegelijk bestaan. Deze vraag gaat over identiteit: ben jij ook iemand die kan genieten, zonder de verbinding met hem/haar te verliezen?',
    voorbeeld: 'bijv. iemand die hem meedraagt in mijn vreugde, niet alleen in mijn pijn',
  },
  {
    id: 'eerbetoon',
    vraag: 'Is jouw verdriet een eerbetoon aan hem/haar, of houdt het je ook bij hem/haar?',
    uitleg: 'Verdriet is liefde die nergens naartoe kan. Maar soms wordt het ook een manier om dicht bij de ander te blijven. Dit onderscheid is waardevol in de brief.',
    voorbeeld: 'bijv. allebei, en dat maakt loslaten zo moeilijk',
  },
];

export default function LoyaliteitsBrief() {
  const [naam, setNaam] = useState('');
  const [relatie, setRelatie] = useState('');
  const [status, setStatus] = useState<Status>('leeft');
  const [loyaliteitType, setLoyaliteitType] = useState<LoyaliteitType>('patroon');
  const [patroon, setPatroon] = useState('');
  const [herinnering, setHerinnering] = useState('');
  const [dankbaar, setDankbaar] = useState('');
  const [verboden, setVerboden] = useState('');
  const [keuze, setKeuze] = useState('');
  const [loslaten, setLoslaten] = useState('');
  const [jouwNaam, setJouwNaam] = useState('');
  const [rakeVragenOpen, setRakeVragenOpen] = useState(false);
  const [rakeAntwoorden, setRakeAntwoorden] = useState<Record<string, string>>({});
  const [rakeUitlegOpen, setRakeUitlegOpen] = useState<Record<string, boolean>>({});
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
${loyaliteitType === 'patroon' ? `
Als het patroon gaat over het herhalen van iemands lot (ziek worden op dezelfde leeftijd, nooit verder komen, hetzelfde levensverhaal naleven), genereer dan zinnen in de richting van: "Jouw verhaal was van jou, het mijne is van mij", "Ik hoef jouw lot niet te herhalen om van jou te houden", "Ik mag verder leven dan jij kon".
` : ''}${loyaliteitType === 'gemis' ? `
Belangrijk voor deze situatie: de loyaliteit is aan het eigen gemis en verdriet, niet aan een patroon van de ander. Het verdriet is van de schrijver, niet van de persoon aan wie geschreven wordt. Genereer zinnen die gaan over de vrijheid om vreugde en verdriet naast elkaar te laten bestaan, zonder de ander of het verlies te verraden. Denk aan de richting van: "Mijn vreugde verraadt jou niet", "Mijn gemis is van mij, mijn vreugde ook", "Ik draag jou mee in mijn vreugde, niet alleen in mijn pijn".
` : ''}
Situatie:
Persoon: ${naam} (${relatie})
${loyaliteitType === 'patroon' ? `Overgenomen patroon: ${patroon || 'niet ingevuld'}` : `Loyaliteit aan het gemis: ${patroon || 'niet ingevuld'}`}
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

    const actieveRakeVragen = loyaliteitType === 'patroon' ? RAKE_VRAGEN : RAKE_VRAGEN_GEMIS;
    const rakeContext = actieveRakeVragen
      .filter((v) => rakeAntwoorden[v.id]?.trim())
      .map((v) => `- ${v.vraag}\n  ${rakeAntwoorden[v.id]}`)
      .join('\n');

    const statusZin =
      status === 'overleden'
        ? `${naam} is al overleden`
        : status === 'geen-contact'
        ? `${naam} is nog in leven maar er is geen contact meer`
        : `${naam} leeft nog en er is contact`;

    const briefSystem = 'Je schrijft persoonlijke brieven in het Nederlands. Je toon is warm, poëtisch en intiem. Je gebruikt namen zoals opgegeven. Je schrijft plain text: geen markdown, geen koppen, geen sterretjes, geen opsommingstekens. Witregels mogen, maar alleen tussen gedachteblokken.';

    const prompt = `Schrijf een persoonlijke brief als één doorlopende tekst. Geen genummerde secties, geen koppen, geen opsomming. De stijl is warm en poëtisch: zinnen zijn vloeiend en bevatten 1-2 volledige gedachten. Gebruik witruimte tussen gedachteblokken. De brief voelt intiem, zacht en oprecht.

Begin geen enkele zin met het woord "En". Gebruik geen m-dashes. Geen markdown, geen sterretjes, gewone tekst met regelafbrekingen. De brief is 280-380 woorden.

${loyaliteitType === 'patroon'
  ? `De brief doorloopt organisch deze emotionele beweging:
begin bij herkenning (ik zie jou, gebruik de herinnering als ankerpunt als die er is), ga dan naar dankbaarheid (wat ik van jou heb meegekregen), dan naar de loyaliteit (hoe ik jou heb meegedragen via het patroon of lot, benoem dit zonder oordeel), dan de kosten (wat ik mezelf daardoor heb ontzegd), dan de keuze (wat ik nu kies, niet als verraad maar als eerbetoon aan wie ik word) inclusief wat ik daarbij achterlaat, en sluit warm af in 2-3 regels. Als het patroon gaat over het herhalen van iemands lot (ziek worden op dezelfde leeftijd, nooit verder komen, hetzelfde levensverhaal naleven), is de bevrijdingsbeweging: ik hoef jouw lot niet te herhalen om jou te eren — jouw verhaal was van jou, het mijne is van mij.`
  : `De brief doorloopt organisch deze emotionele beweging:
begin bij herkenning en wat er was (gebruik de herinnering als ankerpunt als die er is), ga dan naar dankbaarheid en naar wat je mist, dan naar de loyaliteit aan het gemis (hoe je jezelf vreugde hebt ontzegd alsof blij zijn het verlies zou verraden, benoem dit liefdevol en zonder oordeel: het verdriet is van jou, niet van hem/haar), dan de bevrijding (jouw vreugde verraadt hem/haar niet, je kunt hem/haar meedragen in je vreugde en niet alleen in je pijn), dan de keuze (wat je jezelf nu toestaat) inclusief wat je daarbij achterlaat, en sluit warm af in 2-3 regels.`}

Begin met: Lieve ${naam},
Sluit af met een lege regel en dan: Liefs, ${jouwNaam || '...'}

Schrijf in de ik-persoon. Spreek de persoon aan met "je/jij".

Context:
Persoon: ${naam} (${relatie}). ${statusZin}.
${loyaliteitType === 'patroon' ? `Overgenomen patroon: ${patroon || 'niet ingevuld'}` : `Hoe de loyaliteit aan het gemis zich uit: ${patroon || 'niet ingevuld'}`}
Concreet beeld of herinnering: ${herinnering || 'niet ingevuld'}
Dankbaar voor: ${dankbaar}
${loyaliteitType === 'patroon' ? `Verboden uit loyaliteit: ${verboden || 'niet ingevuld'}` : `Verboden uit loyaliteit aan het gemis: ${verboden || 'niet ingevuld'}`}
Kiest nu voor: ${keuze}
Laat achter: ${loslaten || 'niet ingevuld'}${rakeContext ? `

Verdieping via rake vragen (gebruik dit als extra emotionele laag in de brief, niet als opsomming):
${rakeContext}` : ''}${geselecteerdeZinnen.length > 0 ? `

Verwerk de volgende systemische zinnen op een natuurlijke plek in de brief. Laat ze landen waar ze het meest kloppen, niet als opsomming maar als deel van de tekst:
${geselecteerdeZinnen.map((z) => `- "${z}"`).join('\n')}` : ''}`;

    try {
      let acc = '';
      await streamAnalyse(
        prompt,
        1800,
        (chunk) => { acc += chunk; setBrief(acc); },
        briefSystem,
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
    setRakeAntwoorden({});
    setRakeVragenOpen(false);
    setRakeUitlegOpen({});
    setNaam(''); setRelatie(''); setStatus('leeft'); setLoyaliteitType('patroon');
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
        <p>Schrijf een brief aan die persoon. Erken wat er was, benoem wat je jezelf daardoor ontzegt, en geef jezelf toestemming om verder te gaan.</p>
      </div>

      <div className="space-y-4">

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-darkSlate mb-1">Hoe noem jij deze persoon?</label>
            <input type="text" value={naam} onChange={(e) => setNaam(e.target.value)} placeholder="bijv. mama, opa, Jan" className={inputKlasse} />
            {naam.trim() && (
              <p className="mt-1 text-[11px] text-darkSlate/40 italic">Jouw brief begint met: Lieve {naam.trim()},</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-darkSlate mb-1">Jouw relatie tot hem/haar</label>
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
          <label className="block text-xs font-medium text-darkSlate mb-2">Waar gaat deze loyaliteit over?</label>
          <div className="flex flex-col gap-2">
            {([
              ['patroon', 'Aan een patroon dat ik van hem/haar heb meegekregen'] as [LoyaliteitType, string],
              ['gemis', 'Aan mijn eigen verdriet of gemis om hem/haar'] as [LoyaliteitType, string],
            ]).map(([val, label]) => (
              <label key={val} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="loyaliteitType"
                  value={val}
                  checked={loyaliteitType === val}
                  onChange={() => { setLoyaliteitType(val); setRakeAntwoorden({}); }}
                  className="accent-darkRed"
                />
                <span className="text-sm text-darkSlate">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-darkSlate mb-1">
            {loyaliteitType === 'patroon'
              ? 'Welk patroon of lot heb je onbewust meegedragen?'
              : 'Hoe uit jouw loyaliteit aan het gemis zich?'}
          </label>
          <textarea
            value={patroon}
            onChange={(e) => setPatroon(e.target.value)}
            placeholder={loyaliteitType === 'patroon'
              ? 'bijv. altijd doorgaan, voor iedereen zorgen… of: hetzelfde lot naleven, nooit verder komen dan hij/zij'
              : 'bijv. ik laat mezelf geen vreugde toe, ik voel me schuldig als ik lach…'}
            rows={2}
            className={textareaKlasse}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-darkSlate mb-1">Een concreet beeld of herinnering bij deze persoon</label>
          <textarea value={herinnering} onChange={(e) => setHerinnering(e.target.value)} placeholder="bijv. haar handen die altijd bezet waren, zijn lach bij kleine dingen…" rows={2} className={textareaKlasse} />
        </div>

        <div>
          <label className="block text-xs font-medium text-darkSlate mb-1">Wat heb je van hem/haar geleerd, of waarvoor wil je bedanken? <span className="text-darkRed">*</span></label>
          <textarea value={dankbaar} onChange={(e) => setDankbaar(e.target.value)} placeholder="bijv. doorzettingsvermogen, het gevoel van geborgenheid…" rows={2} className={textareaKlasse} />
        </div>

        <div>
          <label className="block text-xs font-medium text-darkSlate mb-1">
            {loyaliteitType === 'patroon'
              ? 'Wat heb je jezelf verboden uit loyaliteit aan hem/haar?'
              : 'Wat heb je jezelf verboden uit loyaliteit aan het gemis?'}
          </label>
          <textarea
            value={verboden}
            onChange={(e) => setVerboden(e.target.value)}
            placeholder={loyaliteitType === 'patroon'
              ? 'bijv. genieten, rusten, voor mezelf kiezen…'
              : 'bijv. genieten, verliefd worden, blij zijn, verder gaan…'}
            rows={2}
            className={textareaKlasse}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-darkSlate mb-1">Waarvoor kies jij nu? <span className="text-darkRed">*</span></label>
          <textarea
            value={keuze}
            onChange={(e) => setKeuze(e.target.value)}
            placeholder={loyaliteitType === 'gemis'
              ? 'bijv. blij zijn zonder dat het verraad voelt, vreugde naast verdriet toelaten…'
              : 'bijv. rusten zonder schuldgevoel, genieten, voor mezelf kiezen…'}
            rows={2}
            className={textareaKlasse}
          />
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

      {/* Rake vragen */}
      <div className="border-t border-lightBg pt-4">
        <button
          onClick={() => setRakeVragenOpen((v) => !v)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div>
            <p className="text-sm font-medium text-darkSlate">Rake vragen</p>
            <p className="text-xs text-darkSlate/50">Optioneel: verdiep de brief met eerlijkere antwoorden</p>
          </div>
          <span className="text-darkSlate/40 ml-3 text-xs">{rakeVragenOpen ? '▲' : '▼'}</span>
        </button>

        {rakeVragenOpen && (
          <div className="mt-4 space-y-4">
            {(loyaliteitType === 'patroon' ? RAKE_VRAGEN : RAKE_VRAGEN_GEMIS).map((v) => (
              <div key={v.id}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <label className="text-xs font-medium text-darkSlate leading-snug">{v.vraag}</label>
                  <button
                    type="button"
                    onClick={() => setRakeUitlegOpen((prev) => ({ ...prev, [v.id]: !prev[v.id] }))}
                    className="flex-shrink-0 w-5 h-5 rounded-full border border-darkSlate/30 text-darkSlate/40 text-[10px] font-bold flex items-center justify-center hover:border-midGreen hover:text-midGreen transition-colors"
                    title="Meer uitleg"
                  >
                    i
                  </button>
                </div>
                {rakeUitlegOpen[v.id] && (
                  <div className="mb-2 bg-lightBg2 rounded-xl px-3 py-2 space-y-1">
                    <p className="text-xs text-darkSlate/70 leading-relaxed">{v.uitleg}</p>
                    <p className="text-[11px] text-darkSlate/40 italic">{v.voorbeeld}</p>
                  </div>
                )}
                <textarea
                  value={rakeAntwoorden[v.id] || ''}
                  onChange={(e) => setRakeAntwoorden((prev) => ({ ...prev, [v.id]: e.target.value }))}
                  rows={2}
                  className={textareaKlasse}
                  placeholder="Je hoeft niet alles in te vullen…"
                />
              </div>
            ))}
          </div>
        )}
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
