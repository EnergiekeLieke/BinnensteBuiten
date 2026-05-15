'use client';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, PdfSectieKop, AnalyseInhoud } from '@/lib/pdfHelpers';

const VERLANGEN_KLEUREN: Record<string, { bg: string; tekst: string }> = {
  certainty:    { bg: K.darkSlate, tekst: K.cream },
  variety:      { bg: K.orange,    tekst: K.wit },
  significance: { bg: K.darkRed,   tekst: K.cream },
  love:         { bg: K.lightBg,   tekst: K.darkSlate },
  growth:       { bg: K.darkGreen, tekst: K.cream },
  contribution: { bg: K.midGreen,  tekst: K.cream },
};

const s = StyleSheet.create({
  pagina:          { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:            { paddingHorizontal: 40 },
  keuzeRij:        { flexDirection: 'row', marginBottom: 7 },
  keuzeKaart:      { flex: 1, borderWidth: 1, borderColor: K.lightBg, borderRadius: 5, padding: 9, backgroundColor: K.wit },
  keuzeKaartLinks: { marginRight: 7 },
  keuzeGebied:     { fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: K.darkSlate, marginBottom: 5 },
  keuzeLeeg:       { fontSize: 8.5, color: K.midGreen, fontStyle: 'italic' },
  verlangensLabel: { fontSize: 8.5, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 3, alignSelf: 'flex-start' },
  reflectieRij:    { flexDirection: 'row', gap: 10 },
  reflectieBlok:   { flex: 1, borderLeftWidth: 3, borderLeftColor: K.darkRed, backgroundColor: K.cream, padding: 10, borderRadius: 4 },
  reflectieGroen:  { flex: 1, borderLeftWidth: 3, borderLeftColor: K.darkGreen, backgroundColor: K.cream, padding: 10, borderRadius: 4 },
  reflectieLabel:  { fontFamily: 'Helvetica-Bold', fontSize: 8, color: K.darkRed, marginBottom: 5, letterSpacing: 0.5 },
  reflectieGroenL: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: K.darkGreen, marginBottom: 5, letterSpacing: 0.5 },
  reflectieTekst:  { fontSize: 9.5, color: K.darkSlate, lineHeight: 1.55 },
});

export interface PdfKeuze {
  gebied:        string;
  verlangenId:   string | null;
  verlangenLabel: string | null;
}

export interface PdfProps {
  keuzes:    PdfKeuze[];
  opvallend: string;
  actie:     string;
  analyse:   string;
}

function KeuzeGrid({ keuzes }: { keuzes: PdfKeuze[] }) {
  const rijen: PdfKeuze[][] = [];
  for (let i = 0; i < keuzes.length; i += 2) rijen.push(keuzes.slice(i, i + 2));
  return (
    <>
      {rijen.map((rij, ri) => (
        <View key={ri} style={s.keuzeRij} wrap={false}>
          {rij.map((k, ki) => {
            const kleur = k.verlangenId ? VERLANGEN_KLEUREN[k.verlangenId] : null;
            return (
              <View key={ki} style={[s.keuzeKaart, ki === 0 ? s.keuzeKaartLinks : {}]}>
                <Text style={s.keuzeGebied}>{k.gebied}</Text>
                {kleur && k.verlangenLabel
                  ? <Text style={[s.verlangensLabel, { backgroundColor: kleur.bg, color: kleur.tekst }]}>{k.verlangenLabel}</Text>
                  : <Text style={s.keuzeLeeg}>niet ingevuld</Text>}
              </View>
            );
          })}
        </View>
      ))}
    </>
  );
}

function BasisverlangenDocument({ keuzes, opvallend, actie, analyse }: PdfProps) {
  const titel = 'Basisverlangens Werkblad';
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <Document title={titel} author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel={titel} datum={datum} />
        <View style={g.headerSpacer} fixed />

        <View style={s.body}>
          <PdfSectieKop titel="KEUZES PER LEVENSGEBIED" />
          <KeuzeGrid keuzes={keuzes} />

          <View style={g.sectieKop} wrap={false} minPresenceAhead={80}>
            <View style={g.sectieBar} />
            <Text style={g.sectieTitel}>REFLECTIE</Text>
          </View>
          <View style={s.reflectieRij} wrap={false}>
            <View style={s.reflectieBlok}>
              <Text style={s.reflectieLabel}>WAT VALT JE OP?</Text>
              <Text style={s.reflectieTekst}>{opvallend || '(niet ingevuld)'}</Text>
            </View>
            <View style={s.reflectieGroen}>
              <Text style={s.reflectieGroenL}>WAT GA JE DOEN?</Text>
              <Text style={s.reflectieTekst}>{actie || '(niet ingevuld)'}</Text>
            </View>
          </View>

          {analyse ? (
            <>
              <View style={g.sectieKop} minPresenceAhead={80}>
                <View style={g.sectieBar} />
                <Text style={g.sectieTitel}>JOUW ANALYSE</Text>
              </View>
              <AnalyseInhoud tekst={analyse} />
            </>
          ) : null}
        </View>

        <PdfFooter titel={titel} />
      </Page>
    </Document>
  );
}

export function BasisverlangenPdfKnop(props: PdfProps) {
  return (
    <PDFDownloadLink document={<BasisverlangenDocument {...props} />} fileName="basisverlangens-werkblad.pdf">
      {({ loading }) => (
        <span className="text-sm px-3 py-1.5 rounded-lg bg-darkRed text-white hover:bg-darkRed/80 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}
