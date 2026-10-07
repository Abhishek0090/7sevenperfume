"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Perfume } from "../types";

/**
 * Centered "cascade" carousel: the selected card is raised and full size,
 * its neighbours sit lower and smaller.
 */
export function PerfumeCarousel({ perfumes }: { perfumes: Perfume[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [autoplay] = useState(() =>
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

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
    <section id="collection" className="scroll-mt-16 bg-muted/50 py-14 md:py-20">
      <Container>
        <SectionHeading eyebrow="The Collection" title="Featured signatures" />

        {/* Side padding holds the arrows, so they never sit outside the page. */}
        <div className="relative px-11 md:px-16">
          <Carousel setApi={setApi} opts={{ align: "center", loop: true }} plugins={[autoplay]} className="static">
            {/* Vertical padding leaves room for the raised card and its shadow. */}
            <CarouselContent className="-ml-4 py-8 md:-ml-6">
              {perfumes.map((perfume, i) => {
                const active = i === selected;
                const href = `/perfumes/${perfume.slug}`;
                return (
                  <CarouselItem key={perfume.id} className="basis-[85%] pl-4 sm:basis-1/2 md:pl-6 lg:basis-1/3">
                    <div
                      className={cn(
                        "flex h-full flex-col overflow-hidden rounded-2xl border bg-background transition-all duration-500 ease-out",
                        active
                          ? "-translate-y-4 scale-100 opacity-100 shadow-2xl shadow-black/10"
                          : "translate-y-4 scale-[0.9] opacity-60",
                      )}
                    >
                      <Link href={href} className="relative block aspect-[5/4] bg-muted" tabIndex={active ? 0 : -1}>
                        <Image
                          src={perfume.images[0].src}
                          alt={perfume.images[0].alt}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw"
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col items-center gap-2 p-6 text-center">
                        <span className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
                          {perfume.concentration}
                        </span>
                        <h3 className="font-heading text-2xl font-semibold">{perfume.name}</h3>
                        <p className="text-sm text-muted-foreground">{perfume.tagline}</p>
                        <p className="text-lg font-semibold">{formatPrice(perfume.price)}</p>
                        <Button asChild size="lg" className="mt-2 h-10 px-6" tabIndex={active ? 0 : -1}>
                          <Link href={href}>Discover</Link>
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-0 size-10 bg-background shadow-sm md:size-11" />
            <CarouselNext className="right-0 size-10 bg-background shadow-sm md:size-11" />
          </Carousel>
        </div>
      </Container>
    </section>
  );
}
