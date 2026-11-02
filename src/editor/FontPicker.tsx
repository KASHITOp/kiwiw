import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { FONT_KIT, FONT_GROUPS, GROUP_LABEL, fontDef, fontLabel } from "../fonts/kit";

interface Props {
  value: string;
  onChange: (family: string) => void;
  /** Smaller trigger for the floating toolbar. */
  compact?: boolean;
}

// Font picker grouped by mood; every face previews in itself (DESIGN.md §10).
export default function FontPicker({ value, onChange, compact }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQ("");
    const t = setTimeout(() => searchRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); };
  }, [open]);

  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    return FONT_GROUPS.map((g) => ({
      g,
      fonts: FONT_KIT.filter((f) => f.group === g && (!s || f.label.toLowerCase().includes(s) || GROUP_LABEL[g].toLowerCase().includes(s))),
    })).filter((x) => x.fonts.length);
  }, [q]);

  const current = fontDef(value);

  return (
    <div className={"fp" + (compact ? " fp-compact" : "")} onPointerDown={(e) => e.stopPropagation()}>
      <button type="button" className="fp-trigger" onClick={() => setOpen((o) => !o)} title="Font" aria-haspopup="listbox" aria-expanded={open}>
        <span className="fp-current" style={{ fontFamily: value, fontWeight: current?.defaultWeight ?? 600 }}>{fontLabel(value)}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <>
          <div className="fp-backdrop" onClick={() => setOpen(false)} />
          <div className="fp-pop" role="listbox" aria-label="Fonts">
            <div className="fp-search">
              <Search size={14} />
              <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a font with opinions…" />
            </div>
            <div className="fp-list">
              {groups.map(({ g, fonts }) => (
                <div key={g}>
                  <div className="fp-group">{GROUP_LABEL[g]}</div>
                  {fonts.map((f) => (
                    <button
                      key={f.family}
                      type="button"
                      role="option"
                      aria-selected={f.family === value}
                      className={"fp-item" + (f.family === value ? " on" : "")}
                      onClick={() => { onChange(f.family); setOpen(false); }}
                    >
                      <span className="fp-name" style={{ fontFamily: f.family, fontWeight: f.defaultWeight }}>{f.label}</span>
                      <span className="fp-sample" style={{ fontFamily: f.family, fontWeight: f.defaultWeight }}>{f.sample}</span>
                    </button>
                  ))}
                </div>
              ))}
              {!groups.length && <div className="empty">No font called that. Yet.</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
