'use client';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter } from '@/lib/pdfHelpers';

const stijlen = StyleSheet.create({
  pagina: { backgroundColor: K.wit, paddingBottom: 60 },
  inhoud: { paddingHorizontal: 40, paddingTop: 28 },
  olieNaam: { fontFamily: 'Helvetica-Bold', fontSize: 18, color: K.darkSlate, marginBottom: 20 },
  rij: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: K.lightBg2, borderRadius: 8, padding: 12, marginBottom: 8 },
  rijLabel: { fontSize: 8, color: K.midGreen, marginBottom: 3 },
  rijWaarde: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: K.darkSlate },
  rijTekst: { flex: 1 },
});

interface Props {
  olie: string;
  keuzes: Record<number, string>;
  getoond: number[];
  labels: Record<number, [string, string]>;
}

function OlieKeuzehulpDocument({ olie, keuzes, getoond, labels }: Props) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Document>
      <Page size="A4" style={stijlen.pagina}>
        <PdfHeader titel="Olie Inzetplan" datum={datum} />
        <View style={stijlen.inhoud}>
          <View style={g.sectieKop}>
            <View style={g.sectieBar} />
            <Text style={g.sectieTitel}>JOUW KEUZES</Text>
          </View>
          <Text style={stijlen.olieNaam}>{olie}</Text>
          {getoond.map(id => {
            const [label] = labels[id] ?? ['', ''];
            return (
              <View key={id} style={stijlen.rij}>
                <View style={stijlen.rijTekst}>
                  <Text style={stijlen.rijLabel}>{label.toUpperCase()}</Text>
                  <Text style={stijlen.rijWaarde}>{keuzes[id]}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <PdfFooter titel="Olie Inzetplan" />
      </Page>
    </Document>
  );
}

export function OlieKeuzehulpPdfKnop({ olie, keuzes, getoond, labels }: Props) {
  const bestandsnaam = `olie-inzetplan-${olie.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}.pdf`;

  return (
    <PDFDownloadLink
      document={<OlieKeuzehulpDocument olie={olie} keuzes={keuzes} getoond={getoond} labels={labels} />}
      fileName={bestandsnaam}
      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-darkRed text-cream font-salmon text-lg hover:bg-darkRed/90 transition-colors"
    >
      {({ loading }) => loading ? 'PDF voorbereiden...' : 'Exporteer als PDF'}
    </PDFDownloadLink>
  );
}
