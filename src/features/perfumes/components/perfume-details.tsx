import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckoutPanel } from "@/features/checkout/components/checkout-panel";
import { RatingStars } from "@/features/reviews/components/rating-stars";
import { formatPrice } from "@/lib/format";
import type { Perfume } from "../types";
import { FragranceNotes } from "./fragrance-notes";
import { PerfumeGallery } from "./perfume-gallery";
import { StockBadge } from "./stock-badge";

export function PerfumeDetails({ perfume }: { perfume: Perfume }) {
  return (
    <section>
      <Container className="pt-6 pb-14 md:pt-8 md:pb-20">
        <Link
          href="/#perfumes"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4" />
          Back to collection
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left: image gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <PerfumeGallery images={perfume.images} />
          </div>

          {/* Right: details */}
          <div className="flex flex-col gap-8">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{perfume.gender}</Badge>
                <Badge variant="secondary">{perfume.concentration}</Badge>
              </div>
              <h1 className="font-heading text-4xl font-semibold md:text-5xl">{perfume.name}</h1>
              <p className="text-muted-foreground">{perfume.tagline}</p>
              <a href="#reviews" className="flex w-fit items-center gap-2 text-sm hover:underline">
                <RatingStars rating={perfume.rating} />
                <span className="font-medium">{perfume.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({perfume.reviewCount} reviews)</span>
              </a>
            </div>

            <Separator />

            <dl className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <dt className="text-xs tracking-widest text-muted-foreground uppercase">Price</dt>
                <dd className="text-3xl font-semibold">{formatPrice(perfume.price)}</dd>
                <dd className="text-xs text-muted-foreground">{perfume.sizeMl} ml, inclusive of taxes</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs tracking-widest text-muted-foreground uppercase">Quantity available</dt>
                <dd className="text-3xl font-semibold tabular-nums">{perfume.stock}</dd>
                <dd>
                  <StockBadge stock={perfume.stock} />
                </dd>
              </div>
            </dl>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold tracking-widest uppercase">Description</h3>
              <p className="leading-relaxed text-muted-foreground">{perfume.description}</p>
            </div>

            <FragranceNotes notes={perfume.notes} />

            <Separator />

            <CheckoutPanel perfume={perfume} />
          </div>
        </div>
      </Container>
    </section>
  );
}
