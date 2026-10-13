// ============================================
// Laura Tejeda — Project Detail (lightbox + sidebar)
// ============================================

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LT, pad, toneFor, useSite } from "./Shared";
import { projectHref, segmentHref } from "@/app/lib/routes";
import type { Photo, ProjectData, ProjectDetailData } from "@/sanity/lib/queries";

type GalleryPhoto = NonNullable<Photo>;

function ProjectDetail({ data }: { data: ProjectData & { project: ProjectDetailData } }) {
  const { lang, t } = useSite();
  const { project, siblings, segments } = data;
  const gallery = project.gallery ?? [];
  const [lightbox, setLightbox] = useState<number | null>(null); // index or null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null || gallery.length === 0) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => ((i ?? 0) + 1) % gallery.length);
      if (e.key === "ArrowLeft") setLightbox((i) => ((i ?? 0) - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, gallery.length]);

  // next project of same segment
  const idx = siblings.findIndex((p) => p._id === project._id);
  const next = siblings.length > 1 ? siblings[(idx + 1) % siblings.length] : null;
  const segmentTitle = project.segment === "residential" ? segments.residentialTitle : segments.commercialTitle;
  const tone = toneFor(project.slug);

  return (
    <main style={{ paddingTop: 100 }}>
      {/* Hero */}
      <section style={{ paddingBottom: 0 }}>
        <div className="container">
          <Link href={segmentHref(lang, project.segment)} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-3)", marginBottom: 32 }}>
            <span>←</span> {t.navProjects} — {segmentTitle}
          </Link>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end", marginBottom: 48 }} className="lt-detail-head">
            <div>
              <div className="t-meta" style={{ marginBottom: 24 }}>
                {project.category === "architecture" ? t.categoryArchitecture : t.categoryInteriors}
                {" · "}{project.location}{" · "}{project.year}
              </div>
              <h1 className="t-h1" style={{ margin: 0, fontSize: "clamp(48px, 7vw, 104px)" }}>
                {project.title}
              </h1>
            </div>
            <p className="t-body-lg" style={{ margin: 0, maxWidth: 460 }}>
              {project.subtitle}
            </p>
          </div>

          <LT.Media
            image={project.cover}
            tone={tone}
            ratio="16/9"
            sizes="100vw"
            priority
            style={{ cursor: gallery.length ? "zoom-in" : "default" }}
            label={project.title}
          >
            {gallery.length > 0 && <div onClick={() => setLightbox(0)} style={{ position: "absolute", inset: 0 }} />}
          </LT.Media>
        </div>
      </section>

      {/* Gallery + sticky sidebar */}
      <section style={{ paddingTop: 80, paddingBottom: 60 }}>
        <div className="container lt-detail-body" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 60, alignItems: "start" }}>

          {/* GALLERY */}
          <div>
            <div className="t-eyebrow" style={{ marginBottom: 24 }}>{t.detailAbout}</div>
            <p className="t-body-lg" style={{ marginTop: 0, marginBottom: 64, maxWidth: 640 }}>
              {project.about}
            </p>

            {gallery.length > 0 && (
              <>
                <div className="t-eyebrow" style={{ marginBottom: 24 }}>{t.detailGallery} — {pad(gallery.length)}</div>

                {/* editorial gallery layout: a big single every 4, pairs in between */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {(() => {
                    const rows: React.ReactNode[] = [];
                    let i = 0;
                    while (i < gallery.length) {
                      if (i % 4 !== 0 && i + 1 < gallery.length) {
                        const left = i;
                        const right = i + 1;
                        rows.push(
                          <div key={gallery[i]._key ?? i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                            <GalleryItemView item={gallery[left]} ratio="4/5" onClick={() => setLightbox(left)} idx={left} />
                            <GalleryItemView item={gallery[right]} ratio="4/5" onClick={() => setLightbox(right)} idx={right} />
                          </div>
                        );
                        i += 2;
                      } else {
                        const single = i;
                        rows.push(<GalleryItemView key={gallery[i]._key ?? i} item={gallery[i]} ratio="16/10" onClick={() => setLightbox(single)} idx={single} />);
                        i++;
                      }
                    }
                    return rows;
                  })()}
                </div>
              </>
            )}
          </div>

          {/* SIDEBAR */}
          <aside style={{ position: "sticky", top: 100 }} className="lt-detail-sidebar">
            <div style={{ border: "1px solid var(--line)", padding: 28, borderRadius: 4, background: "var(--paper)" }}>
              <div className="t-meta" style={{ marginBottom: 20 }}>{t.detailSpecs}</div>
              {[
                [t.detailLocation, project.location],
                [t.detailYear, project.year],
                [t.detailType, project.type],
                [t.detailArea, project.area],
                [t.detailStatus, project.status],
                [t.detailRole, project.role],
                [t.detailTeam, project.team],
              ]
                .filter((row): row is [string, string] => Boolean(row[1]))
                .map(([label, value], i, rows) => (
                  <SpecRow key={label} label={label} value={value} last={i === rows.length - 1} />
                ))}
            </div>

            {project.photos && (
              <div style={{ marginTop: 24, paddingLeft: 28 }}>
                <div className="t-meta" style={{ marginBottom: 8 }}>{t.detailPhotos}</div>
                <div className="t-body" style={{ fontSize: 14 }}>{project.photos}</div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* Next project */}
      {next && (
        <section style={{ padding: "var(--section) 0", borderTop: "1px solid var(--line)" }}>
          <div className="container">
            <div className="t-eyebrow" style={{ marginBottom: 24 }}>{t.detailNext}</div>
            <Link href={projectHref(lang, next.slug)} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 48, alignItems: "center" }} className="lt-next-grid">
              <h2 className="t-h1" style={{ margin: 0, fontSize: "clamp(48px, 7vw, 104px)" }}>
                {next.title} <span style={{ fontFamily: "var(--display)", fontStyle: "italic" }}>→</span>
              </h2>
              <LT.Media image={next.cover} tone={toneFor(next.slug)} ratio="4/3" sizes="(max-width: 900px) 100vw, 40vw" />
            </Link>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightbox !== null && gallery[lightbox] && (
        <Lightbox gallery={gallery} title={project.title} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />
      )}
    </main>
  );
}

