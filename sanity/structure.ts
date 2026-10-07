// ===========================================
// Studio sidebar — organised in Laura's terms
// ===========================================
import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { CATEGORIES } from "./schemaTypes/documents/project";

function singleton(S: StructureBuilder, type: string, title: string) {
  return S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title));
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Páginas")
        .child(
          S.list()
            .title("Páginas")
            .items([
              singleton(S, "homePage", "Inicio"),
              singleton(S, "projectsPage", "Proyectos"),
              singleton(S, "studioPage", "Estudio"),
              singleton(S, "servicesPage", "Servicios"),
              singleton(S, "contactPage", "Contacto"),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Proyectos")
        .child(
          S.list()
            .title("Proyectos")
            .items([
              S.documentTypeListItem("project").title("Todos los proyectos"),
              ...CATEGORIES.map((c) =>
                S.listItem()
                  .title(c.title)
                  .id(c.value)
                  .child(
                    S.documentList()
                      .title(c.title)
                      .schemaType("project")
                      .filter('_type == "project" && category == $category')
                      .params({ category: c.value })
                      .initialValueTemplates([S.initialValueTemplateItem("project-by-category", { category: c.value })]),
                  ),
              ),
            ]),
        ),
      S.divider(),
      singleton(S, "siteSettings", "Configuración general"),
      singleton(S, "uiStrings", "Textos del sitio"),
    ]);
