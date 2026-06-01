# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server op localhost:3000
npm run build     # production build
npx tsc --noEmit  # type check zonder build
npm run lint      # ESLint
```

Vereiste env var: `ANTHROPIC_API_KEY` in `.env.local`.

## Architectuur

Next.js 16 App Router. Elke tool is een standalone client component met eigen route. Geen database, geen auth, geen persistentie — alle state is in-memory.

### AI-analyse: twee call-patronen

Beide roepen `/api/analyse/route.ts` aan (model: `claude-sonnet-4-6`, max 8000 tokens):

- `roepAnalyseAan(prompt, maxTokens, signal?)` — buffert volledige response. Alleen gebruiken voor korte structuuruitvoer (≤ 500 tokens, bijv. kernovertuigingen genereren).
- `streamAnalyse(prompt, maxTokens, onChunk, system?, signal?)` — streamt chunk voor chunk. Gebruik dit voor alle lange analyses.

Standaard streaming patroon in componenten:
```typescript
const abortRef = useRef<AbortController | null>(null);
useEffect(() => () => { abortRef.current?.abort(); }, []);

const controller = new AbortController();
abortRef.current = controller;
let acc = '';
await streamAnalyse(prompt, tokens, (chunk) => { acc += chunk; setAnalyse(acc); }, undefined, controller.signal);
setAnalyse(vervangMDashes(acc));  // vervangMDashes altijd ná streaming op de volledige tekst
```

### AI-analyse weergave

`AnalyseResultaat.tsx` is de gedeelde weergavecomponent. Verwacht markdown met `##`/`###` koppen. Props: `tekst`, `titel`, `verbergPrintKnop?`, `isLoading?`. Geef `isLoading={loading}` altijd mee — blokkeert de PDF-knop tijdens streaming.

### PDF-export

Client-side via `@react-pdf/renderer` (geen Puppeteer). Gedeelde stijlen en componenten staan in `lib/pdfHelpers.tsx` (`K`-kleuren, `PdfHeader`, `PdfFooter`, `PdfSectieKop`, `TekstMetVet`, `AnalyseInhoud`).

PDF-componenten altijd dynamisch importeren:
```typescript
const MijnPdfKnop = dynamic(() => import('./MijnPdf').then(m => m.MijnPdfKnop), { ssr: false });
```

### Kleuren: twee bronnen

- `tailwind.config.ts` — voor Tailwind classes in JSX
- `lib/pdfHelpers.tsx` (`K`-object) — voor react-pdf inline styles

Waarden zijn identiek. Bij kleurwijzigingen beide aanpassen. Slider-styling via `globals.css` (`.slider-bewust` rood, `.slider-onbewust` groen); achtergrond dynamisch via `sliderBackground()` uit `lib/huisstijl.ts`.

---

# Projectinstructies — BinnensteBuiten

## Schrijfstijl

- Beperk het gebruik van een lang streepje (—) in teksten.
- Begin zinnen niet met het woord "En". Laat het weg of herschrijf de zin, tenzij het echt onvermijdelijk is.

## AI-gegenereerde tekst: correct Nederlands

Elke system prompt voor een tool die tekst genereert (brieven, analyses, affirmaties, intenties, etc.) bevat altijd deze instructie:

> Schrijf in correct Nederlands: grammaticaal juist, correcte spelling, correcte woordkeuze en geen anglicismen.

Voeg dit toe aan het begin van de system prompt, vóór toon- en stijlinstructies.

## Werkmap

Lokale bestanden worden opgeslagen in `D:\Claude`.

## Flauwekul Filter — patroon

Elk Flauwekul Filter volgt deze vaste structuur. Gebruik `components/FlauwekulFilterTemplate.tsx` als startpunt voor nieuwe filters.

### Vaste delen (altijd in deze volgorde)
1. **Energiemeting stellingen** — 15 positief geformuleerde stellingen, bewust/onbewust sliders 0–10. Totaalscore met scorebandnamen.
2. **Strategieën** — top 3 kiezen via biotensor. Elke strategie heeft een label + toelichting. Toelichting meesturen in AI-prompt.
3. **Belemmerende overtuigingen** — max 25 stuks, genummerd. Checkbox + twee percentage-sliders (overtuigd / loslaten).
4. **Existentiële kernovertuigingen** — AI-gegenereerd op basis van aangevinkte overtuigingen + lage stellingen (bewust of onbewust < 4).
5. **Eindanalyse** — AI-gegenereerd. Vast format: Samenvatting, Opvallende patronen, Groeikansen, Afsluiting.

### Vaste ontwerpbeslissingen
- Scorebandnamen zijn thematisch en speels (bijv. "Flauwekul Alarm", "Liefdesbaas").
- Groei-affirmaties horen als **output** in het rapport, niet als scoreerbare sectie. Meeleveren als lijst in de AI-prompt zodat de AI de meest passende kiest.
- De AI-prompt voor de eindanalyse bevat altijd: totaalkloof bewust/onbewust, stellingen met kloof ≥ 4, en de instructie daar specifiek op te letten.
- De AI-prompt voor kernovertuigingen bevat altijd: aangevinkte overtuigingen + stellingen met score < 4.
- Kernovertuigingen gaan NIET over het filteronderwerp (geld, liefde) maar over wie de persoon denkt te zijn.
- Geen m-dashes in teksten. Deelkoppen gebruiken dubbele punt: "Deel 1: Energiemeting stellingen".
- Belemmerende overtuigingen zijn genummerd (handig bij blind testen met biotensor).
