'use client';

import { useState } from "react";
import { streamAnalyse } from "@/lib/huisstijl";

const grondOpties = [
  "Meditatie", "Yoga", "Sporten", "5-4-3-2-1 zintuigenoefening",
  "Een olie cuppen (bijv. Idaho Blue Spruce)", "Bodyscan met de biotensor",
  "Ademhalingsoefening (bijv. box breathing)", "Andere methode",
];

const lengteopties = [
  { id: "kort",       label: "Kort",      sub: "± 5 minuten"   },
  { id: "medium",     label: "Medium",    sub: "± 10 minuten"  },
  { id: "uitgebreid", label: "Uitgebreid", sub: "15+ minuten"  },
];

const toonOpties = [
  "Warm en eenvoudig, met korte zinnen",
  "Rijke, beeldende taal met zachte overgangen",
  "Spiritueel, maar aards en nuchter",
  "Zacht en liefdevol, alsof een goede vriendin spreekt",
  "Speels en luchtig, met een vleugje humor",
];

const structuurOpties = [
  "Rustige opbouw: eerst gronden, dan ontmoeten, dan afronden",
  "Gebruik korte alinea's en witregels (makkelijk voor te lezen)",
  "Rijke zintuiglijke beschrijvingen (geur, kleur, gevoel)",
  "Beelden uit de natuur (strand, bos, zonlicht)",
];

const gebruikOpties = [
  { id: "lezen",      label: "Fijn om te lezen",     sub: "Vloeiende tekst"        },
  { id: "inspreken",  label: "Inspreken als audio",   sub: "Rustig tempo, pauzes"   },
];

function SectionHeader({ nr, emoji, title, sub }: { nr?: string | number; emoji?: string; title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2.5 mb-1">
        {nr && <span className="bg-darkRed text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">{nr}</span>}
        {emoji && <span className="text-base">{emoji}</span>}
        <h3 className="m-0 text-sm font-bold text-darkGreen">{title}</h3>
      </div>
      {sub && <p className="ml-[34px] text-xs text-darkSlate/70 leading-relaxed mt-0">{sub}</p>}
    </div>
  );
}

function StyledTextArea({ value, onChange, placeholder, rows }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows ?? 3}
      className="w-full px-3 py-2.5 text-sm rounded-xl border border-lightBg bg-white resize-y leading-relaxed text-darkSlate focus:outline-none focus:border-darkGreen box-border"
    />
  );
}

function PillToggle({ options, selected, onToggle, multi }: {
  options: (string | { id: string; label: string; sub?: string })[];
  selected: string | string[];
  onToggle: (id: string) => void;
  multi?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const id    = typeof opt === "string" ? opt : opt.id;
        const label = typeof opt === "string" ? opt : opt.label;
        const sub   = typeof opt === "object" ? opt.sub : null;
        const sel   = multi ? (selected as string[]).includes(id) : selected === id;
        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            className={`rounded-full cursor-pointer text-xs text-left border transition-colors ${sub ? "py-2 px-3.5" : "py-1.5 px-3.5"} ${sel ? "bg-darkRed border-darkRed text-white font-bold" : "bg-white border-lightBg text-darkSlate font-normal hover:border-darkRed/40"}`}
          >
            {label}
            {sub && <span className="block text-[10px] font-normal opacity-80 mt-0.5">{sub}</span>}
          </button>
        );
      })}
    </div>
  );
}

function Block({ children, alt }: { children: React.ReactNode; alt?: boolean }) {
  return (
    <div className={`${alt ? "bg-cream" : "bg-white"} border border-lightBg rounded-xl p-4 mb-5`}>
      {children}
    </div>
  );
}

const init = {
  grond: [] as string[], grondAnders: "",
  tijdlijn: "", thema: "", gevoel: "", elementen: "",
  boodschap: "", uitdaging: "",
  symbool: "", gids: "", omgeving: "",
  lengte: "", toon: [] as string[], structuur: [] as string[],
  gebruik: "", finetuning: "",
};

