import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  className?: string;
  size?: "sm" | "md";
}

export function RatingStars({ rating, className, size = "sm" }: RatingStarsProps) {
  const iconSize = size === "sm" ? "size-3.5" : "size-5";

  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className={cn("relative", iconSize)}>
            <StarIcon className={cn("absolute inset-0 text-foreground/20", iconSize)} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <StarIcon className={cn("fill-foreground text-foreground", iconSize)} />
            </span>
          </span>
        );
      })}
    </div>
  );
}
