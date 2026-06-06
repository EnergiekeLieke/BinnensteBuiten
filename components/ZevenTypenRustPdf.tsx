'use client';

import dynamic from 'next/dynamic';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, PdfSectieKop } from '@/lib/pdfHelpers';
import type { RustTyp } from './ZevenTypenRust';

const s = StyleSheet.create({
  pagina:          { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:            { paddingHorizontal: 40 },
  beschrijving:    { fontSize: 8.5, color: K.darkSlate, lineHeight: 1.5, marginBottom: 8, opacity: 0.65 },
  affirmatieTekst: { fontSize: 9.5, color: K.darkSlate, lineHeight: 1.6, marginBottom: 4 },
  geenKeuze:       { fontSize: 9, color: K.midGreen, lineHeight: 1.5, marginBottom: 4 },
  notitieTekst:    { fontSize: 9, color: K.midGreen, fontFamily: 'Helvetica-Oblique', marginTop: 4, marginBottom: 4 },
  olieTekst:       { fontSize: 9, color: K.darkGreen, marginTop: 2, marginBottom: 8 },
});

interface Props {
  geselecteerd: string[];
  typen: RustTyp[];
  gekozenAffirmaties: Record<string, boolean[]>;
  notities: Record<string, string>;
  gekozenOlieen: Record<string, string[]>;
}

function ZevenTypenRustDocument({ geselecteerd, typen, gekozenAffirmaties, notities, gekozenOlieen }: Props) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const geselecteerdeTypen = typen.filter((t) => geselecteerd.includes(t.id));

  return (
    <Document title="7 Typen Rust" author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel="7 Typen Rust" datum={datum} />
        <View style={g.headerSpacer} fixed />
        <View style={s.body}>
          {geselecteerdeTypen.map((typ) => {
            const gekozen = gekozenAffirmaties[typ.id] || typ.affirmaties.map(() => false);
            const geselecteerdeAffirmaties = typ.affirmaties.filter((_, i) => gekozen[i]);
            const notitie = notities[typ.id];
            const olieen = gekozenOlieen[typ.id] || [];

            return (
              <View key={typ.id} style={{ marginBottom: 4 }}>
                <PdfSectieKop titel={typ.naam.toUpperCase()} />
                <Text style={s.beschrijving}>{typ.beschrijving}</Text>
                {geselecteerdeAffirmaties.length > 0 ? (
                  geselecteerdeAffirmaties.map((aff, i) => (
                    <Text key={i} style={s.affirmatieTekst}>• {aff}</Text>
                  ))
                ) : (
                  <Text style={s.geenKeuze}>(Geen affirmatie gekozen voor dit type)</Text>
                )}
                {!!notitie && (
                  <Text style={s.notitieTekst}>Actie deze week: {notitie}</Text>
                )}
                {olieen.length > 0 && (
                  <Text style={s.olieTekst}>Olie: {olieen.join(', ')}</Text>
                )}
              </View>
            );
          })}
        </View>
        <PdfFooter titel="7 Typen Rust" />
      </Page>
    </Document>
  );
}

function ZevenTypenRustPdfKnopInner(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PDFDownloadLink } = require('@react-pdf/renderer');
  return (
    <PDFDownloadLink document={<ZevenTypenRustDocument {...props} />} fileName="7-typen-rust.pdf">
      {({ loading }: { loading: boolean }) => (
        <span className="text-sm px-3 py-1.5 rounded-lg bg-darkGreen text-white hover:bg-darkGreen/80 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}

export const ZevenTypenRustPdfKnop = dynamic(
  () => Promise.resolve(ZevenTypenRustPdfKnopInner),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);
