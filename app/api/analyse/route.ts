import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 120;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key niet geconfigureerd' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { prompt?: string; maxTokens?: number };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Ongeldig verzoek' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { prompt, maxTokens = 2000 } = body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'Prompt is verplicht' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (prompt.trim().length < 10) {
    return new Response(JSON.stringify({ error: 'Prompt is te kort (minimaal 10 tekens)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (prompt.length > 20000) {
    return new Response(JSON.stringify({ error: 'Prompt is te lang (maximaal 20.000 tekens)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const tokens = Math.min(Math.max(Number(maxTokens) || 2000, 500), 8000);

  let stream: ReturnType<typeof client.messages.stream>;
  try {
    stream = client.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: tokens,
      system:
        'Je bent een warme, inzichtelijke coach. ' +
        'Je schrijft in het Nederlands, persoonlijk en bemoedigend, en spreekt de gebruiker aan als "jij" of "je". ' +
        'Gebruik geen namen. Schrijf eerlijk, diep, zonder jargon. ' +
        'Structureer je antwoord altijd met duidelijke secties met ##-koppen.',
      messages: [{ role: 'user', content: prompt }],
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Kon verbinding met AI niet starten' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
