import { perfumes } from "../data/perfumes.data";
import type { Perfume } from "../types";

/**
 * Data-access layer for perfumes.
 *
 * Every function is async so pages already `await` them. To move to a database,
 * replace the bodies with queries (Prisma, Drizzle, Supabase, a REST API, ...)
 * and keep the signatures unchanged.
 */

export async function getAllPerfumes(): Promise<Perfume[]> {
  return perfumes;
}

export async function getFeaturedPerfumes(): Promise<Perfume[]> {
  return perfumes.filter((p) => p.featured);
}

export async function getPerfumeBySlug(slug: string): Promise<Perfume | null> {
  return perfumes.find((p) => p.slug === slug) ?? null;
}

export async function getAllPerfumeSlugs(): Promise<string[]> {
  return perfumes.map((p) => p.slug);
}
