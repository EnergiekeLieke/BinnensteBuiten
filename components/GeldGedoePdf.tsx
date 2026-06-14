'use client';

import dynamic from 'next/dynamic';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, PdfSectieKop, AnalyseInhoud } from '@/lib/pdfHelpers';
import { STELLINGEN, STRATEGIEEN, OVERTUIGINGEN, scoreband, type Slider2 } from './GeldGedoe';

const s = StyleSheet.create({
  pagina:       { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:         { paddingHorizontal: 40 },

  // Deel 1
  stellingBlok: { marginBottom: 9 },
  stellingTekst:{ fontSize: 8.5, color: K.darkSlate, marginBottom: 3, lineHeight: 1.4 },
  scoreRij:     { flexDirection: 'row', alignItems: 'center', marginBottom: 1.5 },
  scoreLabel:   { fontSize: 7.5, width: 50, color: K.darkSlate, opacity: 0.7 },
  balk:         { flex: 1, height: 6, borderRadius: 3, backgroundColor: '#e8e4e0', marginRight: 8, overflow: 'hidden' },
  balkVulling:  { height: 6, borderRadius: 3 },
  scoreGetal:   { fontSize: 8.5, fontFamily: 'Helvetica-Bold', width: 14, textAlign: 'right' },

  totaalGrid:   { flexDirection: 'row', gap: 10, marginTop: 6 },
  totaalBox:    { flex: 1, borderRadius: 6, padding: 10 },
  totaalGetal:  { fontSize: 16, fontFamily: 'Helvetica-Bold' },
  totaalLabel:  { fontSize: 8, color: K.darkSlate, opacity: 0.7, marginTop: 1 },
  totaalBand:   { fontSize: 7.5, color: K.darkSlate, marginTop: 4, lineHeight: 1.4 },

  // Deel 2
  strategieRij: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  strategieBol: { width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 8, marginTop: 1 },
  strategieNum: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: K.wit },
  strategieTekst: { flex: 1 },
  strategieLabel: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: K.darkSlate },
  strategieToel:  { fontSize: 8, color: K.darkSlate, opacity: 0.7, marginTop: 1, lineHeight: 1.4 },

  // Deel 3 / 4
  ovBlok:       { marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: K.lightBg },
  ovTekst:      { fontSize: 9, color: K.darkSlate, marginBottom: 4, lineHeight: 1.4, fontStyle: 'italic' },
  pctRij:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  pctLabel:     { fontSize: 7.5, color: K.darkSlate, opacity: 0.7, flex: 1, paddingRight: 8 },
  pctGetal:     { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },
  pctAnkers:    { flexDirection: 'row', justifyContent: 'space-between', marginTop: 1, marginBottom: 4 },
  pctAnker:     { fontSize: 6.5, color: K.darkSlate, opacity: 0.5 },

  legText:      { fontSize: 8.5, color: K.darkSlate, opacity: 0.6, lineHeight: 1.5, marginBottom: 4 },
});

function Balkje({ pct, kleur }: { pct: number; kleur: string }) {
  return (
    <View style={s.balk}>
      <View style={[s.balkVulling, { width: `${Math.max(0, Math.min(100, pct))}%`, backgroundColor: kleur }]} />
    </View>
  );
}

function PercentageBalk({ label, waarde, isLoslaten }: { label: string; waarde: number; isLoslaten: boolean }) {
  const kleur = isLoslaten ? K.darkGreen : K.darkRed;
  const ankerLinks  = isLoslaten ? 'ik houd mezelf nog tegen' : 'helemaal niet';
  const ankerRechts = isLoslaten ? 'ik ben er klaar voor'     : 'zit diep verankerd';
  return (
    <View style={{ marginBottom: 3 }}>
      <View style={s.pctRij}>
        <Text style={s.pctLabel}>{label}</Text>
        <Text style={[s.pctGetal, { color: kleur }]}>{waarde}%</Text>
      </View>
      <Balkje pct={waarde} kleur={kleur} />
      <View style={s.pctAnkers}>
        <Text style={s.pctAnker}>{ankerLinks}</Text>
        <Text style={s.pctAnker}>{ankerRechts}</Text>
      </View>
    </View>
  );
}

interface Props {
  d1: { bewust: number; onbewust: number }[];
  gekozenStrategieen: string[];
  aangevinktOv: boolean[];
  slidersOv: Slider2[];
  kernOvertuigingen: string[];
  aangevinktKern: boolean[];
  slidersKern: Slider2[];
  analyse?: string;
}

