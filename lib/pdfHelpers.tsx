import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const BEELDMERK = 'data:image/png;base64,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';

export const K = {
  darkSlate: '#2a3a3c',
  darkGreen: '#3b5633',
  midGreen:  '#758d69',
  orange:    '#d56119',
  darkRed:   '#9e3816',
  cream:     '#fcebdc',
  lightBg:   '#f4c293',
  lightBg2:  '#fde8d0',
  wit:       '#ffffff',
} as const;

export const gedeeldeStijlen = StyleSheet.create({
  headerBalk:   { backgroundColor: K.darkGreen, paddingHorizontal: 40, paddingTop: 32, paddingBottom: 24 },
  headerLabel:  { fontSize: 8, color: K.midGreen, letterSpacing: 2, marginBottom: 6 },
  headerTitel:  { fontFamily: 'Helvetica-Bold', fontSize: 26, color: K.cream, marginBottom: 6 },
  headerDatum:  { fontSize: 9, color: K.lightBg2 },
  headerSpacer: { height: 20 },
  sectieKop:    { flexDirection: 'row', alignItems: 'center', marginTop: 22, marginBottom: 10 },
  sectieBar:    { width: 3, height: 14, backgroundColor: K.orange, borderRadius: 2, marginRight: 8 },
  sectieTitel:  { fontFamily: 'Helvetica-Bold', fontSize: 9, color: K.darkSlate, letterSpacing: 1.5 },
  analyseH2:    { fontFamily: 'Helvetica-Bold', fontSize: 9, color: K.darkSlate, letterSpacing: 1.2, borderBottomWidth: 1, borderBottomColor: K.orange, paddingBottom: 4, marginBottom: 7, marginTop: 14 },
  analyseH3:    { fontFamily: 'Helvetica-Bold', fontSize: 9.5, color: K.darkGreen, marginBottom: 3, marginTop: 4 },
  analyseTekst: { fontSize: 9.5, color: K.darkSlate, lineHeight: 1.6, marginBottom: 3 },
  vet:          { fontFamily: 'Helvetica-Bold', color: K.orange },
  footer:       { position: 'absolute', bottom: 16, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: K.lightBg, paddingTop: 8 },
  footerTekst:  { fontSize: 7.5, color: K.midGreen },
});

export function PdfHeader({ titel, datum }: { titel: string; datum: string }) {
  return (
    <View style={[gedeeldeStijlen.headerBalk, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} fixed>
      <View>
        <Text style={gedeeldeStijlen.headerLabel}>ENERGIEKE LIEKE</Text>
        <Text style={gedeeldeStijlen.headerTitel}>{titel}</Text>
        <Text style={gedeeldeStijlen.headerDatum}>{datum}</Text>
      </View>
      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: K.cream, alignItems: 'center', justifyContent: 'center' }}>
        <Image src={BEELDMERK} style={{ width: 40, height: 40 }} />
      </View>
    </View>
  );
}

export function PdfFooter({ titel }: { titel: string }) {
  return (
    <View style={gedeeldeStijlen.footer} fixed>
      <Text style={gedeeldeStijlen.footerTekst}>Energieke Lieke · {titel}</Text>
      <Text style={gedeeldeStijlen.footerTekst} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

export function PdfSectieKop({ titel }: { titel: string }) {
  return (
    <View style={gedeeldeStijlen.sectieKop}>
      <View style={gedeeldeStijlen.sectieBar} />
      <Text style={gedeeldeStijlen.sectieTitel}>{titel}</Text>
    </View>
  );
}

export function TekstMetVet({ tekst }: { tekst: string }) {
  const s = gedeeldeStijlen;
  const delen = tekst.split(/(\*\*[^*\n]+?\*\*|\*[^*\n]+?\*)/g);
  if (delen.length === 1) return <Text style={s.analyseTekst}>{tekst}</Text>;
  return (
    <Text style={s.analyseTekst}>
      {delen.map((deel, i) => {
        if (deel.startsWith('**') && deel.endsWith('**'))
          return <Text key={i} style={[s.analyseTekst, s.vet]}>{deel.slice(2, -2)}</Text>;
        if (deel.startsWith('*') && deel.endsWith('*'))
          return <Text key={i} style={[s.analyseTekst, s.vet]}>{deel.slice(1, -1)}</Text>;
        return <Text key={i}>{deel}</Text>;
      })}
    </Text>
  );
}

type AnalyseEl = { type: 'h2' | 'h3' | 'tekst'; inhoud: string };
type AnalyseGroep =
  | { type: 'h2'; inhoud: string }
  | { type: 'blok'; header: string; teksten: string[] }
  | { type: 'tekst'; inhoud: string };

export function groepeerAnalyse(tekst: string): AnalyseGroep[] {
  const elementen: AnalyseEl[] = [];
  // Helvetica kent geen emoji-glyphs (✨, 🌱), vervang door een leesbaar bolletje
  const schoon = tekst.replace(/[✨🌱]\s*/g, '• ');
  for (const regel of schoon.split('\n')) {
    if (regel.startsWith('## '))            elementen.push({ type: 'h2', inhoud: regel.slice(3) });
    else if (regel.startsWith('### '))      elementen.push({ type: 'h3', inhoud: regel.slice(4) });
    else if (regel.trim() && !/^[-*_]{3,}$/.test(regel.trim()))
      elementen.push({ type: 'tekst', inhoud: regel.trim() });
  }
  const groepen: AnalyseGroep[] = [];
  let i = 0;
  while (i < elementen.length) {
    const el = elementen[i];
    if (el.type === 'h2') { groepen.push({ type: 'h2', inhoud: el.inhoud }); i++; }
    else if (el.type === 'h3') {
      const teksten: string[] = [];
      i++;
      while (i < elementen.length && elementen[i].type === 'tekst') { teksten.push(elementen[i].inhoud); i++; }
      groepen.push({ type: 'blok', header: el.inhoud, teksten });
    } else { groepen.push({ type: 'tekst', inhoud: el.inhoud }); i++; }
  }
  return groepen;
}

export function AnalyseInhoud({ tekst }: { tekst: string }) {
  const s = gedeeldeStijlen;
  const groepen = groepeerAnalyse(tekst);
  return (
    <>
      {groepen.map((g, i) => {
        if (g.type === 'h2') return <Text key={i} style={s.analyseH2} minPresenceAhead={60}>{g.inhoud.toUpperCase()}</Text>;
        if (g.type === 'blok') return (
          <View key={i} wrap={false} style={{ marginBottom: 4 }}>
            <Text style={s.analyseH3}>{g.header}</Text>
            {g.teksten.map((t, j) => <TekstMetVet key={j} tekst={t} />)}
          </View>
        );
        return <TekstMetVet key={i} tekst={g.inhoud} />;
      })}
    </>
  );
}
