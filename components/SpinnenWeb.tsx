'use client';

import { kleuren } from '@/lib/huisstijl';

interface SpinnenWebProps {
  labels: string[];
  bewustScores: number[];
  onbewustScores: number[];
  maxScore?: number;
  size?: number;
}

export default function SpinnenWeb({
  labels,
  bewustScores,
  onbewustScores,
  maxScore = 10,
  size = 300,
}: SpinnenWebProps) {
  const n   = labels.length;
  const cx  = size / 2;
  const cy  = size / 2;
  const r   = (size / 2) * 0.78;

  const angle = (i: number) => (i * 2 * Math.PI) / n - Math.PI / 2;

  const point = (score: number, i: number) => {
    const ratio = score / maxScore;
    const a     = angle(i);
    return { x: cx + r * ratio * Math.cos(a), y: cy + r * ratio * Math.sin(a) };
  };

  const axisEnd = (i: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  });

  const labelPos = (i: number) => {
    const a = angle(i);
    const d = r + 20;
    const x = cx + d * Math.cos(a);
    const y = cy + d * Math.sin(a);
    const cos = Math.cos(a);
    const anchor: 'start' | 'end' | 'middle' = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle';
    return { x, y, anchor };
  };

  const toPath = (scores: number[]) =>
    scores.map((s, i) => point(s, i)).map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z';

  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <svg width={size + 80} height={size + 110} viewBox={`-40 -40 ${size + 80} ${size + 110}`} className="mx-auto max-w-full h-auto">
      {/* Grid rings */}
      {gridLevels.map((lvl) => (
        <polygon
          key={lvl}
          points={Array.from({ length: n }, (_, i) => {
            const pt = point(lvl, i);
            return `${pt.x},${pt.y}`;
          }).join(' ')}
          fill="none"
          stroke={kleuren.lightBg}
          strokeWidth="1"
        />
      ))}

      {/* Axes */}
      {Array.from({ length: n }, (_, i) => {
        const end = axisEnd(i);
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={end.x} y2={end.y}
            stroke={kleuren.lightBg}
            strokeWidth="1"
          />
        );
      })}

      {/* Onbewust polygon (groen, achtergrond) */}
      <path
        d={toPath(onbewustScores)}
        fill={kleuren.darkGreen}
        fillOpacity={0.25}
        stroke={kleuren.darkGreen}
        strokeWidth={2}
      />

      {/* Bewust polygon (rood, voorgrond) */}
      <path
        d={toPath(bewustScores)}
        fill={kleuren.darkRed}
        fillOpacity={0.2}
        stroke={kleuren.darkRed}
        strokeWidth={2}
      />

      {/* Datapoints bewust */}
      {bewustScores.map((s, i) => {
        const p = point(s, i);
        return <circle key={i} cx={p.x} cy={p.y} r={4} fill={kleuren.darkRed} />;
      })}

      {/* Datapoints onbewust */}
      {onbewustScores.map((s, i) => {
        const p = point(s, i);
        return <circle key={i} cx={p.x} cy={p.y} r={4} fill={kleuren.darkGreen} />;
      })}

      {/* Labels */}
      {labels.map((lbl, i) => {
        const lp = labelPos(i);
        const delen = lbl.includes(' & ') ? lbl.split(' & ') : lbl.includes(' ') && lbl.length > 10 ? [lbl.slice(0, lbl.lastIndexOf(' ', 11)), lbl.slice(lbl.lastIndexOf(' ', 11) + 1)] : [lbl];
        return (
          <text
            key={i}
            x={lp.x}
            y={delen.length > 1 ? lp.y - 5 : lp.y}
            textAnchor={lp.anchor}
            dominantBaseline="middle"
            fontSize={9}
            fill={kleuren.darkSlate}
            fontFamily="sans-serif"
          >
            {delen.map((deel, j) => (
              <tspan key={j} x={lp.x} dy={j === 0 ? 0 : 11}>{deel}</tspan>
            ))}
          </text>
        );
      })}

      {/* Legenda */}
      <rect x={cx - 70} y={size + 22} width={12} height={12} fill={kleuren.darkRed} rx={2} />
      <text x={cx - 54} y={size + 30} fontSize={9} fill={kleuren.darkSlate} fontFamily="sans-serif">Bewust</text>
      <rect x={cx + 10} y={size + 22} width={12} height={12} fill={kleuren.darkGreen} rx={2} />
      <text x={cx + 26} y={size + 30} fontSize={9} fill={kleuren.darkSlate} fontFamily="sans-serif">Onbewust</text>
    </svg>
  );
}