function GeldGedoeDocument({ d1, gekozenStrategieen, aangevinktOv, slidersOv, kernOvertuigingen, aangevinktKern, slidersKern, analyse }: Props) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const totaalBewust   = d1.reduce((sum, x) => sum + x.bewust, 0);
  const totaalOnbewust = d1.reduce((sum, x) => sum + x.onbewust, 0);
  const max = STELLINGEN.length * 10;

  const ovMetIndex = OVERTUIGINGEN.map((ov, i) => ({ ov, i })).filter(({ i }) => aangevinktOv[i]);
  const kernMetIndex = kernOvertuigingen.map((k, i) => ({ k, i })).filter(({ i }) => aangevinktKern[i]);

  return (
    <Document title="Flauwekul Filter: Geld Gedoe" author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel="Flauwekul Filter: Geld Gedoe" datum={datum} />
        <View style={g.headerSpacer} fixed />
        <View style={s.body}>

          {/* DEEL 1 */}
          <PdfSectieKop titel="DEEL 1: ENERGIEMETING STELLINGEN" />
          {STELLINGEN.map((stelling, i) => (
            <View key={i} style={s.stellingBlok} wrap={false}>
              <Text style={s.stellingTekst}>{i + 1}. {stelling}</Text>
              <View style={s.scoreRij}>
                <Text style={[s.scoreLabel, { color: K.darkRed }]}>Bewust</Text>
                <Balkje pct={d1[i].bewust * 10} kleur={K.darkRed} />
                <Text style={[s.scoreGetal, { color: K.darkRed }]}>{d1[i].bewust}</Text>
              </View>
              <View style={s.scoreRij}>
                <Text style={[s.scoreLabel, { color: K.darkGreen }]}>Onbewust</Text>
                <Balkje pct={d1[i].onbewust * 10} kleur={K.darkGreen} />
                <Text style={[s.scoreGetal, { color: K.darkGreen }]}>{d1[i].onbewust}</Text>
              </View>
            </View>
          ))}

          <View style={s.totaalGrid}>
            <View style={[s.totaalBox, { backgroundColor: K.darkRed + '12' }]}>
              <Text style={[s.totaalGetal, { color: K.darkRed }]}>{totaalBewust}/{max}</Text>
              <Text style={s.totaalLabel}>Bewust</Text>
              <Text style={s.totaalBand}>{scoreband(totaalBewust)}</Text>
            </View>
            <View style={[s.totaalBox, { backgroundColor: K.darkGreen + '12' }]}>
              <Text style={[s.totaalGetal, { color: K.darkGreen }]}>{totaalOnbewust}/{max}</Text>
              <Text style={s.totaalLabel}>Onbewust</Text>
              <Text style={s.totaalBand}>{scoreband(totaalOnbewust)}</Text>
            </View>
          </View>

          {/* DEEL 2 */}
          <PdfSectieKop titel="DEEL 2: GELDSTRATEGIEEN" />
          {gekozenStrategieen.length > 0 ? (
            gekozenStrategieen.map((label, rank) => {
              const strat = STRATEGIEEN.find((x) => x.label === label);
              const rankKleuren = [K.darkRed, K.orange, K.midGreen];
              return (
                <View key={label} style={s.strategieRij} wrap={false}>
                  <View style={[s.strategieBol, { backgroundColor: rankKleuren[rank] }]}>
                    <Text style={s.strategieNum}>{rank + 1}</Text>
                  </View>
                  <View style={s.strategieTekst}>
                    <Text style={s.strategieLabel}>{label}</Text>
                    {strat && <Text style={s.strategieToel}>{strat.toelichting}</Text>}
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={s.legText}>Geen strategieën geselecteerd.</Text>
          )}

          {/* DEEL 3 */}
          <PdfSectieKop titel="DEEL 3: BELEMMERENDE OVERTUIGINGEN" />
          {ovMetIndex.length > 0 ? (
            ovMetIndex.map(({ ov, i }) => (
              <View key={i} style={s.ovBlok} wrap={false}>
                <Text style={s.ovTekst}>{i + 1}. {ov}</Text>
                <PercentageBalk label="In hoeverre geloof ik op diep niveau dat dit waar is?" waarde={slidersOv[i].overtuigd} isLoslaten={false} />
                <PercentageBalk label="Hoe bereid en klaar ben ik om dit los te laten?" waarde={slidersOv[i].loslaten} isLoslaten={true} />
              </View>
            ))
          ) : (
            <Text style={s.legText}>Geen overtuigingen aangevinkt.</Text>
          )}

          {/* DEEL 4 */}
          <PdfSectieKop titel="DEEL 4: EXISTENTIELE KERNOVERTUIGINGEN" />
          {kernMetIndex.length > 0 ? (
            kernMetIndex.map(({ k, i }) => (
              <View key={i} style={s.ovBlok} wrap={false}>
                <Text style={s.ovTekst}>{k}</Text>
                <PercentageBalk label="In hoeverre geloof ik op diep niveau dat dit waar is?" waarde={slidersKern[i].overtuigd} isLoslaten={false} />
                <PercentageBalk label="Hoe bereid en klaar ben ik om dit los te laten?" waarde={slidersKern[i].loslaten} isLoslaten={true} />
              </View>
            ))
          ) : (
            <Text style={s.legText}>Geen kernovertuigingen aangevinkt.</Text>
          )}

          {/* ANALYSE */}
          {!!analyse && (
            <>
              <PdfSectieKop titel="DEEL 5: EINDANALYSE" />
              <AnalyseInhoud tekst={analyse} />
            </>
          )}

        </View>
        <PdfFooter titel="Flauwekul Filter: Geld Gedoe" />
      </Page>
    </Document>
  );
}

function GeldGedoePdfKnopInner(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PDFDownloadLink } = require('@react-pdf/renderer');
  return (
    <PDFDownloadLink document={<GeldGedoeDocument {...props} />} fileName="flauwekul-filter-geldgedoe.pdf">
      {({ loading }: { loading: boolean }) => (
        <span className="text-sm px-3 py-1.5 rounded-lg bg-darkRed text-white hover:bg-darkRed/80 transition-colors cursor-pointer inline-block">
          {loading ? 'PDF voorbereiden…' : 'Download volledige PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}

export const GeldGedoePdfKnop = dynamic(
  () => Promise.resolve(GeldGedoePdfKnopInner),
  { ssr: false, loading: () => <span className="text-sm px-3 py-1.5 text-midGreen">PDF laden…</span> }
);
