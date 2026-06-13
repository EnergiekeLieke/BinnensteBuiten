'use client';

import dynamic from 'next/dynamic';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, PdfSectieKop } from '@/lib/pdfHelpers';
import { CATEGORIEEN_DETAIL, INTAKE_OPEN_VRAGEN } from '@/lib/businessScanData';

const s = StyleSheet.create({
  pagina:      { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:        { paddingHorizontal: 40 },
  klantRij:    { flexDirection: 'row', marginBottom: 2 },
  klantLabel:  { fontSize: 9, color: K.midGreen, width: 90 },
  klantWaarde: { fontSize: 9, color: K.darkSlate, fontFamily: 'Helvetica-Bold' },
  instructie:  { fontSize: 8.5, color: K.darkSlate, lineHeight: 1.5, backgroundColor: K.lightBg2, borderRadius: 6, padding: 10, marginTop: 10, marginBottom: 4 },
  catTitelRij: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, marginBottom: 3 },
  catTitel:    { fontFamily: 'Helvetica-Bold', fontSize: 9.5, color: K.darkGreen },
  catGemiddelde: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: K.darkRed },
  scoreRij:    { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  scoreTekst:  { fontSize: 9, color: K.darkSlate, flex: 1, lineHeight: 1.4 },
  balk:        { width: 100, height: 7, borderRadius: 3, backgroundColor: '#e8e4e0', marginHorizontal: 10, overflow: 'hidden' },
  balkVulling: { height: 7, borderRadius: 3, backgroundColor: K.darkRed },
  scoreGetal:  { fontSize: 9, fontFamily: 'Helvetica-Bold', width: 14, textAlign: 'right', color: K.darkRed },
  vraagBlok:   { marginBottom: 10 },
  vraagLabel:  { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: K.darkGreen, marginBottom: 2 },
  vraagTekst:  { fontSize: 9.5, color: K.darkSlate, lineHeight: 1.6 },
});

function ScoreRij({ label, score }: { label: string; score: number }) {
  return (
    <View style={s.scoreRij}>
      <Text style={s.scoreTekst}>{label}</Text>
      <View style={s.balk}>
        <View style={[s.balkVulling, { width: `${score * 10}%` }]} />
      </View>
      <Text style={s.scoreGetal}>{score}</Text>
    </View>
  );
}

export interface BusinessScanIntakeProps {
  klant: { naam: string; bedrijf: string; email: string };
  modus: 'basis' | 'uitgebreid';
  basisScores: number[];
  detailScores: number[][];
  bonus: number;
  open: string[];
}

function BusinessScanIntakeDocument({ klant, modus, basisScores, detailScores, bonus, open }: BusinessScanIntakeProps) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Document title="Business Scan Intake" author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel="Business Scan Intake" datum={datum} />
        <View style={g.headerSpacer} fixed />
        <View style={s.body}>

          {/* Klantgegevens */}
          <PdfSectieKop titel="GEGEVENS" />
          <View style={s.klantRij}>
            <Text style={s.klantLabel}>Naam</Text>
            <Text style={s.klantWaarde}>{klant.naam || '—'}</Text>
          </View>
          <View style={s.klantRij}>
            <Text style={s.klantLabel}>Bedrijfsnaam</Text>
            <Text style={s.klantWaarde}>{klant.bedrijf || '—'}</Text>
          </View>
          <View style={s.klantRij}>
            <Text style={s.klantLabel}>E-mailadres</Text>
            <Text style={s.klantWaarde}>{klant.email || '—'}</Text>
          </View>

          <Text style={s.instructie}>
            Deze PDF bevat de bewuste scores van {klant.naam || 'de klant'}. Vul de onbewuste laag aan met de
            biotensor in de Business Scan Gedetailleerd-tool en gebruik deze scores als basis voor de analyse.
          </Text>

          {/* Scores */}
          <PdfSectieKop titel={modus === 'basis' ? 'SCORES PER CATEGORIE (BEWUST)' : 'SCORES PER SUBONDERDEEL (BEWUST)'} />
          {modus === 'basis'
            ? CATEGORIEEN_DETAIL.map((cat, i) => (
                <ScoreRij key={cat.naam} label={`${i + 1}. ${cat.naam}`} score={basisScores[i]} />
              ))
            : CATEGORIEEN_DETAIL.map((cat, i) => {
                const gemiddelde = Math.round((detailScores[i].reduce((a, b) => a + b, 0) / detailScores[i].length) * 10) / 10;
                return (
                  <View key={cat.naam} wrap={false}>
                    <View style={s.catTitelRij}>
                      <Text style={s.catTitel}>{i + 1}. {cat.naam}</Text>
                      <Text style={s.catGemiddelde}>Gemiddelde: {gemiddelde}</Text>
                    </View>
                    {cat.subonderdelen.map((sub, si) => (
                      <ScoreRij key={sub} label={sub} score={detailScores[i][si]} />
                    ))}
                  </View>
                );
              })}

          {/* Bonus */}
          <PdfSectieKop titel="BONUS — VERTROUWEN & OVERGAVE" />
          <ScoreRij label="Vertrouwen & overgave" score={bonus} />

          {/* Open vragen */}
          <PdfSectieKop titel="TOELICHTING" />
          {INTAKE_OPEN_VRAGEN.map((vraag, i) => (
            <View key={vraag} style={s.vraagBlok} wrap={false}>
              <Text style={s.vraagLabel}>{vraag}</Text>
              <Text style={s.vraagTekst}>{open[i] || '—'}</Text>
            </View>
          ))}

        </View>
        <PdfFooter titel="Business Scan Intake" />
      </Page>
    </Document>
  );
}

function BusinessScanIntakePdfKnopInner(props: BusinessScanIntakeProps) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PDFDownloadLink } = require('@react-pdf/renderer');
  return (
    <PDFDownloadLink document={<BusinessScanIntakeDocument {...props} />} fileName="business-scan-intake.pdf">
      {({ loading }: { loading: boolean }) => (
        <span className="text-sm px-3 py-1.5 rounded-lg bg-darkGreen text-white hover:bg-darkGreen/80 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}

export const BusinessScanIntakePdfKnop = dynamic(
  () => Promise.resolve(BusinessScanIntakePdfKnopInner),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);
