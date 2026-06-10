'use client';

import dynamic from 'next/dynamic';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, PdfSectieKop, AnalyseInhoud } from '@/lib/pdfHelpers';

const VRAGEN = [
  'Ik voel me fysiek energiek en uitgerust.',
  'Ik herstel snel na een drukke dag.',
  'Ik ervaar innerlijke rust, ook als het druk is.',
  'Ik kan mijn grenzen goed voelen.',
  'Ik geef mijn grenzen ook daadwerkelijk aan.',
  'Ik neem voldoende tijd om op te laden.',
  'Ik voel me emotioneel stabiel.',
  'Ik kan goed omgaan met prikkels om mij heen.',
  'Ik kan "nee" zeggen zonder schuldgevoel.',
  'Ik voel dat ik de dingen in mijn leven aankan.',
];

type Band = { label: string; kleur: string; grens: string; thema: string; beschrijving: string; kans: string };

const BANDEN: Band[] = [
  { label: 'Lage draagkracht',      kleur: K.darkRed,   grens: '0 – 40',   thema: 'Herstel & ontladen',          beschrijving: 'Jouw systeem zit (bijna) vol! Let goed op jezelf en neem voldoende rust.', kans: 'Grote kans op vermoeidheid, prikkelbaarheid of uitval.' },
  { label: 'Wisselende draagkracht', kleur: K.orange,    grens: '40 – 70',  thema: 'Balans & grenzen bewaken',    beschrijving: 'Je kunt veel aan, maar je energieniveau is niet altijd stabiel.',            kans: 'Kans op pieken en dalen.' },
  { label: 'Sterke draagkracht',     kleur: K.darkGreen, grens: '70 – 100', thema: 'Bewust inzetten van energie', beschrijving: 'Je systeem is veerkrachtig en flexibel.',                                   kans: 'Bewust (blijven) inzetten van je energie, om dit zo te houden.' },
];

function getBand(score: number): Band {
  if (score < 40) return BANDEN[0];
  if (score < 70) return BANDEN[1];
  return BANDEN[2];
}

const s = StyleSheet.create({
  pagina:       { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:         { paddingHorizontal: 40 },
  vraagRij:     { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  vraagTekst:   { fontSize: 9, color: K.darkSlate, flex: 1, lineHeight: 1.4 },
  balk:         { width: 100, height: 7, borderRadius: 3, backgroundColor: '#e8e4e0', marginHorizontal: 10, overflow: 'hidden' },
  balkVulling:  { height: 7, borderRadius: 3 },
  scoreGetal:   { fontSize: 9, fontFamily: 'Helvetica-Bold', width: 14, textAlign: 'right' },
  totaalBalk:   { height: 10, borderRadius: 4, backgroundColor: '#e8e4e0', marginTop: 4, marginBottom: 2, overflow: 'hidden' },
  totaalVulling:{ height: 10, borderRadius: 4 },
  totaalRij:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  totaalLabel:  { fontSize: 8, color: K.midGreen },
  totaalGetal:  { fontSize: 16, fontFamily: 'Helvetica-Bold', marginTop: 6, marginBottom: 2 },
  bandBox:      { borderRadius: 6, padding: 14, marginTop: 14 },
  bandTitel:    { fontFamily: 'Helvetica-Bold', fontSize: 12, marginBottom: 4 },
  bandSub:      { fontSize: 8.5, lineHeight: 1.5, marginBottom: 3, color: K.darkSlate },
  bandThema:    { fontSize: 8, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginTop: 4 },
  legende:      { marginTop: 20 },
  legendeRij:   { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 5 },
  legendeStip:  { width: 8, height: 8, borderRadius: 4, marginRight: 8, marginTop: 1 },
  legendeTekst: { flex: 1 },
  legendeLabel: { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },
  legendeKlein: { fontSize: 7.5, color: K.darkSlate, marginTop: 1, opacity: 0.7 },
});

interface Props {
  scores: number[];
  analyse?: string;
}

function DraagkrachtTestDocument({ scores, analyse }: Props) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const totaal = scores.reduce((a, b) => a + b, 0);
  const band = getBand(totaal);

  return (
    <Document title="Draagkracht Test" author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel="Draagkracht Test" datum={datum} />
        <View style={g.headerSpacer} fixed />
        <View style={s.body}>

          {/* Scores per stelling */}
          <PdfSectieKop titel="SCORES PER STELLING" />
          {VRAGEN.map((vraag, i) => (
            <View key={i} style={s.vraagRij}>
              <Text style={s.vraagTekst}>{vraag}</Text>
              <View style={s.balk}>
                <View style={[s.balkVulling, { width: `${scores[i] * 10}%`, backgroundColor: K.darkGreen }]} />
              </View>
              <Text style={[s.scoreGetal, { color: K.darkGreen }]}>{scores[i]}</Text>
            </View>
          ))}

          {/* Totaalscore */}
          <PdfSectieKop titel="TOTAALSCORE" />
          <Text style={[s.totaalGetal, { color: band.kleur }]}>{totaal} / 100</Text>
          <View style={s.totaalBalk}>
            <View style={[s.totaalVulling, { width: `${totaal}%`, backgroundColor: band.kleur }]} />
          </View>
          <View style={s.totaalRij}>
            <Text style={s.totaalLabel}>0</Text>
            <Text style={s.totaalLabel}>100</Text>
          </View>

          {/* Interpretatie */}
          <View style={[s.bandBox, { backgroundColor: band.kleur + '18', borderLeftWidth: 3, borderLeftColor: band.kleur }]}>
            <Text style={[s.bandTitel, { color: band.kleur }]}>{band.grens} | {band.label}</Text>
            <Text style={s.bandSub}>{band.beschrijving}</Text>
            <Text style={s.bandSub}>{band.kans}</Text>
            <Text style={[s.bandThema, { color: band.kleur }]}>THEMA: {band.thema.toUpperCase()}</Text>
          </View>

          {/* Analyse */}
          {!!analyse && (
            <>
              <PdfSectieKop titel="JOUW ANALYSE" />
              <AnalyseInhoud tekst={analyse} />
            </>
          )}

          {/* Legenda */}
          <View style={s.legende}>
            <PdfSectieKop titel="OVERZICHT ALLE BANDEN" />
            {BANDEN.map((b) => (
              <View key={b.label} style={[s.legendeRij, { backgroundColor: b.kleur + '12', opacity: band.label === b.label ? 1 : 0.5 }]}>
                <View style={[s.legendeStip, { backgroundColor: b.kleur }]} />
                <View style={s.legendeTekst}>
                  <Text style={[s.legendeLabel, { color: b.kleur }]}>{b.grens} | {b.label}</Text>
                  <Text style={s.legendeKlein}>Thema: {b.thema}</Text>
                </View>
              </View>
            ))}
          </View>

        </View>
        <PdfFooter titel="Draagkracht Test" />
      </Page>
    </Document>
  );
}

function DraagkrachtTestPdfKnopInner(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PDFDownloadLink } = require('@react-pdf/renderer');
  return (
    <PDFDownloadLink document={<DraagkrachtTestDocument {...props} />} fileName="draagkracht-test.pdf">
      {({ loading }: { loading: boolean }) => (
        <span className="text-sm px-3 py-1.5 rounded-lg bg-darkGreen text-white hover:bg-darkGreen/80 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}

export const DraagkrachtTestPdfKnop = dynamic(
  () => Promise.resolve(DraagkrachtTestPdfKnopInner),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);
