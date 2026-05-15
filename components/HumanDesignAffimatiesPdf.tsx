'use client';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { K, gedeeldeStijlen as g, PdfHeader, PdfFooter, PdfSectieKop } from '@/lib/pdfHelpers';
import { HD_AFFIRMATIES, HD_TYPE_TEKSTEN, HD_PROFIEL_TEKSTEN, HD_PATRONEN } from '@/lib/hdAffirmatiesData';
import type { CentrumKey } from '@/lib/hdAffirmatiesData';

const CENTRA_VOLGORDE: CentrumKey[] = ['hoofd', 'ajna', 'keel', 'identiteit', 'hart', 'sacraal', 'milt', 'emotie', 'wortel'];

const CENTRA_LABELS: Record<CentrumKey, string> = {
  hoofd: 'Hoofd', ajna: 'Ajna', keel: 'Keel', identiteit: 'Identiteit (G)',
  hart: 'Hart', sacraal: 'Sacraal', milt: 'Milt', emotie: 'Emotie (Solar Plexus)', wortel: 'Wortel',
};

type SectieKey = 'gedefinieerd' | 'gedefinieerd_groei' | 'gedefinieerd_gave' |
  'ongedefinieerd' | 'ongedefinieerd_groei' | 'ongedefinieerd_gave' |
  'compleetOpen' | 'compleetOpen_groei' | 'compleetOpen_gave';

const SECTIES_PER_STAAT: Record<string, { key: SectieKey; label: string }[]> = {
  gedefinieerd:  [
    { key: 'gedefinieerd',       label: 'Omarmen wat van jou is' },
    { key: 'gedefinieerd_groei', label: 'Groei' },
    { key: 'gedefinieerd_gave',  label: 'Gave' },
  ],
  ongedefinieerd: [
    { key: 'ongedefinieerd',       label: 'Loslaten wat niet van jou is' },
    { key: 'ongedefinieerd_groei', label: 'Groei' },
    { key: 'ongedefinieerd_gave',  label: 'Gave' },
  ],
  compleet_open: [
    { key: 'compleetOpen',       label: 'Diepste loslaten' },
    { key: 'compleetOpen_groei', label: 'Groei' },
    { key: 'compleetOpen_gave',  label: 'Gave' },
  ],
};

const s = StyleSheet.create({
  pagina:      { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: 'Helvetica', fontSize: 10, color: K.darkSlate, backgroundColor: K.wit },
  body:        { paddingHorizontal: 40 },
  infoBlok:    { backgroundColor: K.lightBg2, borderRadius: 5, padding: 10, marginBottom: 8 },
  infoLabel:   { fontFamily: 'Helvetica-Bold', fontSize: 8, color: K.darkGreen, letterSpacing: 1, marginBottom: 3 },
  infoTekst:   { fontSize: 9.5, color: K.darkSlate, lineHeight: 1.55 },
  centrumKop:  { backgroundColor: K.darkGreen, borderRadius: 4, padding: '6 10', marginBottom: 6, marginTop: 14 },
  centrumNaam: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: K.cream },
  sectieLabel: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: K.orange, letterSpacing: 0.8, marginBottom: 3, marginTop: 8 },
  affirmatie:  { fontSize: 9, color: K.darkSlate, lineHeight: 1.55, marginBottom: 2 },
  patroonBlok: { borderLeftWidth: 3, borderLeftColor: K.orange, backgroundColor: K.lightBg2, borderRadius: 4, padding: 10, marginBottom: 6 },
  patroonLabel:{ fontFamily: 'Helvetica-Bold', fontSize: 9, color: K.orange, marginBottom: 3 },
  patroonTekst:{ fontSize: 9, color: K.darkSlate, lineHeight: 1.5 },
});

export interface HdPdfProps {
  type: string;
  profielBewust: string;
  profielOnbewust: string;
  centra: Record<string, string | undefined>;
}

