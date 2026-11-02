import { useEffect, useState } from "react";
import { useEditor } from "../store";
import { makeImage } from "../data/factory";
import { searchPhotos } from "../data/photos";

const PEXELS = (import.meta.env as Record<string, string | undefined>).VITE_PEXELS_API_KEY;

// Without a VITE_PEXELS_API_KEY the panel searches the bundled Pexels set
// (src/data/photos.ts); with a key it searches Pexels live.
const bundled = (term: string) => searchPhotos(term).map((p) => p.src);

// The query comes from the panel's header search (DESIGN.md §15), debounced.
export default function AssetPanel({ q: query }: { q: string }) {
  const add = useEditor((s) => s.addElement);
  const [photos, setPhotos] = useState<string[]>(bundled(""));
  const [loading, setLoading] = useState(false);

  const search = async (term: string) => {
    if (!PEXELS) { setPhotos(bundled(term)); return; }
    setLoading(true);
    try {
      const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(term)}&per_page=18`, {
        headers: { Authorization: PEXELS },
      });
      const data = await res.json();
      setPhotos((data.photos ?? []).map((p: { src: { medium: string } }) => p.src.medium));
    } catch {
      setPhotos(bundled(term));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => search(query.trim()), query ? 400 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <>
      <p className="fx-note" style={{ marginTop: 0 }}>{PEXELS ? <><span className="badge live">Pexels</span> Real stock, properly licensed.</> : <><span className="badge mock">demo</span> 29 bundled Pexels photos. Add a Pexels key for the whole internet.</>}</p>
      {loading ? (
        <div className="empty"><span className="spinner" /></div>
      ) : (
        <div className="asset-grid">
          {photos.map((src, i) => (
            <div key={i} className="asset" onClick={() => add(makeImage(src))}>
              <img src={src} loading="lazy" />
            </div>
          ))}
        </div>
      )}
      {!PEXELS && <div className="empty" style={{ fontSize: 11 }}>Demo photos. Add VITE_PEXELS_API_KEY in .env for real search.</div>}
    </>
  );
}
