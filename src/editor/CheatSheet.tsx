import { X } from "lucide-react";

const ROWS: [string[], string][] = [
  [["Ctrl", "Z"], "Undo"],
  [["Ctrl", "Y"], "Redo"],
  [["Ctrl", "D"], "Duplicate"],
  [["Ctrl", "C"], "Copy"],
  [["Ctrl", "V"], "Paste"],
  [["Ctrl", "A"], "Select everything"],
  [["Ctrl", "G"], "Group (they're a band now)"],
  [["Ctrl", "Shift", "G"], "Ungroup"],
  [["←↑→↓"], "Nudge 1px"],
  [["Shift", "←↑→↓"], "Nudge 10px"],
  [["Del"], "Delete"],
  [["Shift", "Click"], "Add to selection"],
  [["Drag"], "On empty canvas: marquee select"],
  [["Alt", "Drag"], "Move without snapping"],
  [["Shift", "Rotate"], "Snap to 15°"],
  [["/"], "Search the open panel"],
  [["Ctrl", "\\"], "Hide / show the panel"],
  [["Esc"], "Deselect"],
  [["?"], "This sheet"],
];

export default function CheatSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="cheat-scrim" onPointerDown={onClose}>
      <div className="cheat" role="dialog" aria-label="Keyboard shortcuts" onPointerDown={(e) => e.stopPropagation()}>
        <header>
          <div>
            <b>Shortcuts</b>
            <span>For people who think the mouse is optional.</span>
          </div>
          <button className="icon-btn" onClick={onClose} title="Close (Esc)"><X size={16} /></button>
        </header>
        <dl>
          {ROWS.map(([keys, what]) => (
            <div key={what}>
              <dt>{keys.map((k) => <kbd key={k}>{k}</kbd>)}</dt>
              <dd>{what}</dd>
            </div>
          ))}
        </dl>
        <footer>Secret: there's one more. It involves arrows, B and A.</footer>
      </div>
    </div>
  );
}