function GalleryItemView({ item, ratio, onClick, idx }: { item: GalleryPhoto; ratio: string; onClick: () => void; idx: number }) {
  return (
    <figure style={{ margin: 0, cursor: "zoom-in" }} onClick={onClick}>
      <LT.Media image={item} tone={toneFor(idx)} ratio={ratio} sizes="(max-width: 900px) 100vw, 60vw" />
      <figcaption style={{ marginTop: 12, display: "flex", justifyContent: "space-between", gap: 16 }}>
        <span className="t-caption">{item.caption}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.08em" }}>{pad(idx + 1)}</span>
      </figcaption>
    </figure>
  );
}

function SpecRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ paddingTop: 12, paddingBottom: 12, borderBottom: last ? "none" : "1px solid var(--line-soft)" }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.4 }}>{value}</div>
    </div>
  );
}

function Lightbox({ gallery, title, index, onClose, onChange }: { gallery: GalleryPhoto[]; title: string; index: number; onClose: () => void; onChange: (i: number) => void }) {
  const item = gallery[index];
  return (
    <div className="modal-backdrop open" onClick={onClose}>
      <div style={{ position: "absolute", top: 24, right: 24, display: "flex", gap: 12, alignItems: "center", zIndex: 2 }}>
        <span style={{ color: "rgba(245,239,230,0.7)", fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.1em" }}>
          {pad(index + 1)} / {pad(gallery.length)}
        </span>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Close" style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(245,239,230,0.12)", color: "var(--bg)" }}>×</button>
      </div>

      <button onClick={(e) => { e.stopPropagation(); onChange((index - 1 + gallery.length) % gallery.length); }} aria-label="Previous"
        style={{ position: "absolute", left: 32, top: "50%", transform: "translateY(-50%)", color: "var(--bg)", fontSize: 24, width: 48, height: 48, borderRadius: "50%", background: "rgba(245,239,230,0.08)", zIndex: 2 }}>
        ←
      </button>
      <button onClick={(e) => { e.stopPropagation(); onChange((index + 1) % gallery.length); }} aria-label="Next"
        style={{ position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", color: "var(--bg)", fontSize: 24, width: 48, height: 48, borderRadius: "50%", background: "rgba(245,239,230,0.08)", zIndex: 2 }}>
        →
      </button>

      <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", inset: "60px 96px 96px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <LT.Media image={item} tone={toneFor(index)} ratio="16/9" fit="contain" sizes="90vw" style={{ width: "100%", maxHeight: "80vh", height: "auto", background: "transparent" }} />
        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", color: "rgba(245,239,230,0.85)", gap: 20 }}>
          <span style={{ fontSize: 14 }}>{item.caption}</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(245,239,230,0.5)", letterSpacing: "0.1em" }}>{title}</span>
        </div>
      </div>
    </div>
  );
}

export { ProjectDetail };
