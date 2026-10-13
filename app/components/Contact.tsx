// ============================================
// Laura Tejeda — Contact page
// ============================================
"use client";
import { Fragment, useState } from "react";
import { LT, useSite } from "./Shared";
import type { ContactData } from "@/sanity/lib/queries";

type FormState = { name: string; email: string; phone: string; subject: string; message: string };

function Contact({ data }: { data: ContactData }) {
  const { t, settings } = useSite();
  const subjects = data.subjects ?? [];
  const empty: FormState = { name: "", email: "", phone: "", subject: subjects[0]?._key ?? "", message: "" };
  const [form, setForm] = useState<FormState>(empty);
  const [sent, setSent] = useState(false);

  // TODO (phase 4): send the message by email instead of only showing the confirmation.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm(empty);
  };

  return (
    <main style={{ paddingTop: 140 }}>
      <section style={{ paddingBottom: 60 }}>
        <div className="container">
          <div className="t-eyebrow" style={{ marginBottom: 32 }}>{data.eyebrow}</div>
          <h1 className="t-h1" style={{ margin: 0, maxWidth: 1100 }}>
            <LT.Accent value={data.title} />
          </h1>
          <p className="t-body-lg" style={{ marginTop: 32, maxWidth: 640 }}>{data.body}</p>
        </div>
      </section>

      <section style={{ paddingBottom: 80 }}>
        <div className="container lt-contact-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 80, alignItems: "start" }}>
          {/* FORM */}
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Field label={t.contactNameLabel} required>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.contactNamePlaceholder} style={inputStyle} />
            </Field>
            <Field label={t.contactEmailLabel} required>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t.contactEmailPlaceholder} style={inputStyle} />
            </Field>
            <Field label={t.contactPhoneLabel}>
              <input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t.contactPhonePlaceholder} style={inputStyle} />
            </Field>
            {subjects.length > 0 && (
              <Field label={t.contactSubjectLabel}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 8 }}>
                  {subjects.map((s) => (
                    <button key={s._key} type="button" aria-pressed={form.subject === s._key} onClick={() => setForm({ ...form, subject: s._key })} style={{
                      padding: "10px 16px",
                      border: "1px solid " + (form.subject === s._key ? "var(--ink)" : "var(--line)"),
                      background: form.subject === s._key ? "var(--ink)" : "transparent",
                      color: form.subject === s._key ? "var(--bg)" : "var(--ink-2)",
                      borderRadius: 999, fontSize: 13, transition: "all 200ms var(--ease)",
                    }}>{s.label}</button>
                  ))}
                </div>
              </Field>
            )}
            <Field label={t.contactMessageLabel} required last>
              <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.contactMessagePlaceholder} style={{ ...inputStyle, resize: "vertical", minHeight: 140 }} />
            </Field>

            <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 24 }}>
              <button type="submit" className="btn btn-fill" style={{ padding: "16px 28px" }}>
                {sent ? t.contactSent : t.contactSend} <span className="arrow">→</span>
              </button>
              {sent && <span className="t-caption" role="status" style={{ color: "var(--accent)" }}>✓ {t.contactSent}</span>}
            </div>
          </form>

          {/* SIDE INFO */}
          <aside>
            <div style={{ background: "var(--bg-soft)", padding: 36, borderRadius: 4 }}>
              <div className="t-eyebrow" style={{ marginBottom: 24 }}>{data.studioLabel}</div>
              {data.address && (
                <div style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.015em", marginBottom: 24 }}>
                  <Lines text={data.address} />
                </div>
              )}
              <hr className="hr" style={{ background: "var(--line)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
                <ContactRow label={t.contactEmailLabel} value={settings.email} />
                {settings.phone && <ContactRow label={t.contactPhoneLabel} value={settings.phone} />}
                {settings.instagram && <ContactRow label="Instagram" value={settings.instagram} />}
                {settings.pinterest && <ContactRow label="Pinterest" value={settings.pinterest} />}
              </div>

              {data.hours && (
                <>
                  <hr className="hr" style={{ background: "var(--line)", marginTop: 32 }} />
                  <div style={{ marginTop: 24 }}>
                    <div className="t-eyebrow" style={{ marginBottom: 12 }}>{data.hoursLabel}</div>
                    <div className="t-body" style={{ fontSize: 14, marginTop: 0 }}>
                      <Lines text={data.hours} />
                    </div>
                  </div>
                </>
              )}
            </div>

            {(data.availabilityText || data.availabilityStatus) && (
              <div style={{ marginTop: 24, padding: 28, border: "1px solid var(--line)", borderRadius: 4 }}>
                <div className="t-eyebrow" style={{ marginBottom: 12 }}>{data.availabilityLabel}</div>
                {data.availabilityText && (
                  <p className="t-body" style={{ marginTop: 0, fontSize: 14 }}>{data.availabilityText}</p>
                )}
                {data.availabilityStatus && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 13, color: "var(--accent)" }}>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }}></span>
                    {data.availabilityStatus}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

/** Multi-line text from a Sanity text field, one <br /> per line break. */
function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
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
