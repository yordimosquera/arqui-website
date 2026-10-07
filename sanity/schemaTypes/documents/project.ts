import { defineArrayMember, defineField, defineType } from "sanity";
import { localeStringField, localeTextField } from "../objects/locale";

export const CATEGORIES = [
  { title: "Arquitectura", value: "architecture" },
  { title: "Interiorismo", value: "interiors" },
];

export const SEGMENTS = [
  { title: "Residencial", value: "residential" },
  { title: "Comercial", value: "commercial" },
];

export const project = defineType({
  name: "project",
  title: "Proyecto",
  type: "document",
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "details", title: "Ficha técnica" },
    { name: "images", title: "Imágenes" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    localeStringField("title", "Nombre del proyecto", { group: "content", maxLength: 40 }),
    defineField({
      name: "slug",
      title: "Dirección web",
      description: "Se genera a partir del nombre. Cambiarla rompe los enlaces ya compartidos.",
      type: "slug",
      group: "content",
      options: { source: "title.es", maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      group: "content",
      options: { list: CATEGORIES, layout: "radio", direction: "horizontal" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "segment",
      title: "Segmento",
      type: "string",
      group: "content",
      options: { list: SEGMENTS, layout: "radio", direction: "horizontal" },
      validation: (rule) => rule.required(),
    }),
    localeStringField("subtitle", "Frase corta", {
      group: "content",
      maxLength: 90,
      description: "Una línea que resume el proyecto. Aparece bajo el título.",
    }),
    localeTextField("about", "Sobre el proyecto", { group: "content" }),

    defineField({ name: "location", title: "Ubicación", type: "string", group: "details", validation: (r) => r.required() }),
    defineField({ name: "year", title: "Año", type: "string", group: "details", validation: (r) => r.required().regex(/^\d{4}$/, { name: "año" }) }),
    defineField({ name: "area", title: "Área", description: "Ej. 320 m²", type: "string", group: "details" }),
    localeStringField("type", "Tipología", { group: "details", description: "Ej. Vivienda unifamiliar" }),
    localeStringField("status", "Estado", { group: "details", description: "Ej. Construido, En obra" }),
    localeStringField("role", "Rol", { group: "details" }),
    localeStringField("team", "Equipo", { group: "details", required: false }),
    defineField({ name: "photos", title: "Fotografía (crédito)", type: "string", group: "details" }),

    defineField({
      name: "coverImage",
      title: "Imagen de portada",
      description: "Se usa en el listado y en la parte superior del proyecto.",
      type: "photo",
      group: "images",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Galería",
      description: "Arrastra las fotos para cambiar el orden.",
      type: "array",
      group: "images",
      of: [defineArrayMember({ type: "photo" })],
      options: { layout: "grid" },
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    { title: "Año (más reciente)", name: "yearDesc", by: [{ field: "year", direction: "desc" }] },
    { title: "Nombre", name: "titleAsc", by: [{ field: "title.es", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title.es", year: "year", category: "category", media: "coverImage" },
    prepare({ title, year, category, media }) {
      const cat = CATEGORIES.find((c) => c.value === category)?.title;
      return { title, subtitle: [cat, year].filter(Boolean).join(" · "), media };
    },
  },
});
