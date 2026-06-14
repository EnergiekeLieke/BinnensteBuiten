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

export async function roepAnalyseAan(prompt: string, maxTokens = 2000, signal?: AbortSignal): Promise<string> {
  const res = await fetch('/api/analyse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, maxTokens }),
    signal,
  });
  return leesStream(res);
}

export async function streamAnalyse(
  prompt: string,
  maxTokens = 2000,
  onChunk: (chunk: string) => void,
  system?: string,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch('/api/analyse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, maxTokens, ...(system ? { system } : {}) }),
    signal,
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

// Nog in gebruik door HumanDesignAffirmaties — vervanging gepland
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

const KOMMA_WOORDEN = new Set([
  'maar', 'want', 'en', 'of', 'dus', 'toch', 'ook', 'zelfs',
  'soms', 'nog', 'al', 'dan', 'hoewel', 'terwijl',
]);

export function vervangMDashes(tekst: string): string {
  const zonderMDash = tekst.replace(/[ \t]*—[ \t]*/g, (match, offset: number, str: string) => {
    const na = str.slice(offset + match.length);
    const eersteChar = na[0] ?? '';
    const volgend = (na.match(/^([a-zA-Z]+)/)?.[1] ?? '').toLowerCase();
    if (eersteChar >= 'A' && eersteChar <= 'Z') return '. ';
    if (KOMMA_WOORDEN.has(volgend)) return ', ';
    return ': ';
  });
  // AI laat soms de spatie na ## of ### weg, waardoor koppen niet als kop herkend worden
  return zonderMDash.replace(/^(#{2,3})([^#\s])/gm, '$1 $2');
}
