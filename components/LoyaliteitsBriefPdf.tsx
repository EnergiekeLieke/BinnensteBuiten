'use client';

import dynamic from 'next/dynamic';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter } from '@/lib/pdfHelpers';

const s = StyleSheet.create({
  pagina:       { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:         { paddingHorizontal: 40 },
  briefRegel:   { fontSize: 11, color: K.darkSlate, lineHeight: 1.8 },
  briefLeegte:  { height: 10 },
});

interface Props {
  naam: string;
  brief: string;
}

function LoyaliteitsBriefDocument({ naam, brief }: Props) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const regels = brief.split('\n');

  return (
    <Document title={`Loyaliteitsbrief aan ${naam}`} author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel="Keuze Kompas · Richting Oost" datum={datum} />
        <View style={g.headerSpacer} fixed />
        <View style={s.body}>
          {regels.map((regel, i) =>
            regel.trim() === '' ? (
              <View key={i} style={s.briefLeegte} />
            ) : (
              <Text key={i} style={s.briefRegel}>{regel}</Text>
            )
          )}
        </View>
        <PdfFooter titel="Loyaliteitsbrief" />
      </Page>
    </Document>
  );
}

function LoyaliteitsBriefPdfKnopInner(props: Props) {
  const { PDFDownloadLink } = require('@react-pdf/renderer');
  const bestandsnaam = `loyaliteitsbrief-${props.naam.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  return (
    <PDFDownloadLink document={<LoyaliteitsBriefDocument {...props} />} fileName={bestandsnaam}>
      {({ loading }: { loading: boolean }) => (
        <span className="text-sm px-3 py-1.5 rounded-lg bg-darkRed text-white hover:bg-darkRed/80 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}

export const LoyaliteitsBriefPdfKnop = dynamic(
  () => Promise.resolve(LoyaliteitsBriefPdfKnopInner),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);
