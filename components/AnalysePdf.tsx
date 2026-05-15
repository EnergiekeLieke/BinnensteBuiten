'use client';

import { Document, Page, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, AnalyseInhoud } from '@/lib/pdfHelpers';

const s = StyleSheet.create({
  pagina: { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:   { paddingHorizontal: 40 },
});

function AnalyseDocument({ titel, tekst }: { titel: string; tekst: string }) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <Document title={titel} author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel={titel} datum={datum} />
        <View style={g.headerSpacer} fixed />
        <View style={s.body}>
          <AnalyseInhoud tekst={tekst} />
        </View>
        <PdfFooter titel={titel} />
      </Page>
    </Document>
  );
}

export function AnalysePdfKnop({ titel, tekst }: { titel: string; tekst: string }) {
  const bestandsnaam = titel.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.pdf';
  return (
    <PDFDownloadLink document={<AnalyseDocument titel={titel} tekst={tekst} />} fileName={bestandsnaam}>
      {({ loading }) => (
        <span className="text-sm px-3 py-1.5 rounded-lg bg-darkRed text-white hover:bg-darkRed/80 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}
