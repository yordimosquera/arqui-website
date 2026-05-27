// ============================================
// Laura Tejeda — Contact page
// ============================================
"use client";
import { useState } from "react";
import { CONTENT } from "@/app/content";
import { LT, useLT } from "./Shared";

type FormState = { name: string; email: string; subject: string; message: string };

function Contact() {
  const t = LT.useT();
  const { lang } = useLT();
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "residential", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "residential", message: "" });
  };

  const subjects: { v: string; l: { es: string; en: string } }[] = [
    { v: "residential", l: { es: "Vivienda nueva", en: "New house" } },
    { v: "renovation", l: { es: "Renovación / interiorismo", en: "Renovation / interiors" } },
    { v: "commercial", l: { es: "Comercial / hospitalidad", en: "Commercial / hospitality" } },
    { v: "consulting", l: { es: "Consultoría", en: "Consulting" } },
    { v: "other", l: { es: "Otro", en: "Other" } },
  ];

  return (
    <main style={{ paddingTop: 140 }}>
      <section style={{ paddingBottom: 60 }}>
        <div className="container">
          <div className="t-eyebrow" style={{ marginBottom: 32 }}>{t.contactEyebrow}</div>
          <h1 className="t-h1" style={{ margin: 0, maxWidth: 1100 }}>
            {lang === "es" ? "¿Tienes un " : "Have a "}
            <em className="italic-accent">{lang === "es" ? "proyecto" : "project"}</em>
            {lang === "es" ? " en mente?" : " in mind?"}
          </h1>
          <p className="t-body-lg" style={{ marginTop: 32, maxWidth: 640 }}>{t.contactBody}</p>
        </div>
      </section>

      <section style={{ paddingBottom: 80 }}>
        <div className="container lt-contact-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "start" }}>
          {/* FORM */}
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Field label={lang === "es" ? "Nombre" : "Name"} required>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.contactNamePlaceholder} style={inputStyle} />
            </Field>
            <Field label={lang === "es" ? "Correo" : "Email"} required>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t.contactEmailPlaceholder} style={inputStyle} />
            </Field>
            <Field label={lang === "es" ? "Tipo de proyecto" : "Project type"}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 8 }}>
                {subjects.map((s) => (
                  <button key={s.v} type="button" onClick={() => setForm({ ...form, subject: s.v })} style={{
                    padding: "10px 16px",
                    border: "1px solid " + (form.subject === s.v ? "var(--ink)" : "var(--line)"),
                    background: form.subject === s.v ? "var(--ink)" : "transparent",
                    color: form.subject === s.v ? "var(--bg)" : "var(--ink-2)",
                    borderRadius: 999, fontSize: 13, transition: "all 200ms var(--ease)",
                  }}>{LT.pick(s.l, lang)}</button>
                ))}
              </div>
            </Field>
            <Field label={lang === "es" ? "Mensaje" : "Message"} required last>
              <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.contactMessagePlaceholder} style={{ ...inputStyle, resize: "vertical", minHeight: 140 }} />
            </Field>

            <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 24 }}>
              <button type="submit" className="btn btn-fill" style={{ padding: "16px 28px" }}>
                {sent ? t.contactSent : t.contactSend} <span className="arrow">→</span>
              </button>
              {sent && <span className="t-caption" style={{ color: "var(--accent)" }}>✓ {t.contactSent}</span>}
            </div>
          </form>

          {/* SIDE INFO */}
          <aside>
            <div style={{ background: "var(--bg-soft)", padding: 36, borderRadius: 4 }}>
              <div className="t-eyebrow" style={{ marginBottom: 24 }}>{lang === "es" ? "Estudio" : "Studio"}</div>
              <div style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.015em", marginBottom: 24 }}>
                {lang === "es" ? "Carrera 53 #76-115" : "Carrera 53 #76-115"}<br />
                Barranquilla, Colombia
              </div>
              <hr className="hr" style={{ background: "var(--line)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
                <ContactRow label={lang === "es" ? "Correo" : "Email"} value={CONTENT.brand.email} />
                <ContactRow label={lang === "es" ? "Teléfono" : "Phone"} value={CONTENT.brand.phone} />
                <ContactRow label="Instagram" value={CONTENT.brand.instagram} />
                <ContactRow label="Pinterest" value={CONTENT.brand.pinterest} />
              </div>

              <hr className="hr" style={{ background: "var(--line)", marginTop: 32 }} />
              <div style={{ marginTop: 24 }}>
                <div className="t-eyebrow" style={{ marginBottom: 12 }}>{lang === "es" ? "Horario" : "Hours"}</div>
                <div className="t-body" style={{ fontSize: 14, marginTop: 0 }}>
                  {lang === "es" ? "Lunes a viernes" : "Monday to Friday"}<br />
                  9:00 — 18:00 (GMT-5)
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, padding: 28, border: "1px solid var(--line)", borderRadius: 4 }}>
              <div className="t-eyebrow" style={{ marginBottom: 12 }}>{lang === "es" ? "Calendario" : "Calendar"}</div>
              <p className="t-body" style={{ marginTop: 0, fontSize: 14 }}>
                {lang === "es"
                  ? "Recibimos hasta cinco proyectos al año. Actualmente revisamos encargos para 2026."
                  : "We take up to five projects a year. Currently reviewing commissions for 2026."}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 13, color: "var(--accent)" }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }}></span>
                {lang === "es" ? "Aceptando proyectos para 2026" : "Accepting projects for 2026"}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 0",
  fontSize: 16,
  fontFamily: "var(--sans)",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--line)",
  borderRadius: 0,
  color: "var(--ink)",
  outline: "none",
  transition: "border-color 200ms var(--ease)",
};

function Field({ label, children, required, last }: { label: string; children: React.ReactNode; required?: boolean; last?: boolean }) {
  return (
    <div style={{ paddingTop: 24, paddingBottom: 12, borderBottom: last ? "none" : "1px dashed transparent" }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
        {label} {required && <span style={{ color: "var(--accent)" }}>*</span>}
      </div>
      {children}
    </div>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 15, marginTop: 2 }}>{value}</div>
    </div>
  );
}

export { Contact };
