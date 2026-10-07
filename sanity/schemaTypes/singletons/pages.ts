// ===========================================
// Page singletons — one document per page of the site
// ===========================================
import { defineArrayMember, defineField, defineType } from "sanity";
import { localeStringField, localeTextField } from "../objects/locale";

const seoField = defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" });
const seoGroup = { name: "seo", title: "SEO" };

export const homePage = defineType({
  name: "homePage",
  title: "Inicio",
  type: "document",
  groups: [
    { name: "hero", title: "Portada", default: true },
    { name: "featured", title: "Proyectos destacados" },
    { name: "manifesto", title: "Manifiesto" },
    { name: "press", title: "Prensa" },
    seoGroup,
  ],
  fields: [
    localeStringField("tagline", "Profesión", { group: "hero", maxLength: 40, description: "Ej. Arquitecta e interiorista" }),
    localeStringField("heroLine1", "Título — línea 1", { group: "hero", maxLength: 20 }),
    localeStringField("heroLine2", "Título — línea 2", { group: "hero", maxLength: 20 }),
    localeStringField("heroLine3", "Título — línea 3", { group: "hero", maxLength: 20 }),
    localeTextField("heroSub", "Texto bajo el título", { group: "hero", maxLength: 260 }),
    defineField({ name: "heroImage", title: "Imagen de portada", type: "photo", group: "hero" }),

    localeStringField("featuredEyebrow", "Antetítulo", { group: "featured", maxLength: 24 }),
    defineField({
      name: "featuredProjects",
      title: "Proyectos destacados",
      description: "Elige y ordena los proyectos que aparecen en la página de inicio.",
      type: "array",
      group: "featured",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (rule) => rule.unique().max(6),
    }),

    localeStringField("manifestoEyebrow", "Antetítulo", { group: "manifesto", maxLength: 24 }),
    localeStringField("manifestoTitle", "Título", { group: "manifesto", maxLength: 60 }),
    localeTextField("manifestoBody", "Texto", { group: "manifesto", maxLength: 500 }),

    defineField({
      name: "press",
      title: "Prensa y reconocimientos",
      type: "array",
      group: "press",
      of: [
        defineArrayMember({
          type: "object",
          name: "pressItem",
          fields: [
            defineField({ name: "source", title: "Medio o premio", type: "string", validation: (r) => r.required() }),
            defineField({ name: "year", title: "Año", type: "string", validation: (r) => r.required().regex(/^\d{4}$/, { name: "año" }) }),
            localeStringField("title", "Título"),
            defineField({ name: "url", title: "Enlace (opcional)", type: "url" }),
          ],
          preview: { select: { title: "source", subtitle: "year" } },
        }),
      ],
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Inicio" }) },
});

export const projectsPage = defineType({
  name: "projectsPage",
  title: "Proyectos (página)",
  type: "document",
  groups: [{ name: "content", title: "Contenido", default: true }, seoGroup],
  fields: [
    localeStringField("eyebrow", "Antetítulo", { group: "content", maxLength: 24 }),
    localeStringField("title", "Título", { group: "content", maxLength: 40 }),
    localeTextField("intro", "Introducción", { group: "content", maxLength: 200 }),
    localeStringField("residentialTitle", "Segmento residencial — título", { group: "content", maxLength: 30 }),
    localeTextField("residentialIntro", "Segmento residencial — texto", { group: "content", maxLength: 160 }),
    localeStringField("commercialTitle", "Segmento comercial — título", { group: "content", maxLength: 30 }),
    localeTextField("commercialIntro", "Segmento comercial — texto", { group: "content", maxLength: 160 }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Proyectos" }) },
});

export const studioPage = defineType({
  name: "studioPage",
  title: "Estudio",
  type: "document",
  groups: [{ name: "content", title: "Contenido", default: true }, seoGroup],
  fields: [
    localeStringField("eyebrow", "Antetítulo", { group: "content", maxLength: 24 }),
    localeStringField("title", "Título", { group: "content", maxLength: 80 }),
    defineField({ name: "portrait", title: "Retrato", type: "photo", group: "content" }),
    defineField({
      name: "body",
      title: "Párrafos",
      description: "Cada elemento es un párrafo. Arrastra para reordenar.",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "localeText" })],
      validation: (rule) => rule.min(1).max(6),
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Estudio" }) },
});

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Servicios",
  type: "document",
  groups: [
    { name: "services", title: "Servicios", default: true },
    { name: "process", title: "Proceso" },
    seoGroup,
  ],
  fields: [
    localeStringField("servicesEyebrow", "Antetítulo", { group: "services", maxLength: 24 }),
    localeStringField("servicesTitle", "Título", { group: "services", maxLength: 40 }),
    localeTextField("servicesIntro", "Introducción", { group: "services", maxLength: 220 }),
    defineField({
      name: "services",
      title: "Servicios",
      description: "Se numeran automáticamente según el orden.",
      type: "array",
      group: "services",
      of: [
        defineArrayMember({
          type: "object",
          name: "service",
          fields: [localeStringField("title", "Nombre", { maxLength: 40 }), localeTextField("body", "Descripción", { maxLength: 300 })],
          preview: { select: { title: "title.es" } },
        }),
      ],
      validation: (rule) => rule.min(1).max(8),
    }),

    localeStringField("processEyebrow", "Antetítulo", { group: "process", maxLength: 24 }),
    localeStringField("processTitle", "Título", { group: "process", maxLength: 40 }),
    localeTextField("processIntro", "Introducción", { group: "process", maxLength: 220 }),
    defineField({
      name: "process",
      title: "Etapas",
      description: "Se numeran automáticamente según el orden.",
      type: "array",
      group: "process",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            localeStringField("title", "Nombre", { maxLength: 40 }),
            localeTextField("body", "Descripción", { maxLength: 300 }),
            localeStringField("duration", "Duración", { maxLength: 20, description: "Ej. 2–3 semanas" }),
          ],
          preview: { select: { title: "title.es", subtitle: "duration.es" } },
        }),
      ],
      validation: (rule) => rule.min(1).max(8),
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Servicios" }) },
});

export const contactPage = defineType({
  name: "contactPage",
  title: "Contacto",
  type: "document",
  groups: [{ name: "content", title: "Contenido", default: true }, seoGroup],
  fields: [
    localeStringField("eyebrow", "Antetítulo", { group: "content", maxLength: 24 }),
    localeStringField("title", "Título", { group: "content", maxLength: 60 }),
    localeTextField("body", "Texto", { group: "content", maxLength: 240 }),
    defineField({
      name: "subjects",
      title: "Tipos de proyecto (opciones del formulario)",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "subject",
          fields: [localeStringField("label", "Opción", { maxLength: 40 })],
          preview: { select: { title: "label.es" } },
        }),
      ],
      validation: (rule) => rule.min(1).max(8),
    }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Contacto" }) },
});
