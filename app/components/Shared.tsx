// ============================================
// Laura Tejeda — Shared UI components
// ============================================
"use client";
import { createContext, Fragment, useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import type { Accent as AccentValue, Photo, SiteSettings, UiStrings } from "@/sanity/lib/queries";
import { activePage, href, LANGS, switchLang, type Lang, type PageId } from "@/app/lib/routes";

// ——— Site context: language, interface strings, studio settings ———
export type SiteContextValue = { lang: Lang; t: UiStrings; settings: SiteSettings };

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ value, children }: { value: SiteContextValue; children: React.ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within a SiteProvider");
  return ctx;
}

const useT = () => useSite().t;

// ——— Title with italic accent words (Portable Text limited to `em` + line breaks) ———
function Accent({ value, emClassName = "italic-accent", emStyle }: { value: AccentValue; emClassName?: string; emStyle?: React.CSSProperties }) {
  const spans = value?.[0]?.children ?? [];
  return (
    <>
      {spans.map((span) => {
        const lines = span.text.split("\n");
        const text = lines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ));
        return span.marks?.includes("em") ? (
          <em key={span._key} className={emClassName || undefined} style={emStyle}>{text}</em>
        ) : (
          <Fragment key={span._key}>{text}</Fragment>
        );
      })}
    </>
  );
}

// ——— Placeholder tones (used until real photos are uploaded) ———
const TONES = ["warm", "cream", "terracotta", "stone", "dark", "olive", "clay", "cool"];
function toneFor(seed: string | number) {
  const n = typeof seed === "number" ? seed : [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
  return TONES[n % TONES.length];
}

// ——— Logo wordmark ———
function Logo({ small }: { small?: boolean }) {
  const { lang, settings } = useSite();
  return (
    <Link href={href(lang, "home")} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
      <span style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: small ? 22 : 26, lineHeight: 1, letterSpacing: "-0.02em" }}>
        {settings.name}
      </span>
      <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.18em", color: "var(--ink-3)", textTransform: "uppercase" }}>
        Estudio
      </span>
    </Link>
  );
}

// ——— Top Nav ———
const NAV_ITEMS: { id: PageId; key: keyof UiStrings }[] = [
  { id: "projects", key: "navProjects" },
  { id: "studio", key: "navAbout" },
  { id: "services", key: "navServices" },
  { id: "contact", key: "navContact" },
];

function Nav() {
  const { lang, t } = useSite();
  const pathname = usePathname();
  const current = activePage(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={href(lang, item.id)}
              aria-current={current === item.id ? "page" : undefined}
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
              {t[item.key]}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {LANGS.map((l, i) => (
              <Fragment key={l}>
                {i > 0 && <span style={{ color: "var(--ink-4)" }}>/</span>}
                <Link href={switchLang(pathname, l)} hrefLang={l} aria-current={lang === l ? "true" : undefined}
                  style={{ color: lang === l ? "var(--ink)" : "var(--ink-4)", fontWeight: lang === l ? 500 : 400 }}>
                  {l.toUpperCase()}
                </Link>
              </Fragment>
            ))}
          </div>
          <button
            className="lt-nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: "none", width: 36, height: 36, alignItems: "center", justifyContent: "center" }}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <svg width="20" height="14" viewBox="0 0 20 14"><line x1="0" y1="2" x2="20" y2="2" stroke="currentColor" strokeWidth="1.5" /><line x1="0" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lt-nav-mobile" style={{ background: "var(--bg)", borderTop: "1px solid var(--line-soft)", padding: "20px 0" }}>
          <div className="container" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.id} href={href(lang, item.id)} onClick={() => setMobileOpen(false)} style={{ fontFamily: "var(--display)", fontSize: 28, fontStyle: "italic", color: current === item.id ? "var(--accent)" : "var(--ink)" }}>{t[item.key]}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

// ——— Footer ———
function Footer() {
  const { lang, t, settings } = useSite();
  const [first, ...rest] = settings.name.split(" ");
  return (
    <footer style={{ background: "var(--ink)", color: "var(--bg)", marginTop: 120 }}>
      <div className="container" style={{ paddingTop: 96, paddingBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 60, alignItems: "start" }} className="lt-footer-grid">
          <div>
            <div style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 0.95, letterSpacing: "-0.02em" }}>
              {first}{rest.length > 0 && <><br />{rest.join(" ")}</>}
            </div>
            <p style={{ marginTop: 24, fontSize: 14, color: "rgba(245,239,230,0.65)", maxWidth: 320, lineHeight: 1.6 }}>
              {t.footerNote}
            </p>
          </div>

          <div>
            <div className="t-meta" style={{ color: "rgba(245,239,230,0.5)", marginBottom: 18 }}>{t.footerNavTitle}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}><Link href={href(lang, item.id)} style={{ fontSize: 15, color: "rgba(245,239,230,0.85)" }}>{t[item.key]}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="t-meta" style={{ color: "rgba(245,239,230,0.5)", marginBottom: 18 }}>{t.footerContactTitle}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 15, color: "rgba(245,239,230,0.85)" }}>
              <li>{settings.email}</li>
              {settings.phone && <li>{settings.phone}</li>}
              {settings.location && <li>{settings.location}</li>}
            </ul>
          </div>

          <div>
            <div className="t-meta" style={{ color: "rgba(245,239,230,0.5)", marginBottom: 18 }}>{t.footerFollowTitle}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 15, color: "rgba(245,239,230,0.85)" }}>
              {settings.instagram && <li>Instagram — {settings.instagram}</li>}
              {settings.pinterest && <li>Pinterest — {settings.pinterest}</li>}
            </ul>
          </div>
        </div>

        <hr style={{ height: 1, background: "rgba(245,239,230,0.12)", border: 0, marginTop: 80 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, fontSize: 12, color: "rgba(245,239,230,0.5)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span>© {new Date().getFullYear()} {settings.name}</span>
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

// ——— Sanity photo, falling back to a placeholder until one is uploaded ———
type MediaProps = PlaceholderProps & {
  image: Photo | undefined;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
};

function Media({ image, sizes = "100vw", priority, fit = "cover", tone, label, ratio = "4/5", style, children }: MediaProps) {
  if (!image?.asset) {
    return <Placeholder tone={tone} label={label} ratio={ratio} style={style}>{children}</Placeholder>;
  }
  const { x = 0.5, y = 0.5 } = image.hotspot ?? {};
  return (
    <div className="ph" style={{ aspectRatio: ratio, ...style }}>
      <Image
        src={urlFor(image).url()}
        loader={({ width, quality }) => urlFor(image).width(width).quality(quality ?? 75).url()}
        alt={image.alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={image.lqip ? "blur" : "empty"}
        blurDataURL={image.lqip ?? undefined}
        style={{ objectFit: fit, objectPosition: `${x * 100}% ${y * 100}%` }}
      />
      {children}
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export { useT, Accent, toneFor, pad, Nav, Footer, Logo, Placeholder, Media };
export const LT = { useT, Accent, Nav, Footer, Logo, Placeholder, Media };
