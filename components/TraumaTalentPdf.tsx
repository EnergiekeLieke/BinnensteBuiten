'use client';

import dynamic from 'next/dynamic';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, PdfSectieKop, AnalyseInhoud } from '@/lib/pdfHelpers';
import type { TraumaPatroon } from './TraumaTalent';

const s = StyleSheet.create({
  pagina:        { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:          { paddingHorizontal: 40 },
  patroonRij:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: K.lightBg },
  patroonNaam:   { fontFamily: 'Helvetica-Bold', fontSize: 9, color: K.darkSlate },
  patroonTalent: { fontSize: 9, color: K.darkGreen },
  patroonIntentie: { fontSize: 8, color: K.darkSlate, opacity: 0.65, lineHeight: 1.4, paddingBottom: 6, paddingHorizontal: 0 },
  kwadrantContainer: { flexDirection: 'column', marginTop: 8, marginBottom: 12 },
  kwadrantRij:   { flexDirection: 'row', alignItems: 'stretch' },
  kwadrantMidden:{ flexDirection: 'row', alignItems: 'center', height: 30 },
  kwadrantVak:   { flex: 1, padding: 10, borderWidth: 1.5 },
  kwadrantBrug:  { width: 36, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  kwadrantBrugTekst: { fontSize: 6, textAlign: 'center', color: K.midGreen },
  kwadrantLabel: { fontSize: 7, letterSpacing: 1.5, marginBottom: 4 },
  kwadrantWaarde:{ fontFamily: 'Helvetica-Bold', fontSize: 10, marginBottom: 3 },
  kwadrantSub:   { fontSize: 8, lineHeight: 1.4 },
  kwadrantNotitie: { fontSize: 7.5, fontFamily: 'Helvetica-Oblique', marginTop: 6 },
});

interface Props {
  patronen: TraumaPatroon[];
  focusPatroon: TraumaPatroon;
  uitdaging: string;
  allergie: string;
  analyse: string;
}

function TraumaTalentDocument({ patronen, focusPatroon, uitdaging, allergie, analyse }: Props) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Document title="Trauma-Talent" author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel="Trauma-Talent" datum={datum} />
        <View style={g.headerSpacer} fixed />
        <View style={s.body}>

          {/* Herkende patronen */}
          <PdfSectieKop titel="HERKENDE PATRONEN" />
          {patronen.map((p, i) => (
            <View key={i}>
              <View style={s.patroonRij}>
                <Text style={s.patroonNaam}>{p.naam}</Text>
                <Text style={s.patroonTalent}>{p.talent}</Text>
              </View>
              <Text style={s.patroonIntentie}>{p.positieveIntentie}</Text>
            </View>
          ))}

          {/* Kernkwadrant */}
          <PdfSectieKop titel="KERNKWADRANT (OFMAN)" />
          <View style={s.kwadrantContainer}>

            {/* Rij 1: KWALITEIT — brug — VALKUIL */}
            <View style={s.kwadrantRij}>
              <View style={[s.kwadrantVak, { borderColor: K.darkGreen, backgroundColor: K.lightBg2 }]}>
                <Text style={[s.kwadrantLabel, { color: K.darkGreen }]}>KWALITEIT</Text>
                <Text style={[s.kwadrantWaarde, { color: K.darkGreen }]}>{focusPatroon.talent}</Text>
                <Text style={[s.kwadrantSub, { color: K.darkSlate }]}>{focusPatroon.talentBeschrijving}</Text>
                <Text style={[s.kwadrantNotitie, { color: K.darkGreen }]}>Bewust, vanuit kracht</Text>
              </View>
              <View style={s.kwadrantBrug}>
                <Text style={s.kwadrantBrugTekst}>te</Text>
                <Text style={s.kwadrantBrugTekst}>veel</Text>
                <Text style={s.kwadrantBrugTekst}>→</Text>
              </View>
              <View style={[s.kwadrantVak, { borderColor: K.darkRed, backgroundColor: '#fdf2ee' }]}>
                <Text style={[s.kwadrantLabel, { color: K.darkRed }]}>VALKUIL</Text>
                <Text style={[s.kwadrantWaarde, { color: K.darkRed }]}>{focusPatroon.valkuil}</Text>
                <Text style={[s.kwadrantSub, { color: K.darkSlate }]}>Te veel van de kwaliteit</Text>
                <Text style={[s.kwadrantNotitie, { color: K.darkRed }]}>Onbewust, vanuit angst</Text>
              </View>
            </View>

            {/* Rij 2: diagonale pijlen */}
            <View style={s.kwadrantMidden}>
              <View style={{ flex: 1 }} />
              <View style={[s.kwadrantBrug, { flexDirection: 'column' }]}>
                <Text style={[s.kwadrantBrugTekst, { color: K.midGreen }]}>↗ pos.</Text>
                <Text style={[s.kwadrantBrugTekst, { color: K.midGreen }]}>teg.</Text>
                <Text style={[s.kwadrantBrugTekst, { color: K.midGreen }]}>↙ pos.</Text>
                <Text style={[s.kwadrantBrugTekst, { color: K.midGreen }]}>teg.</Text>
              </View>
              <View style={{ flex: 1 }} />
            </View>

            {/* Rij 3: UITDAGING — brug — ALLERGIE */}
            <View style={s.kwadrantRij}>
              <View style={[s.kwadrantVak, { borderColor: K.midGreen, backgroundColor: '#f3f6f0' }]}>
                <Text style={[s.kwadrantLabel, { color: K.midGreen }]}>UITDAGING</Text>
                <Text style={[s.kwadrantWaarde, { color: K.midGreen }]}>{uitdaging}</Text>
                <Text style={[s.kwadrantSub, { color: K.darkSlate }]}>Positieve tegenhanger van de valkuil</Text>
              </View>
              <View style={s.kwadrantBrug}>
                <Text style={s.kwadrantBrugTekst}>→ te</Text>
                <Text style={s.kwadrantBrugTekst}>veel</Text>
              </View>
              <View style={[s.kwadrantVak, { borderColor: K.orange, backgroundColor: '#fdf4ec' }]}>
                <Text style={[s.kwadrantLabel, { color: K.orange }]}>ALLERGIE</Text>
                <Text style={[s.kwadrantWaarde, { color: K.orange }]}>{allergie}</Text>
                <Text style={[s.kwadrantSub, { color: K.darkSlate }]}>Wat jou irriteert in anderen</Text>
              </View>
            </View>

          </View>

          {/* Goed om te weten */}
          <View style={{ backgroundColor: K.lightBg2, borderRadius: 6, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: K.lightBg }}>
            <Text style={{ fontSize: 8, color: K.darkSlate, lineHeight: 1.5 }}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>Goed om te weten: </Text>
              je zenuwstelsel moet wennen aan iets nieuws. Ander gedrag kan onwennig voelen, zelfs als je weet dat het klopt. Dat betekent niet dat het fout gaat, maar dat je iets aan het herprogrammeren bent.
            </Text>
          </View>

          {/* Analyse */}
          <PdfSectieKop titel="ANALYSE" />
          <AnalyseInhoud tekst={analyse} />

        </View>
        <PdfFooter titel="Trauma-Talent" />
      </Page>
    </Document>
  );
}

function TraumaTalentPdfKnopInner(props: Props) {
  const { PDFDownloadLink } = require('@react-pdf/renderer');
  return (
    <PDFDownloadLink document={<TraumaTalentDocument {...props} />} fileName="trauma-talent.pdf">
      {({ loading }: { loading: boolean }) => (
        <span className="text-sm px-3 py-1.5 rounded-lg bg-darkRed text-white hover:bg-darkRed/80 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}

export const TraumaTalentPdfKnop = dynamic(
  () => Promise.resolve(TraumaTalentPdfKnopInner),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);
