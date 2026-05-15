'use client';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, PdfSectieKop } from '@/lib/pdfHelpers';

const s = StyleSheet.create({
  pagina:       { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:         { paddingHorizontal: 40 },
  scoreBalk:    { borderRadius: 6, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 4 },
  scoreCijfer:  { fontFamily: 'Helvetica-Bold', fontSize: 32 },
  scoreMax:     { fontSize: 11, color: K.midGreen },
  scoreTekst:   { flex: 1, fontSize: 10, color: K.darkSlate, lineHeight: 1.4 },
  stellingRij:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: K.lightBg },
  stellingNr:   { fontFamily: 'Helvetica-Bold', fontSize: 8, color: K.midGreen, width: 14 },
  stellingTekst:{ flex: 1, fontSize: 8.5, color: K.darkSlate, lineHeight: 1.4 },
  stellingScore:{ fontFamily: 'Helvetica-Bold', fontSize: 10, width: 18, textAlign: 'right' },
  ovBlok:       { borderLeftWidth: 3, borderLeftColor: K.orange, backgroundColor: K.lightBg2, borderRadius: 4, padding: 10, marginBottom: 8 },
  ovTekst:      { fontFamily: 'Helvetica-Bold', fontSize: 9, color: K.darkSlate, marginBottom: 5 },
  ovSliders:    { flexDirection: 'row', gap: 12 },
  sliderLabel:  { fontSize: 8, color: K.midGreen },
  sliderWaarde: { fontFamily: 'Helvetica-Bold', fontSize: 8 },
  affBlok:      { borderRadius: 6, padding: 10, marginBottom: 8 },
  affLabel:     { fontSize: 7.5, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5, marginBottom: 4 },
  affTekst:     { fontSize: 9, lineHeight: 1.5, fontStyle: 'italic', color: K.darkSlate },
  expLabel:     { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: K.midGreen, marginBottom: 2 },
  expTekst:     { fontSize: 8, color: K.darkSlate, lineHeight: 1.4, marginTop: 6 },
});

export interface FlowOvertuiging {
  tekst: string;
  overtuigd: number;
  loslaten: number;
  positief: string;
  groei: string;
  experiment: string;
  experimentGroei: string;
}

export interface FlowPdfProps {
  totaal: number;
  bandTekst: string;
  stellingen: { tekst: string; score: number }[];
  overtuigingen: FlowOvertuiging[];
}

function FlowDocument({ totaal, bandTekst, stellingen, overtuigingen }: FlowPdfProps) {
  const titel = 'FLOW-test';
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const bandKleur = totaal >= 80 ? K.darkGreen : totaal >= 50 ? K.orange : K.darkRed;
  const bandBg    = totaal >= 80 ? '#f0f5f0'   : totaal >= 50 ? '#fef3ec' : '#fdf0ec';

  const top3 = [...overtuigingen].sort((a, b) => b.overtuigd - a.overtuigd).slice(0, 3);

  return (
    <Document title={titel} author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel={titel} datum={datum} />
        <View style={g.headerSpacer} fixed />

        <View style={s.body}>
          <PdfSectieKop titel="FLOWSCORE" />
          <View style={[s.scoreBalk, { backgroundColor: bandBg }]} wrap={false}>
            <Text style={[s.scoreCijfer, { color: bandKleur }]}>
              {totaal}<Text style={s.scoreMax}>/100</Text>
            </Text>
            <Text style={s.scoreTekst}>{bandTekst}</Text>
          </View>

          <View style={g.sectieKop} minPresenceAhead={60}>
            <View style={g.sectieBar} />
            <Text style={g.sectieTitel}>FLOWMETING</Text>
          </View>
          {stellingen.map((st, i) => (
            <View key={i} style={s.stellingRij} wrap={false}>
              <Text style={s.stellingNr}>{i + 1}.</Text>
              <Text style={s.stellingTekst}>{st.tekst}</Text>
              <Text style={[s.stellingScore, { color: st.score >= 7 ? K.darkGreen : st.score >= 4 ? K.orange : K.darkRed }]}>{st.score}</Text>
            </View>
          ))}

          {overtuigingen.length > 0 && (
            <>
              <View style={g.sectieKop} minPresenceAhead={60}>
                <View style={g.sectieBar} />
                <Text style={g.sectieTitel}>ACTIEVE OVERTUIGINGEN</Text>
              </View>
              {overtuigingen.map((ov, i) => (
                <View key={i} style={s.ovBlok} wrap={false}>
                  <Text style={s.ovTekst}>{ov.tekst}</Text>
                  <View style={s.ovSliders}>
                    <Text style={s.sliderLabel}>Overtuigd: <Text style={[s.sliderWaarde, { color: K.darkRed }]}>{ov.overtuigd}%</Text></Text>
                    <Text style={s.sliderLabel}>Bereid los te laten: <Text style={[s.sliderWaarde, { color: K.darkGreen }]}>{ov.loslaten}%</Text></Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {top3.length > 0 && (
            <>
              <View style={g.sectieKop} minPresenceAhead={60}>
                <View style={g.sectieBar} />
                <Text style={g.sectieTitel}>JOUW AFFIRMATIES</Text>
              </View>
              {top3.map((ov, i) => {
                const klaar = ov.loslaten >= 50;
                const tekst = ov.tekst.endsWith('.') ? ov.tekst.slice(0, -1).toLowerCase() : ov.tekst.toLowerCase();
                const affirmatie = klaar
                  ? `"Ik kies ervoor om de overtuiging ${tekst} los te laten, omdat ik weet dat ${ov.positief}. Dankjewel overtuiging, dat je me al die tijd hebt beschermd. Ik kies er nu voor om te vertrouwen op mijn natuurlijke flow."`
                  : ov.groei;
                return (
                  <View key={i} style={[s.affBlok, { backgroundColor: klaar ? '#f0f5f0' : '#fef3ec', borderLeftWidth: 3, borderLeftColor: klaar ? K.darkGreen : K.orange }]} wrap={false}>
                    <Text style={[s.affLabel, { color: klaar ? K.darkGreen : K.orange }]}>
                      {klaar ? `${ov.loslaten}% BEREID: LOSLATEN` : `${ov.loslaten}% BEREID: GROEI-AFFIRMATIE`}
                    </Text>
                    <Text style={s.affTekst}>{affirmatie}</Text>
                    <View style={{ marginTop: 8, padding: 8, backgroundColor: K.wit, borderRadius: 4 }}>
                      <Text style={s.expLabel}>SPEEL HET ANDERS</Text>
                      <Text style={s.expTekst}>{klaar ? ov.experiment : ov.experimentGroei}</Text>
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </View>

        <PdfFooter titel={titel} />
      </Page>
    </Document>
  );
}

export function AandachtladderPdfKnop(props: FlowPdfProps) {
  return (
    <PDFDownloadLink document={<FlowDocument {...props} />} fileName="flow-test.pdf">
      {({ loading }) => (
        <span className="px-8 py-3 rounded-xl bg-darkGreen text-cream font-salmon text-lg hover:bg-darkGreen/90 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}
