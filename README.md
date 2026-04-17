# Energieke Lieke — Webapp

**"Van denken naar voelen"**

Next.js coaching toolkit met 5 interactieve tools, Anthropic AI-analyse en PDF-export.

## Installatie

### Vereisten
- Node.js 18+ (https://nodejs.org)
- Een Anthropic API key (https://console.anthropic.com)

### Stappen

```bash
# 1. Ga naar de projectmap
cd D:\Claude\energieke-lieke

# 2. Installeer dependencies
npm install

# 3. Maak .env.local aan
copy .env.example .env.local
# Vul je ANTHROPIC_API_KEY in in .env.local

# 4. Start de ontwikkelserver
npm run dev
```

Open http://localhost:3000

## Fonts instellen

De webapp gebruikt de fonts **Salmon** (koppen) en **Brogi** (platte tekst).
Voeg de font-bestanden toe aan `public/fonts/`:

```
public/
  fonts/
    Salmon.woff2
    Salmon.woff
    Brogi.woff2
    Brogi.woff
```

Zonder fontbestanden worden automatisch fallback-fonts gebruikt (Georgia / Inter).

## Structuur

```
app/
  layout.tsx                    — globale layout met header/footer
  page.tsx                      — startpagina met tool-overzicht
  levenswiel/page.tsx
  basisverlangens/page.tsx
  geldgedoe/page.tsx
  business-scan/page.tsx
  business-scan-gedetailleerd/page.tsx
  api/
    analyse/route.ts            — beveiligde Anthropic API route
    pdf/route.ts                — Puppeteer PDF-generatie route

components/
  SpinnenWeb.tsx                — herbruikbare SVG radar-chart
  AnalyseResultaat.tsx          — AI-analyse weergave + kopieer + PDF-knop
  LevenswielAnalyse.tsx         — Tool 1
  BasisverlangenswWerkblad.tsx  — Tool 2
  GeldGedoe.tsx                 — Tool 3
  BusinessScan.tsx              — Tool 4
  BusinessScanDetailed.tsx      — Tool 5

lib/
  huisstijl.ts                  — kleuren, constanten, gedeelde functies
```

## Deployment op Vercel

1. Push het project naar GitHub
2. Importeer in Vercel (vercel.com/new)
3. Voeg environment variable toe: `ANTHROPIC_API_KEY`
4. Deploy

De `vercel.json` is al geconfigureerd met verhoogd geheugen voor de PDF-route.

## Tools

| Tool | Route | Beschrijving |
|------|-------|-------------|
| Levenswiel Analyse | `/levenswiel` | 8 gebieden × bewust/onbewust + spinnenweb |
| Basisverlangens Werkblad | `/basisverlangens` | 6 verlangens per levensgebied |
| Flauwekul Filter: Geld Gedoe | `/geldgedoe` | 4-delige geldenergie sessie |
| Business Scan | `/business-scan` | 12 categorieën snel overzicht |
| Business Scan Gedetailleerd | `/business-scan-gedetailleerd` | Per subonderdeel met accordion |
