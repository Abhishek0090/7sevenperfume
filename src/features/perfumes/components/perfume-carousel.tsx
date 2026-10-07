"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
} from "@/components/ui/carousel";
import { formatPrice } from "@/lib/format";
import type { Perfume } from "../types";

export function PerfumeCarousel({ perfumes }: { perfumes: Perfume[] }) {
  const [autoplay] = useState(() =>
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  return (
    <section id="collection" className="scroll-mt-16 bg-muted/50 py-20 md:py-28">
      <Container>
        <Carousel opts={{ align: "start", loop: true }} plugins={[autoplay]}>
          {/* Arrows sit in the heading row (not outside the track) so nothing overflows the page. */}
          <SectionHeading eyebrow="The Collection" title="Featured signatures">
            <div className="flex shrink-0 gap-2">
              <CarouselPrevious className="static my-0 size-10" />
              <CarouselNext className="static my-0 size-10" />
            </div>
          </SectionHeading>

          <CarouselContent className="-ml-6">
            {perfumes.map((perfume) => (
              <CarouselItem key={perfume.id} className="basis-full pl-6 lg:basis-1/2">
                <div className="grid h-full overflow-hidden rounded-2xl border bg-background sm:grid-cols-2">
                  <Link
                    href={`/perfumes/${perfume.slug}`}
                    className="relative aspect-[4/5] bg-muted sm:aspect-auto sm:min-h-80"
                  >
                    <Image
                      src={perfume.images[0].src}
                      alt={perfume.images[0].alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-col justify-center gap-3 p-8 md:p-10">
                    <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
                      {perfume.concentration}
                    </span>
                    <h3 className="font-heading text-3xl font-semibold">{perfume.name}</h3>
                    <p className="text-sm text-muted-foreground">{perfume.tagline}</p>
                    <p className="text-xl font-semibold">{formatPrice(perfume.price)}</p>
                    <Button asChild size="lg" className="mt-3 h-10 w-fit px-5">
                      <Link href={`/perfumes/${perfume.slug}`}>Discover</Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Container>
    </section>
  );
}
