// ===========================================
// Bilingual fields (ES required, EN recommended)
// ===========================================
import { defineField, defineType } from "sanity";

type LocaleOptions = { maxLength?: number; optional?: boolean };

function localeFields(kind: "string" | "text", { maxLength, optional }: LocaleOptions = {}) {
  const rows = kind === "text" ? 4 : undefined;
  return [
    defineField({
      name: "es",
      title: "Español",
      type: kind,
      rows,
      validation: (rule) => {
        let r = optional ? rule : rule.required().error("El texto en español es obligatorio.");
        if (maxLength) r = r.max(maxLength).error(`Máximo ${maxLength} caracteres para que no se desborde el diseño.`);
        return r;
      },
    }),
    defineField({
      name: "en",
      title: "English",
      type: kind,
      rows,
      validation: (rule) => {
        let r = optional ? rule : rule.required().warning("Falta la traducción al inglés; se mostrará el texto en español.");
        if (maxLength) r = r.max(maxLength).error(`Máximo ${maxLength} caracteres para que no se desborde el diseño.`);
        return r;
      },
    }),
  ];
}

export const localeString = defineType({
  name: "localeString",
  title: "Texto (ES / EN)",
  type: "object",
  options: { columns: 2 },
  fields: localeFields("string"),
});

/** Same as localeString, but both languages may be left empty. */
export const optionalLocaleString = defineType({
  name: "optionalLocaleString",
  title: "Texto opcional (ES / EN)",
  type: "object",
  options: { columns: 2 },
  fields: localeFields("string", { optional: true }),
});

export const localeText = defineType({
  name: "localeText",
  title: "Párrafo (ES / EN)",
  type: "object",
  fields: localeFields("text"),
});

/**
 * Helper for a bilingual field with a character limit.
 * Usage: localeStringField("heroLine1", "Línea 1", { maxLength: 24 })
 */
export function localeStringField(
  name: string,
  title: string,
  opts: LocaleOptions & { description?: string; group?: string; required?: boolean } = {},
) {
  return defineField({
    name,
    title,
    description: opts.description,
    group: opts.group,
    type: "object",
    options: { columns: 2 },
    fields: localeFields("string", opts),
    validation: opts.required === false ? undefined : (rule) => rule.required(),
  });
}

export function localeTextField(
  name: string,
  title: string,
  opts: LocaleOptions & { description?: string; group?: string; required?: boolean } = {},
) {
  return defineField({
    name,
    title,
    description: opts.description,
    group: opts.group,
    type: "object",
    fields: localeFields("text", opts),
    validation: opts.required === false ? undefined : (rule) => rule.required(),
  });
}
