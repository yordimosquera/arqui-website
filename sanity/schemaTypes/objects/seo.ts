import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO y redes sociales",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Título en Google",
      description: "Si se deja vacío se usa el título de la página.",
      type: "localeString",
    }),
    defineField({
      name: "description",
      title: "Descripción en Google",
      description: "Idealmente entre 120 y 160 caracteres.",
      type: "localeText",
    }),
    defineField({
      name: "image",
      title: "Imagen al compartir en redes",
      description: "Recomendado 1200 × 630 px.",
      type: "image",
    }),
  ],
});
