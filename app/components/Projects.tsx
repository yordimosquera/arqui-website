// ============================================
// Laura Tejeda — Project index (Residential / Commercial)
// ============================================
"use client";
import { CONTENT } from "@/app/content";
import { LT, useLT } from "./Shared";
import { ProjectCard } from "./Home";


type Segment = "residential" | "commercial";

function ProjectIndex({ segment, onOpenProject, onNav }: { segment: Segment; onOpenProject: (id: string) => void; onNav: (id: string) => void }) {
  const t = LT.useT();
  const { lang } = useLT();

  const filtered = CONTENT.projects.filter((p) => p.segment === segment);

  const isRes = segment === "residential";
  const other: Segment = isRes ? "commercial" : "residential";
  const segLabel = (s: Segment) => (s === "residential" ? t.segResidential : t.segCommercial);
  const tabs: Segment[] = ["residential", "commercial"];

  return (
    <main style={{ paddingTop: 140 }}>
      <section style={{ paddingBottom: 60 }}>
        <div className="container">
          <button onClick={() => onNav("home")} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-3)", marginBottom: 32 }}>
            <span>←</span> {t.detailBack}
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end", marginBottom: 64 }} className="lt-index-head">
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 24 }}>
                {t.indexEyebrow} — {String(CONTENT.projects.length).padStart(2, "0")} {lang === "es" ? "proyectos" : "projects"}
              </div>
              <h1 className="t-h1" style={{ margin: 0 }}>
                {t.indexTitle.slice(0, -1)}
                <em className="italic-accent" style={{ display: "inline-block" }}>{t.indexTitle.slice(-1)}</em>
              </h1>
            </div>
            <p className="t-body-lg" style={{ margin: 0, maxWidth: 480, alignSelf: "end" }}>
              {t.indexSub}
            </p>
          </div>

          {/* Segment tabs */}
          <div role="tablist" aria-label={t.indexTitle} style={{ display: "flex", gap: 40, borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}>
            {tabs.map((s) => {
              const active = s === segment;
              const count = CONTENT.projects.filter((p) => p.segment === s).length;
              return (
                <button
                  key={s}
                  role="tab"
                  aria-selected={active}
                  onClick={() => !active && onNav(s)}
                  style={{
                    display: "inline-flex", alignItems: "baseline", gap: 10,
                    padding: "0 0 16px", marginBottom: -1,
                    fontFamily: "var(--display)", fontSize: "clamp(24px, 3vw, 36px)", letterSpacing: "-0.01em",
                    fontStyle: active ? "italic" : "normal",
                    color: active ? "var(--ink)" : "var(--ink-3)",
                    borderBottom: active ? "1px solid var(--ink)" : "1px solid transparent",
                    transition: "color 240ms var(--ease), border-color 240ms var(--ease)",
                  }}
                >
                  {segLabel(s)}
                  <span style={{ fontFamily: "var(--mono)", fontStyle: "normal", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.1em" }}>
                    {String(count).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="t-body" style={{ margin: "24px 0 0", maxWidth: 560 }}>
            {isRes ? t.segResidentialSub : t.segCommercialSub}
          </p>
        </div>
      </section>

      {/* Grid — masonry-ish, alternating sizes */}
      <section style={{ paddingBottom: 80 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 32, rowGap: 80 }} className="lt-index-grid">
            {filtered.map((p, i) => {
              // alternate spans for editorial rhythm
              const layouts = [
                { col: "span 7", offset: 0 },
                { col: "span 5", offset: 0 },
                { col: "span 5", offset: 0 },
                { col: "span 7", offset: 0 },
                { col: "span 6", offset: 0 },
                { col: "span 6", offset: 0 },
              ];
              const L = layouts[i % layouts.length];
              return (
                <div key={p.id} style={{ gridColumn: L.col, marginTop: i % 4 === 1 ? 60 : 0 }} className="lt-index-cell">
                  <ProjectCard project={p} large={i % 4 === 0} onClick={() => onOpenProject(p.id)} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cross-link to other segment */}
      <section style={{ padding: "var(--section) 0", borderTop: "1px solid var(--line)", marginTop: 60 }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
            <div className="t-eyebrow">{lang === "es" ? "Continuar a" : "Continue to"}</div>
            <button className="btn btn-ghost" onClick={() => onNav(other)}>
              {segLabel(other)} <span className="arrow">→</span>
            </button>
          </div>
          <h2 className="t-h1" style={{ margin: "32px 0 0", fontSize: "clamp(60px, 10vw, 160px)" }}>
            {segLabel(other)}
          </h2>
        </div>
      </section>
    </main>
  );
}

export { ProjectIndex };
