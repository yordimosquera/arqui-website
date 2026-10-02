// ============================================
// Laura Tejeda — Studio (About) + Services + Process
// ============================================
"use client";
import { CONTENT } from "@/app/content";
import { LT, useLT } from "./Shared";

function Studio() {
  const t = LT.useT();
  const { lang } = useLT();
  return (
    <main style={{ paddingTop: 140 }}>
      {/* Header */}
      <section style={{ paddingBottom: 80 }}>
        <div className="container">
          <div className="t-eyebrow" style={{ marginBottom: 32 }}>{t.aboutEyebrow}</div>
          <h1 className="t-h1" style={{ margin: 0, maxWidth: 1100 }}>
            {lang === "es" ? "Una arquitecta del " : "A Caribbean architect, "}
            <em className="italic-accent">{lang === "es" ? "Caribe" : "trained between"}</em>
            {lang === "es" ? ", formada entre " : " "}
            <em className="italic-accent">{lang === "es" ? "Bogotá y Lisboa" : "Bogotá and Lisbon"}</em>
            .
          </h1>
        </div>
      </section>

      {/* Portrait + bio */}
      <section style={{ paddingBottom: 120 }}>
        <div className="container lt-studio-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "start" }}>
          <div style={{ position: "sticky", top: 120 }}>
            <LT.Placeholder tone="warm" ratio="4/5" label={lang === "es" ? "Retrato — Laura Tejeda" : "Portrait — Laura Tejeda"} />
            <div style={{ marginTop: 16, fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {lang === "es" ? "Foto: Federico Ríos · 2024" : "Photo: Federico Ríos · 2024"}
            </div>
          </div>

          <div>
            <p className="t-body-lg" style={{ marginTop: 0 }}>{t.aboutBody1}</p>
            <p className="t-body-lg" style={{ marginTop: 32 }}>{t.aboutBody2}</p>
            <p className="t-body-lg" style={{ marginTop: 32 }}>{t.aboutBody3}</p>

            <hr className="hr" style={{ margin: "60px 0" }} />

            <div className="t-eyebrow" style={{ marginBottom: 24 }}>{lang === "es" ? "Trayectoria" : "Background"}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { y: "2020 —", t: { es: "Funda Laura Tejeda Estudio en Barranquilla", en: "Founds Laura Tejeda Studio in Barranquilla" } },
                { y: "2017–20", t: { es: "Arquitecta asociada en Tropical Architecture, Cartagena", en: "Associate architect at Tropical Architecture, Cartagena" } },
                { y: "2015–17", t: { es: "Maestría en Diseño de Interiores, FA Lisboa", en: "MA in Interior Design, FA Lisboa" } },
                { y: "2014–15", t: { es: "Práctica en Estudio AT, Ciudad de México", en: "Practice at Estudio AT, Mexico City" } },
                { y: "2009–14", t: { es: "Arquitectura, Universidad de los Andes, Bogotá", en: "Architecture, Universidad de los Andes, Bogotá" } },
              ].map((row, i) => (
                <li key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 24, padding: "16px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-3)", letterSpacing: "0.06em" }}>{row.y}</span>
                  <span style={{ fontSize: 15 }}>{LT.pick(row.t, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section style={{ background: "var(--bg-soft)", padding: "var(--section) 0" }}>
        <div className="container-narrow" style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: "clamp(36px, 5vw, 72px)", lineHeight: 1.05, letterSpacing: "-0.015em", color: "var(--ink)" }}>
            “{lang === "es"
              ? "Una casa no se diseña, se acompaña. Hay que escuchar el clima, el lugar, la familia que la habitará — y luego escribir poco."
              : "A house isn't designed, it's accompanied. You have to listen to the climate, the place, the family that will inhabit it — and then write very little."}”
          </span>
          <div style={{ marginTop: 32, fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Laura Tejeda — {lang === "es" ? "entrevista para Axxis, 2024" : "interview for Axxis, 2024"}
          </div>
        </div>
      </section>

      {/* Studio team */}
      <section style={{ padding: "var(--section) 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "start", marginBottom: 60 }}>
            <div className="t-eyebrow">{lang === "es" ? "Equipo" : "Team"}</div>
            <p className="t-body-lg" style={{ margin: 0, maxWidth: 640 }}>
              {lang === "es"
                ? "Somos un estudio pequeño y deliberado: nunca llevamos más de cinco proyectos a la vez. Trabajamos en colaboración estrecha con artesanos, ingenieros y constructores del Caribe colombiano."
                : "We are a small and deliberate studio: never more than five projects at once. We work in close collaboration with artisans, engineers and builders from the Colombian Caribbean."}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }} className="lt-team-grid">
            {[
              { n: "Laura Tejeda", role: { es: "Fundadora · Arquitecta", en: "Founder · Architect" }, tone: "warm" },
              { n: "Mateo Ríos", role: { es: "Arquitecto asociado", en: "Associate architect" }, tone: "stone" },
              { n: "Sara Pinzón", role: { es: "Diseñadora de interiores", en: "Interior designer" }, tone: "cream" },
              { n: "Valentina Cárdenas", role: { es: "Coordinadora de obra", en: "Construction coordinator" }, tone: "olive" },
              { n: "Carpintería Caribe", role: { es: "Aliados — carpintería", en: "Allies — carpentry" }, tone: "clay" },
              { n: "Cerámica Galapa", role: { es: "Aliados — cerámica", en: "Allies — ceramics" }, tone: "terracotta" },
            ].map((m, i) => (
              <div key={i}>
                <LT.Placeholder tone={m.tone} ratio="1/1" />
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 22, letterSpacing: "-0.01em" }}>{m.n}</div>
                  <div className="t-caption" style={{ marginTop: 2 }}>{LT.pick(m.role, lang)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Services() {
  const t = LT.useT();
  const { lang } = useLT();
  return (
    <section id="services-anchor" style={{ background: "var(--ink)", color: "var(--bg)", padding: "var(--section) 0" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "end", marginBottom: 80 }} className="lt-services-head">
          <div>
            <div className="t-eyebrow" style={{ color: "rgba(245,239,230,0.5)" }}>{t.servicesEyebrow}</div>
            <h2 className="t-h1" style={{ margin: "16px 0 0", color: "var(--bg)", fontSize: "clamp(56px, 8vw, 120px)" }}>
              {t.servicesTitle.split("").slice(0, -1).join("")}<em style={{ fontFamily: "var(--display)", fontStyle: "italic", color: "var(--accent-soft)" }}>{t.servicesTitle.slice(-1)}</em>
            </h2>
          </div>
          <p className="t-body-lg" style={{ margin: 0, color: "rgba(245,239,230,0.75)", maxWidth: 540 }}>
            {t.servicesIntro}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }} className="lt-services-grid">
          {CONTENT.services.map((s, i) => (
            <div key={i} style={{
              padding: "40px 0",
              paddingRight: i % 2 === 0 ? 40 : 0,
              paddingLeft: i % 2 === 1 ? 40 : 0,
              borderTop: "1px solid rgba(245,239,230,0.18)",
              borderBottom: i >= CONTENT.services.length - 2 ? "1px solid rgba(245,239,230,0.18)" : "none",
              borderLeft: i % 2 === 1 ? "1px solid rgba(245,239,230,0.18)" : "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "rgba(245,239,230,0.5)", letterSpacing: "0.12em" }}>{s.n}</span>
              </div>
              <h3 style={{ margin: 0, fontFamily: "var(--display)", fontStyle: "italic", fontSize: "clamp(28px, 3vw, 40px)", letterSpacing: "-0.01em", color: "var(--bg)" }}>
                {LT.pick(s.title, lang)}
              </h3>
              <p style={{ marginTop: 16, fontSize: 16, color: "rgba(245,239,230,0.7)", lineHeight: 1.6, maxWidth: 480 }}>
                {LT.pick(s.body, lang)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const t = LT.useT();
  const { lang } = useLT();
  return (
    <section style={{ padding: "var(--section) 0" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "end", marginBottom: 80 }} className="lt-process-head">
          <div>
            <div className="t-eyebrow">{t.processEyebrow}</div>
            <h2 className="t-h1" style={{ margin: "16px 0 0", fontSize: "clamp(56px, 8vw, 120px)" }}>
              {lang === "es" ? "Proce" : "Proce"}<em className="italic-accent">{lang === "es" ? "so" : "ss"}</em>
            </h2>
          </div>
          <p className="t-body-lg" style={{ margin: 0, maxWidth: 540 }}>{t.processIntro}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {CONTENT.process.map((p, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "80px 1.4fr 2fr 200px", gap: 40, alignItems: "start",
              padding: "48px 0", borderTop: "1px solid var(--line)",
              borderBottom: i === CONTENT.process.length - 1 ? "1px solid var(--line)" : "none",
            }} className="lt-process-row">
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-3)", letterSpacing: "0.12em", paddingTop: 12 }}>{p.n}</span>
              <h3 style={{ margin: 0, fontFamily: "var(--display)", fontStyle: "italic", fontSize: "clamp(32px, 3.5vw, 48px)", letterSpacing: "-0.015em" }}>
                {LT.pick(p.title, lang)}
              </h3>
              <p className="t-body" style={{ margin: 0, marginTop: 6 }}>{LT.pick(p.body, lang)}</p>
              <div style={{ paddingTop: 12 }}>
                <div className="t-meta" style={{ marginBottom: 4 }}>{lang === "es" ? "Duración" : "Duration"}</div>
                <div style={{ fontSize: 14 }}>{LT.pick(p.duration, lang)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Standalone Services page (for nav target)
function ServicesPage() {
  return (
    <main style={{ paddingTop: 120 }}>
      <Services />
      <Process />
    </main>
  );
}

export { Studio, Services, Process, ServicesPage };
