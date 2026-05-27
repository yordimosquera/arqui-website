// ============================================
// Laura Tejeda — Home page
// ============================================
"use client";
import { useState, useEffect } from "react";
import { CONTENT } from "@/app/content";
import { LT, useLT, type Project } from "./Shared";


function Home({ onNav, onOpenProject }: { onNav: (id: string) => void; onOpenProject: (id: string) => void }) {
  const featured = CONTENT.projects.filter((p) => p.featured);

  return (
    <main>
      <Hero featured={featured} onNav={onNav} onOpenProject={onOpenProject} />
      <SelectedWork onOpenProject={onOpenProject} onNav={onNav} />
      <Manifesto />
      <Sections onNav={onNav} />
      <PressStrip />
      <ContactCTA onNav={onNav} />
    </main>
  );
}

// ——— HERO with auto carousel ———
function Hero({ featured, onNav, onOpenProject }: { featured: Project[]; onNav: (id: string) => void; onOpenProject: (id: string) => void }) {
  const t = LT.useT();
  const { lang } = useLT();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
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
              {lang === "es" ? "Estudio independiente — Barranquilla" : "Independent studio — Barranquilla"}
            </div>
            <h1 className="t-h1" style={{ margin: 0 }}>
              {t.heroLine1}<br />
              <em className="italic-accent">{t.heroLine2}</em><br />
              {t.heroLine3}
            </h1>
            <p className="t-body-lg" style={{ marginTop: 36, maxWidth: 460 }}>
              {t.heroSub}
            </p>
            <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn-fill" onClick={() => onOpenProject(current.id)}>
                {t.ctaViewProject} <span className="arrow">→</span>
              </button>
              <button className="btn btn-ghost" onClick={() => onNav("studio")}>
                {lang === "es" ? "Conoce el estudio" : "About the studio"}
              </button>
            </div>
          </div>

          {/* Carousel meta */}
          <div style={{ marginTop: 60 }}>
            <div className="t-meta" style={{ marginBottom: 12 }}>
              {String(idx + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")} — {t.featuredEyebrow}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontFamily: "var(--display)", fontStyle: "italic", fontSize: 32, lineHeight: 1, letterSpacing: "-0.015em" }}>
                {LT.pick(current.title, lang)}
              </h3>
              <span className="t-caption" style={{ color: "var(--ink-3)" }}>{current.location} · {current.year}</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {featured.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`} style={{
                  flex: 1, maxWidth: 80, height: 2,
                  background: i === idx ? "var(--ink)" : "var(--line)",
                  transition: "background 240ms var(--ease)",
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — carousel image */}
        <div style={{ position: "relative", minHeight: 600 }}>
          {featured.map((p, i) => (
            <div key={p.id} style={{
              position: "absolute", inset: 0,
              opacity: i === idx ? 1 : 0,
              transition: "opacity 800ms var(--ease)",
              cursor: "pointer",
            }} onClick={() => onOpenProject(p.id)}>
              <LT.Placeholder tone={p.tone} ratio="auto" style={{ height: "100%", width: "100%" }} label={LT.pick(p.title, lang)} />
            </div>
          ))}

          {/* arrows */}
          <div style={{ position: "absolute", bottom: 24, right: 24, display: "flex", gap: 8 }}>
            <button onClick={() => setIdx((idx - 1 + featured.length) % featured.length)} style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(245,239,230,0.92)", color: "var(--ink)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(6px)",
            }} aria-label="Previous">←</button>
            <button onClick={() => setIdx((idx + 1) % featured.length)} style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(245,239,230,0.92)", color: "var(--ink)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(6px)",
            }} aria-label="Next">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ——— Selected work strip ———
function SelectedWork({ onOpenProject, onNav }: { onOpenProject: (id: string) => void; onNav: (id: string) => void }) {
  const t = LT.useT();
  const { lang } = useLT();
  const featured = CONTENT.projects.filter((p) => p.featured).slice(0, 4);

  return (
    <section style={{ paddingTop: 140, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 60, gap: 40, flexWrap: "wrap" }}>
          <div>
            <div className="t-eyebrow" style={{ marginBottom: 16 }}>{t.featuredEyebrow}</div>
            <h2 className="t-h2" style={{ margin: 0, maxWidth: 700 }}>
              {lang === "es" ? "Una selección de proyectos " : "A selection of "}
              <em className="italic-accent">{lang === "es" ? "recientes" : "recent projects"}</em>
            </h2>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-ghost" onClick={() => onNav("architecture")}>{t.navArch} →</button>
            <button className="btn btn-ghost" onClick={() => onNav("interiors")}>{t.navInt} →</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="lt-work-grid">
          {featured.map((p, i) => (
            <ProjectCard key={p.id} project={p} large={i === 0 || i === 3} onClick={() => onOpenProject(p.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ——— Project card ———
function ProjectCard({ project, large, onClick, compact }: { project: Project; large?: boolean; onClick: () => void; compact?: boolean }) {
  const { lang } = useLT();
  const [hover, setHover] = useState(false);
  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", transition: "transform 400ms var(--ease)" }}
    >
      <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--radius)" }}>
        <LT.Placeholder
          tone={project.tone}
          ratio={compact ? "4/3" : large ? "5/6" : "4/5"}
          label={LT.pick(project.title, lang)}
          style={{ transform: hover ? "scale(1.03)" : "scale(1)", transition: "transform 800ms var(--ease)" }}
        />
        <div style={{
          position: "absolute", left: 16, top: 16,
          background: "rgba(245,239,230,0.92)", padding: "6px 10px", borderRadius: 2,
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-2)",
        }}>
          {project.category === "architecture" ? (lang === "es" ? "Arquitectura" : "Architecture") : (lang === "es" ? "Interiorismo" : "Interiors")}
        </div>
      </div>
      <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontFamily: "var(--display)", fontStyle: "italic", fontSize: large ? 32 : 26, lineHeight: 1.05, letterSpacing: "-0.015em" }}>
            {LT.pick(project.title, lang)}
          </h3>
          <p className="t-caption" style={{ marginTop: 6, marginBottom: 0 }}>
            {project.location} — {project.year}
          </p>
        </div>
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-3)", whiteSpace: "nowrap" }}>
          {LT.pick(project.type, lang)}
        </span>
      </div>
    </article>
  );
}

// ——— Manifesto block ———
function Manifesto() {
  const t = LT.useT();
  return (
    <section style={{ background: "var(--bg-soft)", padding: "var(--section) 0", marginTop: 60 }}>
      <div className="container lt-manifesto-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "start" }}>
        <div>
          <div className="t-eyebrow">{t.manifestoEyebrow}</div>
          <div style={{ marginTop: 20, fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            01 / 04
          </div>
        </div>
        <div>
          <h2 className="t-h2" style={{ margin: 0 }}>
            {t.manifestoTitle.split(",")[0]},
            <br />
            <em className="italic-accent">{t.manifestoTitle.split(",")[1]?.trim()}</em>
          </h2>
          <p className="t-body-lg" style={{ marginTop: 32, maxWidth: 640 }}>
            {t.manifestoBody}
          </p>
        </div>
      </div>
    </section>
  );
}

// ——— Two big sections (Architecture / Interiors) ———
function Sections({ onNav }: { onNav: (id: string) => void }) {
  const t = LT.useT();
  const { lang } = useLT();
  return (
    <section style={{ padding: "var(--section) 0" }}>
      <div className="container">
        <div className="t-eyebrow" style={{ marginBottom: 60 }}>{t.indexEyebrow}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="lt-sections-grid">
          {[
            { id: "architecture", title: t.indexArchTitle, sub: t.indexArchSub, n: "01" },
            { id: "interiors", title: t.indexIntTitle, sub: t.indexIntSub, n: "02" },
          ].map((s) => {
            const sample = CONTENT.projects.filter((p) => p.category === s.id).slice(0, 3);
            return (
              <div key={s.id} onClick={() => onNav(s.id)} style={{ cursor: "pointer", border: "1px solid var(--line)", padding: 32, borderRadius: 4, background: "var(--paper)", transition: "all 240ms var(--ease)" }}
                onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "var(--bg-soft)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = "var(--paper)"}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.1em" }}>{s.n}</span>
                  <span className="t-caption">{sample.length + (lang === "es" ? " proyectos" : " projects")}</span>
                </div>
                <h3 className="t-h2" style={{ margin: 0, fontSize: "clamp(40px, 4.5vw, 64px)" }}>{s.title}</h3>
                <p className="t-body" style={{ marginTop: 16, maxWidth: 420 }}>{s.sub}</p>

                <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
                  {sample.map((p) => (
                    <div key={p.id} style={{ flex: 1 }}>
                      <LT.Placeholder tone={p.tone} ratio="3/4" />
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500 }}>
                  {lang === "es" ? "Ver" : "View"} {s.title.toLowerCase()} <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ——— Press strip ———
function PressStrip() {
  const { lang } = useLT();
  return (
    <section style={{ padding: "60px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <div className="container">
        <div className="t-eyebrow" style={{ marginBottom: 28 }}>{lang === "es" ? "Prensa y reconocimientos" : "Press & recognitions"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }} className="lt-press-grid">
          {CONTENT.press.map((p, i) => (
            <div key={i} style={{ paddingTop: 16, borderTop: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 24, letterSpacing: "-0.01em" }}>{p.source}</div>
              <div className="t-caption" style={{ marginTop: 6 }}>{LT.pick(p.title, lang)}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-4)", marginTop: 10, letterSpacing: "0.1em" }}>{p.year}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ——— Contact CTA ———
function ContactCTA({ onNav }: { onNav: (id: string) => void }) {
  const { lang } = useLT();
  return (
    <section style={{ padding: "var(--section) 0" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <div className="t-eyebrow">{lang === "es" ? "Trabajemos juntos" : "Let's work together"}</div>
        <h2 className="t-h1" style={{ margin: "32px 0", fontSize: "clamp(60px, 9vw, 144px)" }}>
          {lang === "es" ? "¿Empezamos" : "Shall we"}
          <br />
          <em className="italic-accent">{lang === "es" ? "una conversación?" : "begin a conversation?"}</em>
        </h2>
        <button className="btn btn-fill" onClick={() => onNav("contact")} style={{ padding: "18px 36px", fontSize: 15 }}>
          {lang === "es" ? "Escribir al estudio" : "Write to the studio"} <span className="arrow">→</span>
        </button>
      </div>
    </section>
  );
}

export { Home, ProjectCard };
