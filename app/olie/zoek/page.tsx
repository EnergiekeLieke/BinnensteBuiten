'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Olie = { naam: string; voor?: string; href?: string };

type Categorie = {
  id: string;
  titel: string;
  emoji: string;
  kleur: string;
  olieen: Olie[];
  blend?: { naam: string; olieen: string[]; href?: string };
  notitie?: string;
};

type Groep = {
  titel: string;
  emoji: string;
  categories: Categorie[];
};

const groepen: Groep[] = [
  {
    titel: 'Fysiek',
    emoji: '🌿',
    categories: [
      {
        id: 'luchtwegen',
        titel: 'Luchtwegen & vrij ademen',
        emoji: '🫁',
        kleur: 'border-midGreen',
        olieen: [{ naam: 'R.C.' }, { naam: 'Eucalyptus' }, { naam: 'Peppermint' }],
      },
      {
        id: 'spijsvertering',
        titel: 'Spijsvertering',
        emoji: '🌿',
        kleur: 'border-orange',
        olieen: [{ naam: 'Di-Gize' }, { naam: 'Peppermint' }, { naam: 'Fennel' }, { naam: 'Ginger' }],
      },
      {
        id: 'weerstand',
        titel: 'Weerstand',
        emoji: '🛡️',
        kleur: 'border-darkGreen',
        olieen: [{ naam: 'Thieves' }, { naam: 'Purification' }, { naam: 'Lemon' }],
      },
      {
        id: 'pollen',
        titel: 'Pollen',
        emoji: '🌸',
        kleur: 'border-midGreen',
        olieen: [{ naam: 'Lavender', href: 'https://energiekelieke.kennis.shop/pay/Lavender5ML' }, { naam: 'Lemon' }, { naam: 'Peppermint' }],
        blend: { naam: 'het pollentrio', olieen: ['Lavender', 'Lemon', 'Peppermint'], href: 'https://energiekelieke.kennis.shop/pay/pollen' },
      },
    ],
  },
  {
    titel: 'Energie & Focus',
    emoji: '⚡',
    categories: [
      {
        id: 'focus',
        titel: 'Focus',
        emoji: '🎯',
        kleur: 'border-darkRed',
        olieen: [{ naam: 'Lemon' }, { naam: 'Peppermint' }],
        blend: { naam: 'focusblend', olieen: ['Lemon', 'Peppermint'] },
      },
      {
        id: 'wakker',
        titel: 'Wakker worden',
        emoji: '☀️',
        kleur: 'border-orange',
        olieen: [{ naam: 'Peppermint' }],
      },
      {
        id: 'motivatie',
        titel: 'Motivatie',
        emoji: '🔥',
        kleur: 'border-darkRed',
        olieen: [
          { naam: 'Magnify Your Purpose', voor: 'richting', href: 'https://energiekelieke.kennis.shop/pay/motivatieboostolien' },
          { naam: 'Motivation', voor: 'actie', href: 'https://energiekelieke.kennis.shop/pay/motivatieboostolien' },
          { naam: 'Believe of Valor', voor: 'zelfvertrouwen', href: 'https://energiekelieke.kennis.shop/pay/valor' },
        ],
      },
      {
        id: 'zelfvertrouwen',
        titel: 'Zelfvertrouwen & Eigenwaarde',
        emoji: '💪',
        kleur: 'border-midGreen',
        olieen: [{ naam: 'Believe' }, { naam: 'Valor', href: 'https://energiekelieke.kennis.shop/pay/valor' }],
      },
    ],
  },
  {
    titel: 'Rust & Balans',
    emoji: '🌙',
    categories: [
      {
        id: 'ontspanning',
        titel: 'Ontspanning & Slapen',
        emoji: '😴',
        kleur: 'border-darkSlate',
        olieen: [{ naam: 'Lavender', href: 'https://energiekelieke.kennis.shop/pay/Lavender5ML' }, { naam: 'Cedarwood' }, { naam: 'Stress Away', href: 'https://energiekelieke.kennis.shop/pay/stressaway' }],
      },
      {
        id: 'gronding',
        titel: 'Aarden & Gronding',
        emoji: '🌳',
        kleur: 'border-darkGreen',
        olieen: [
          { naam: 'Idaho Blue Spruce' },
          { naam: 'Cedarwood' },
          { naam: 'Copaiba' },
          { naam: 'Grounding' },
        ],
        notitie: 'of andere boom oliën',
      },
    ],
  },
];

function KaartItem({ cat, open, onToggle }: { cat: Categorie; open: boolean; onToggle: () => void }) {
  return (
    <div className={`bg-white rounded-2xl border-l-4 ${cat.kleur} shadow overflow-hidden`}>
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{cat.emoji}</span>
          <span className="font-salmon text-base text-darkSlate">{cat.titel}</span>
        </div>
        <span className={`text-darkSlate/40 text-sm transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-darkSlate/10">
          <ul className="flex flex-col gap-2 mt-3">
            {cat.olieen.map((o) => (
              <li key={o.naam} className="flex items-baseline gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-midGreen flex-shrink-0 mt-1.5" />
                {o.href ? (
                  <a href={o.href} target="_blank" rel="noopener noreferrer" className="text-sm text-midGreen font-medium hover:underline">{o.naam}</a>
                ) : (
                  <span className="text-sm text-darkSlate font-medium">{o.naam}</span>
                )}
                {o.voor && (
                  <span className="text-xs text-darkSlate/50">voor {o.voor}</span>
                )}
              </li>
            ))}
          </ul>

          {cat.notitie && (
            <p className="text-xs text-darkSlate/50 mt-2 ml-3.5 italic">{cat.notitie}</p>
          )}

          {cat.blend && (
            cat.blend.href ? (
              <a href={cat.blend.href} target="_blank" rel="noopener noreferrer" className="mt-4 block bg-midGreen/10 hover:bg-midGreen/20 transition-colors rounded-xl px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-midGreen mb-1">Als blend: {cat.blend.naam} →</p>
                <p className="text-xs text-darkSlate/70">{cat.blend.olieen.join(' + ')}</p>
              </a>
            ) : (
            <div className="mt-4 bg-midGreen/10 rounded-xl px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-midGreen mb-1">
                Als blend: {cat.blend.naam}
              </p>
              <p className="text-xs text-darkSlate/70">
                {cat.blend.olieen.join(' + ')}
              </p>
            </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function ZoekPage() {
  const [open, setOpen] = useState<Set<string>>(new Set());

  useEffect(() => {
    const sendHeight = () => {
      window.parent.postMessage({ type: 'iframeHeight', height: document.documentElement.scrollHeight + 32 }, '*');
    };
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.documentElement);
    sendHeight();
    return () => observer.disconnect();
  }, []);

  const toggle = (id: string) => setOpen((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div>
      <div className="mb-2">
        <Link href="/olie" className="text-xs text-midGreen hover:underline">← Oliën</Link>
      </div>
      <div className="mb-8">
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">Welke olie past bij wat ik zoek?</h1>
        <p className="text-sm text-darkSlate/70 leading-relaxed">
          Klik een categorie open om te zien welke oliën daarbij passen.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {groepen.map((groep) => (
          <div key={groep.titel}>
            <h2 className="font-bold text-xs uppercase tracking-widest text-darkSlate mb-3">
              {groep.emoji} {groep.titel}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              {groep.categories.map((cat) => (
                <KaartItem
                  key={cat.id}
                  cat={cat}
                  open={open.has(cat.id)}
                  onToggle={() => toggle(cat.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
