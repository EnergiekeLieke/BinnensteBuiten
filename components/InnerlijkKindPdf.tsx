'use client';

import dynamic from 'next/dynamic';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, PdfSectieKop, AnalyseInhoud } from '@/lib/pdfHelpers';

const s = StyleSheet.create({
  pagina:      { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:        { paddingHorizontal: 40 },
  wondrij:     { marginBottom: 8 },
  wondHeader:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  wondNaam:    { fontFamily: 'Helvetica-Bold', fontSize: 9, color: K.darkSlate },
  wondKracht:  { fontSize: 9, color: K.midGreen },
  wondScore:   { fontFamily: 'Helvetica-Bold', fontSize: 9, color: K.darkGreen },
  balk:        { height: 5, backgroundColor: K.lightBg, borderRadius: 3 },
  balkVulling: { height: 5, backgroundColor: K.darkGreen, borderRadius: 3 },
  behoefte:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  behoefteNm:  { fontSize: 9, color: K.darkSlate },
  behoefteScr: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: K.darkGreen },
  reflVraag:   { fontFamily: 'Helvetica-Bold', fontSize: 9, color: K.darkSlate, marginBottom: 2, marginTop: 6 },
  reflAntw:    { fontSize: 9, color: K.darkSlate, lineHeight: 1.5, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: K.midGreen },
});

interface Wond {
  wond: string;
  kracht: string;
}

interface Behoefte {
  naam: string;
}

interface Props {
  titel: string;
  analyse: string;
  wonden: Wond[];
  behoeften: Behoefte[];
  reflectievragen: string[];
  scores: number[];
  behoeftenScores: number[];
  reflecties: string[];
}

function InnerlijkKindDocument({ titel, analyse, wonden, behoeften, reflectievragen, scores, behoeftenScores, reflecties }: Props) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const heeftReflectie = reflecties.some((r) => r.trim());

  return (
    <Document title={titel} author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel={titel} datum={datum} />
        <View style={g.headerSpacer} fixed />
        <View style={s.body}>

          {/* Scores */}
          <PdfSectieKop titel="Jouw scores" />
          {wonden.map((w, i) => (
            <View key={i} style={s.wondrij}>
              <View style={s.wondHeader}>
                <Text style={s.wondNaam}>{w.wond} <Text style={s.wondKracht}>→ {w.kracht}</Text></Text>
                <Text style={s.wondScore}>{scores[i]}%</Text>
              </View>
              <View style={s.balk}>
                <View style={[s.balkVulling, { width: `${scores[i]}%` }]} />
              </View>
            </View>
          ))}

          {/* Behoeften als kind */}
          <PdfSectieKop titel="Behoeften als kind" />
          {behoeften.map((b, i) => (
            <View key={i} style={s.behoefte}>
              <Text style={s.behoefteNm}>{b.naam}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={[s.balk, { width: 80 }]}>
                  <View style={[s.balkVulling, { width: `${behoeftenScores[i]}%` }]} />
                </View>
                <Text style={s.behoefteScr}>{behoeftenScores[i]}%</Text>
              </View>
            </View>
          ))}

          {/* Reflectie */}
          {heeftReflectie && (
            <>
              <PdfSectieKop titel="Reflectie" />
              {reflectievragen.map((vraag, i) =>
                reflecties[i].trim() ? (
                  <View key={i} style={{ marginBottom: 8 }}>
                    <Text style={s.reflVraag}>{vraag}</Text>
                    <Text style={s.reflAntw}>{reflecties[i].trim()}</Text>
                  </View>
                ) : null
              )}
            </>
          )}

          {/* Analyse */}
          <PdfSectieKop titel="Analyse" />
          <AnalyseInhoud tekst={analyse} />

        </View>
        <PdfFooter titel={titel} />
      </Page>
    </Document>
  );
}

function InnerlijkKindPdfKnopInner(props: Props) {
  const { PDFDownloadLink } = require('@react-pdf/renderer');
  const bestandsnaam = 'innerlijk-kind.pdf';
  return (
    <PDFDownloadLink document={<InnerlijkKindDocument {...props} />} fileName={bestandsnaam}>
      {({ loading }: { loading: boolean }) => (
        <span className="text-sm px-3 py-1.5 rounded-lg bg-darkRed text-white hover:bg-darkRed/80 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}

export const InnerlijkKindPdfKnop = dynamic(
  () => Promise.resolve(InnerlijkKindPdfKnopInner),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);
