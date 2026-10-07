import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import type { RatingSummary, Review } from "../types";
import { RatingStars } from "./rating-stars";
import { ReviewCard } from "./review-card";

interface ReviewSectionProps {
  reviews: Review[];
  summary: RatingSummary;
}

export function ReviewSection({ reviews, summary }: ReviewSectionProps) {
  const maxCount = Math.max(...summary.distribution, 1);

  return (
    <section id="reviews" className="scroll-mt-16 border-t bg-muted/30 py-14 md:py-20">
      <Container>
        <SectionHeading eyebrow="Reviews" title="What customers say" />

        <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
          <aside className="space-y-6 rounded-2xl border bg-background p-6 lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-2">
              <p className="font-heading text-6xl font-semibold">{summary.average.toFixed(1)}</p>
              <RatingStars rating={summary.average} size="md" />
              <p className="text-sm text-muted-foreground">Based on {summary.total} reviews</p>
            </div>

            <ul className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary.distribution[star - 1];
                return (
                  <li key={star} className="flex items-center gap-3 text-sm">
                    <span className="w-3 tabular-nums">{star}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground tabular-nums">{count}</span>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
