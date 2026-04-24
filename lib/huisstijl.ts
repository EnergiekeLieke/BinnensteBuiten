export const kleuren = {
  darkRed:   '#9e3816',
  darkGreen: '#3b5633',
  midGreen:  '#758d69',
  lightBg:   '#f4c293',
  lightBg2:  '#fde8d0',
  cream:     '#fcebdc',
  darkSlate: '#2a3a3c',
  orange:    '#d56119',
  blauw:     '#1a4a7a',
} as const;

export function sliderBackground(value: number, max: number, color: string, bg: string = kleuren.lightBg2): string {
  const pct = `${(value / max) * 100}%`;
  return `linear-gradient(to right, ${color} 0%, ${color} ${pct}, ${bg} ${pct}, ${bg} 100%)`;
}

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

async function leesStream(res: Response): Promise<string> {
  if (!res.ok || !res.body) {
    const tekst = await res.text();
    let errMsg = `Analyse mislukt (${res.status})`;
    try { errMsg = JSON.parse(tekst).error || errMsg; } catch { errMsg = tekst.slice(0, 150) || errMsg; }
    throw new Error(errMsg);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let result = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }
  } catch (err) {
    reader.cancel();
    throw err;
  }
  return result;
}

export async function roepAnalyseAan(prompt: string, maxTokens = 2000): Promise<string> {
  const res = await fetch('/api/analyse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, maxTokens }),
  });
  return leesStream(res);
}

export async function streamAnalyse(
  prompt: string,
  maxTokens = 2000,
  onChunk: (chunk: string) => void,
  system?: string,
): Promise<void> {
  const res = await fetch('/api/analyse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, maxTokens, ...(system ? { system } : {}) }),
  });
  if (!res.ok || !res.body) {
    const tekst = await res.text();
    let errMsg = `Analyse mislukt (${res.status})`;
    try { errMsg = JSON.parse(tekst).error || errMsg; } catch { errMsg = tekst.slice(0, 150) || errMsg; }
    throw new Error(errMsg);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value, { stream: true }));
    }
  } catch (err) {
    reader.cancel();
    throw err;
  }
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
