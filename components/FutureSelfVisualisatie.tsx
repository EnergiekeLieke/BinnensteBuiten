'use client';

import { useState } from "react";
import { streamAnalyse } from "@/lib/huisstijl";

const C = {
  darkRed: "#9e3816", darkGreen: "#3b5633", midGreen: "#758d69",
  lightBg: "#f4c293", lightBg2: "#fde8d0", cream: "#fcebdc",
  darkSlate: "#2a3a3c", orange: "#d56119",
};

const grondOpties = [
  "Meditatie", "Yoga", "Sporten", "5-4-3-2-1 zintuigenoefening",
  "Een olie cuppen (bijv. Idaho Blue Spruce)", "Bodyscan met de biotensor",
  "Ademhalingsoefening (bijv. box breathing)", "Andere methode"
];

const lengteopties = [
  { id: "kort", label: "Kort", sub: "± 5 minuten" },
  { id: "medium", label: "Medium", sub: "± 10 minuten" },
  { id: "uitgebreid", label: "Uitgebreid", sub: "15+ minuten" },
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
  { id: "lezen", label: "Fijn om te lezen", sub: "Vloeiende tekst" },
  { id: "inspreken", label: "Inspreken als audio", sub: "Rustig tempo, pauzes" },
];

function SectionHeader({ nr, emoji, title, sub }: { nr?: string | number; emoji?: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        {nr && <span style={{ background: C.darkRed, color: "#fff", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{nr}</span>}
        {emoji && <span style={{ fontSize: 16 }}>{emoji}</span>}
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.darkGreen }}>{title}</h3>
      </div>
      {sub && <p style={{ margin: "0 0 0 34px", fontSize: 12, color: C.darkSlate, opacity: 0.7, lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

function TextArea({ value, onChange, placeholder, rows }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea value={value} onChange={function(e) { onChange(e.target.value); }} placeholder={placeholder} rows={rows || 3}
      style={{ width: "100%", padding: "10px 12px", fontSize: 13, borderRadius: 10, border: "1px solid " + C.lightBg, background: "#fff", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", color: C.darkSlate }} />
  );
}

function PillToggle({ options, selected, onToggle, multi }: { options: (string | { id: string; label: string; sub?: string })[]; selected: string | string[]; onToggle: (id: string) => void; multi?: boolean }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(function(opt) {
        const id = typeof opt === "string" ? opt : opt.id;
        const label = typeof opt === "string" ? opt : opt.label;
        const sub = typeof opt === "object" ? opt.sub : null;
        const sel = multi ? (selected as string[]).includes(id) : selected === id;
        return (
          <button key={id} onClick={function() { onToggle(id); }}
            style={{ padding: sub ? "8px 14px" : "6px 14px", borderRadius: 20, cursor: "pointer", fontWeight: sel ? 700 : 400, border: "1.5px solid " + (sel ? C.darkRed : C.lightBg), background: sel ? C.darkRed : "#fff", color: sel ? "#fff" : C.darkSlate, fontSize: 12, textAlign: "left" }}>
            {label}{sub && <span style={{ display: "block", fontSize: 10, fontWeight: 400, opacity: 0.8, marginTop: 1 }}>{sub}</span>}
          </button>
        );
      })}
    </div>
  );
}

function Block({ children, alt }: { children: React.ReactNode; alt?: boolean }) {
  return (
    <div style={{ background: alt ? C.cream : "#fff", border: "1px solid " + C.lightBg, borderRadius: 12, padding: "16px 18px", marginBottom: "1.25rem" }}>
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
  const lengteTekst = { kort: "ongeveer 5 minuten (kort)", medium: "ongeveer 10 minuten (medium)", uitgebreid: "15 minuten of langer (uitgebreid)" }[form.lengte] || form.lengte;
  const gebruikTekst = form.gebruik === "inspreken" ? "De tekst wordt ingesproken als audio: gebruik een rustig tempo met korte pauzes tussen zinnen." : "De tekst wordt gelezen: zorg voor vloeiende, leesbare alinea's.";

  const regels = [
    `Schrijf een geleide Future Self Visualisatie in het Nederlands.`,
    `De visualisatie duurt ${lengteTekst}.`,
    gebruikTekst,
    ``,
    `CONTEXT VAN DE GEBRUIKER:`,
    `- Tijdlijn: ${form.tijdlijn} in de toekomst`,
    `- Thema / focus: ${form.thema}`,
    `- Hoe ze zich wil voelen / hoe haar future self eruitziet: ${form.gevoel}`,
    form.elementen ? `- Zichtbare elementen van haar toekomstige leven: ${form.elementen}` : "",
    form.boodschap ? `- Wat ze hoopt dat haar future self haar vertelt: ${form.boodschap}` : "",
    form.uitdaging ? `- Haar grootste uitdaging nu: ${form.uitdaging}` : "",
    form.symbool ? `- Symbool of voorwerp om mee te nemen: ${form.symbool}` : "",
    form.gids ? `- Gids, helper of dier: ${form.gids}` : "",
    form.omgeving ? `- Gewenste omgeving / sfeer: ${form.omgeving}` : "",
    form.grond.length ? `- Ze heeft zich gegrond via: ${form.grond.filter(g => g !== "Andere methode").join(", ")}${form.grondAnders ? ` (${form.grondAnders})` : ""}` : "",
    ``,
    form.toon.length ? `TOON & STIJL: ${form.toon.join(" / ")}` : "",
    form.structuur.length ? `STRUCTUUR & BEELDEN: ${form.structuur.join(" / ")}` : "",
    form.finetuning ? `EXTRA AANWIJZINGEN: ${form.finetuning}` : "",
    ``,
    `Schrijf de volledige visualisatietekst als doorlopende proza, klaar om voor te lezen of in te spreken.`,
    `Begin direct met de visualisatie zelf — geen uitleg of inleiding ervoor.`,
    `Spreek de luisteraar aan als "je" of "jij".`,
  ].filter(Boolean);

  return regels.join("\n");
}

export default function FutureSelfVisualisatie() {
  const [form, setForm] = useState(init);
  const [loading, setLoading] = useState(false);
  const [resultaat, setResultaat] = useState("");
  const [fout, setFout] = useState("");

  function set(key: string, val: unknown) { setForm(function(f) { return Object.assign({}, f, { [key]: val }); }); }

  function toggleMulti(key: string, val: string) {
    setForm(function(f) {
      const arr = f[key as keyof typeof f] as string[];
      return Object.assign({}, f, { [key]: arr.includes(val) ? arr.filter(function(x) { return x !== val; }) : arr.concat([val]) });
    });
  }

  async function genereer() {
    setLoading(true);
    setFout("");
    setResultaat("");
    const maxTokens = form.lengte === "uitgebreid" ? 3500 : form.lengte === "medium" ? 2000 : 1200;
    try {
      await streamAnalyse(bouwPrompt(form), maxTokens, (chunk) => {
        setResultaat((prev) => prev + chunk);
      });
    } catch (e: unknown) {
      setFout(e instanceof Error ? e.message : "Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  const alleFilled = form.tijdlijn && form.thema && form.gevoel && form.lengte;

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <div style={{ background: C.darkGreen, padding: "1.5rem 1.25rem 1.25rem" }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: 1, color: C.lightBg, textTransform: "uppercase" }}>Energieke Lieke · Binnenstebuiten Spel</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "4px 0 4px", color: "#fff" }}>Future Self Visualisatie</h2>
        <p style={{ fontSize: 13, color: C.lightBg2, margin: 0, fontStyle: "italic" }}>Ontmoet wie jij al aan het worden bent</p>
      </div>

      <div style={{ padding: "1.25rem 1rem", maxWidth: 560, margin: "0 auto" }}>

        {/* Intro */}
        <div style={{ background: C.lightBg2, borderRadius: 12, padding: "14px 16px", marginBottom: "1.5rem", borderLeft: "4px solid " + C.orange }}>
          <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: C.darkRed }}>Voordat je begint</p>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: C.darkSlate, lineHeight: 1.7 }}>
            Zorg eerst dat je je goed gegrond voelt. Doe dit op een manier die voor jou werkt.
          </p>
          <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: C.darkGreen }}>Hoe heb je je gegrond?</p>
          <PillToggle options={grondOpties} selected={form.grond} onToggle={function(v) { toggleMulti("grond", v); }} multi />
          {form.grond.includes("Andere methode") && (
            <div style={{ marginTop: 10 }}>
              <TextArea value={form.grondAnders} onChange={function(v) { set("grondAnders", v); }} placeholder="Beschrijf jouw methode..." rows={2} />
            </div>
          )}
        </div>

        {/* Vragenlijst */}
        <h2 style={{ fontSize: 13, fontWeight: 700, color: C.darkGreen, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 0 1rem" }}>De Future Self Vragenlijst</h2>

        <Block>
          <SectionHeader nr="1" title="Tijdlijn" sub="Over hoeveel jaar wil jij je future self ontmoeten?" />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["1 jaar", "2 jaar", "3 jaar", "5 jaar", "10 jaar"].map(function(opt) {
              const sel = form.tijdlijn === opt;
              return (
                <button key={opt} onClick={function() { set("tijdlijn", opt); }}
                  style={{ padding: "6px 16px", borderRadius: 20, cursor: "pointer", fontWeight: sel ? 700 : 400, border: "1.5px solid " + (sel ? C.darkGreen : C.lightBg), background: sel ? C.darkGreen : "#fff", color: sel ? "#fff" : C.darkSlate, fontSize: 13 }}>
                  {opt}
                </button>
              );
            })}
            <input type="text" value={["1 jaar","2 jaar","3 jaar","5 jaar","10 jaar"].includes(form.tijdlijn) ? "" : form.tijdlijn}
              onChange={function(e) { set("tijdlijn", e.target.value); }}
              placeholder="Anders, nl..."
              style={{ padding: "6px 12px", borderRadius: 20, border: "1.5px solid " + C.lightBg, fontSize: 13, width: 110, color: C.darkSlate }} />
          </div>
        </Block>

        <Block alt>
          <SectionHeader nr="2" title="Thema / focus" sub="Wat wil je ontdekken of ontwikkelen via deze visualisatie?" />
          <TextArea value={form.thema} onChange={function(v) { set("thema", v); }} placeholder="Bijv: rust, zelfvertrouwen, ondernemerschap, moederschap, gezondheid, levensmissie..." rows={2} />
        </Block>

        <Block>
          <SectionHeader nr="3" title="Hoe wil je je voelen?" sub="Hoe zie jij je future self voor je? Gebruik hier de woorden en/of metafoor van richting NOORD van je Keuze Kompas uit Spelen met Richting." />
          <TextArea value={form.gevoel} onChange={function(v) { set("gevoel", v); }} placeholder="Bijv: ze straalt rust uit, heeft een open blik... of: sprankelend en energiek, vrij, ontspannen, succesvol, liefdevol..." />
        </Block>

        <Block alt>
          <SectionHeader nr="4" title="Zichtbare elementen" sub="Waar woon je, wat voor werk doe je, hoe ziet je dag eruit, wie zijn er met je meegegroeid?" />
          <TextArea value={form.elementen} onChange={function(v) { set("elementen", v); }} placeholder="Beschrijf zo concreet mogelijk hoe jouw toekomstige leven eruitziet..." />
        </Block>

        <Block>
          <SectionHeader nr="5" title="Wat hoop je dat je future self jou vertelt?" sub="Welke inzichten, bemoediging of wijsheid heb je nu nodig?" />
          <TextArea value={form.boodschap} onChange={function(v) { set("boodschap", v); }} placeholder="Bijv: ze stelt me gerust, geeft me vertrouwen, beantwoordt mijn vragen..." />
        </Block>

        <Block alt>
          <SectionHeader nr="6" title="Grootste uitdaging" sub="Wat ondermijnt nu regelmatig je vertrouwen of haalt je uit je flow?" />
          <TextArea value={form.uitdaging} onChange={function(v) { set("uitdaging", v); }} placeholder="Bijv: twijfel, vergelijken, financiële zorgen, please-gedrag..." rows={2} />
        </Block>

        <Block>
          <SectionHeader nr="7" title="Optionele elementen" sub="Voeg toe wat je wilt meenemen in de visualisatie." />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.darkGreen, display: "block", marginBottom: 6 }}>Symbool of voorwerp</label>
              <TextArea value={form.symbool} onChange={function(v) { set("symbool", v); }} placeholder="Bijv: ze geeft me een steen mee, een olie, een sleutel..." rows={2} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: C.darkGreen, display: "block", marginBottom: 6 }}>Gids, helper of dier</label>
              <TextArea value={form.gids} onChange={function(v) { set("gids", v); }} placeholder="Bijv: ik ontmoet een gids, een dier dat mij begeleidt..." rows={2} />
            </div>
          </div>
        </Block>

        <Block alt>
          <SectionHeader nr="8" title="Omgeving & sfeer" sub="Op welke plek voel jij je fijn? Wat maakt dat zo? (Geen voorkeur? Laat leeg.)" />
          <TextArea value={form.omgeving} onChange={function(v) { set("omgeving", v); }} placeholder="Bijv: strand, bos, bergen, een vertrouwde kamer, een tuin..." rows={2} />
        </Block>

        <Block>
          <SectionHeader nr="9" title="Beoogde lengte" />
          <PillToggle options={lengteopties} selected={form.lengte} onToggle={function(v) { set("lengte", v); }} />
        </Block>

        <Block alt>
          <SectionHeader emoji="🎙️" title="Waarvoor gebruik je de tekst?" />
          <PillToggle options={gebruikOpties} selected={form.gebruik} onToggle={function(v) { set("gebruik", v); }} />
        </Block>

        <div style={{ border: "2px solid " + C.orange, borderRadius: 12, padding: "16px 18px", marginBottom: "1.5rem" }}>
          <SectionHeader emoji="✨" title="Finetuning" sub="Hoe moet de tekst klinken en voelen? Kies wat bij jou past." />

          <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: C.darkGreen }}>Toon & stijl</p>
          <div style={{ marginBottom: 12 }}>
            <PillToggle options={toonOpties} selected={form.toon} onToggle={function(v) { toggleMulti("toon", v); }} multi />
          </div>

          <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: C.darkGreen }}>Structuur & beelden</p>
          <div style={{ marginBottom: 12 }}>
            <PillToggle options={structuurOpties} selected={form.structuur} onToggle={function(v) { toggleMulti("structuur", v); }} multi />
          </div>

          <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: C.darkGreen }}>Extra aanwijzingen (vrij)</p>
          <TextArea value={form.finetuning} onChange={function(v) { set("finetuning", v); }} placeholder="Bijv: gebruik warme en eenvoudige taal / laat het klinken als een innerlijke mentor / gebruik rijke beeldspraak..." rows={3} />
        </div>

        <button disabled={!alleFilled || loading} onClick={genereer}
          style={{ width: "100%", padding: "14px", fontSize: 15, fontWeight: 700, cursor: (alleFilled && !loading) ? "pointer" : "not-allowed", borderRadius: 10, border: "none", background: (alleFilled && !loading) ? C.darkRed : "#ccc", color: "#fff", letterSpacing: 0.3 }}>
          {loading ? "Visualisatie wordt gegenereerd..." : "Genereer mijn Future Self Visualisatie"}
        </button>
        {!alleFilled && !loading && (
          <p style={{ fontSize: 12, color: C.darkSlate, opacity: 0.6, textAlign: "center", marginTop: 8 }}>
            Vul minimaal tijdlijn, thema, gevoel en lengte in om te beginnen.
          </p>
        )}

        {fout && (
          <div style={{ marginTop: "1.5rem", background: "#fff0ee", border: "1px solid " + C.darkRed, borderRadius: 12, padding: "14px 16px" }}>
            <p style={{ margin: 0, fontSize: 13, color: C.darkRed }}>{fout}</p>
          </div>
        )}

        {resultaat && (
          <div style={{ marginTop: "2rem", background: "#fff", border: "1px solid " + C.lightBg, borderRadius: 14, padding: "24px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.25rem", paddingBottom: "1rem", borderBottom: "1px solid " + C.lightBg }}>
              <span style={{ fontSize: 20 }}>🌟</span>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.darkGreen }}>Jouw Future Self Visualisatie</h3>
            </div>
            {resultaat.split("\n\n").filter(Boolean).map(function(alinea, i) {
              return (
                <p key={i} style={{ margin: "0 0 1.1rem", fontSize: 14, color: C.darkSlate, lineHeight: 1.85 }}>
                  {alinea}
                </p>
              );
            })}
            <button onClick={function() { setResultaat(""); }}
              style={{ marginTop: 8, padding: "8px 18px", borderRadius: 20, border: "1.5px solid " + C.lightBg, background: "#fff", color: C.darkSlate, fontSize: 12, cursor: "pointer" }}>
              Opnieuw genereren
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
