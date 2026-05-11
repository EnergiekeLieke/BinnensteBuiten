# Projectinstructies — BinnensteBuiten

## Schrijfstijl

- Beperk het gebruik van een lang streepje (—) in teksten.
- Begin zinnen niet met het woord "En". Laat het weg of herschrijf de zin, tenzij het echt onvermijdelijk is.

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
