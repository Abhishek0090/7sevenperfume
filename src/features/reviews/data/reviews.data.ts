import type { Review } from "../types";

// Mock data. Replace with a database query inside review.service.ts.

type ReviewSeed = Omit<Review, "id" | "perfumeId" | "photos">;

const seeds: ReviewSeed[] = [
  {
    author: "Aarav Mehta",
    rating: 5,
    title: "My new signature scent",
    comment:
      "Lasts all day on me and I keep getting compliments at work. The dry-down is the best part.",
    createdAt: "2026-08-14",
    verifiedPurchase: true,
  },
  {
    author: "Priya Sharma",
    rating: 5,
    title: "Worth every rupee",
    comment:
      "Beautiful bottle and the fragrance is even better. Ordering was quick over WhatsApp and it arrived in two days.",
    createdAt: "2026-08-02",
    verifiedPurchase: true,
  },
  {
    author: "Rohan Kapoor",
    rating: 4,
    title: "Great projection",
    comment:
      "Strong opening that calms down after an hour. Two sprays are enough. Would like a travel size option.",
    createdAt: "2026-07-21",
    verifiedPurchase: true,
  },
  {
    author: "Sneha Iyer",
    rating: 5,
    title: "Elegant and unique",
    comment:
      "Nothing like the usual department store perfumes. It feels special and people ask me what I am wearing.",
    createdAt: "2026-07-09",
    verifiedPurchase: false,
  },
  {
    author: "Kabir Singh",
    rating: 4,
    title: "Good for evenings",
    comment:
      "A bit heavy for daytime in summer, but perfect for dinners and events. Longevity is around 8 hours.",
    createdAt: "2026-06-28",
    verifiedPurchase: true,
  },
  {
    author: "Ananya Rao",
    rating: 3,
    title: "Nice, but not for me",
    comment:
      "Well made and long lasting. The notes are just a little too intense for my taste. My husband loves it though.",
    createdAt: "2026-06-11",
    verifiedPurchase: true,
  },
];

const perfumeIds = ["p-001", "p-002", "p-003", "p-004", "p-005", "p-006", "p-007"];

// Give each perfume a rotated subset of the seed reviews so the pages differ.
export const reviews: Review[] = perfumeIds.flatMap((perfumeId, pIndex) =>
  seeds
    .map((_, i) => seeds[(i + pIndex) % seeds.length])
    .slice(0, 4 + (pIndex % 3))
    .map((seed, i) => ({
      ...seed,
      id: `${perfumeId}-r${i + 1}`,
      perfumeId,
      photos: [],
    })),
);