function bouwPrompt(form: typeof init): string {
  const lengteTekst: Record<string, string> = {
    kort: "ongeveer 5 minuten (kort)",
    medium: "ongeveer 10 minuten (medium) — schrijf minimaal 1000 woorden en eindig altijd met een volledige afronding",
    uitgebreid: "15 tot 20 minuten (uitgebreid) — schrijf minimaal 2000 woorden en eindig altijd met een volledige afronding",
  };
  const gebruikTekst = form.gebruik === "inspreken"
    ? "De tekst wordt ingesproken als audio: gebruik een rustig tempo met korte pauzes tussen zinnen."
    : "De tekst wordt gelezen: zorg voor vloeiende, leesbare alinea's.";

  const regels = [
    `Schrijf een geleide Future Self Visualisatie in het Nederlands.`,
    `De visualisatie duurt ${lengteTekst[form.lengte] ?? form.lengte}.`,
    gebruikTekst,
    ``,
    `CONTEXT VAN DE GEBRUIKER:`,
    `- Tijdlijn: ${form.tijdlijn} in de toekomst`,
    `- Thema / focus: ${form.thema}`,
    `- Hoe ze zich wil voelen / hoe haar future self eruitziet: ${form.gevoel}`,
    form.elementen  ? `- Zichtbare elementen van haar toekomstige leven: ${form.elementen}` : "",
    form.boodschap  ? `- Wat ze hoopt dat haar future self haar vertelt: ${form.boodschap}` : "",
    form.uitdaging  ? `- Haar grootste uitdaging nu: ${form.uitdaging}` : "",
    form.symbool    ? `- Symbool of voorwerp om mee te nemen: ${form.symbool}` : "",
    form.gids       ? `- Gids, helper of dier: ${form.gids}` : "",
    form.omgeving   ? `- Gewenste omgeving / sfeer: ${form.omgeving}` : "",
    form.grond.length ? `- Ze heeft zich gegrond via: ${form.grond.filter(g => g !== "Andere methode").join(", ")}${form.grondAnders ? ` (${form.grondAnders})` : ""}` : "",
    ``,
    form.toon.length      ? `TOON & STIJL: ${form.toon.join(" / ")}` : "",
    form.structuur.length ? `STRUCTUUR & BEELDEN: ${form.structuur.join(" / ")}` : "",
    form.finetuning       ? `EXTRA AANWIJZINGEN: ${form.finetuning}` : "",
    ``,
    `Schrijf de volledige visualisatietekst als doorlopende proza, klaar om voor te lezen of in te spreken.`,
    `Begin direct met de visualisatie zelf — geen uitleg of inleiding ervoor.`,
    `Spreek de luisteraar aan als "je" of "jij".`,
    `Vermijd zinnen die beginnen met "En" — laat dit woord weg als het geen toegevoegde waarde heeft.`,
  ].filter(Boolean);

  return regels.join("\n");
}

