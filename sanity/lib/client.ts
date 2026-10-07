import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Published content only; cache is invalidated by the Sanity webhook (phase 3).
  useCdn: true,
  perspective: "published",
});
