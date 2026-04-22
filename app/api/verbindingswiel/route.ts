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
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Kon analyse niet verwerken' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
