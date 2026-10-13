// ============================================
// Laura Tejeda — Studio (About) + Services + Process
// ============================================
"use client";
import { LT, pad, toneFor, useSite } from "./Shared";
import type { ServicesData, StudioData } from "@/sanity/lib/queries";

function Studio({ data }: { data: StudioData }) {
  const { settings } = useSite();
  const body = data.body ?? [];
  const timeline = data.timeline ?? [];
  const team = data.team ?? [];

  return (
    <main style={{ paddingTop: 140 }}>
      {/* Header */}
      <section style={{ paddingBottom: 80 }}>
        <div className="container">
          <div className="t-eyebrow" style={{ marginBottom: 32 }}>{data.eyebrow}</div>
          <h1 className="t-h1" style={{ margin: 0, maxWidth: 1100 }}>
            <LT.Accent value={data.title} />
          </h1>
        </div>
      </section>

      {/* Portrait + bio */}
      <section style={{ paddingBottom: 120 }}>
        <div className="container lt-studio-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "start" }}>
          <div style={{ position: "sticky", top: 120 }}>
            <LT.Media image={data.portrait} tone="warm" ratio="4/5" sizes="(max-width: 900px) 100vw, 45vw" priority label={settings.name} />
            {data.portraitCredit && (
              <div style={{ marginTop: 16, fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {data.portraitCredit}
              </div>
            )}
          </div>

          <div>
            {body.map((p, i) => (
              <p key={p._key} className="t-body-lg" style={{ marginTop: i === 0 ? 0 : 32 }}>{p.text}</p>
            ))}

            {timeline.length > 0 && (
              <>
                <hr className="hr" style={{ margin: "60px 0" }} />

                <div className="t-eyebrow" style={{ marginBottom: 24 }}>{data.timelineTitle}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {timeline.map((row) => (
                    <li key={row._key} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 24, padding: "16px 0", borderBottom: "1px solid var(--line-soft)" }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-3)", letterSpacing: "0.06em" }}>{row.period}</span>
                      <span style={{ fontSize: 15 }}>{row.text}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      {data.quote && (
        <section style={{ background: "var(--bg-soft)", padding: "var(--section) 0" }}>
          <div className="container-narrow" style={{ textAlign: "center" }}>
            <span style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: "clamp(36px, 5vw, 72px)", lineHeight: 1.05, letterSpacing: "-0.015em", color: "var(--ink)" }}>
              “{data.quote}”
            </span>
            {data.quoteSource && (
              <div style={{ marginTop: 32, fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {data.quoteSource}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Studio team */}
      {team.length > 0 && (
        <section style={{ padding: "var(--section) 0" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "start", marginBottom: 60 }}>
              <div className="t-eyebrow">{data.teamTitle}</div>
              <p className="t-body-lg" style={{ margin: 0, maxWidth: 640 }}>
                {data.teamIntro}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }} className="lt-team-grid">
              {team.map((m, i) => (
                <div key={m._key}>
                  <LT.Media image={m.photo} tone={toneFor(i)} ratio="1/1" sizes="(max-width: 900px) 50vw, 30vw" />
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 22, letterSpacing: "-0.01em" }}>{m.name}</div>
                    <div className="t-caption" style={{ marginTop: 2 }}>{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function Services({ data }: { data: ServicesData }) {
  const services = data.services ?? [];
  return (
    <section id="services-anchor" style={{ background: "var(--ink)", color: "var(--bg)", padding: "var(--section) 0" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "end", marginBottom: 80 }} className="lt-services-head">
          <div>
            <div className="t-eyebrow" style={{ color: "rgba(245,239,230,0.5)" }}>{data.servicesEyebrow}</div>
            <h2 className="t-h1" style={{ margin: "16px 0 0", color: "var(--bg)", fontSize: "clamp(56px, 8vw, 120px)" }}>
              <LT.Accent value={data.servicesTitle} emClassName="" emStyle={{ fontFamily: "var(--display)", fontStyle: "italic", color: "var(--accent-soft)" }} />
            </h2>
          </div>
          <p className="t-body-lg" style={{ margin: 0, color: "rgba(245,239,230,0.75)", maxWidth: 540 }}>
            {data.servicesIntro}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }} className="lt-services-grid">
          {services.map((s, i) => (
            <div key={s._key} style={{
              padding: "40px 0",
              paddingRight: i % 2 === 0 ? 40 : 0,
              paddingLeft: i % 2 === 1 ? 40 : 0,
              borderTop: "1px solid rgba(245,239,230,0.18)",
              borderBottom: i >= services.length - 2 ? "1px solid rgba(245,239,230,0.18)" : "none",
              borderLeft: i % 2 === 1 ? "1px solid rgba(245,239,230,0.18)" : "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "rgba(245,239,230,0.5)", letterSpacing: "0.12em" }}>{pad(i + 1)}</span>
              </div>
              <h3 style={{ margin: 0, fontFamily: "var(--display)", fontStyle: "italic", fontSize: "clamp(28px, 3vw, 40px)", letterSpacing: "-0.01em", color: "var(--bg)" }}>
                {s.title}
              </h3>
              <p style={{ marginTop: 16, fontSize: 16, color: "rgba(245,239,230,0.7)", lineHeight: 1.6, maxWidth: 480 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ data }: { data: ServicesData }) {
  const { t } = useSite();
  const steps = data.process ?? [];
  return (
    <section style={{ padding: "var(--section) 0" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "end", marginBottom: 80 }} className="lt-process-head">
          <div>
            <div className="t-eyebrow">{data.processEyebrow}</div>
            <h2 className="t-h1" style={{ margin: "16px 0 0", fontSize: "clamp(56px, 8vw, 120px)" }}>
              <LT.Accent value={data.processTitle} />
            </h2>
          </div>
          <p className="t-body-lg" style={{ margin: 0, maxWidth: 540 }}>{data.processIntro}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {steps.map((p, i) => (
            <div key={p._key} style={{
              display: "grid", gridTemplateColumns: "80px 1.4fr 2fr 200px", gap: 40, alignItems: "start",
              padding: "48px 0", borderTop: "1px solid var(--line)",
              borderBottom: i === steps.length - 1 ? "1px solid var(--line)" : "none",
            }} className="lt-process-row">
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-3)", letterSpacing: "0.12em", paddingTop: 12 }}>{pad(i + 1)}</span>
              <h3 style={{ margin: 0, fontFamily: "var(--display)", fontStyle: "italic", fontSize: "clamp(32px, 3.5vw, 48px)", letterSpacing: "-0.015em" }}>
                {p.title}
              </h3>
              <p className="t-body" style={{ margin: 0, marginTop: 6 }}>{p.body}</p>
              <div style={{ paddingTop: 12 }}>
                <div className="t-meta" style={{ marginBottom: 4 }}>{t.processDuration}</div>
                <div style={{ fontSize: 14 }}>{p.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Standalone Services page (for nav target)
function ServicesPage({ data }: { data: ServicesData }) {
  return (
    <main style={{ paddingTop: 120 }}>
      <Services data={data} />
      <Process data={data} />
    </main>
  );
}

export { Studio, Services, Process, ServicesPage };
