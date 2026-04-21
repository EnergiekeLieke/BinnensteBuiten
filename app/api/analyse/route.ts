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

  if (prompt.length > 20000) {
    return new Response(JSON.stringify({ error: 'Prompt te lang' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const tokens = Math.min(Math.max(Number(maxTokens) || 2000, 500), 4000);

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: tokens,
    system:
      'Je bent een warme, inzichtelijke coach. ' +
      'Je schrijft in het Nederlands, persoonlijk en bemoedigend, en spreekt de gebruiker aan als "jij" of "je". ' +
      'Gebruik geen namen. Schrijf eerlijk, diep, zonder jargon. ' +
      'Structureer je antwoord altijd met duidelijke secties met ##-koppen.',
    messages: [{ role: 'user', content: prompt }],
  });

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
