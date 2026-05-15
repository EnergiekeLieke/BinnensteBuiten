'use client';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Svg, Polygon, Line } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, PdfSectieKop } from '@/lib/pdfHelpers';
import { aspecten } from './Verbindingswiel';
import type { Score, Analyse } from './Verbindingswiel';

const BLAUW = '#1a4a7a';

const ASPECT_LABELS = [
  'Emotioneel', 'Recreatief', 'Economisch', 'Familiair', 'Spiritueel',
  'Fysiek', 'Intellectueel', 'Passioneel', 'Cultureel', 'Esthetisch',
];

const TYPE_KLEUR: Record<string, { bg: string; tekst: string; label: string }> = {
  groot_verlangengat: { bg: '#fdf0e8', tekst: K.darkRed,   label: 'Groot verlangengat' },
  belangverschil:     { bg: '#fef9e8', tekst: K.orange,    label: 'Verschil in belang'  },
  onbewust_lager:     { bg: '#edf4e9', tekst: K.darkGreen, label: 'Onbewust lager'      },
  beiden_laag:        { bg: '#f0eef8', tekst: '#4a2d6b',   label: 'Beiden laag'         },
};

// ── Spinnenweb ────────────────────────────────────────────────────────────────

function SpinnenwebPdf({ scoresA, scoresB }: { scoresA: Score[]; scoresB: Score[] }) {
  const n = 10;
  const cx = 130, cy = 130, r = 90;
  const angles = Array.from({ length: n }, (_, i) => (2 * Math.PI * i) / n - Math.PI / 2);

  const pt = (val: number, i: number) => {
    const rr = (val / 10) * r;
    return `${(cx + rr * Math.cos(angles[i])).toFixed(2)},${(cy + rr * Math.sin(angles[i])).toFixed(2)}`;
  };
  const poly = (scores: Score[], key: keyof Score) => scores.map((s, i) => pt(s[key], i)).join(' ');
  const avgPoly = () => aspecten.map((_, i) => {
    const avg = (scoresA[i].vervullingBewust + scoresA[i].vervullingOnbewust + scoresB[i].vervullingBewust + scoresB[i].vervullingOnbewust) / 4;
    return pt(avg, i);
  }).join(' ');
  const gridPoly = (v: number) => Array.from({ length: n }, (_, i) => pt(v, i)).join(' ');

  return (
    <Svg viewBox="0 0 260 260" style={{ width: 260, height: 260 }}>
      {[2, 4, 6, 8, 10].map(v => (
        <Polygon key={v} points={gridPoly(v)} fill="none" stroke="rgba(59,86,51,0.18)" strokeWidth={0.7} />
      ))}
      {angles.map((a, i) => (
        <Line key={i} x1={cx} y1={cy}
          x2={(cx + r * Math.cos(a)).toFixed(2)}
          y2={(cy + r * Math.sin(a)).toFixed(2)}
          stroke="rgba(59,86,51,0.18)" strokeWidth={0.7} />
      ))}

      {/* Gemiddelde */}
      <Polygon points={avgPoly()} fill="rgba(213,97,25,0.12)" stroke={K.orange} strokeWidth={1.5} strokeDasharray="4 3" />

      {/* Partner A: doorgetrokken */}
      <Polygon points={poly(scoresA, 'vervullingOnbewust')} fill={K.darkGreen} fillOpacity={0.1} stroke={K.darkGreen} strokeWidth={1.8} />
      <Polygon points={poly(scoresA, 'vervullingBewust')} fill={K.darkRed} fillOpacity={0.1} stroke={K.darkRed} strokeWidth={1.8} />

      {/* Partner B: gestippeld */}
      <Polygon points={poly(scoresB, 'vervullingOnbewust')} fill="none" stroke={K.darkGreen} strokeWidth={1.8} strokeDasharray="4 3" />
      <Polygon points={poly(scoresB, 'vervullingBewust')} fill="none" stroke={K.darkRed} strokeWidth={1.8} strokeDasharray="4 3" />
    </Svg>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  pagina:       { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:         { paddingHorizontal: 40 },
  intro:        { fontSize: 9.5, color: K.darkSlate, lineHeight: 1.6, marginBottom: 14 },
  // Spinnenweb
  spinnenRij:   { flexDirection: 'row', gap: 16, marginBottom: 16, alignItems: 'flex-start' },
  legenda:      { flex: 1, marginTop: 8 },
  legendaRij:   { flexDirection: 'row', alignItems: 'center', marginBottom: 5, gap: 6 },
  legendaLijn:  { width: 22, height: 2, borderRadius: 1 },
  legendaTekst: { fontSize: 8, color: K.darkSlate },
  aspectLabel:  { fontSize: 7, color: K.darkSlate, opacity: 0.65, marginTop: 1 },
  // Scoretabel
  tabelKop:     { flexDirection: 'row', backgroundColor: K.darkGreen, paddingVertical: 5, paddingHorizontal: 8, marginBottom: 1 },
  tabelRij:     { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 8 },
  tabelAspect:  { width: 120, fontSize: 8, fontFamily: 'Helvetica-Bold', color: K.darkSlate },
  tabelCelKop:  { width: 52, fontSize: 7, color: K.cream, textAlign: 'center', fontFamily: 'Helvetica-Bold' },
  tabelCel:     { width: 52, fontSize: 9, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  scheidingTop: { borderTopWidth: 1, borderTopColor: K.lightBg, marginTop: 1 },
  // Analyse
  samenvatting: { fontSize: 10.5, color: K.darkSlate, lineHeight: 1.7, marginBottom: 14, fontStyle: 'italic' },
  kaartRij:     { marginBottom: 7, padding: '8 12', borderRadius: 4 },
  kaartTitel:   { fontFamily: 'Helvetica-Bold', fontSize: 9.5, marginBottom: 3 },
  kaartTekst:   { fontSize: 9, lineHeight: 1.6 },
  typeTag:      { fontSize: 7, fontFamily: 'Helvetica-Bold', color: K.wit, borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2, marginBottom: 4, alignSelf: 'flex-start' },
  vraagBlok:    { backgroundColor: K.darkGreen, borderRadius: 4, padding: '8 12', marginBottom: 6 },
  vraagLabel:   { fontSize: 7, color: K.lightBg, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5, marginBottom: 3, textTransform: 'uppercase' },
  vraagTekst:   { fontSize: 9.5, color: K.cream, lineHeight: 1.65, fontStyle: 'italic' },
  afsluiting:   { backgroundColor: K.lightBg2, borderRadius: 4, padding: '10 14', marginTop: 8 },
  afsluitTekst: { fontSize: 10, color: K.darkSlate, lineHeight: 1.7, fontStyle: 'italic' },
});

// ── Document ──────────────────────────────────────────────────────────────────

export interface VerbindingswielPdfProps {
  naamA: string;
  naamB: string;
  scoresA: Score[];
  scoresB: Score[];
  analyse: Analyse;
}

function VerbindingswielDocument({ naamA, naamB, scoresA, scoresB, analyse }: VerbindingswielPdfProps) {
  const titel = 'Verbindingswiel';
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Document title={titel} author="Energieke Lieke">
      {/* ── Pagina 1: Spinnenweb + Scores ── */}
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel={titel} datum={datum} />
        <View style={g.headerSpacer} fixed />

        <View style={s.body}>
          <Text style={s.intro}>{naamA} & {naamB}</Text>

          {/* Spinnenweb + legenda */}
          <View style={s.spinnenRij} wrap={false}>
            <SpinnenwebPdf scoresA={scoresA} scoresB={scoresB} />
            <View style={s.legenda}>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: K.darkGreen, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>Legenda</Text>
              {[
                { kleur: K.darkRed,   stippel: false, label: `${naamA} — vervulling bewust` },
                { kleur: K.darkGreen, stippel: false, label: `${naamA} — vervulling onbewust` },
                { kleur: K.darkRed,   stippel: true,  label: `${naamB} — vervulling bewust` },
                { kleur: K.darkGreen, stippel: true,  label: `${naamB} — vervulling onbewust` },
                { kleur: K.orange,    stippel: true,  label: 'Gemiddelde vervulling' },
              ].map((item, i) => (
                <View key={i} style={s.legendaRij}>
                  <View style={[s.legendaLijn, { backgroundColor: item.stippel ? 'transparent' : item.kleur, borderTopWidth: item.stippel ? 1.5 : 0, borderTopColor: item.kleur, borderStyle: item.stippel ? 'dashed' : 'solid' }]} />
                  <Text style={s.legendaTekst}>{item.label}</Text>
                </View>
              ))}
              <View style={{ marginTop: 12 }}>
                {ASPECT_LABELS.map((l, i) => (
                  <Text key={i} style={s.aspectLabel}>{i + 1}. {l}</Text>
                ))}
              </View>
            </View>
          </View>

          {/* Scoretabel */}
          <PdfSectieKop titel="SCORES PER VERBINDINGSASPECT" />
          <View style={{ borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: K.lightBg }}>
            {/* Koptekst */}
            <View style={s.tabelKop}>
              <Text style={{ width: 120, fontSize: 7, color: K.cream, fontFamily: 'Helvetica-Bold' }}>Aspect</Text>
              <Text style={[s.tabelCelKop, { color: '#aed0ff' }]}>Belang</Text>
              <Text style={s.tabelCelKop}>Bewust</Text>
              <Text style={s.tabelCelKop}>Onbewust</Text>
              <Text style={[s.tabelCelKop, { color: '#aed0ff' }]}>Belang</Text>
              <Text style={s.tabelCelKop}>Bewust</Text>
              <Text style={s.tabelCelKop}>Onbewust</Text>
            </View>
            {/* Partner labels */}
            <View style={[s.tabelRij, { backgroundColor: K.lightBg2, paddingVertical: 3 }]}>
              <Text style={{ width: 120, fontSize: 7, color: K.darkSlate, opacity: 0.5 }} />
              <Text style={{ width: 156, fontSize: 7, fontFamily: 'Helvetica-Bold', color: K.darkSlate, textAlign: 'center' }}>{naamA}</Text>
              <Text style={{ width: 156, fontSize: 7, fontFamily: 'Helvetica-Bold', color: K.darkSlate, textAlign: 'center' }}>{naamB}</Text>
            </View>
            {aspecten.map((a, i) => (
              <View key={a.id} style={[s.tabelRij, { backgroundColor: i % 2 === 0 ? K.wit : K.cream }]} wrap={false}>
                <Text style={s.tabelAspect}>{ASPECT_LABELS[i]}</Text>
                <Text style={[s.tabelCel, { color: BLAUW }]}>{scoresA[i].belang}</Text>
                <Text style={[s.tabelCel, { color: K.darkRed }]}>{scoresA[i].vervullingBewust}</Text>
                <Text style={[s.tabelCel, { color: K.darkGreen }]}>{scoresA[i].vervullingOnbewust}</Text>
                <Text style={[s.tabelCel, { color: BLAUW }]}>{scoresB[i].belang}</Text>
                <Text style={[s.tabelCel, { color: K.darkRed }]}>{scoresB[i].vervullingBewust}</Text>
                <Text style={[s.tabelCel, { color: K.darkGreen }]}>{scoresB[i].vervullingOnbewust}</Text>
              </View>
            ))}
          </View>
        </View>
        <PdfFooter titel={titel} />
      </Page>

      {/* ── Pagina 2: Analyse ── */}
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel={`${titel} — Analyse`} datum={datum} />
        <View style={g.headerSpacer} fixed />

        <View style={s.body}>
          {analyse.samenvatting && (
            <>
              <PdfSectieKop titel="SAMENVATTING" />
              <Text style={s.samenvatting}>{analyse.samenvatting}</Text>
            </>
          )}

          {(analyse.sterktes?.length ?? 0) > 0 && (
            <>
              <PdfSectieKop titel="VERBINDINGSSTERKTES" />
              {analyse.sterktes!.map((st, i) => (
                <View key={i} style={[s.kaartRij, { backgroundColor: '#edf4e9' }]} wrap={false}>
                  <Text style={[s.kaartTitel, { color: K.darkGreen }]}>{st.aspect}</Text>
                  <Text style={[s.kaartTekst, { color: K.darkSlate }]}>{st.inzicht}</Text>
                </View>
              ))}
            </>
          )}

          {(analyse.aandacht?.length ?? 0) > 0 && (
            <>
              <PdfSectieKop titel="AANDACHTSGEBIEDEN" />
              {analyse.aandacht!.map((at, i) => {
                const kl = TYPE_KLEUR[at.type] || TYPE_KLEUR.beiden_laag;
                return (
                  <View key={i} style={[s.kaartRij, { backgroundColor: kl.bg, borderLeftWidth: 3, borderLeftColor: kl.tekst }]} wrap={false}>
                    <Text style={[s.typeTag, { backgroundColor: kl.tekst }]}>{kl.label}</Text>
                    <Text style={[s.kaartTitel, { color: kl.tekst }]}>{at.aspect}</Text>
                    <Text style={[s.kaartTekst, { color: kl.tekst }]}>{at.inzicht}</Text>
                  </View>
                );
              })}
            </>
          )}

          {(analyse.groei?.length ?? 0) > 0 && (
            <>
              <PdfSectieKop titel="GROEIKANSEN SAMEN" />
              {analyse.groei!.map((gr, i) => (
                <View key={i} style={[s.kaartRij, { backgroundColor: K.lightBg2 }]} wrap={false}>
                  <Text style={[s.kaartTitel, { color: K.darkRed }]}>{gr.aspect}</Text>
                  <Text style={[s.kaartTekst, { color: K.darkSlate }]}>{gr.tip}</Text>
                </View>
              ))}
            </>
          )}

          {analyse.reflectie && (
            <>
              <PdfSectieKop titel="REFLECTIEVRAGEN VOOR JULLIE SAMEN" />
              {[
                { nr: 1, v: analyse.reflectie.vraag1 },
                { nr: 2, v: analyse.reflectie.vraag2 },
                { nr: 3, v: analyse.reflectie.vraag3 },
              ].filter(x => x.v).map(({ nr, v }) => (
                <View key={nr} style={s.vraagBlok} wrap={false}>
                  <Text style={s.vraagLabel}>Vraag {nr}</Text>
                  <Text style={s.vraagTekst}>"{v}"</Text>
                </View>
              ))}
            </>
          )}

          {analyse.afsluiting && (
            <View style={s.afsluiting} wrap={false}>
              <Text style={s.afsluitTekst}>{analyse.afsluiting}</Text>
            </View>
          )}
        </View>
        <PdfFooter titel={titel} />
      </Page>
    </Document>
  );
}

// ── Download knop ─────────────────────────────────────────────────────────────

export function VerbindingswielPdfKnop(props: VerbindingswielPdfProps) {
  const bestandsnaam = `verbindingswiel-${props.naamA.toLowerCase().replace(/\s+/g, '-')}-${props.naamB.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  return (
    <PDFDownloadLink document={<VerbindingswielDocument {...props} />} fileName={bestandsnaam}>
      {({ loading }) => (
        <span style={{
          display: 'inline-block', width: '100%', padding: '11px', textAlign: 'center',
          fontSize: 14, fontWeight: 600, cursor: loading ? 'default' : 'pointer',
          borderRadius: 10, background: '#3b5633', color: '#fcebdc', boxSizing: 'border-box',
        }}>
          {loading ? 'PDF voorbereiden…' : 'Download rapport als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}
