import Image from "next/image";
import { BadgeCheckIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { Review } from "../types";
import { RatingStars } from "./rating-stars";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="space-y-4 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{initials(review.author)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{review.author}</p>
              {review.verifiedPurchase && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <BadgeCheckIcon className="size-3.5" />
                  Verified purchase
                </p>
              )}
            </div>
          </div>
          <time dateTime={review.createdAt} className="shrink-0 text-xs text-muted-foreground">
            {formatDate(review.createdAt)}
          </time>
        </div>

        <div className="space-y-1.5">
          <RatingStars rating={review.rating} />
          <h4 className="font-medium">{review.title}</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
        </div>

        {review.photos.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {review.photos.map((photo) => (
              <li key={photo.id} className="relative size-20 overflow-hidden rounded-md border bg-muted">
                <Image src={photo.url} alt={photo.alt} fill sizes="80px" className="object-cover" />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
