export const kleuren = {
  darkRed:   '#9e3816',
  darkGreen: '#3b5633',
  midGreen:  '#758d69',
  lightBg:   '#f4c293',
  lightBg2:  '#fde8d0',
  cream:     '#fdf6ee',
  darkSlate: '#2a3a3c',
  orange:    '#d56119',
} as const;

export const LEVENSGEBIEDEN = [
  'Huis',
  'Werk',
  'Vrienden & Familie',
  'Ontspanning',
  'Liefde & Relatie',
  'Persoonlijke groei',
  'Gezondheid',
  'Financiën',
] as const;

export type Levensgebied = (typeof LEVENSGEBIEDEN)[number];

export async function roepAnalyseAan(prompt: string, maxTokens = 2000): Promise<string> {
  const res = await fetch('/api/analyse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, maxTokens }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Analyse mislukt');
  return data.result as string;
}

export async function exporteerAlsPdf(html: string, toolName: string): Promise<void> {
  const res = await fetch('/api/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, toolName }),
  });
  if (!res.ok) {
    const d = await res.json();
    throw new Error(d.error || 'PDF export mislukt');
  }
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${toolName.replace(/\s+/g, '-')}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
