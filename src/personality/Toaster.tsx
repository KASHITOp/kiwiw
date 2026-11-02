import { useEffect, useState } from "react";
import { useBus } from "./bus";

/** Bottom-centre ink pill, 2.6s, one at a time (DESIGN.md §13). */
export default function Toaster() {
  const { toastMsg, toastKey } = useBus();
  const [shown, setShown] = useState<string | null>(null);
  useEffect(() => {
    if (!toastMsg) return;
    setShown(toastMsg);
    const t = setTimeout(() => setShown(null), 2600);
    return () => clearTimeout(t);
  }, [toastMsg, toastKey]);
  return (
    <div className="toaster" aria-live="polite" role="status">
      {shown && <div key={toastKey} className="toast">{shown}</div>}
    </div>
  );
}
