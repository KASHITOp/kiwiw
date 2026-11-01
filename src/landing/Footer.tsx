import { Link } from "react-router-dom";
import KiwiSlice from "../brand/KiwiSlice";
import { useEditor } from "../store";

const REPO = "https://github.com/KASHITOp/kiwiw";

export function ZigRule() {
  return <div className="zig" aria-hidden="true" />;
}

export default function Footer() {
  const newDoc = useEditor((s) => s.newDoc);
  return (
    <footer className="ft">
      <ZigRule />
      <div className="ft-inner">
        <div className="ft-cta">
          <KiwiSlice R={120} detail={0.6} pad={12} className="ft-slice" />
          <div>
            <div className="mono eyebrow">[04] LAST SLICE</div>
            <h2 className="display ft-h2">Cut it open.</h2>
            <p className="ft-sub">Your plain idea is in there somewhere. Bring it.</p>
            <Link to="/editor" className="k-btn" onClick={() => newDoc(1080, 1080)}>Open the editor →</Link>
          </div>
        </div>
        <div className="ft-cols mono">
          <div>
            <h4>MADE OF</h4>
            <span>React 19</span><span>Vite</span><span>TypeScript</span>
          </div>
          <div>
            <h4>ELSEWHERE</h4>
            <a href={REPO} target="_blank" rel="noreferrer">GitHub</a>
            <a href={`${REPO}/blob/main/DESIGN.md`} target="_blank" rel="noreferrer">DESIGN.md</a>
            <a href={`${REPO}/blob/main/LICENSES.md`} target="_blank" rel="noreferrer">Licenses</a>
          </div>
          <div>
            <h4>SMALL PRINT</h4>
            <span>MIT licensed</span><span>AI runs in demo mode</span><span>No keys needed</span>
          </div>
        </div>
      </div>
      <div className="ft-base mono">
        <span>© {new Date().getFullYear()} KIWIW</span>
        <span>BUILT WITH CLAUDE CODE</span>
        <span>NO KIWIS WERE HARMED. ONE WAS CUT.</span>
      </div>
    </footer>
  );
}
