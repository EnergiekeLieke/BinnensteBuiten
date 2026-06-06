'use client';

import dynamic from 'next/dynamic';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, PdfSectieKop, AnalyseInhoud } from '@/lib/pdfHelpers';

const BAR_BREEDTE = 130;

const s = StyleSheet.create({
  pagina:       { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:         { paddingHorizontal: 40 },
  gebieden:     { fontSize: 8.5, color: K.midGreen, marginBottom: 14, fontFamily: 'Helvetica-Oblique' },
  vraagWrap:    { marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: K.lightBg2 },
  vraagTekst:   { fontFamily: 'Helvetica-Bold', fontSize: 9.5, color: K.darkSlate, marginBottom: 6 },
  rij:          { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 },
  rijLabel:     { fontSize: 8, color: K.darkSlate, width: 70 },
  rijWaarde:    { fontSize: 8, fontFamily: 'Helvetica-Bold', width: 30 },
  barBg:        { width: BAR_BREEDTE, height: 5, backgroundColor: K.lightBg2, borderRadius: 2 },
  gapTekst:     { fontSize: 7.5, color: K.darkSlate, fontFamily: 'Helvetica-Oblique', marginTop: 2 },
  ovtTekst:     { fontSize: 8.5, color: K.darkSlate, marginBottom: 4, fontFamily: 'Helvetica-Oblique' },
  ovtWrap:      { marginTop: 4, marginBottom: 8 },
});

export type ModusPdf = 'bewust' | 'onbewust' | 'beide';

export interface ScoreRegel {
  tekst: string;
  bewust: number;
  onbewust: number;
}

export interface AangevinktOvertuiging {
  vraagTekst: string;
  items: { tekst: string; overtuigd: number; loslaten: number }[];
}

interface Props {
  geselecteerdeGebieden: string[];
  scoreRegels: ScoreRegel[];
  analyse: string;
  modus: ModusPdf;
  aangevinktOvertuigingen: AangevinktOvertuiging[];
}

function ScoreBalk({ waarde, kleur, max = 10 }: { waarde: number; kleur: string; max?: number }) {
  const vulBreedte = Math.round((waarde / max) * BAR_BREEDTE);
  return (
    <View style={s.barBg}>
      <View style={{ width: vulBreedte, height: 5, backgroundColor: kleur, borderRadius: 2 }} />
    </View>
  );
}

function CongruentieDocument({ geselecteerdeGebieden, scoreRegels, analyse, modus, aangevinktOvertuigingen }: Props) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const toonBewust = modus === 'bewust' || modus === 'beide';
  const toonOnbewust = modus === 'onbewust' || modus === 'beide';

  return (
    <Document title="Congruentie Checker" author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel="Congruentie Checker" datum={datum} />
        <View style={g.headerSpacer} fixed />
        <View style={s.body}>
          {geselecteerdeGebieden.length > 0 && (
            <Text style={s.gebieden}>Levensgebied: {geselecteerdeGebieden.join(', ')}</Text>
          )}

          <PdfSectieKop titel="SCORES" />
          {scoreRegels.map((regel, i) => {
            const gap = regel.bewust - regel.onbewust;
            return (
              <View key={i} style={s.vraagWrap}>
                <Text style={s.vraagTekst}>"{regel.tekst}"</Text>
                {toonBewust && (
                  <View style={s.rij}>
                    <Text style={s.rijLabel}>Bewust</Text>
                    <Text style={[s.rijWaarde, { color: K.darkRed }]}>{regel.bewust}/10</Text>
                    <ScoreBalk waarde={regel.bewust} kleur={K.darkRed} />
                  </View>
                )}
                {toonOnbewust && (
                  <View style={s.rij}>
                    <Text style={s.rijLabel}>Onbewust</Text>
                    <Text style={[s.rijWaarde, { color: K.midGreen }]}>{regel.onbewust}/10</Text>
                    <ScoreBalk waarde={regel.onbewust} kleur={K.midGreen} />
                  </View>
                )}
                {modus === 'beide' && gap !== 0 && (
                  <Text style={s.gapTekst}>
                    Gap: {gap > 0 ? `+${gap}` : gap}{' '}
                    ({gap > 0 ? 'bewust hoger dan onbewust' : 'onbewust hoger dan bewust'})
                  </Text>
                )}
              </View>
            );
          })}

          {aangevinktOvertuigingen.length > 0 && (
            <>
              <PdfSectieKop titel="BELEMMERENDE OVERTUIGINGEN" />
              {aangevinktOvertuigingen.map((item, i) => (
                <View key={i} style={s.vraagWrap}>
                  <Text style={s.vraagTekst}>"{item.vraagTekst}"</Text>
                  {item.items.map((o, j) => (
                    <View key={j} style={s.ovtWrap}>
                      <Text style={s.ovtTekst}>"{o.tekst}"</Text>
                      <View style={s.rij}>
                        <Text style={s.rijLabel}>% overtuigd</Text>
                        <Text style={[s.rijWaarde, { color: K.darkRed }]}>{o.overtuigd}%</Text>
                        <ScoreBalk waarde={o.overtuigd} kleur={K.darkRed} max={100} />
                      </View>
                      <View style={s.rij}>
                        <Text style={s.rijLabel}>% bereid tot loslaten</Text>
                        <Text style={[s.rijWaarde, { color: K.midGreen }]}>{o.loslaten}%</Text>
                        <ScoreBalk waarde={o.loslaten} kleur={K.midGreen} max={100} />
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </>
          )}

          <PdfSectieKop titel="ANALYSE" />
          <AnalyseInhoud tekst={analyse} />
        </View>
        <PdfFooter titel="Congruentie Checker" />
      </Page>
    </Document>
  );
}

function CongruentieCheckerPdfKnopInner(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PDFDownloadLink } = require('@react-pdf/renderer');
  return (
    <PDFDownloadLink document={<CongruentieDocument {...props} />} fileName="congruentie-checker.pdf">
      {({ loading }: { loading: boolean }) => (
        <span className="text-sm px-3 py-1.5 rounded-lg bg-darkGreen text-white hover:bg-darkGreen/80 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download als PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}

export const CongruentieCheckerPdfKnop = dynamic(
  () => Promise.resolve(CongruentieCheckerPdfKnopInner),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);
