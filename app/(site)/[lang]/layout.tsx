import "@/styles/tokens.css";
import "../../globals.css";
import type { Metadata } from "next";
import { SiteProvider, Nav, Footer } from "@/app/components/Shared";
import { getLang, getSite, SITE_URL } from "@/app/lib/site";
import { LANGS } from "@/app/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const lang = await getLang(params);
  const { settings, t } = await getSite(lang);
  const defaultTitle = settings.seo?.title || settings.name;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: defaultTitle, template: `%s — ${settings.name}` },
    description: settings.seo?.description || t.footerNote,
  };
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = await getLang(params);
  const { settings, t } = await getSite(lang);

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteProvider value={{ lang, t, settings }}>
          <Nav />
          {children}
          <Footer />
        </SiteProvider>
      </body>
    </html>
  );
}
