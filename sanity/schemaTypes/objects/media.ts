// ===========================================
// Images with alt text, caption and quality guard
// ===========================================
import { defineField, defineType } from "sanity";

const MIN_WIDTH = 1600;

export const photo = defineType({
  name: "photo",
  title: "Foto",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Descripción de la imagen (accesibilidad y Google)",
      description: "Describe lo que se ve, p. ej. «Patio interior con celosía de madera».",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Pie de foto",
      description: "Opcional. Aparece debajo de la imagen en la galería.",
      type: "localeString",
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      const ref = (value as { asset?: { _ref?: string } } | undefined)?.asset?._ref;
      if (!ref) return true;
      // Asset refs look like image-<id>-<width>x<height>-<ext>
      const width = Number(ref.split("-")[2]?.split("x")[0]);
      if (width && width < MIN_WIDTH) {
        return `La imagen mide ${width}px de ancho; usa una de al menos ${MIN_WIDTH}px para que se vea nítida.`;
      }
      return true;
    }),
});
