import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/** Cache tag shared by every Sanity query; the webhook (phase 4) revalidates it on publish. */
export const SANITY_TAG = "sanity";

export function sanityFetch<T>(query: string, params: QueryParams = {}) {
  return client.fetch<T>(query, params, { next: { revalidate: 60, tags: [SANITY_TAG] } });
}
