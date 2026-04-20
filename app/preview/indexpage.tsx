 "use client";

  import { useState } from "react";

  const C = {
    darkRed: "#9e3816", darkGreen: "#3b5633", midGreen: "#758d69",
    lightBg: "#f4c293", lightBg2: "#fde8d0", cream: "#fdf6ee",
    darkSlate: "#2a3a3c", orange: "#d56119",
  };

  const tools = [
    { titel: "Levenswiel Analyse", sub: "Hoe tevreden ben je op alle levensgebieden?", url:
  "https://energiekelieke.kennis.shop/watch/2946/39496", kleur: C.darkGreen },
    { titel: "Basisverlangens", sub: "Wat heeft jouw onderbewustzijn écht nodig?", url:
  "https://energiekelieke.kennis.shop/watch/2946/39501", kleur: C.midGreen },
    { titel: "Business Scan", sub: "Hoe staat jouw business er energetisch voor?", url:
  "https://energiekelieke.kennis.shop/watch/2946/39497", kleur: C.darkRed },
    { titel: "Business Scan Detailed", sub: "Diepgaande scan per subonderdeel van je business.", url:
  "https://energiekelieke.kennis.shop/watch/2946/39498", kleur: C.darkRed },
  ];

  const flauwekul = [
    { titel: "Geld Gedoe", sub: "Spoor je geldblokades op en filter het flauwekul eruit.", url:
  "https://energiekelieke.kennis.shop/watch/2946/39500", actief: true },
    { titel: "Tijd Tekort", sub: "Binnenkort beschikbaar.", url: null, actief: false },
    { titel: "Batterij Blokkade", sub: "Binnenkort beschikbaar.", url: null, actief: false },
    { titel: "Liefdes Lek", sub: "Binnenkort beschikbaar.", url: null, actief: false },
    { titel: "Geniet Gebrek", sub: "Binnenkort beschikbaar.", url: null, actief: false },
    { titel: "Masker Moe", sub: "Binnenkort beschikbaar.", url: null, actief: false },
  ];

  function Tegel({ titel, sub, url, kleur, disabled }: { titel: string; sub: string; url: string | null; kleur: string;
  disabled?: boolean }) {
    const handleClick = () => { if (url) window.open(url, "_blank"); };
    return (
      <div onClick={handleClick}
        style={{
          background: disabled ? "#e8e6e1" : "#fff",
          border: "1.5px solid " + (disabled ? "#ccc" : kleur),
          borderRadius: 12, padding: "16px 18px",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "box-shadow 0.15s, transform 0.15s",
          position: "relative", opacity: disabled ? 0.65 : 1,
        }}
        onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.transform = "translateY(-2px)";
  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; }}}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
      >
        {disabled && (
          <span style={{ position: "absolute", top: 10, right: 12, fontSize: 10, fontWeight: 700, background: "#bbb",
  color: "#fff", borderRadius: 4, padding: "2px 7px", textTransform: "uppercase", letterSpacing: 0.5
  }}>Binnenkort</span>
        )}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 44, background: disabled ? "#ccc" :
  kleur, borderRadius: "10px 0 0 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 3, height: 24, background: "rgba(255,255,255,0.3)", borderRadius: 2 }} />
        </div>
        <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15, color: disabled ? "#999" : C.darkSlate,
  paddingLeft: 52 }}>{titel}</p>
        <p style={{ margin: 0, fontSize: 12, color: disabled ? "#aaa" : C.darkSlate, opacity: disabled ? 1 : 0.75,
  lineHeight: 1.5, paddingLeft: 52 }}>{sub}</p>
      </div>
    );
  }

  export default function PreviewPage() {
    const [flauwOpen, setFlauwOpen] = useState(false);

    return (
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        {/* Intro */}
        <div style={{ background: C.lightBg2, borderRadius: 12, padding: "16px 18px", marginBottom: "1.75rem",
  borderLeft: "4px solid " + C.orange }}>
          <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: C.darkGreen }}>Welkom!</p>
          <p style={{ margin: "0 0 8px", fontSize: 13, color: C.darkSlate, lineHeight: 1.7 }}>
            Kom los van die innerlijke stemmetjes die je laten geloven dat er geen ruimte is voor wat jou écht blij
  maakt. Met rake vragen, praktische tools en speelse experimenten breng je jezelf stap voor stap terug in contact met
  wat jij nodig hebt.
          </p>
          <p style={{ margin: 0, fontSize: 13, color: C.darkSlate, lineHeight: 1.7 }}>
            Niet door nóg harder te werken aan jezelf, maar door zachter te worden. <strong style={{ fontWeight: 700,
  color: C.darkRed }}>Dáár begint jouw vrijheid.</strong>
          </p>
        </div>

        {/* Tools */}
        <h2 style={{ fontSize: 13, fontWeight: 700, color: C.darkGreen, textTransform: "uppercase", letterSpacing: 0.8,
  margin: "0 0 0.75rem" }}>Jouw tools</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.75rem" }}>
          {tools.map((t) => <Tegel key={t.titel} titel={t.titel} sub={t.sub} url={t.url} kleur={t.kleur} />)}
        </div>

        {/* Flauwekul Filter */}
        <div style={{ border: "2px solid " + C.orange, borderRadius: 12, overflow: "hidden", marginBottom: "1.5rem" }}>
          <div onClick={() => setFlauwOpen((s) => !s)}
            style={{ background: C.orange, padding: "14px 18px", cursor: "pointer", display: "flex", justifyContent:
  "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform:
  "uppercase", letterSpacing: 1 }}>Onderdeel van het Binnenstebuiten Spel</p>
              <p style={{ margin: "3px 0 0", fontSize: 17, fontWeight: 700, color: "#fff" }}>Flauwekul Filter</p>
            </div>
            <span style={{ fontSize: 20, color: "#fff", opacity: 0.85 }}>{flauwOpen ? "▲" : "▼"}</span>
          </div>

          {flauwOpen && (
            <div style={{ background: C.cream, padding: "16px 18px" }}>
              <div style={{ marginBottom: "1.25rem" }}>
                <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: C.darkRed }}>Flauwekul Filter</p>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: C.darkSlate, lineHeight: 1.7 }}>Je hoofd is soms een
   drukke markt vol overtuigingen die al járen hetzelfde kraampje runnen. <em>"Niet genoeg."</em> <em>"Te laat."</em>
  <em>"Dat bestaat niet voor mij."</em></p>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: C.darkSlate, lineHeight: 1.7 }}>Schaarstedenken
  verstopt zich overal! In hoe je werkt, hoe je ontspant, hoe je naar je bankrekening kijkt, en zelfs in hoe je 's
  ochtends wakker wordt.</p>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: C.darkSlate, lineHeight: 1.7 }}>Het Flauwekul Filter
   helpt je om die sluipende schaarstegedachten op te sporen op <strong>álle vlakken van je leven</strong>: Tijd, Geld,
  Energie, Liefde, Plezier, Jezelf laten zien (authenticiteit), etc.</p>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: C.darkSlate, lineHeight: 1.7 }}>Je onderbewustzijn
  weet allang de weg naar groei. De biotensor helpt je om die wijsheid op te sporen. Eerlijk, direct en soms verrassend
  helder.</p>
                <p style={{ margin: 0, fontSize: 13, color: C.darkRed, fontWeight: 700, lineHeight: 1.7 }}>Zet die
  automatische piloot maar aan de kant en ontdek wat er écht speelt!</p>
              </div>
              <div style={{ borderTop: "1px solid " + C.lightBg, paddingTop: "1rem" }}>
                <p style={{ margin: "0 0 0.75rem", fontSize: 12, fontWeight: 700, color: C.darkGreen, textTransform:
  "uppercase", letterSpacing: 0.5 }}>Kies je filter</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {flauwekul.map((f) => (
                    <Tegel key={f.titel} titel={f.titel} sub={f.sub} url={f.url} kleur={f.actief ? C.darkRed : "#999"}
  disabled={!f.actief} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
