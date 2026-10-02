// ============================================
// Laura Tejeda — Project Detail (lightbox + sidebar)
// ============================================

"use client";
import { useState, useEffect } from "react";
import { CONTENT } from "@/app/content";
import { LT, useLT, type Project, type GalleryItem } from "./Shared";


function ProjectDetail({ projectId, onNav, onOpenProject }: { projectId: string | null | undefined; onNav: (id: string) => void; onOpenProject: (id: string) => void }) {
  const t = LT.useT();
  const { lang } = useLT();
  const project = CONTENT.projects.find((p) => p.id === projectId);
  const [lightbox, setLightbox] = useState<number | null>(null); // index or null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null || !project) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => ((i ?? 0) + 1) % project.gallery.length);
      if (e.key === "ArrowLeft") setLightbox((i) => ((i ?? 0) - 1 + project.gallery.length) % project.gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, project]);

  if (!project) return null;

  // next project of same segment
  const sameCat = CONTENT.projects.filter((p) => p.segment === project.segment);
  const idx = sameCat.findIndex((p) => p.id === project.id);
  const next = sameCat[(idx + 1) % sameCat.length];

  return (
    <main style={{ paddingTop: 100 }}>
      {/* Hero */}
      <section style={{ paddingBottom: 0 }}>
        <div className="container">
          <button onClick={() => onNav(project.segment)} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-3)", marginBottom: 32 }}>
            <span>←</span> {t.navProjects} — {project.segment === "residential" ? t.segResidential : t.segCommercial}
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end", marginBottom: 48 }} className="lt-detail-head">
            <div>
              <div className="t-meta" style={{ marginBottom: 24 }}>
                {project.category === "architecture" ? (lang === "es" ? "Arquitectura" : "Architecture") : (lang === "es" ? "Interiorismo" : "Interiors")}
                {" · "}{project.location}{" · "}{project.year}
              </div>
              <h1 className="t-h1" style={{ margin: 0, fontSize: "clamp(48px, 7vw, 104px)" }}>
                {LT.pick(project.title, lang)}
              </h1>
            </div>
            <p className="t-body-lg" style={{ margin: 0, maxWidth: 460 }}>
              {LT.pick(project.subtitle, lang)}
            </p>
          </div>

          <LT.Placeholder
            tone={project.tone}
            ratio="16/9"
            style={{ cursor: "zoom-in" }}
            label={LT.pick(project.title, lang)}
          >
            <div onClick={() => setLightbox(0)} style={{ position: "absolute", inset: 0 }} />
          </LT.Placeholder>
        </div>
      </section>

      {/* Gallery + sticky sidebar */}
      <section style={{ paddingTop: 80, paddingBottom: 60 }}>
        <div className="container lt-detail-body" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 60, alignItems: "start" }}>

          {/* GALLERY */}
          <div>
            <div className="t-eyebrow" style={{ marginBottom: 24 }}>{t.detailAbout}</div>
            <p className="t-body-lg" style={{ marginTop: 0, marginBottom: 64, maxWidth: 640 }}>
              {LT.pick(project.about, lang)}
            </p>

            <div className="t-eyebrow" style={{ marginBottom: 24 }}>{t.detailGallery} — {String(project.gallery.length).padStart(2, "0")}</div>

            {/* editorial gallery layout */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* render in pairs/singles */}
              {(() => {
                const rows: React.ReactNode[] = [];
                let i = 0;
                while (i < project.gallery.length) {
                  if (i % 4 === 0) {
                    // big single
                    rows.push(<GalleryItemView key={i} item={project.gallery[i]} ratio="16/10" onClick={() => setLightbox(i)} idx={i} />);
                    i++;
                  } else if (i + 1 < project.gallery.length) {
                    const left = i;
                    const right = i + 1;
                    rows.push(
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                        <GalleryItemView item={project.gallery[left]} ratio="4/5" onClick={() => setLightbox(left)} idx={left} />
                        <GalleryItemView item={project.gallery[right]} ratio="4/5" onClick={() => setLightbox(right)} idx={right} />
                      </div>
                    );
                    i += 2;
                  } else {
                    rows.push(<GalleryItemView key={i} item={project.gallery[i]} ratio="16/10" onClick={() => setLightbox(i)} idx={i} />);
                    i++;
                  }
                }
                return rows;
              })()}
            </div>
          </div>

          {/* SIDEBAR */}
          <aside style={{ position: "sticky", top: 100 }} className="lt-detail-sidebar">
            <div style={{ border: "1px solid var(--line)", padding: 28, borderRadius: 4, background: "var(--paper)" }}>
              <div className="t-meta" style={{ marginBottom: 20 }}>{lang === "es" ? "Ficha" : "Specs"}</div>
              <SpecRow label={t.detailLocation} value={project.location} />
              <SpecRow label={t.detailYear} value={project.year} />
              <SpecRow label={t.detailType} value={LT.pick(project.type, lang)} />
              <SpecRow label={t.detailArea} value={project.area} />
              <SpecRow label={t.detailStatus} value={LT.pick(project.status, lang)} />
              <SpecRow label={t.detailRole} value={LT.pick(project.role, lang)} />
              <SpecRow label={t.detailTeam} value={LT.pick(project.team, lang)} last />
            </div>

            {project.photos && project.photos !== "—" && (
              <div style={{ marginTop: 24, paddingLeft: 28 }}>
                <div className="t-meta" style={{ marginBottom: 8 }}>{t.detailPhotos}</div>
                <div className="t-body" style={{ fontSize: 14 }}>{project.photos}</div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* Next project */}
      <section style={{ padding: "var(--section) 0", borderTop: "1px solid var(--line)" }}>
        <div className="container">
          <div className="t-eyebrow" style={{ marginBottom: 24 }}>{t.detailNext}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 48, alignItems: "center", cursor: "pointer" }}
            onClick={() => onOpenProject(next.id)} className="lt-next-grid">
            <h2 className="t-h1" style={{ margin: 0, fontSize: "clamp(48px, 7vw, 104px)" }}>
              {LT.pick(next.title, lang)} <span style={{ fontFamily: "var(--display)", fontStyle: "italic" }}>→</span>
            </h2>
            <LT.Placeholder tone={next.tone} ratio="4/3" />
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox project={project} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />
      )}
    </main>
  );
}

