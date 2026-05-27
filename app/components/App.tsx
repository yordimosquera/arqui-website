// ============================================
// Laura Tejeda — App root + router
// ============================================
"use client";
import { useState, useEffect, useSyncExternalStore } from "react";
import { CONTENT } from "@/app/content";
import { LT, LTProvider, type Lang } from "./Shared";
import { Home } from "./Home";
import { ProjectIndex } from "./Projects";
import { ProjectDetail } from "./Detail";
import { Studio, ServicesPage } from "./Studio";
import { Contact } from "./Contact";

type Route = { name: string; projectId?: string | null };

// ——— Language store (persisted in localStorage, SSR-safe) ———
const langListeners = new Set<() => void>();
function subscribeLang(cb: () => void) {
  window.addEventListener("storage", cb);
  langListeners.add(cb);
  return () => {
    window.removeEventListener("storage", cb);
    langListeners.delete(cb);
  };
}
function getLangSnapshot(): Lang {
  return localStorage.getItem("lt_lang") === "en" ? "en" : "es";
}
function getLangServerSnapshot(): Lang {
  return "es";
}
function persistLang(l: Lang) {
  localStorage.setItem("lt_lang", l);
  langListeners.forEach((fn) => fn());
}

export default function App() {
  const lang = useSyncExternalStore(subscribeLang, getLangSnapshot, getLangServerSnapshot);
  const setLang = persistLang;
  const [route, setRoute] = useState<Route>({ name: "home", projectId: null });

  // reflect language on the document
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [route]);

  const onNav = (id: string) => {
    if (id === "home") setRoute({ name: "home" });
    else if (id === "architecture") setRoute({ name: "architecture" });
    else if (id === "interiors") setRoute({ name: "interiors" });
    else if (id === "studio") setRoute({ name: "studio" });
    else if (id === "services") setRoute({ name: "services" });
    else if (id === "contact") setRoute({ name: "contact" });
  };
  const onOpenProject = (id: string) => setRoute({ name: "project", projectId: id });

  const currentNavId = route.name === "project"
    ? CONTENT.projects.find((p) => p.id === route.projectId)?.category || "home"
    : route.name;

  return (
    <LTProvider value={{ lang, setLang, onNav, onOpenProject }}>
      <div data-screen-label={`Laura Tejeda — ${route.name}`}>
        <LT.Nav current={currentNavId} lang={lang} onLang={setLang} onNav={onNav} />

        <div key={`${route.name}-${route.projectId}-${lang}`} className="fade-in">
          {route.name === "home" && <Home onNav={onNav} onOpenProject={onOpenProject} />}
          {route.name === "architecture" && <ProjectIndex category="architecture" onNav={onNav} onOpenProject={onOpenProject} />}
          {route.name === "interiors" && <ProjectIndex category="interiors" onNav={onNav} onOpenProject={onOpenProject} />}
          {route.name === "project" && <ProjectDetail projectId={route.projectId} onNav={onNav} onOpenProject={onOpenProject} />}
          {route.name === "studio" && <Studio />}
          {route.name === "services" && <ServicesPage />}
          {route.name === "contact" && <Contact />}
        </div>

        <LT.Footer onNav={onNav} />
      </div>
    </LTProvider>
  );
}
