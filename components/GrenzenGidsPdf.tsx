'use client';

import dynamic from 'next/dynamic';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, PdfSectieKop } from '@/lib/pdfHelpers';
import type { GrensManier } from './GrenzenGids';

const s = StyleSheet.create({
  pagina:        { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:          { paddingHorizontal: 40 },
  wanneer:       { fontSize: 8.5, color: K.darkSlate, lineHeight: 1.5, marginBottom: 8, opacity: 0.65 },
  voorbeeldTekst:{ fontSize: 9.5, color: K.darkSlate, lineHeight: 1.6, marginBottom: 4 },
  geenKeuze:     { fontSize: 9, color: K.midGreen, lineHeight: 1.5, marginBottom: 4 },
  krachtTekst:   { fontSize: 9, color: K.darkGreen, lineHeight: 1.5, marginTop: 4 },
  letOpTekst:    { fontSize: 9, color: K.orange, lineHeight: 1.5, marginBottom: 4 },
  situatieTekst: { fontSize: 9, color: K.midGreen, fontFamily: 'Helvetica-Oblique', marginTop: 4, marginBottom: 8 },
});

interface Props {
  geselecteerd: string[];
  manieren: GrensManier[];
  gekozenVoorbeelden: Record<string, boolean[]>;
  situaties: Record<string, string>;
}

function GrenzenGidsDocument({ geselecteerd, manieren, gekozenVoorbeelden, situaties }: Props) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const geselecteerdeManieren = manieren.filter((m) => geselecteerd.includes(m.id));

  return (
    <Document title="Grenzen Gids" author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel="Grenzen Gids" datum={datum} />
        <View style={g.headerSpacer} fixed />
        <View style={s.body}>
          {geselecteerdeManieren.map((manier) => {
            const gekozen = gekozenVoorbeelden[manier.id] || manier.voorbeelden.map(() => false);
            const geselecteerdeVoorbeelden = manier.voorbeelden.filter((_, i) => gekozen[i]);
            const situatie = situaties[manier.id];

            return (
              <View key={manier.id} style={{ marginBottom: 4 }}>
                <PdfSectieKop titel={manier.naam.toUpperCase()} />
                <Text style={s.wanneer}>{manier.wanneer}</Text>
                {geselecteerdeVoorbeelden.length > 0 ? (
                  geselecteerdeVoorbeelden.map((voorbeeld, i) => (
                    <Text key={i} style={s.voorbeeldTekst}>• {voorbeeld}</Text>
                  ))
                ) : (
                  <Text style={s.geenKeuze}>(Geen voorbeeld gekozen voor deze manier)</Text>
                )}
                <Text style={s.krachtTekst}>Kracht: {manier.kracht}</Text>
                {!!manier.letOp && (
                  <Text style={s.letOpTekst}>Let op: {manier.letOp}</Text>
                )}
                {!!situatie && (
                  <Text style={s.situatieTekst}>Situatie: {situatie}</Text>
                )}
              </View>
            );
          })}
        </View>
        <PdfFooter titel="Grenzen Gids" />
      </Page>
    </Document>
  );
}

function GrenzenGidsPdfKnopInner(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PDFDownloadLink } = require('@react-pdf/renderer');
  return (
    <PDFDownloadLink document={<GrenzenGidsDocument {...props} />} fileName="grenzen-gids.pdf">
      {({ loading }: { loading: boolean }) => (
        <span className="text-sm px-3 py-1.5 rounded-lg bg-darkGreen text-white hover:bg-darkGreen/80 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}

export const GrenzenGidsPdfKnop = dynamic(
  () => Promise.resolve(GrenzenGidsPdfKnopInner),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);
