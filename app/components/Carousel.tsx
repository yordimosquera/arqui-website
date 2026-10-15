// ============================================
// Laura Tejeda — Photo carousel
// Fades between Sanity photos; arrows, dots, swipe and keyboard.
// ============================================
"use client";
import { useRef, useState } from "react";
import { arrowStyle, LT, pad, type GalleryPhoto } from "./Shared";

type CarouselProps = {
  photos: GalleryPhoto[];
  /** Accessible name of the carousel; also the alt text for photos without a description. */
  label: string;
  /** Placeholder tone shown when there are no photos. */
  tone: string;
  ratio?: string;
  sizes?: string;
  /** Called with the current index when a photo is clicked, tapped or Enter is pressed. */
  onOpen?: (index: number) => void;
};

function Carousel({ photos, label, tone, ratio = "16/9", sizes = "100vw", onOpen }: CarouselProps) {
  const [idx, setIdx] = useState(0);
  const dragStart = useRef<number | null>(null);
  const count = photos.length;

  if (count === 0) return <LT.Placeholder tone={tone} ratio={ratio} label={label} />;

  const go = (step: number) => setIdx((i) => (i + step + count) % count);
  // Only the current photo and its neighbours are mounted, so the gallery isn't downloaded upfront.
  const isNear = (i: number) => i === idx || i === (idx + 1) % count || i === (idx - 1 + count) % count;
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "Enter") onOpen?.(idx);
      }}
    >
      <div
        style={{ position: "relative", aspectRatio: ratio, cursor: onOpen ? "zoom-in" : "default", touchAction: "pan-y", userSelect: "none" }}
        onPointerDown={(e) => { dragStart.current = e.clientX; }}
        onPointerUp={(e) => {
          if (dragStart.current === null) return;
          const dx = e.clientX - dragStart.current;
          dragStart.current = null;
          if (Math.abs(dx) > 40 && count > 1) go(dx < 0 ? 1 : -1); // swipe
          else onOpen?.(idx); // tap / click
        }}
      >
        {photos.map((p, i) => isNear(i) && (
          <div key={p._key ?? p.asset._ref} aria-hidden={i !== idx} style={{
            position: "absolute", inset: 0,
            opacity: i === idx ? 1 : 0,
            transition: "opacity 600ms var(--ease)",
          }}>
            <LT.Media image={p} tone={tone} label={label} ratio="auto" sizes={sizes} priority={i === 0} style={{ position: "absolute", inset: 0 }} />
          </div>
        ))}

        {count > 1 && (
          <div style={{ position: "absolute", bottom: 24, right: 24, display: "flex", gap: 8 }} onPointerDown={stop} onPointerUp={stop}>
            <button onClick={() => go(-1)} style={arrowStyle} aria-label="Previous">←</button>
            <button onClick={() => go(1)} style={arrowStyle} aria-label="Next">→</button>
          </div>
        )}
      </div>

      {(count > 1 || photos[idx].caption) && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <span className="t-caption" aria-live="polite">{photos[idx].caption}</span>
          {count > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {photos.map((p, i) => (
                  <button key={p._key ?? p.asset._ref} onClick={() => setIdx(i)} aria-label={`${i + 1} / ${count}`} aria-current={i === idx ? "true" : undefined} style={{
                    width: 24, height: 2,
                    background: i === idx ? "var(--ink)" : "var(--line)",
                    transition: "background 240ms var(--ease)",
                  }} />
                ))}
              </div>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.08em" }}>
                {pad(idx + 1)} / {pad(count)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { Carousel };
