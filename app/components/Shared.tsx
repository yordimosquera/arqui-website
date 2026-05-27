// ============================================
// Laura Tejeda — Shared UI components
// ============================================
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { CONTENT } from "@/app/content";


// ——— I18n hook ———
export type Lang = "es" | "en";
export type CopyDict = (typeof CONTENT.copy)[Lang];
export type LocalizedString = string | { es?: string; en?: string } | null | undefined;
export type Project = (typeof CONTENT.projects)[number];
export type GalleryItem = Project["gallery"][number];
export type ServiceItem = (typeof CONTENT.services)[number];
export type ProcessItem = (typeof CONTENT.process)[number];
export type PressItem = (typeof CONTENT.press)[number];

// ——— App context: language + navigation ———
export type LTContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  onNav: (id: string) => void;
  onOpenProject: (id: string) => void;
};

const LTContext = createContext<LTContextValue | null>(null);

export function LTProvider({ value, children }: { value: LTContextValue; children: React.ReactNode }) {
  return <LTContext.Provider value={value}>{children}</LTContext.Provider>;
}

export function useLT(): LTContextValue {
  const ctx = useContext(LTContext);
  if (!ctx) throw new Error("useLT must be used within an LTProvider");
  return ctx;
}

function useT(): CopyDict {
  const { lang } = useLT();
  return CONTENT.copy[lang];
}
function pick(obj: LocalizedString, lang: string) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return (obj as Record<string, string>)[lang] || obj.es || "";
}

// ——— Logo wordmark ———
function Logo({ small }: { small?: boolean }) {
  const { onNav } = useLT();
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onNav("home"); }} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
      <span style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: small ? 22 : 26, lineHeight: 1, letterSpacing: "-0.02em" }}>
        Laura Tejeda
      </span>
      <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-3)", textTransform: "uppercase" }}>
        Estudio
      </span>
    </a>
  );
}

// ——— Top Nav ———
function Nav({ current, lang, onLang, onNav }: { current: string; lang: Lang; onLang: (v: Lang) => void; onNav: (id: string) => void }) {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { id: "architecture", label: t.navArch },
    { id: "interiors", label: t.navInt },
    { id: "studio", label: t.navAbout },
    { id: "services", label: t.navServices },
    { id: "contact", label: t.navContact },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        backdropFilter: scrolled ? "blur(14px)" : "none",
        background: scrolled ? "rgba(245, 239, 230, 0.78)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--line-soft)" : "1px solid transparent",
        transition: "all 280ms var(--ease)",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <Logo small={scrolled} />

        <nav style={{ display: "flex", alignItems: "center", gap: 36 }} className="lt-nav-desktop">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => { e.preventDefault(); onNav(item.id); }}
              style={{
                fontSize: 14,
                color: current === item.id ? "var(--ink)" : "var(--ink-2)",
                fontWeight: current === item.id ? 500 : 400,
                position: "relative",
                paddingBottom: 4,
                borderBottom: current === item.id ? "1px solid var(--ink)" : "1px solid transparent",
                transition: "border-color 240ms var(--ease)",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <button onClick={() => onLang("es")} style={{ color: lang === "es" ? "var(--ink)" : "var(--ink-4)", fontWeight: lang === "es" ? 500 : 400 }}>ES</button>
            <span style={{ color: "var(--ink-4)" }}>/</span>
            <button onClick={() => onLang("en")} style={{ color: lang === "en" ? "var(--ink)" : "var(--ink-4)", fontWeight: lang === "en" ? 500 : 400 }}>EN</button>
          </div>
          <button
            className="lt-nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: "none", width: 36, height: 36, alignItems: "center", justifyContent: "center" }}
            aria-label="Menu"
          >
            <svg width="20" height="14" viewBox="0 0 20 14"><line x1="0" y1="2" x2="20" y2="2" stroke="currentColor" strokeWidth="1.5" /><line x1="0" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lt-nav-mobile" style={{ background: "var(--bg)", borderTop: "1px solid var(--line-soft)", padding: "20px 0" }}>
          <div className="container" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {items.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={(e) => { e.preventDefault(); onNav(item.id); setMobileOpen(false); }} style={{ fontFamily: "var(--display)", fontSize: 28, fontStyle: "italic", color: current === item.id ? "var(--accent)" : "var(--ink)" }}>{item.label}</a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

// ——— Footer ———
function Footer({ onNav }: { onNav: (id: string) => void }) {
  const t = useT();
  const { lang } = useLT();
  const navLabels: Record<string, keyof CopyDict> = { architecture: "navArch", interiors: "navInt", studio: "navAbout", services: "navServices", contact: "navContact" };
  return (
    <footer style={{ background: "var(--ink)", color: "var(--bg)", marginTop: 120 }}>
      <div className="container" style={{ paddingTop: 96, paddingBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 60, alignItems: "start" }} className="lt-footer-grid">
          <div>
            <div style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 0.95, letterSpacing: "-0.02em" }}>
              Laura<br />Tejeda
            </div>
            <p style={{ marginTop: 24, fontSize: 14, color: "rgba(245,239,230,0.65)", maxWidth: 320, lineHeight: 1.6 }}>
              {t.footerNote}
            </p>
          </div>

          <div>
            <div className="t-meta" style={{ color: "rgba(245,239,230,0.5)", marginBottom: 18 }}>{lang === "es" ? "Navegación" : "Navigation"}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {["architecture", "interiors", "studio", "services", "contact"].map(id => (
                <li key={id}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); onNav(id); }} style={{ fontSize: 15, color: "rgba(245,239,230,0.85)" }}>{t[navLabels[id]]}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="t-meta" style={{ color: "rgba(245,239,230,0.5)", marginBottom: 18 }}>{lang === "es" ? "Contacto" : "Contact"}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 15, color: "rgba(245,239,230,0.85)" }}>
              <li>{CONTENT.brand.email}</li>
              <li>{CONTENT.brand.phone}</li>
              <li>{CONTENT.brand.location}</li>
            </ul>
          </div>

          <div>
            <div className="t-meta" style={{ color: "rgba(245,239,230,0.5)", marginBottom: 18 }}>{lang === "es" ? "Síguenos" : "Follow"}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 15, color: "rgba(245,239,230,0.85)" }}>
              <li>Instagram — {CONTENT.brand.instagram}</li>
              <li>Pinterest — {CONTENT.brand.pinterest}</li>
            </ul>
          </div>
        </div>

        <hr style={{ height: 1, background: "rgba(245,239,230,0.12)", border: 0, marginTop: 80 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, fontSize: 12, color: "rgba(245,239,230,0.5)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span>© {new Date().getFullYear()} Laura Tejeda</span>
          <span>{t.footerRights}</span>
        </div>
      </div>
    </footer>
  );
}

// ——— Image placeholder with architectural overlay ———
type PlaceholderProps = {
  tone?: string;
  label?: string;
  ratio?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

function Placeholder({ tone = "warm", label, ratio = "4/5", style, children }: PlaceholderProps) {
  return (
    <div className="ph" data-tone={tone} style={{ aspectRatio: ratio, ...style }}>
      <div className="ph-arch">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.2" strokeDasharray="0.5 0.5" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.2" strokeDasharray="0.5 0.5" />
          <rect x="20" y="20" width="60" height="60" fill="none" stroke="white" strokeWidth="0.2" />
        </svg>
      </div>
      {label && <div className="ph-mark">{label}</div>}
      {children}
    </div>
  );
}

export { useT, pick, Nav, Footer, Logo, Placeholder };
export const LT = { useT, pick, Nav, Footer, Logo, Placeholder };
