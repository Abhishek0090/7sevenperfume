import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { RatingStars } from "@/features/reviews/components/rating-stars";
import { formatPrice } from "@/lib/format";
import type { Perfume } from "../types";

export function PerfumeCard({ perfume }: { perfume: Perfume }) {
  const href = `/perfumes/${perfume.slug}`;
  const soldOut = perfume.stock <= 0;

  return (
    <Card className="group h-full gap-0 overflow-hidden py-0 transition-shadow hover:shadow-lg">
      <Link href={href} className="relative block aspect-[5/4] overflow-hidden bg-muted">
        <Image
          src={perfume.images[0].src}
          alt={perfume.images[0].alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary">{perfume.gender}</Badge>
          {soldOut && <Badge variant="destructive">Sold out</Badge>}
        </div>
      </Link>

      <CardContent className="flex flex-1 flex-col gap-2 pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RatingStars rating={perfume.rating} />
          <span>({perfume.reviewCount})</span>
        </div>
        <Link href={href} className="font-heading text-xl font-semibold hover:underline">
          {perfume.name}
        </Link>
        <p className="line-clamp-1 text-sm text-muted-foreground">{perfume.tagline}</p>
        <p className="mt-auto text-xs text-muted-foreground">
          {perfume.sizeMl} ml &middot; {perfume.concentration}
        </p>
      </CardContent>

      <CardFooter className="justify-between gap-2 border-t py-4">
        <span className="text-lg font-semibold">{formatPrice(perfume.price)}</span>
        <AddToCartButton perfume={perfume} size="sm" className="w-32" />
      </CardFooter>
    </Card>
  );
}
