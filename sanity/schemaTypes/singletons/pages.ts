// ===========================================
// Page singletons — one document per page of the site
// ===========================================
import { defineArrayMember, defineField, defineType } from "sanity";
import { localeStringField, localeTextField } from "../objects/locale";
import { localeAccentField } from "../objects/accent";

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
    { name: "cta", title: "Llamada final" },
    seoGroup,
  ],
  fields: [
    localeStringField("heroEyebrow", "Antetítulo", { group: "hero", maxLength: 48, description: "Ej. Estudio independiente — Barranquilla" }),
    localeStringField("heroLine1", "Título — línea 1", { group: "hero", maxLength: 20 }),
    localeStringField("heroLine2", "Título — línea 2 (en cursiva)", { group: "hero", maxLength: 20 }),
    localeStringField("heroLine3", "Título — línea 3", { group: "hero", maxLength: 20 }),
    localeTextField("heroSub", "Texto bajo el título", { group: "hero", maxLength: 260 }),
    localeStringField("heroStudioButton", "Botón hacia la página Estudio", { group: "hero", maxLength: 28 }),
    defineField({ name: "heroImage", title: "Imagen de portada", type: "photo", group: "hero" }),

    localeStringField("featuredEyebrow", "Antetítulo", { group: "featured", maxLength: 24 }),
    localeAccentField("featuredTitle", "Título", { group: "featured", maxLength: 60 }),
    defineField({
      name: "featuredProjects",
      title: "Proyectos destacados",
      description: "Elige y ordena los proyectos que aparecen en el carrusel y en la selección de la página de inicio.",
      type: "array",
      group: "featured",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (rule) => rule.unique().max(6),
    }),

    localeStringField("manifestoEyebrow", "Antetítulo", { group: "manifesto", maxLength: 24 }),
    localeAccentField("manifestoTitle", "Título", { group: "manifesto", maxLength: 60 }),
    localeTextField("manifestoBody", "Texto", { group: "manifesto", maxLength: 500 }),

    localeStringField("ctaEyebrow", "Antetítulo", { group: "cta", maxLength: 32 }),
    localeAccentField("ctaTitle", "Título", { group: "cta", maxLength: 48 }),
    localeStringField("ctaButton", "Botón hacia Contacto", { group: "cta", maxLength: 28 }),
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
    localeAccentField("title", "Título", { group: "content", maxLength: 40 }),
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
  groups: [
    { name: "content", title: "Presentación", default: true },
    { name: "timeline", title: "Trayectoria" },
    { name: "quote", title: "Cita" },
    { name: "team", title: "Equipo" },
    seoGroup,
  ],
  fields: [
    localeStringField("eyebrow", "Antetítulo", { group: "content", maxLength: 24 }),
    localeAccentField("title", "Título", { group: "content", maxLength: 80 }),
    defineField({ name: "portrait", title: "Retrato", type: "photo", group: "content" }),
    localeStringField("portraitCredit", "Crédito del retrato", { group: "content", maxLength: 48, required: false, description: "Ej. Foto: Federico Ríos · 2024" }),
    defineField({
      name: "body",
      title: "Párrafos",
      description: "Cada elemento es un párrafo. Arrastra para reordenar.",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "localeText" })],
      validation: (rule) => rule.min(1).max(6),
    }),

    localeStringField("timelineTitle", "Título de la sección", { group: "timeline", maxLength: 24 }),
    defineField({
      name: "timeline",
      title: "Hitos",
      description: "Del más reciente al más antiguo. Arrastra para reordenar.",
      type: "array",
      group: "timeline",
      of: [
        defineArrayMember({
          type: "object",
          name: "milestone",
          fields: [
            defineField({ name: "period", title: "Periodo", description: "Ej. 2017–20", type: "string", validation: (r) => r.required().max(12) }),
            localeStringField("text", "Descripción", { maxLength: 80 }),
          ],
          preview: { select: { title: "text.es", subtitle: "period" } },
        }),
      ],
      validation: (rule) => rule.max(12),
    }),

    localeTextField("quote", "Cita", { group: "quote", maxLength: 220, description: "Sin comillas; el diseño las agrega." }),
    localeStringField("quoteSource", "Fuente de la cita", { group: "quote", maxLength: 60, description: "Ej. entrevista para Axxis, 2024" }),

    localeStringField("teamTitle", "Título de la sección", { group: "team", maxLength: 24 }),
    localeTextField("teamIntro", "Introducción", { group: "team", maxLength: 260 }),
    defineField({
      name: "team",
      title: "Personas y aliados",
      type: "array",
      group: "team",
      of: [
        defineArrayMember({
          type: "object",
          name: "member",
          fields: [
            defineField({ name: "name", title: "Nombre", type: "string", validation: (r) => r.required().max(40) }),
            localeStringField("role", "Rol", { maxLength: 40 }),
            defineField({ name: "photo", title: "Foto", type: "photo" }),
          ],
          preview: { select: { title: "name", subtitle: "role.es", media: "photo" } },
        }),
      ],
      validation: (rule) => rule.max(12),
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
    localeAccentField("servicesTitle", "Título", { group: "services", maxLength: 24 }),
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
    localeAccentField("processTitle", "Título", { group: "process", maxLength: 24 }),
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
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "info", title: "Datos del estudio" },
    seoGroup,
  ],
  fields: [
    localeStringField("eyebrow", "Antetítulo", { group: "content", maxLength: 24 }),
    localeAccentField("title", "Título", { group: "content", maxLength: 60 }),
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

    localeStringField("studioLabel", "Título del recuadro", { group: "info", maxLength: 24, description: "Ej. Estudio" }),
    defineField({
      name: "address",
      title: "Dirección",
      description: "Cada línea se muestra en una línea aparte.",
      type: "text",
      rows: 2,
      group: "info",
      validation: (r) => r.max(100),
    }),
    localeStringField("hoursLabel", "Título del horario", { group: "info", maxLength: 24 }),
    localeTextField("hours", "Horario", { group: "info", maxLength: 100, description: "Cada línea se muestra en una línea aparte." }),
    localeStringField("availabilityLabel", "Título de disponibilidad", { group: "info", maxLength: 24, description: "Ej. Calendario" }),
    localeTextField("availabilityText", "Texto de disponibilidad", { group: "info", maxLength: 200 }),
    localeStringField("availabilityStatus", "Estado", { group: "info", maxLength: 48, description: "Ej. Aceptando proyectos para 2026" }),
    seoField,
  ],
  preview: { prepare: () => ({ title: "Contacto" }) },
});
