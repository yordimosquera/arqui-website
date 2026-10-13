// ============================================
// Laura Tejeda — Home page
// ============================================
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LT, pad, toneFor, useSite } from "./Shared";
import { href, projectHref, segmentHref, type Segment } from "@/app/lib/routes";
import type { HomeData, ProjectCard as ProjectCardData } from "@/sanity/lib/queries";

function Home({ data }: { data: HomeData }) {
  const featured = data.page.featured ?? [];

  return (
    <main>
      <Hero page={data.page} featured={featured} />
      <SelectedWork page={data.page} segments={data.segments} featured={featured} />
      <Manifesto page={data.page} />
      <Sections segments={data.segments} projects={data.projects} />
      <ContactCTA page={data.page} />
    </main>
  );
}

type Page = HomeData["page"];

// ——— HERO with auto carousel ———
function Hero({ page, featured }: { page: Page; featured: ProjectCardData[] }) {
  const { lang, t } = useSite();
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || featured.length < 2) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % featured.length), 5500);
    return () => clearInterval(timer);
  }, [paused, featured.length]);

  const current = featured[idx];

  return (
    <section style={{ position: "relative", minHeight: "100vh", paddingTop: 72 }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container lt-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "stretch", paddingTop: 60, paddingBottom: 40 }}>

        {/* LEFT — type and meta */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "calc(100vh - 200px)" }}>
          <div>
            <div className="t-meta" style={{ marginBottom: 32 }}>
              <span style={{ display: "inline-block", width: 6, height: 6, background: "var(--accent)", borderRadius: "50%", marginRight: 10, verticalAlign: "middle" }}></span>
              {page.heroEyebrow}
            </div>
            <h1 className="t-h1" style={{ margin: 0 }}>
              {page.heroLine1}<br />
              <em className="italic-accent">{page.heroLine2}</em><br />
              {page.heroLine3}
            </h1>
            <p className="t-body-lg" style={{ marginTop: 36, maxWidth: 460 }}>
              {page.heroSub}
            </p>
            <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
              {current && (
                <Link className="btn btn-fill" href={projectHref(lang, current.slug)}>
                  {t.ctaViewProject} <span className="arrow">→</span>
                </Link>
              )}
              <Link className="btn btn-ghost" href={href(lang, "studio")}>
                {page.heroStudioButton}
              </Link>
            </div>
          </div>

          {/* Carousel meta */}
          {current && (
            <div style={{ marginTop: 60 }}>
              <div className="t-meta" style={{ marginBottom: 12 }}>
                {pad(idx + 1)} / {pad(featured.length)} — {page.featuredEyebrow}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontFamily: "var(--display)", fontStyle: "italic", fontSize: 32, lineHeight: 1, letterSpacing: "-0.015em" }}>
                  {current.title}
                </h3>
                <span className="t-caption" style={{ color: "var(--ink-3)" }}>{current.location} · {current.year}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {featured.map((p, i) => (
                  <button key={p._id} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`} style={{
                    flex: 1, maxWidth: 80, height: 2,
                    background: i === idx ? "var(--ink)" : "var(--line)",
                    transition: "background 240ms var(--ease)",
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — carousel image (hero image when there are no featured projects) */}
        <div style={{ position: "relative", minHeight: 600 }}>
          {featured.length === 0 && (
            <LT.Media image={page.heroImage} tone="warm" ratio="auto" sizes="50vw" priority style={{ position: "absolute", inset: 0 }} />
          )}
          {featured.map((p, i) => (
            <div key={p._id} style={{
              position: "absolute", inset: 0,
              opacity: i === idx ? 1 : 0,
              transition: "opacity 800ms var(--ease)",
              cursor: "pointer",
            }} onClick={() => router.push(projectHref(lang, p.slug))}>
              <LT.Media image={p.cover} tone={toneFor(p.slug)} ratio="auto" sizes="(max-width: 900px) 100vw, 50vw" priority={i === 0}
                style={{ height: "100%", width: "100%" }} label={p.title} />
            </div>
          ))}

          {/* arrows */}
          {featured.length > 1 && (
            <div style={{ position: "absolute", bottom: 24, right: 24, display: "flex", gap: 8 }}>
              <button onClick={() => setIdx((idx - 1 + featured.length) % featured.length)} style={arrowStyle} aria-label="Previous">←</button>
              <button onClick={() => setIdx((idx + 1) % featured.length)} style={arrowStyle} aria-label="Next">→</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const arrowStyle: React.CSSProperties = {
  width: 44, height: 44, borderRadius: "50%",
  background: "rgba(245,239,230,0.92)", color: "var(--ink)",
  display: "flex", alignItems: "center", justifyContent: "center",
  backdropFilter: "blur(6px)",
};

// ——— Selected work strip ———
function SelectedWork({ page, segments, featured }: { page: Page; segments: HomeData["segments"]; featured: ProjectCardData[] }) {
  const { lang } = useSite();
  const selection = featured.slice(0, 4);
  if (selection.length === 0) return null;

  return (
    <section style={{ paddingTop: 140, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 60, gap: 40, flexWrap: "wrap" }}>
          <div>
            <div className="t-eyebrow" style={{ marginBottom: 16 }}>{page.featuredEyebrow}</div>
            <h2 className="t-h2" style={{ margin: 0, maxWidth: 700 }}>
              <LT.Accent value={page.featuredTitle} />
            </h2>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link className="btn btn-ghost" href={segmentHref(lang, "residential")}>{segments.residentialTitle} →</Link>
            <Link className="btn btn-ghost" href={segmentHref(lang, "commercial")}>{segments.commercialTitle} →</Link>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="lt-work-grid">
          {selection.map((p, i) => (
            <ProjectCard key={p._id} project={p} large={i === 0 || i === 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ——— Project card ———
function ProjectCard({ project, large, compact }: { project: ProjectCardData; large?: boolean; compact?: boolean }) {
  const { lang, t } = useSite();
  const [hover, setHover] = useState(false);
  return (
    <Link href={projectHref(lang, project.slug)} style={{ display: "block" }}>
      <article
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ cursor: "pointer", transition: "transform 400ms var(--ease)" }}
      >
        <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--radius)" }}>
          <LT.Media
            image={project.cover}
            tone={toneFor(project.slug)}
            ratio={compact ? "4/3" : large ? "5/6" : "4/5"}
            sizes="(max-width: 900px) 100vw, 50vw"
            label={project.title}
            style={{ transform: hover ? "scale(1.03)" : "scale(1)", transition: "transform 800ms var(--ease)" }}
          />
          <div style={{
            position: "absolute", left: 16, top: 16,
            background: "rgba(245,239,230,0.92)", padding: "6px 10px", borderRadius: 2,
            fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-2)",
          }}>
            {project.category === "architecture" ? t.categoryArchitecture : t.categoryInteriors}
          </div>
        </div>
        <div className="lt-card-meta-row" style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontFamily: "var(--display)", fontStyle: "italic", fontSize: large ? 32 : 26, lineHeight: 1.05, letterSpacing: "-0.015em" }}>
              {project.title}
            </h3>
            <p className="t-caption" style={{ marginTop: 6, marginBottom: 0 }}>
              {project.location} — {project.year}
            </p>
          </div>
          <span className="lt-card-type" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-3)", whiteSpace: "nowrap" }}>
            {project.type}
          </span>
        </div>
      </article>
    </Link>
  );
}

// ——— Manifesto block ———
function Manifesto({ page }: { page: Page }) {
  return (
    <section style={{ background: "var(--bg-soft)", padding: "var(--section) 0", marginTop: 60 }}>
      <div className="container lt-manifesto-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }}>
        <div>
          <div className="t-eyebrow">{page.manifestoEyebrow}</div>
          <div style={{ marginTop: 20, fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            01 / 04
          </div>
        </div>
        <div>
          <h2 className="t-h2" style={{ margin: 0 }}>
            <LT.Accent value={page.manifestoTitle} />
          </h2>
          <p className="t-body-lg" style={{ marginTop: 32, maxWidth: 640 }}>
            {page.manifestoBody}
          </p>
        </div>
      </div>
    </section>
  );
}

// ——— Two big sections (Residential / Commercial) ———
function Sections({ segments, projects }: { segments: HomeData["segments"]; projects: ProjectCardData[] }) {
  const { lang, t } = useSite();
  const cards: { id: Segment; title: string; sub: string }[] = [
    { id: "residential", title: segments.residentialTitle, sub: segments.residentialIntro },
    { id: "commercial", title: segments.commercialTitle, sub: segments.commercialIntro },
  ];
  return (
    <section style={{ padding: "var(--section) 0" }}>
      <div className="container">
        <div className="t-eyebrow" style={{ marginBottom: 60 }}>{segments.eyebrow}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="lt-sections-grid">
          {cards.map((s, i) => {
            const inSegment = projects.filter((p) => p.segment === s.id);
            const sample = inSegment.slice(0, 3);
            return (
              <Link key={s.id} href={segmentHref(lang, s.id)} className="lt-segment-card" style={{ display: "block", cursor: "pointer", border: "1px solid var(--line)", padding: 32, borderRadius: 4, background: "var(--paper)", transition: "all 240ms var(--ease)" }}
                onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-soft)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.background = "var(--paper)"}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.1em" }}>{pad(i + 1)}</span>
                  <span className="t-caption">{inSegment.length} {t.projectsCount}</span>
                </div>
                <h3 className="t-h2" style={{ margin: 0, fontSize: "clamp(40px, 4.5vw, 64px)" }}>{s.title}</h3>
                <p className="t-body" style={{ marginTop: 16, maxWidth: 420 }}>{s.sub}</p>

                <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
                  {sample.map((p) => (
                    <div key={p._id} style={{ flex: 1 }}>
                      <LT.Media image={p.cover} tone={toneFor(p.slug)} ratio="3/4" sizes="15vw" />
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500 }}>
                  {t.viewPrefix} {s.title.toLowerCase()} <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ——— Contact CTA ———
function ContactCTA({ page }: { page: Page }) {
  const { lang } = useSite();
  return (
    <section style={{ padding: "var(--section) 0" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <div className="t-eyebrow">{page.ctaEyebrow}</div>
        <h2 className="t-h1" style={{ margin: "32px 0", fontSize: "clamp(60px, 9vw, 144px)" }}>
          <LT.Accent value={page.ctaTitle} />
        </h2>
        <Link className="btn btn-fill" href={href(lang, "contact")} style={{ padding: "18px 36px", fontSize: 15 }}>
          {page.ctaButton} <span className="arrow">→</span>
        </Link>
      </div>
    </section>
  );
}

export { Home, ProjectCard };
