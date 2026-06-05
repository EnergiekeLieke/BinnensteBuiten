'use client';

import dynamic from 'next/dynamic';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, PdfSectieKop, AnalyseInhoud } from '@/lib/pdfHelpers';
import type { Kwadrant } from './KernKwadranten';

const s = StyleSheet.create({
  pagina:         { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:           { paddingHorizontal: 40 },
  kwadrantWrap:   { marginTop: 6, marginBottom: 12 },
  rij:            { flexDirection: 'row', alignItems: 'stretch' },
  midden:         { flexDirection: 'row', alignItems: 'center', height: 28 },
  vak:            { flex: 1, padding: 8, borderWidth: 1.5 },
  brug:           { width: 36, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  brugTekst:      { fontSize: 6, textAlign: 'center', color: K.midGreen },
  vakLabel:       { fontSize: 7, letterSpacing: 1.5, marginBottom: 3 },
  vakWaarde:      { fontFamily: 'Helvetica-Bold', fontSize: 10, marginBottom: 2 },
  vakSub:         { fontSize: 8, lineHeight: 1.4 },
});

interface Props {
  kwadranten: Kwadrant[];
}

function KernKwadrantenDocument({ kwadranten }: Props) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Document title="Kernkwadranten" author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel="Kernkwadranten" datum={datum} />
        <View style={g.headerSpacer} fixed />
        <View style={s.body}>
          {kwadranten.map((k, idx) => (
            <View key={k.id}>
              <PdfSectieKop titel={`KWADRANT ${idx + 1}${k.label ? `: ${k.label.toUpperCase()}` : ''}`} />

              <View style={s.kwadrantWrap}>
                {/* Rij 1: Kwaliteit — te veel → — Valkuil */}
                <View style={s.rij}>
                  <View style={[s.vak, { borderColor: K.darkGreen, backgroundColor: K.lightBg2 }]}>
                    <Text style={[s.vakLabel, { color: K.darkGreen }]}>KWALITEIT</Text>
                    <Text style={[s.vakWaarde, { color: K.darkGreen }]}>{k.kwaliteit}</Text>
                    {!!k.kwaliteitToelichting && (
                      <Text style={[s.vakSub, { color: K.darkSlate }]}>{k.kwaliteitToelichting}</Text>
                    )}
                  </View>
                  <View style={s.brug}>
                    <Text style={s.brugTekst}>te veel</Text>
                    <Text style={s.brugTekst}>→</Text>
                  </View>
                  <View style={[s.vak, { borderColor: K.darkRed, backgroundColor: '#fdf2ee' }]}>
                    <Text style={[s.vakLabel, { color: K.darkRed }]}>VALKUIL</Text>
                    <Text style={[s.vakWaarde, { color: K.darkRed }]}>{k.valkuil}</Text>
                    {!!k.valkuilToelichting && (
                      <Text style={[s.vakSub, { color: K.darkSlate }]}>{k.valkuilToelichting}</Text>
                    )}
                  </View>
                </View>

                {/* Rij 2: pijlen */}
                <View style={s.midden}>
                  <View style={[s.brug, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={s.brugTekst}>↑ positief</Text>
                    <Text style={s.brugTekst}>tegendeel</Text>
                  </View>
                  <View style={{ width: 36 }} />
                  <View style={[s.brug, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={s.brugTekst}>positief</Text>
                    <Text style={s.brugTekst}>tegendeel ↓</Text>
                  </View>
                </View>

                {/* Rij 3: Allergie — ← te veel — Uitdaging */}
                <View style={s.rij}>
                  <View style={[s.vak, { borderColor: K.orange, backgroundColor: '#fdf4ec' }]}>
                    <Text style={[s.vakLabel, { color: K.orange }]}>ALLERGIE</Text>
                    <Text style={[s.vakWaarde, { color: K.orange }]}>{k.allergie}</Text>
                    {!!k.allergieToelichting && (
                      <Text style={[s.vakSub, { color: K.darkSlate }]}>{k.allergieToelichting}</Text>
                    )}
                  </View>
                  <View style={s.brug}>
                    <Text style={s.brugTekst}>← te veel</Text>
                  </View>
                  <View style={[s.vak, { borderColor: K.midGreen, backgroundColor: '#f3f6f0' }]}>
                    <Text style={[s.vakLabel, { color: K.midGreen }]}>UITDAGING</Text>
                    <Text style={[s.vakWaarde, { color: K.midGreen }]}>{k.uitdaging}</Text>
                    {!!k.uitdagingToelichting && (
                      <Text style={[s.vakSub, { color: K.darkSlate }]}>{k.uitdagingToelichting}</Text>
                    )}
                  </View>
                </View>
              </View>

              <AnalyseInhoud tekst={k.analyse} />
            </View>
          ))}
        </View>
        <PdfFooter titel="Kernkwadranten" />
      </Page>
    </Document>
  );
}

function KernKwadrantenPdfKnopInner({ kwadranten }: Props) {
  const { PDFDownloadLink } = require('@react-pdf/renderer');
  return (
    <PDFDownloadLink document={<KernKwadrantenDocument kwadranten={kwadranten} />} fileName="kernkwadranten.pdf">
      {({ loading }: { loading: boolean }) => (
        <span className="text-sm px-3 py-1.5 rounded-lg bg-darkGreen text-white hover:bg-darkGreen/80 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}

export const KernKwadrantenPdfKnop = dynamic(
  () => Promise.resolve(KernKwadrantenPdfKnopInner),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);
