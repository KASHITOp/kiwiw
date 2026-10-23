import { useEffect, useState } from "react";
import { useEditor } from "../store";
import { makeImage } from "../data/factory";

const PEXELS = (import.meta.env as Record<string, string | undefined>).VITE_PEXELS_API_KEY;

// Free placeholder photos (picsum) so the library works with zero config.
// With a VITE_PEXELS_API_KEY set, real Pexels search is used instead — a
// properly-licensed stock source, not scraped from any product.
function placeholderPhotos(seed: string): string[] {
  const base = [...seed].reduce((a, c) => a + c.charCodeAt(0), 7);
  return Array.from({ length: 12 }, (_, i) => `https://picsum.photos/seed/${base + i}/400/400`);
}

export default function AssetPanel() {
  const add = useEditor((s) => s.addElement);
  const [q, setQ] = useState("nature");
  const [photos, setPhotos] = useState<string[]>(placeholderPhotos("nature"));
  const [loading, setLoading] = useState(false);

  const search = async (term: string) => {
    setQ(term);
    if (!PEXELS) { setPhotos(placeholderPhotos(term)); return; }
    setLoading(true);
    try {
      const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(term)}&per_page=18`, {
        headers: { Authorization: PEXELS },
      });
      const data = await res.json();
      setPhotos((data.photos ?? []).map((p: { src: { medium: string } }) => p.src.medium));
    } catch {
      setPhotos(placeholderPhotos(term));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { search("nature"); /* eslint-disable-next-line */ }, []);

  return (
    <>
      <h4>Photos {PEXELS ? <span className="badge-live">Pexels</span> : <span className="badge-mock">demo</span>}</h4>
      <div className="field">
        <input
          type="text"
          placeholder="Search photos…"
          defaultValue={q}
          onKeyDown={(e) => e.key === "Enter" && search((e.target as HTMLInputElement).value)}
        />
      </div>
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
