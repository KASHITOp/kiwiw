import { useLayoutEffect, useRef, useState } from "react";
import type { KiwiwDoc } from "../types";
import ElementContent from "./ElementContent";

// Renders a real, scaled-down render of a document into whatever box it sits
// in. The parent must be position:relative with a fixed size.
export default function Thumb({ doc }: { doc: KiwiwDoc }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) setScale(Math.min(r.width / doc.width, r.height / doc.height));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [doc.width, doc.height]);

  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", overflow: "hidden" }}>
      {/* box sized to the scaled render, so centering is exact */}
      <div style={{ width: doc.width * scale, height: doc.height * scale, position: "relative", flex: "none" }}>
        <div
          className="tpl-render"
          style={{
            width: doc.width,
            height: doc.height,
            background: doc.background,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {doc.elements.map((el) =>
            el.hidden ? null : (
              <div
                key={el.id}
                className="el"
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.w,
                  height: el.h,
                  opacity: el.opacity,
                  transform: `rotate(${el.rotation}deg)`,
                }}
              >
                <ElementContent el={el} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
