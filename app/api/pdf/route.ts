import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let body: { html?: string; toolName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek' }, { status: 400 });
  }

  const { html, toolName = 'Rapport' } = body;
  if (!html || typeof html !== 'string') {
    return NextResponse.json({ error: 'HTML is verplicht' }, { status: 400 });
  }

  const fullHtml = buildPdfHtml(html, toolName);

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chromium: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let puppeteer: any;

    chromium  = await import('@sparticuz/chromium');
    puppeteer = (await import('puppeteer-core')).default;

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
    });

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${toolName.replace(/\s+/g, '-')}.pdf"`,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Onbekende fout';
    return NextResponse.json({ error: `PDF fout: ${msg}` }, { status: 500 });
  }
}

function buildPdfHtml(bodyHtml: string, toolName: string): string {
  const date = new Date().toLocaleDateString('nl-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, serif; color: #2a3a3c; background: #fdf6ee; font-size: 11pt; line-height: 1.6; }
  .pdf-header { background: #2a3a3c; color: #fdf6ee; padding: 20px 24px; display: flex; justify-content: space-between; align-items: flex-end; }
  .pdf-header .brand { font-size: 22pt; color: #f4c293; }
  .pdf-header .tool  { font-size: 12pt; color: #758d69; }
  .pdf-header .date  { font-size: 9pt; color: #758d69; }
  .pdf-body  { padding: 24px; }
  h2 { font-size: 14pt; color: #3b5633; margin: 20px 0 8px; border-bottom: 1px solid #f4c293; padding-bottom: 4px; }
  h3 { font-size: 11pt; color: #9e3816; margin: 14px 0 6px; }
  p  { margin-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10pt; }
  th { background: #3b5633; color: #fdf6ee; padding: 6px 10px; text-align: left; }
  td { padding: 5px 10px; border-bottom: 1px solid #fde8d0; }
  tr:nth-child(even) td { background: #fde8d0; }
  .score-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 9pt; font-weight: bold; }
  .bewust   { background: #9e3816; color: white; }
  .onbewust { background: #3b5633; color: white; }
  .analyse-block { background: #fde8d0; border-left: 4px solid #d56119; padding: 12px 16px; margin: 12px 0; border-radius: 4px; }
  .affirmatie { background: #3b5633; color: #fdf6ee; padding: 8px 14px; border-radius: 6px; margin: 6px 0; }
  .groei-affirmatie { background: #d56119; color: white; padding: 8px 14px; border-radius: 6px; margin: 6px 0; }
  .pdf-footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #f4c293; text-align: center; font-size: 9pt; color: #758d69; }
</style>
</head>
<body>
  <div class="pdf-header">
    <div>
      <div class="brand">Energieke Lieke</div>
      <div class="tool">${toolName}</div>
    </div>
    <div class="date">${date}</div>
  </div>
  <div class="pdf-body">
    ${bodyHtml}
    <div class="pdf-footer">Gegenereerd via Energieke Lieke — Van denken naar voelen</div>
  </div>
</body>
</html>`;
}
