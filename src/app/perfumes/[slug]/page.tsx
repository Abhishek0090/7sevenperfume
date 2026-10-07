import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PerfumeDetails } from "@/features/perfumes/components/perfume-details";
import { getAllPerfumeSlugs, getPerfumeBySlug } from "@/features/perfumes/services/perfume.service";
import { ReviewSection } from "@/features/reviews/components/review-section";
import { getRatingSummary, getReviewsByPerfumeId } from "@/features/reviews/services/review.service";

// Pre-render every perfume at build time. With a database, switch to ISR
// (`export const revalidate = 60`) or remove `dynamicParams = false`.
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllPerfumeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/perfumes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const perfume = await getPerfumeBySlug(slug);
  if (!perfume) return {};

  return {
    title: perfume.name,
    description: perfume.description,
    openGraph: { title: perfume.name, description: perfume.tagline, images: [perfume.images[0].src] },
  };
}

export default async function PerfumePage({ params }: PageProps<"/perfumes/[slug]">) {
  const { slug } = await params;
  const perfume = await getPerfumeBySlug(slug);
  if (!perfume) notFound();

  const [reviews, summary] = await Promise.all([getReviewsByPerfumeId(perfume.id), getRatingSummary(perfume)]);

  return (
    <>
      <PerfumeDetails perfume={perfume} />
      <ReviewSection reviews={reviews} summary={summary} />
    </>
  );
}
