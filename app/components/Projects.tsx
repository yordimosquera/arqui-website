// ============================================
// Laura Tejeda — Project index pages (Architecture / Interiors)
// ============================================
"use client";
import { useState } from "react";
import { CONTENT } from "@/app/content";
import { LT, useLT } from "./Shared";
import { ProjectCard } from "./Home";


function ProjectIndex({ category, onOpenProject, onNav }: { category: string; onOpenProject: (id: string) => void; onNav: (id: string) => void }) {
  const t = LT.useT();
  const { lang } = useLT();
  const [, setFilter] = useState("all");
  void setFilter;

  const all = CONTENT.projects.filter((p) => p.category === category);
  const filtered = all; // placeholder filter — for now all are shown

  const isArch = category === "architecture";

  return (
    <main style={{ paddingTop: 140 }}>
      <section style={{ paddingBottom: 60 }}>
        <div className="container">
          <button onClick={() => onNav("home")} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-3)", marginBottom: 32 }}>
            <span>←</span> {t.detailBack}
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end", marginBottom: 80 }} className="lt-index-head">
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 24 }}>
                {t.indexEyebrow} — {String(all.length).padStart(2, "0")} {lang === "es" ? "proyectos" : "projects"}
              </div>
              <h1 className="t-h1" style={{ margin: 0 }}>
                {isArch ? t.indexArchTitle.split("").slice(0, -1).join("") : t.indexIntTitle.split("").slice(0, -1).join("")}
                <em className="italic-accent" style={{ display: "inline-block" }}>{isArch ? t.indexArchTitle.slice(-1) : t.indexIntTitle.slice(-1)}</em>
              </h1>
            </div>
            <p className="t-body-lg" style={{ margin: 0, maxWidth: 480, alignSelf: "end" }}>
              {isArch ? t.indexArchSub : t.indexIntSub}
            </p>
          </div>
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

      {/* Cross-link to other category */}
      <section style={{ padding: "var(--section) 0", borderTop: "1px solid var(--line)", marginTop: 60 }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
            <div className="t-eyebrow">{lang === "es" ? "Continuar a" : "Continue to"}</div>
            <button className="btn btn-ghost" onClick={() => onNav(isArch ? "interiors" : "architecture")}>
              {isArch ? t.navInt : t.navArch} <span className="arrow">→</span>
            </button>
          </div>
          <h2 className="t-h1" style={{ margin: "32px 0 0", fontSize: "clamp(60px, 10vw, 160px)" }}>
            {isArch ? t.navInt : t.navArch}
          </h2>
        </div>
      </section>
    </main>
  );
}

export { ProjectIndex };
