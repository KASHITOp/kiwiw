// Share popover: copy a read-only link, or explain why there isn't one.
import { useMemo } from "react";
import { X } from "lucide-react";
import { shareLink } from "./link";
import { toast } from "../personality/bus";
import type { KiwiwDoc } from "../types";

export default function ShareDialog({ doc, onClose, onExport }: { doc: KiwiwDoc; onClose: () => void; onExport: () => void }) {
  const r = useMemo(() => shareLink(doc), [doc]);
  const copy = () => {
    if (!r.ok) return;
    navigator.clipboard?.writeText(r.url).then(() => toast("Link copied. The whole design is inside it. Spooky.")).catch(() => toast("Clipboard said no. Select the link and copy it."));
  };
  return (
    <div className="share" role="dialog" aria-label="Share">
      <header><b>Share a read-only link</b><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={16} /></button></header>
      {r.ok ? (
        <>
          <p className="hint">No account, no server. The design lives inside the link itself.</p>
          <input className="share-url mono" readOnly value={r.url} onFocus={(e) => e.currentTarget.select()} />
          <div className="share-go">
            <button className="btn primary sm" onClick={copy}>Copy link</button>
            <a className="btn sm" href={r.url} target="_blank" rel="noreferrer">Open it</a>
          </div>
          <p className="mono share-meta">{Math.round(r.url.length / 100) / 10}k characters · viewers can Remix it</p>
        </>
      ) : (
        <>
          <p className="hint">{r.reason}</p>
          <div className="share-go">
            <button className="btn primary sm" onClick={() => { onClose(); onExport(); }}>Export PNG instead</button>
          </div>
          <p className="mono share-meta">tip: designs with our bundled photos fit in a link fine</p>
        </>
      )}
    </div>
  );
}
