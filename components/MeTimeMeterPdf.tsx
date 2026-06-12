'use client';

import dynamic from 'next/dynamic';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, PdfSectieKop, AnalyseInhoud } from '@/lib/pdfHelpers';

const STELLINGEN = [
  { links: 'Ik maak geen tijd voor mezelf vrij in mijn agenda, het gebeurt alleen als er toevallig ruimte overblijft.', rechts: 'Ik plan bewust tijd voor mezelf in mijn agenda.' },
  { links: 'Zodra het druk wordt, is mijn me-time het eerste dat ik laat schieten.', rechts: 'Ik houd me aan mijn me-time, ook als het druk wordt.' },
  { links: 'Als ik tijd voor mezelf neem, voel ik me schuldig.', rechts: 'Ik neem zonder schuldgevoel tijd voor mezelf.' },
  { links: 'Ik merk vaak te laat dat ik aan rust toe ben, pas als ik al overprikkeld of uitgeput ben.', rechts: 'Ik herken op tijd dat ik rust nodig heb.' },
  { links: 'Ik laat de behoeften van anderen altijd voorgaan, mijn eigen behoeften komen op de laatste plek.', rechts: 'Ik zet mijn eigen behoeften net zo serieus als die van anderen.' },
  { links: 'Ik schrap als eerste mijn me-time wanneer mijn agenda volloopt.', rechts: 'Ik blijf mijn me-time prioriteit geven, ook wanneer mijn agenda volloopt.' },
  { links: 'Ik heb geen idee wat mij écht oplaadt, of ik weet het wel maar doe het bijna nooit.', rechts: 'Ik weet wat mij écht oplaadt (en doe dat ook).' },
  { links: 'Hele dagen gaan voorbij zonder dat ik ook maar één moment van rust heb genomen.', rechts: 'Ik neem dagelijks kleine momenten van rust.' },
  { links: 'Ik voel me vaak opgejaagd of leeg.', rechts: 'Ik voel me ontspannen en energiek gedurende de dag.' },
  { links: 'Ik vind tijd voor mezelf nemen iets dat eigenlijk niet mag, of waar ik over twijfel.', rechts: 'Ik gun mezelf zonder twijfel tijd voor mezelf.' },
];

type Band = { label: string; kleur: string; grens: string; thema: string; beschrijving: string; kans: string };

const BANDEN: Band[] = [
  { label: 'Overlevingsstand',        kleur: K.darkRed,   grens: '0 – 40',   thema: 'Grenzen & zelfwaarde',              beschrijving: 'Me-time verdwijnt zodra het druk wordt.',                          kans: 'Grote kans op uitputting.' },
  { label: 'Bewust maar inconsistent', kleur: K.orange,    grens: '40 – 70',  thema: 'Keuzes maken & prioriteit geven',   beschrijving: 'Je weet dat je me-time nodig hebt, maar doet het niet altijd.',    kans: 'Kans op terugval zodra je agenda volloopt.' },
  { label: 'Zelfzorg in balans',      kleur: K.darkGreen, grens: '70 – 100', thema: 'Verdieping & verfijning',           beschrijving: 'Je bewaakt je energie goed.',                                       kans: 'Een stevige basis om verder te verdiepen.' },
];

function getBand(score: number): Band {
  if (score < 40) return BANDEN[0];
  if (score < 70) return BANDEN[1];
  return BANDEN[2];
}

const s = StyleSheet.create({
  pagina:       { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:         { paddingHorizontal: 40 },
  vraagBlok:    { marginBottom: 9 },
  vraagPolen:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  poolLinks:    { fontSize: 7.5, color: K.darkSlate, opacity: 0.55, flex: 1, lineHeight: 1.4, paddingRight: 8 },
  poolRechts:   { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: K.darkSlate, flex: 1, lineHeight: 1.4, textAlign: 'right' },
  vraagRij:     { flexDirection: 'row', alignItems: 'center' },
  balk:         { flex: 1, height: 7, borderRadius: 3, backgroundColor: '#e8e4e0', marginRight: 10, overflow: 'hidden' },
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

function MeTimeMeterDocument({ scores, analyse }: Props) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const totaal = scores.reduce((a, b) => a + b, 0);
  const band = getBand(totaal);

  return (
    <Document title="Me-time Meter" author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel="Me-time Meter" datum={datum} />
        <View style={g.headerSpacer} fixed />
        <View style={s.body}>

          {/* Scores per stelling */}
          <PdfSectieKop titel="SCORES PER STELLING" />
          {STELLINGEN.map((stelling, i) => (
            <View key={i} style={s.vraagBlok}>
              <View style={s.vraagPolen}>
                <Text style={s.poolLinks}>{stelling.links}</Text>
                <Text style={s.poolRechts}>{stelling.rechts}</Text>
              </View>
              <View style={s.vraagRij}>
                <View style={s.balk}>
                  <View style={[s.balkVulling, { width: `${scores[i] * 10}%`, backgroundColor: K.darkGreen }]} />
                </View>
                <Text style={[s.scoreGetal, { color: K.darkGreen }]}>{scores[i]}</Text>
              </View>
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
        <PdfFooter titel="Me-time Meter" />
      </Page>
    </Document>
  );
}

function MeTimeMeterPdfKnopInner(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PDFDownloadLink } = require('@react-pdf/renderer');
  return (
    <PDFDownloadLink document={<MeTimeMeterDocument {...props} />} fileName="me-time-meter.pdf">
      {({ loading }: { loading: boolean }) => (
        <span className="text-sm px-3 py-1.5 rounded-lg bg-darkGreen text-white hover:bg-darkGreen/80 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}

export const MeTimeMeterPdfKnop = dynamic(
  () => Promise.resolve(MeTimeMeterPdfKnopInner),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);
