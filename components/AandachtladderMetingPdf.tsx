'use client';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter } from '@/lib/pdfHelpers';
import type { Trede, Duo } from './AandachtladderMeting';

function UitlegPdf({ tekst }: { tekst: string }) {
  const delen = tekst.split(/\*\*(.+?)\*\*/g);
  return (
    <Text style={s.uitlegTekst}>
      {delen.map((deel, i) =>
        i % 2 === 1
          ? <Text key={i} style={{ fontFamily: 'Helvetica-Bold' }}>{deel}</Text>
          : deel
      )}
    </Text>
  );
}

const TREDEACHTERGROND: Record<string, string> = {
  rood:   K.darkRed,
  oranje: K.orange,
  groen:  K.darkGreen,
};

const s = StyleSheet.create({
  pagina:     { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:       { paddingHorizontal: 40 },
  sectieKop:  { fontFamily: 'Helvetica-Bold', fontSize: 9, color: K.darkSlate, letterSpacing: 1.2, borderBottomWidth: 1, borderBottomColor: K.orange, paddingBottom: 4, marginBottom: 8, marginTop: 16 },
  tredeBlok:  { borderRadius: 4, padding: '8 12', marginBottom: 4 },
  tredeNaam:  { fontFamily: 'Helvetica-Bold', fontSize: 14, color: K.cream, marginBottom: 2 },
  tredeSub:   { fontSize: 9, color: K.cream, opacity: 0.85 },
  duoRij:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: K.lightBg2, borderRadius: 4, padding: '8 12', marginBottom: 8 },
  duoLinks:   { fontFamily: 'Helvetica-Bold', fontSize: 10, color: K.darkRed },
  duoRechts:  { fontFamily: 'Helvetica-Bold', fontSize: 10, color: K.darkGreen },
  duoPct:     { fontFamily: 'Helvetica-Bold', fontSize: 18, color: K.darkGreen },
  uitlegBlok: { backgroundColor: K.lightBg2, borderRadius: 4, padding: 10, marginBottom: 8 },
  uitlegTekst:{ fontSize: 9.5, color: K.darkSlate, lineHeight: 1.55 },
  tipTekst:   { fontSize: 9, color: K.midGreen, fontStyle: 'italic', marginTop: 4 },
  vraagBlok:  { marginBottom: 10 },
  vraag:      { fontFamily: 'Helvetica-Bold', fontSize: 9.5, color: K.darkGreen, marginBottom: 4 },
  antwoord:   { fontSize: 9.5, color: K.darkSlate, lineHeight: 1.6 },
  leeg:       { fontSize: 9, color: K.midGreen, fontStyle: 'italic' },
});

interface Props {
  trede: Trede;
  duo: Duo;
  subkeuzeKeuze?: string | null;
  percentage: number;
  antwoorden: [string, string, string];
}

function MetingDocument({ trede, duo, subkeuzeKeuze, percentage, antwoorden }: Props) {
  const titel = 'Aandachtladder';
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const tredeKleur = TREDEACHTERGROND[trede.groep] ?? K.darkGreen;

  return (
    <Document title={titel} author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel={titel} datum={datum} />
        <View style={g.headerSpacer} fixed />

        <View style={s.body}>
          {/* Trede */}
          <Text style={s.sectieKop}>JOUW TREDE</Text>
          <View style={[s.tredeBlok, { backgroundColor: tredeKleur }]}>
            <Text style={s.tredeNaam}>Trede {trede.id}: {trede.naam}</Text>
            <Text style={s.tredeSub}>{trede.sub}</Text>
          </View>

          {/* Duo + percentage */}
          <Text style={s.sectieKop}>GEKOZEN ONDERWERP</Text>
          <View style={s.duoRij} wrap={false}>
            <Text style={s.duoLinks}>{duo.links}</Text>
            <Text style={s.duoPct}>{percentage}%</Text>
            <Text style={s.duoRechts}>{duo.rechts}</Text>
          </View>

          {subkeuzeKeuze && duo.subkeuze && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 }}>
              <Text style={{ fontSize: 9, color: K.darkSlate }}>{duo.subkeuze.vraag}</Text>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: K.darkGreen }}>{subkeuzeKeuze}</Text>
            </View>
          )}

          {/* Uitleg */}
          <View style={s.uitlegBlok} wrap={false}>
            <UitlegPdf tekst={duo.uitleg} />
            {duo.tip && <Text style={s.tipTekst}>{duo.tip}</Text>}
          </View>

          {/* Journalling */}
          <Text style={s.sectieKop}>JOURNALLING</Text>
          {duo.vragen.map((vraag, i) => (
            <View key={i} style={s.vraagBlok} wrap={false}>
              <Text style={s.vraag}>✍ {vraag}</Text>
              {antwoorden[i].trim()
                ? <Text style={s.antwoord}>{antwoorden[i]}</Text>
                : <Text style={s.leeg}>(niet ingevuld)</Text>
              }
            </View>
          ))}
        </View>

        <PdfFooter titel={titel} />
      </Page>
    </Document>
  );
}

export function AandachtladderMetingPdfKnop(props: Props) {
  return (
    <PDFDownloadLink document={<MetingDocument {...props} />} fileName="aandachtladder-meting.pdf">
      {({ loading }) => (
        <span className="px-6 py-2.5 rounded-xl bg-darkRed text-cream font-salmon hover:bg-darkRed/90 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}
