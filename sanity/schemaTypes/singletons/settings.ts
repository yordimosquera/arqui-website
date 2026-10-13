// ===========================================
// Global settings + interface strings
// ===========================================
import { defineField, defineType } from "sanity";
import { localeStringField } from "../objects/locale";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Configuración general",
  type: "document",
  groups: [
    { name: "brand", title: "Marca", default: true },
    { name: "contact", title: "Contacto y redes" },
    { name: "seo", title: "SEO por defecto" },
  ],
  fields: [
    defineField({ name: "name", title: "Nombre del estudio", type: "string", group: "brand", validation: (r) => r.required() }),
    defineField({ name: "initials", title: "Iniciales (logo)", type: "string", group: "brand", validation: (r) => r.required().max(3) }),
    defineField({ name: "location", title: "Ciudad", type: "string", group: "brand" }),

    defineField({ name: "email", title: "Correo", type: "email", group: "contact", validation: (r) => r.required() }),
    defineField({ name: "phone", title: "Teléfono", type: "string", group: "contact" }),
    defineField({ name: "instagram", title: "Instagram (usuario)", description: "Ej. @laura.tejeda.estudio", type: "string", group: "contact" }),
    defineField({ name: "pinterest", title: "Pinterest (usuario)", type: "string", group: "contact" }),

    defineField({
      name: "seo",
      title: "SEO por defecto",
      description: "Se usa en las páginas que no tienen su propio SEO.",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: { prepare: () => ({ title: "Configuración general" }) },
});

// key → [label in Studio, max length]
const UI_STRINGS = {
  nav: {
    title: "Menú",
    fields: {
      navProjects: ["Proyectos", 20],
      navAbout: ["Estudio", 20],
      navServices: ["Servicios", 20],
      navContact: ["Contacto", 20],
    },
  },
  buttons: {
    title: "Botones y enlaces",
    fields: {
      ctaViewProject: ["Ver proyecto", 24],
      detailBack: ["Volver", 20],
      detailNext: ["Siguiente proyecto", 32],
      continueTo: ["«Continuar a» (al final del listado de proyectos)", 24],
      viewPrefix: ["«Ver» (tarjetas de segmento en Inicio)", 12],
    },
  },
  form: {
    title: "Formulario de contacto",
    fields: {
      contactNameLabel: ["Etiqueta nombre", 24],
      contactEmailLabel: ["Etiqueta correo", 24],
      contactPhoneLabel: ["Etiqueta teléfono", 24],
      contactSubjectLabel: ["Etiqueta tipo de proyecto", 32],
      contactMessageLabel: ["Etiqueta mensaje", 24],
      contactNamePlaceholder: ["Campo nombre", 40],
      contactEmailPlaceholder: ["Campo correo", 40],
      contactPhonePlaceholder: ["Campo teléfono", 40],
      contactMessagePlaceholder: ["Campo mensaje", 80],
      contactSend: ["Botón enviar", 24],
      contactSent: ["Mensaje de confirmación", 60],
    },
  },
  project: {
    title: "Ficha de proyecto",
    fields: {
      detailSpecs: ["Título de la ficha", 20],
      detailLocation: ["Ubicación", 20],
      detailYear: ["Año", 20],
      detailType: ["Tipología", 20],
      detailArea: ["Área", 20],
      detailStatus: ["Estado", 20],
      detailRole: ["Rol", 20],
      detailTeam: ["Equipo", 20],
      detailPhotos: ["Fotografía", 20],
      detailAbout: ["Sobre el proyecto", 32],
    },
  },
  labels: {
    title: "Etiquetas generales",
    fields: {
      categoryArchitecture: ["Categoría arquitectura", 24],
      categoryInteriors: ["Categoría interiorismo", 24],
      projectsCount: ["Palabra tras el número de proyectos", 16],
      processDuration: ["«Duración» en las etapas del proceso", 20],
    },
  },
  footer: {
    title: "Pie de página",
    fields: {
      footerNote: ["Nota", 90],
      footerRights: ["Derechos", 50],
      footerNavTitle: ["Título navegación", 24],
      footerContactTitle: ["Título contacto", 24],
      footerFollowTitle: ["Título redes", 24],
    },
  },
} as const;

export type UiStringKey = {
  [G in keyof typeof UI_STRINGS]: keyof (typeof UI_STRINGS)[G]["fields"];
}[keyof typeof UI_STRINGS];

export const uiStrings = defineType({
  name: "uiStrings",
  title: "Textos del sitio",
  type: "document",
  groups: Object.entries(UI_STRINGS).map(([name, g], i) => ({ name, title: g.title, default: i === 0 })),
  fields: Object.entries(UI_STRINGS).flatMap(([group, g]) =>
    Object.entries(g.fields).map(([key, [label, maxLength]]) => localeStringField(key, label, { group, maxLength })),
  ),
  preview: { prepare: () => ({ title: "Textos del sitio" }) },
});
