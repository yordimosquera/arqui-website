// ===========================================
// Accent titles — plain text where Laura can only mark words in *italic*
// (rendered with the terracotta .italic-accent style) and add line breaks
// with Shift + Enter. No headings, lists or links.
// ===========================================
import { defineArrayMember, defineField, type PortableTextBlock } from "sanity";

const accentBlock = defineArrayMember({
  type: "block",
  styles: [{ title: "Normal", value: "normal" }],
  lists: [],
  marks: { decorators: [{ title: "Cursiva (acento)", value: "em" }], annotations: [] },
});

function plainLength(blocks: PortableTextBlock[] | undefined) {
  return (blocks ?? [])
    .flatMap((b) => (Array.isArray(b.children) ? b.children : []))
    .map((c) => (typeof c.text === "string" ? c.text.length : 0))
    .reduce((a, n) => a + n, 0);
}

function accentLanguageField(name: "es" | "en", title: string, maxLength?: number) {
  return defineField({
    name,
    title,
    type: "array",
    of: [accentBlock],
    validation: (rule) =>
      rule.custom((value: PortableTextBlock[] | undefined) => {
        const len = plainLength(value);
        if (!len) {
          return name === "es"
            ? "El texto en español es obligatorio."
            : { message: "Falta la traducción al inglés; se mostrará el texto en español.", level: "warning" };
        }
        if ((value?.length ?? 0) > 1) return "Usa un solo párrafo; para cambiar de línea usa Shift + Enter.";
        if (maxLength && len > maxLength) return `Máximo ${maxLength} caracteres para que no se desborde el diseño.`;
        return true;
      }),
  });
}

/**
 * Bilingual title where selected words render in the italic accent style.
 * Usage: localeAccentField("title", "Título", { maxLength: 60 })
 */
export function localeAccentField(
  name: string,
  title: string,
  opts: { maxLength?: number; description?: string; group?: string } = {},
) {
  return defineField({
    name,
    title,
    description:
      opts.description ?? "Selecciona una palabra y presiona Ctrl/⌘ + I para ponerla en cursiva. Shift + Enter cambia de línea.",
    group: opts.group,
    type: "object",
    fields: [accentLanguageField("es", "Español", opts.maxLength), accentLanguageField("en", "English", opts.maxLength)],
    validation: (rule) => rule.required(),
  });
}
