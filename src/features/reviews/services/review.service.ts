import type { Perfume } from "@/features/perfumes/types";
import { reviews } from "../data/reviews.data";
import type { RatingSummary, Review } from "../types";

/**
 * Data-access layer for reviews. Swap the bodies for database queries later;
 * keep the signatures so the UI does not change.
 */

export async function getReviewsByPerfumeId(perfumeId: string): Promise<Review[]> {
  return reviews
    .filter((r) => r.perfumeId === perfumeId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * The perfume record holds the aggregate rating across all reviews (as a
 * database would via a cached column). The distribution is scaled from the
 * sample reviews so the bars reflect the full review count.
 */
export async function getRatingSummary(perfume: Perfume): Promise<RatingSummary> {
  const sample = await getReviewsByPerfumeId(perfume.id);
  const counts = [0, 0, 0, 0, 0];
  sample.forEach((r) => counts[r.rating - 1]++);

  const scale = sample.length ? perfume.reviewCount / sample.length : 0;
  const distribution = counts.map((c) => Math.round(c * scale)) as RatingSummary["distribution"];

  return {
    average: perfume.rating,
    total: perfume.reviewCount,
    distribution,
  };
}