function GalleryItemView({ item, ratio, onClick, idx }: { item: GalleryItem; ratio: string; onClick: () => void; idx: number }) {
  const { lang } = useLT();
  return (
    <figure style={{ margin: 0, cursor: "zoom-in" }} onClick={onClick}>
      <LT.Placeholder tone={item.tone} ratio={ratio} />
      <figcaption style={{ marginTop: 12, display: "flex", justifyContent: "space-between", gap: 16 }}>
        <span className="t-caption">{LT.pick(item.caption, lang)}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.08em" }}>{String(idx + 1).padStart(2, "0")}</span>
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

function Lightbox({ project, index, onClose, onChange }: { project: Project; index: number; onClose: () => void; onChange: (i: number) => void }) {
  const { lang } = useLT();
  const item = project.gallery[index];
  return (
    <div className="modal-backdrop open" onClick={onClose}>
      <div style={{ position: "absolute", top: 24, right: 24, display: "flex", gap: 12, alignItems: "center", zIndex: 2 }}>
        <span style={{ color: "rgba(245,239,230,0.7)", fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.1em" }}>
          {String(index + 1).padStart(2, "0")} / {String(project.gallery.length).padStart(2, "0")}
        </span>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(245,239,230,0.12)", color: "var(--bg)" }}>×</button>
      </div>

      <button onClick={(e) => { e.stopPropagation(); onChange((index - 1 + project.gallery.length) % project.gallery.length); }}
        style={{ position: "absolute", left: 32, top: "50%", transform: "translateY(-50%)", color: "var(--bg)", fontSize: 24, width: 48, height: 48, borderRadius: "50%", background: "rgba(245,239,230,0.08)", zIndex: 2 }}>
        ←
      </button>
      <button onClick={(e) => { e.stopPropagation(); onChange((index + 1) % project.gallery.length); }}
        style={{ position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", color: "var(--bg)", fontSize: 24, width: 48, height: 48, borderRadius: "50%", background: "rgba(245,239,230,0.08)", zIndex: 2 }}>
        →
      </button>

      <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", inset: "60px 96px 96px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <LT.Placeholder tone={item.tone} ratio="16/9" style={{ width: "100%", maxHeight: "80vh", height: "auto" }} />
        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", color: "rgba(245,239,230,0.85)", gap: 20 }}>
          <span style={{ fontSize: 14 }}>{LT.pick(item.caption, lang)}</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(245,239,230,0.5)", letterSpacing: "0.1em" }}>{LT.pick(project.title, lang)}</span>
        </div>
      </div>
    </div>
  );
}

export { ProjectDetail };
