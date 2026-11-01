import { useId, useMemo } from "react";
import { kiwiGeometry, cutLine, KIWI } from "./kiwi";

interface Props {
  R?: number;
  /** Render only one side of the cut. */
  half?: "left" | "right";
  detail?: number;
  /** Extra viewBox room around the rind. */
  pad?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function KiwiSlice({ R = 290, half, detail = 1, pad = 40, className, style }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = useMemo(() => kiwiGeometry(R, detail), [R, detail]);
  const cut = useMemo(() => cutLine(R), [R]);

  const vb = R + pad;
  const zp = cut.map(([x, y]) => `L${x.toFixed(1)},${y}`).join(" ");
  const first = cut[0][1];
  const last = cut[cut.length - 1][1];
  const edge = half === "left" ? -vb : vb;
  const clip = half ? `M${edge},${first} ${zp} L${edge},${last} Z` : null;

  return (
    <svg viewBox={`${-vb} ${-vb} ${vb * 2} ${vb * 2}`} className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id={`fl${id}`} cx="0" cy="0" r={R} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F6FBDF" />
          <stop offset=".22" stopColor="#E6F6A2" />
          <stop offset=".45" stopColor="#C6EC62" />
          <stop offset=".8" stopColor={KIWI.kiwi} />
          <stop offset="1" stopColor="#6CB022" />
        </radialGradient>
        <filter id={`fz${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency={R < 40 ? 3 : 1.5} numOctaves={2} seed={4} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale={Math.max(1.5, R * 0.04)} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {clip && (
          <clipPath id={`c${id}`}>
            <path d={clip} />
          </clipPath>
        )}
      </defs>
      <g clipPath={clip ? `url(#c${id})` : undefined}>
        <circle r={R} fill={KIWI.fuzz} filter={`url(#fz${id})`} />
        <circle r={R * 0.95} fill={KIWI.skin} />
        <circle r={R * 0.935} fill={`url(#fl${id})`} />
        {g.rays.map((r, i) => (
          <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#F4FBD6" strokeOpacity={r.o} strokeWidth={r.w} />
        ))}
        <ellipse rx={g.core.rx} ry={g.core.ry} fill="#F7FBE5" />
        {g.seeds.map((s, i) => (
          <ellipse key={i} cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} transform={`rotate(${s.rot} ${s.x} ${s.y})`} fill={KIWI.seed} />
        ))}
        {clip && <path d={"M" + zp.slice(1)} fill="none" stroke="#EEF9BE" strokeWidth={R * 0.009} opacity={0.7} />}
      </g>
    </svg>
  );
}
