import type { Accent } from "@/sanity/lib/queries";

/** Plain text of an accent title (for metadata, aria labels, etc.). */
export const accentText = (value: Accent) =>
  (value?.[0]?.children ?? []).map((s) => s.text).join("").replace(/\n/g, " ");
