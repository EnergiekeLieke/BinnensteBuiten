'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { CATEGORIEEN_DETAIL, INTAKE_OPEN_VRAGEN } from '@/lib/businessScanData';

const BusinessScanIntakePdfKnop = dynamic(
  () => import('./BusinessScanIntakePdf').then((m) => m.BusinessScanIntakePdfKnop),
  { ssr: false }
);

const inputClass = 'w-full text-sm text-darkSlate border border-lightBg rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-midGreen';

export default function BusinessScanIntake() {
  const [klant, setKlant] = useState({ naam: '', bedrijf: '', email: '' });
  const [modus, setModus] = useState<'basis' | 'uitgebreid'>('uitgebreid');

  const [basisScores, setBasisScores] = useState<number[]>(() => CATEGORIEEN_DETAIL.map(() => 5));
  const [detailScores, setDetailScores] = useState<number[][]>(() =>
    CATEGORIEEN_DETAIL.map((c) => c.subonderdelen.map(() => 5))
  );
  const [open, setOpen] = useState<boolean[]>(() => CATEGORIEEN_DETAIL.map(() => false));
  const [bonus, setBonus] = useState(5);
  const [antwoorden, setAntwoorden] = useState<string[]>(INTAKE_OPEN_VRAGEN.map(() => ''));

  const toggleCat = (i: number) =>
    setOpen((p) => p.map((o, idx) => (idx === i ? !o : o)));

  const updateBasis = (i: number, v: number) =>
    setBasisScores((p) => p.map((x, idx) => (idx === i ? v : x)));

  const updateDetail = (ci: number, si: number, v: number) =>
    setDetailScores((p) => p.map((row, idx) => (idx === ci ? row.map((x, sidx) => (sidx === si ? v : x)) : row)));

  const updateAntwoord = (i: number, v: string) =>
    setAntwoorden((p) => p.map((x, idx) => (idx === i ? v : x)));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-salmon text-3xl text-darkSlate mb-2">Business Scan Intake</h1>
        <p className="text-midGreen text-sm">Voorbereiding op jouw Business Scan</p>
      </div>

      <div className="bg-lightBg2 border-l-4 border-midGreen rounded-xl px-4 py-3 text-sm text-darkSlate leading-relaxed">
        <span className="font-semibold text-midGreen">Zo werkt het: </span>
        Vul hieronder je gegevens en je scores in. Geef per onderdeel het cijfer dat klopt met wat je bewust
        denkt of vindt (0 = gaat voor geen meter, 10 = gaat perfect en moeiteloos). Download daarna de PDF en mail
        deze. Vervolgens bereid ik de rest van de analyse voor en plannen we daarover een call.
      </div>

      {/* Klantgegevens */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-lightBg space-y-3">
        <h2 className="font-salmon text-lg text-darkSlate">Jouw gegevens</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-midGreen block mb-1">Naam</label>
            <input
              type="text" value={klant.naam} className={inputClass}
              onChange={(e) => setKlant((k) => ({ ...k, naam: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs text-midGreen block mb-1">Bedrijfsnaam</label>
            <input
              type="text" value={klant.bedrijf} className={inputClass}
              onChange={(e) => setKlant((k) => ({ ...k, bedrijf: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs text-midGreen block mb-1">E-mailadres</label>
            <input
              type="email" value={klant.email} className={inputClass}
              onChange={(e) => setKlant((k) => ({ ...k, email: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Modus toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setModus('basis')}
          className={`text-sm px-4 py-2 rounded-full border transition-colors ${
            modus === 'basis' ? 'bg-darkGreen text-cream border-darkGreen' : 'border-lightBg text-midGreen hover:border-darkGreen'
          }`}
        >
          Basis
        </button>
        <button
          onClick={() => setModus('uitgebreid')}
          className={`text-sm px-4 py-2 rounded-full border transition-colors ${
            modus === 'uitgebreid' ? 'bg-darkGreen text-cream border-darkGreen' : 'border-lightBg text-midGreen hover:border-darkGreen'
          }`}
        >
          Uitgebreid
        </button>
      </div>

      {/* Scores */}
      <div className="space-y-3">
        {modus === 'basis'
          ? CATEGORIEEN_DETAIL.map((cat, i) => (
              <div key={cat.naam} className="bg-white rounded-xl p-4 shadow-sm border border-lightBg">
                <h3 className="font-salmon text-base text-darkSlate mb-2">{i + 1}. {cat.naam}</h3>
                <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                  {cat.subonderdelen.map((sub) => (
                    <li key={sub} className="text-xs text-midGreen before:content-['•'] before:mr-1.5 before:text-orange">
                      {sub}
                    </li>
                  ))}
                </ul>
                <BewustSlider waarde={basisScores[i]} onChange={(v) => updateBasis(i, v)} />
              </div>
            ))
          : CATEGORIEEN_DETAIL.map((cat, i) => (
              <div key={cat.naam} className="bg-white rounded-xl shadow-sm border border-lightBg overflow-hidden">
                <button
                  onClick={() => toggleCat(i)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-lightBg2 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-midGreen text-xs w-5">{i + 1}.</span>
                    <span className="font-salmon text-darkSlate text-base">{cat.naam}</span>
                  </div>
                  <span className="text-midGreen text-sm">{open[i] ? '▲' : '▼'}</span>
                </button>

                {open[i] && (
                  <div className="px-4 pb-4 border-t border-lightBg">
                    <div className="space-y-3 mt-3">
                      {cat.subonderdelen.map((sub, si) => (
                        <div key={sub} className="rounded-lg p-3 border border-lightBg">
                          <span className="text-sm font-medium text-darkSlate block mb-2">{sub}</span>
                          <BewustSlider waarde={detailScores[i][si]} onChange={(v) => updateDetail(i, si, v)} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

        {/* Bonus */}
        <div className="bg-orange/10 rounded-xl p-4 border border-orange/30">
          <h3 className="font-salmon text-base text-orange mb-3">Bonus — Vertrouwen & overgave</h3>
          <BewustSlider waarde={bonus} onChange={setBonus} />
        </div>
      </div>

      {/* Open vragen */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-lightBg space-y-4">
        <h2 className="font-salmon text-lg text-darkSlate">Toelichting</h2>
        {INTAKE_OPEN_VRAGEN.map((vraag, i) => (
          <div key={vraag}>
            <label className="text-sm text-darkSlate block mb-1">{vraag}</label>
            <textarea
              value={antwoorden[i]}
              onChange={(e) => updateAntwoord(i, e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <BusinessScanIntakePdfKnop
          klant={klant}
          modus={modus}
          basisScores={basisScores}
          detailScores={detailScores}
          bonus={bonus}
          open={antwoorden}
        />
      </div>
    </div>
  );
}

function BewustSlider({ waarde, onChange }: { waarde: number; onChange: (v: number) => void }) {
  const trackColor = '#9e3816';
  const pct = `${waarde * 10}%`;
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-xs w-16 text-darkRed">Bewust</span>
        <input
          type="range" min={0} max={10} step={1} value={waarde}
          className="flex-1 slider-bewust"
          style={{ background: `linear-gradient(to right, ${trackColor} 0%, ${trackColor} ${pct}, #fde8d0 ${pct}, #fde8d0 100%)` }}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="text-xs font-bold w-4 text-right text-darkRed">{waarde}</span>
      </div>
      <div className="flex justify-between ml-[76px] mr-7 text-[11px] text-darkSlate/50 mt-1">
        <span>0 = gaat voor geen meter</span>
        <span>10 = gaat perfect en moeiteloos</span>
      </div>
    </div>
  );
}
