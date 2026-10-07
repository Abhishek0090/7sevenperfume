"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { PerfumeImage } from "../types";

/** Main swipeable image with a synced thumbnail strip. */
export function PerfumeGallery({ images }: { images: PerfumeImage[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className="flex flex-col gap-4">
      <Carousel setApi={setApi} opts={{ loop: true }} className="overflow-hidden rounded-2xl border bg-muted">
        <CarouselContent className="ml-0">
          {images.map((image, i) => (
            <CarouselItem key={image.src} className="pl-0">
              <div className="relative aspect-[4/5]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-4 size-10 bg-background/90" />
            <CarouselNext className="right-4 size-10 bg-background/90" />
          </>
        )}
      </Carousel>

      {images.length > 1 && (
        <ul className="grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((image, i) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => api?.scrollTo(i)}
                aria-label={`Show image ${i + 1}: ${image.alt}`}
                aria-current={selected === i}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-lg border-2 bg-muted transition",
                  selected === i ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <Image src={image.src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
