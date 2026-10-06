"use client";

// ===========================================
// Sanity Studio — mounted at /studio
// ===========================================
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { esESLocale } from "@sanity/locale-es-es";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes, SINGLETONS } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const singletons = new Set<string>(SINGLETONS);
// Singletons can be edited and published, never created, duplicated or deleted.
const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "default",
  title: "Laura Tejeda — Estudio",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure, title: "Contenido" }),
    esESLocale(),
    // GROQ playground for developers only
    ...(process.env.NODE_ENV === "development" ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => [
      ...templates.filter(({ schemaType }) => !singletons.has(schemaType)),
      {
        id: "project-by-category",
        title: "Proyecto por categoría",
        schemaType: "project",
        parameters: [{ name: "category", type: "string" }],
        value: (params: { category: string }) => ({ category: params.category }),
      },
    ],
  },
  document: {
    actions: (input, context) =>
      singletons.has(context.schemaType) ? input.filter(({ action }) => action && SINGLETON_ACTIONS.has(action)) : input,
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global" ? prev.filter((t) => !singletons.has(t.templateId)) : prev,
  },
});
