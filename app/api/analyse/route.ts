import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'API key niet geconfigureerd' }, { status: 500 });
  }

  let body: { prompt?: string; maxTokens?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek' }, { status: 400 });
  }

  const { prompt, maxTokens = 2000 } = body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return NextResponse.json({ error: 'Prompt is verplicht' }, { status: 400 });
  }

  if (prompt.length > 20000) {
    return NextResponse.json({ error: 'Prompt te lang' }, { status: 400 });
  }

  const tokens = Math.min(Math.max(Number(maxTokens) || 2000, 500), 4000);

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: tokens,
      system:
        'Je bent een warme, inzichtelijke coach. ' +
        'Je schrijft in het Nederlands, persoonlijk en bemoedigend, en spreekt de gebruiker aan als "jij" of "je". ' +
        'Gebruik geen namen. Schrijf eerlijk, diep, zonder jargon. ' +
        'Structureer je antwoord altijd met duidelijke secties met ##-koppen.',
      messages: [{ role: 'user', content: prompt }],
    });

    const text =
      message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ result: text });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Onbekende fout';
    return NextResponse.json({ error: `Anthropic fout: ${msg}` }, { status: 502 });
  }
}
