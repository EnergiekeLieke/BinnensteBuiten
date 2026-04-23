import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key niet geconfigureerd' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { prompt?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Ongeldig verzoek' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { prompt } = body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'Prompt is verplicht' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (prompt.length > 30000) {
    return new Response(JSON.stringify({ error: 'Prompt is te lang (maximaal 30.000 tekens)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content.map((b) => ('text' in b ? b.text : '')).join('').replace(/```json|```/g, '').trim();

  if (!raw.startsWith('{')) {
    return new Response(JSON.stringify({ error: 'Onverwacht antwoord van AI' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = JSON.parse(raw);
    if (!result.samenvatting || !result.sterktes || !result.aandacht) {
      console.error('Onvolledig analyserapport:', JSON.stringify(result).slice(0, 300));
      return new Response(JSON.stringify({ error: 'Onvolledig rapport ontvangen — probeer opnieuw' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('JSON parse error:', err, 'Raw:', raw.slice(0, 300));
    return new Response(JSON.stringify({ error: 'Analyse kon niet worden verwerkt — probeer opnieuw' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
