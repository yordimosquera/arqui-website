// ============================================
// Laura Tejeda — Project index (Residential / Commercial)
// ============================================
"use client";
import Link from "next/link";
import { LT, pad, useSite } from "./Shared";
import { ProjectCard } from "./Home";
import { href, segmentHref, SEGMENTS, type Segment } from "@/app/lib/routes";
import type { ProjectsData } from "@/sanity/lib/queries";

function ProjectIndex({ segment, data }: { segment: Segment; data: ProjectsData }) {
  const { lang, t } = useSite();
  const { page, projects } = data;

  const filtered = projects.filter((p) => p.segment === segment);

  const isRes = segment === "residential";
  const other: Segment = isRes ? "commercial" : "residential";
  const segLabel = (s: Segment) => (s === "residential" ? page.residentialTitle : page.commercialTitle);

  return (
    <main style={{ paddingTop: 140 }}>
      <section style={{ paddingBottom: 60 }}>
        <div className="container">
          <Link href={href(lang, "home")} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-3)", marginBottom: 32 }}>
            <span>←</span> {t.detailBack}
          </Link>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end", marginBottom: 64 }} className="lt-index-head">
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 24 }}>
                {page.eyebrow} — {pad(projects.length)} {t.projectsCount}
              </div>
              <h1 className="t-h1" style={{ margin: 0 }}>
                <LT.Accent value={page.title} emStyle={{ display: "inline-block" }} />
              </h1>
            </div>
            <p className="t-body-lg" style={{ margin: 0, maxWidth: 480, alignSelf: "end" }}>
              {page.intro}
            </p>
          </div>

          {/* Segment tabs */}
          <nav aria-label={t.navProjects} style={{ display: "flex", gap: 40, borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}>
            {SEGMENTS.map((s) => {
              const active = s === segment;
              const count = projects.filter((p) => p.segment === s).length;
              return (
                <Link
                  key={s}
                  href={segmentHref(lang, s)}
                  aria-current={active ? "page" : undefined}
                  scroll={false}
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
                    {pad(count)}
                  </span>
                </Link>
              );
            })}
          </nav>
          <p className="t-body" style={{ margin: "24px 0 0", maxWidth: 560 }}>
            {isRes ? page.residentialIntro : page.commercialIntro}
          </p>
        </div>
      </section>

      {/* Grid — masonry-ish, alternating sizes */}
      <section style={{ paddingBottom: 80 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 32, rowGap: 80 }} className="lt-index-grid">
            {filtered.map((p, i) => {
              // alternate spans for editorial rhythm
              const layouts = ["span 7", "span 5", "span 5", "span 7", "span 6", "span 6"];
              return (
                <div key={p._id} style={{ gridColumn: layouts[i % layouts.length], marginTop: i % 4 === 1 ? 60 : 0 }} className="lt-index-cell">
                  <ProjectCard project={p} large={i % 4 === 0} />
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
            <div className="t-eyebrow">{t.continueTo}</div>
            <Link className="btn btn-ghost" href={segmentHref(lang, other)}>
              {segLabel(other)} <span className="arrow">→</span>
            </Link>
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