const PROFIEL_NAMEN: Record<string, string> = {
  '1': 'Onderzoeker', '2': 'Kluizenaar', '3': 'Experimenteerder',
  '4': 'Netwerker', '5': 'Probleemoplosser', '6': 'Rolmodel',
};

function HdDocument({ type, profielBewust, profielOnbewust, centra }: HdPdfProps) {
  const titel = 'Human Design Affirmaties';
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const profiel = `${profielBewust}/${profielOnbewust}`;
  const typeTekst = HD_TYPE_TEKSTEN.find(t => t.type === type)?.tekst ?? '';
  const profielTekst = HD_PROFIEL_TEKSTEN.find(p => p.profiel === profiel)?.tekst ?? '';
  const hdMap = new Map(HD_AFFIRMATIES.map(c => [c.key, c]));
  const patronen = HD_PATRONEN.filter(p => p.match(centra));

  return (
    <Document title={titel} author="Energieke Lieke">
      <Page size="A4" style={s.pagina}>
        <PdfHeader titel={titel} datum={datum} />
        <View style={g.headerSpacer} fixed />

        <View style={s.body}>
          {/* Type */}
          {typeTekst && (
            <>
              <PdfSectieKop titel={`TYPE: ${type.toUpperCase()}`} />
              <View style={s.infoBlok} wrap={false}>
                <Text style={s.infoTekst}>{typeTekst}</Text>
              </View>
            </>
          )}

          {/* Profiel */}
          {profielTekst && (
            <>
              <PdfSectieKop titel={`PROFIEL ${profiel}: ${PROFIEL_NAMEN[profielBewust] ?? ''} / ${PROFIEL_NAMEN[profielOnbewust] ?? ''}`} />
              <View style={s.infoBlok} wrap={false}>
                <Text style={s.infoTekst}>{profielTekst}</Text>
              </View>
            </>
          )}

          {/* Centra */}
          <PdfSectieKop titel="ENERGIECENTRA EN AFFIRMATIES" />
          {CENTRA_VOLGORDE.map(key => {
            const staat = centra[key];
            if (!staat) return null;
            const secties = SECTIES_PER_STAAT[staat];
            if (!secties) return null;
            const data = hdMap.get(key);
            if (!data) return null;

            return (
              <View key={key} wrap={false}>
                <View style={s.centrumKop}>
                  <Text style={s.centrumNaam}>{CENTRA_LABELS[key]} · {staat.replace('_', ' ')}</Text>
                </View>
                {secties.map(({ key: sk, label }) => {
                  const aff = data[sk] as string[] | undefined;
                  if (!aff?.length) return null;
                  return (
                    <View key={sk}>
                      <Text style={s.sectieLabel}>{label.toUpperCase()}</Text>
                      {aff.map((a, i) => (
                        <Text key={i} style={s.affirmatie}>· {a}</Text>
                      ))}
                    </View>
                  );
                })}
              </View>
            );
          })}

          {/* Patronen */}
          {patronen.length > 0 && (
            <>
              <PdfSectieKop titel="INTERESSANTE COMBINATIES" />
              {patronen.map((p, i) => (
                <View key={i} style={s.patroonBlok} wrap={false}>
                  <Text style={s.patroonLabel}>{p.titel}</Text>
                  <Text style={s.patroonTekst}>{p.tekst}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        <PdfFooter titel={titel} />
      </Page>
    </Document>
  );
}

export function HdAffimatiesPdfKnop(props: HdPdfProps) {
  return (
    <PDFDownloadLink document={<HdDocument {...props} />} fileName="human-design-affirmaties.pdf">
      {({ loading }) => (
        <span className="shrink-0 px-3 py-1.5 rounded-full border border-darkGreen text-darkGreen text-xs cursor-pointer hover:bg-darkGreen hover:text-white transition-colors inline-block">
          {loading ? 'Bezig...' : 'Download PDF'}
        </span>
      )}
    </PDFDownloadLink>
  );
}