export default function FutureSelfVisualisatie() {
  const [form, setForm]         = useState(init);
  const [loading, setLoading]   = useState(false);
  const [resultaat, setResultaat] = useState("");
  const [fout, setFout]         = useState("");

  function set(key: string, val: unknown) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function toggleMulti(key: string, val: string) {
    setForm(f => {
      const arr = f[key as keyof typeof f] as string[];
      return { ...f, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  }

  async function genereer() {
    setLoading(true);
    setFout("");
    setResultaat("");
    const maxTokens = form.lengte === "uitgebreid" ? 6000 : form.lengte === "medium" ? 3500 : 1200;
    try {
      await streamAnalyse(bouwPrompt(form), maxTokens, chunk => {
        setResultaat(prev => prev + chunk);
      });
    } catch (e: unknown) {
      setFout(e instanceof Error ? e.message : "Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  const alleFilled = form.tijdlijn && form.thema && form.gevoel && form.lengte;

  return (
    <div className="bg-cream min-h-screen">
      <div className="px-4 sm:px-6 pt-6 pb-2 max-w-[860px] mx-auto">
        <p className="m-0 text-xs font-semibold tracking-widest text-midGreen uppercase">Energieke Lieke · BinnensteBuiten Spel</p>
        <h2 className="text-2xl font-bold mt-1 mb-1 text-darkSlate">Future Self Visualisatie</h2>
        <p className="text-sm text-darkGreen m-0 italic">Ontmoet wie jij al aan het worden bent</p>
      </div>

      <div className="px-4 sm:px-6 py-5 max-w-[860px] mx-auto">

        {/* Intro / gronden */}
        <div className="bg-lightBg2 rounded-xl p-4 mb-6 border-l-4 border-orange">
          <p className="text-sm font-bold text-darkRed mb-2 mt-0">Voordat je begint</p>
          <p className="text-sm text-darkSlate leading-relaxed mb-2">
            Zorg eerst dat je je goed gegrond voelt. Doe dit op een manier die voor jou werkt.
          </p>
          <p className="text-xs font-bold text-darkGreen mb-2">Hoe heb je je gegrond?</p>
          <PillToggle options={grondOpties} selected={form.grond} onToggle={v => toggleMulti("grond", v)} multi />
          {form.grond.includes("Andere methode") && (
            <div className="mt-2.5">
              <StyledTextArea value={form.grondAnders} onChange={v => set("grondAnders", v)} placeholder="Beschrijf jouw methode..." rows={2} />
            </div>
          )}
        </div>

        <h2 className="text-xs font-bold text-darkGreen uppercase tracking-widest mb-4 mt-0">De Future Self Vragenlijst</h2>

        <Block>
          <SectionHeader nr="1" title="Tijdlijn" sub="Over hoeveel jaar wil jij je future self ontmoeten?" />
          <div className="flex gap-2 flex-wrap">
            {["1 jaar", "2 jaar", "3 jaar", "5 jaar", "10 jaar"].map(opt => {
              const sel = form.tijdlijn === opt;
              return (
                <button key={opt} onClick={() => set("tijdlijn", opt)}
                  className={`px-4 py-1.5 rounded-full cursor-pointer text-sm border transition-colors ${sel ? "bg-darkGreen border-darkGreen text-white font-bold" : "bg-white border-lightBg text-darkSlate hover:border-darkGreen/40"}`}>
                  {opt}
                </button>
              );
            })}
            <input type="text"
              value={["1 jaar","2 jaar","3 jaar","5 jaar","10 jaar"].includes(form.tijdlijn) ? "" : form.tijdlijn}
              onChange={e => set("tijdlijn", e.target.value)}
              placeholder="Anders, nl..."
              className="px-3 py-1.5 rounded-full border border-lightBg text-sm text-darkSlate w-28 focus:outline-none focus:border-darkGreen" />
          </div>
        </Block>

        <Block alt>
          <SectionHeader nr="2" title="Thema / focus" sub="Wat wil je ontdekken of ontwikkelen via deze visualisatie?" />
          <StyledTextArea value={form.thema} onChange={v => set("thema", v)} placeholder="Bijv: rust, zelfvertrouwen, ondernemerschap, moederschap, gezondheid, levensmissie..." rows={2} />
        </Block>

        <Block>
          <SectionHeader nr="3" title="Hoe wil je je voelen?" sub="Hoe zie jij je future self voor je? Gebruik hier de woorden en/of metafoor van richting NOORD van je Keuze Kompas (Spelen met Richting). Noord staat voor je Future Self: waar wil je naartoe, wat is je grootste verlangen, wat klopt nu echt voor jou? Heb je het Keuze Kompas niet bij de hand? Beschrijf dan vrij hoe jouw toekomstige zelf eruitziet en aanvoelt." />
          <StyledTextArea value={form.gevoel} onChange={v => set("gevoel", v)} placeholder="Bijv: ze straalt rust uit, heeft een open blik... of: sprankelend en energiek, vrij, ontspannen, succesvol, liefdevol..." />
        </Block>

        <Block alt>
          <SectionHeader nr="4" title="Zichtbare elementen" sub="Waar woon je, wat voor werk doe je, hoe ziet je dag eruit, wie zijn er met je meegegroeid?" />
          <StyledTextArea value={form.elementen} onChange={v => set("elementen", v)} placeholder="Beschrijf zo concreet mogelijk hoe jouw toekomstige leven eruitziet..." />
        </Block>

        <Block>
          <SectionHeader nr="5" title="Wat hoop je dat je future self jou vertelt?" sub="Welke inzichten, bemoediging of wijsheid heb je nu nodig?" />
          <StyledTextArea value={form.boodschap} onChange={v => set("boodschap", v)} placeholder="Bijv: ze stelt me gerust, geeft me vertrouwen, beantwoordt mijn vragen..." />
        </Block>

        <Block alt>
          <SectionHeader nr="6" title="Grootste uitdaging" sub="Wat ondermijnt nu regelmatig je vertrouwen of haalt je uit je flow?" />
          <StyledTextArea value={form.uitdaging} onChange={v => set("uitdaging", v)} placeholder="Bijv: twijfel, vergelijken, financiële zorgen, please-gedrag..." rows={2} />
        </Block>

        <Block>
          <SectionHeader nr="7" title="Optionele elementen" sub="Voeg toe wat je wilt meenemen in de visualisatie." />
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold text-darkGreen block mb-1.5">Symbool of voorwerp</label>
              <StyledTextArea value={form.symbool} onChange={v => set("symbool", v)} placeholder="Bijv: ze geeft me een steen mee, een olie, een sleutel..." rows={2} />
            </div>
            <div>
              <label className="text-xs font-bold text-darkGreen block mb-1.5">Gids, helper of dier</label>
              <StyledTextArea value={form.gids} onChange={v => set("gids", v)} placeholder="Bijv: ik ontmoet een gids, een dier dat mij begeleidt..." rows={2} />
            </div>
          </div>
        </Block>

        <Block alt>
          <SectionHeader nr="8" title="Omgeving & sfeer" sub="Op welke plek voel jij je fijn? Wat maakt dat zo? (Geen voorkeur? Laat leeg.)" />
          <StyledTextArea value={form.omgeving} onChange={v => set("omgeving", v)} placeholder="Bijv: strand, bos, bergen, een vertrouwde kamer, een tuin..." rows={2} />
        </Block>

        <Block>
          <SectionHeader nr="9" title="Beoogde lengte" />
          <PillToggle options={lengteopties} selected={form.lengte} onToggle={v => set("lengte", v)} />
        </Block>

        <Block alt>
          <SectionHeader emoji="🎙️" title="Waarvoor gebruik je de tekst?" />
          <PillToggle options={gebruikOpties} selected={form.gebruik} onToggle={v => set("gebruik", v)} />
        </Block>

        <div className="border-2 border-orange rounded-xl p-4 mb-6">
          <SectionHeader emoji="✨" title="Finetuning" sub="Hoe moet de tekst klinken en voelen? Kies wat bij jou past." />
          <p className="text-xs font-bold text-darkGreen mb-1.5 mt-0">Toon & stijl</p>
          <div className="mb-3">
            <PillToggle options={toonOpties} selected={form.toon} onToggle={v => toggleMulti("toon", v)} multi />
          </div>
          <p className="text-xs font-bold text-darkGreen mb-1.5 mt-0">Structuur & beelden</p>
          <div className="mb-3">
            <PillToggle options={structuurOpties} selected={form.structuur} onToggle={v => toggleMulti("structuur", v)} multi />
          </div>
          <p className="text-xs font-bold text-darkGreen mb-1.5 mt-0">Extra aanwijzingen (vrij)</p>
          <StyledTextArea value={form.finetuning} onChange={v => set("finetuning", v)} placeholder="Bijv: gebruik warme en eenvoudige taal / laat het klinken als een innerlijke mentor / gebruik rijke beeldspraak..." rows={3} />
        </div>

        <button
          disabled={!alleFilled || loading}
          onClick={genereer}
          className={`w-full py-3.5 text-sm font-bold rounded-xl border-none text-white tracking-wide transition-colors ${alleFilled && !loading ? "bg-darkRed cursor-pointer hover:bg-darkRed/90" : "bg-[#ccc] cursor-not-allowed"}`}
        >
          {loading ? "Visualisatie wordt gegenereerd..." : "Genereer mijn Future Self Visualisatie"}
        </button>

        {!alleFilled && !loading && (
          <p className="text-xs text-darkSlate/60 text-center mt-2">
            Nog in te vullen:
            {!form.tijdlijn && ' tijdlijn'}
            {!form.thema && ' · thema'}
            {!form.gevoel && ' · hoe je je wilt voelen'}
            {!form.lengte && ' · lengte'}
          </p>
        )}

        {fout && (
          <div className="mt-6 bg-[#fff0ee] border border-darkRed rounded-xl p-4">
            <p className="m-0 text-sm text-darkRed">{fout}</p>
          </div>
        )}

        {resultaat && (
          <div className="mt-8 bg-white border border-lightBg rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-lightBg">
              <span className="text-xl">🌟</span>
              <h3 className="m-0 text-base font-bold text-darkGreen">Jouw Future Self Visualisatie</h3>
            </div>
            {resultaat.split("\n\n").filter(Boolean).map((alinea, i) => (
              <p key={i} className="text-sm text-darkSlate leading-[1.85] mb-4 last:mb-0">
                {alinea}
              </p>
            ))}
            <button
              onClick={() => setResultaat("")}
              className="mt-2 px-4 py-2 rounded-full border border-lightBg bg-white text-darkSlate text-xs cursor-pointer hover:border-darkSlate/40 transition-colors"
            >
              Opnieuw genereren
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
