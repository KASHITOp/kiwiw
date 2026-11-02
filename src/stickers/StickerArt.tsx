import { useId } from "react";
import { STICKER_MAP } from "./library";

interface Props {
  kind: string;
  fill?: string;
  accent?: string;
  ink?: string;
  flipX?: boolean;
  /** Force letterboxing (used by picker tiles so stretchy stickers still preview nicely). */
  fit?: boolean;
}

export default function StickerArt({ kind, fill, accent, ink, flipX, fit }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const def = STICKER_MAP[kind];
  if (!def) return null;
  const c = { fill: fill ?? def.colors.fill, accent: accent ?? def.colors.accent, ink: ink ?? def.colors.ink };
  return (
    <svg
      viewBox={`0 0 ${def.vb[0]} ${def.vb[1]}`}
      preserveAspectRatio={def.stretch && !fit ? "none" : "xMidYMid meet"}
      width="100%"
      height="100%"
      style={{ display: "block", overflow: "visible", transform: flipX ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      <def.Art c={c} uid={uid} />
    </svg>
  );
}
