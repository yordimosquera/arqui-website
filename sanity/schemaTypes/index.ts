import type { SchemaTypeDefinition } from "sanity";
import { localeString, localeText } from "./objects/locale";
import { photo } from "./objects/media";
import { seo } from "./objects/seo";
import { project } from "./documents/project";
import { contactPage, homePage, projectsPage, servicesPage, studioPage } from "./singletons/pages";
import { siteSettings, uiStrings } from "./singletons/settings";

export const SINGLETONS = [
  "homePage",
  "projectsPage",
  "studioPage",
  "servicesPage",
  "contactPage",
  "siteSettings",
  "uiStrings",
] as const;

export const schemaTypes: SchemaTypeDefinition[] = [
  // objects
  localeString,
  localeText,
  photo,
  seo,
  // documents
  project,
  // singletons
  homePage,
  projectsPage,
  studioPage,
  servicesPage,
  contactPage,
  siteSettings,
  uiStrings,
];
