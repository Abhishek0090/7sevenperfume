"use client";

import Image from "next/image";
import { ArrowUpRightIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { FAMILIES } from "@/features/perfumes/families";

/**
 * "Shop by mood" tiles. Each links to the grid pre-filtered via the #family-<id> hash.
 * Plain anchors (not next/link) so the browser fires "hashchange", which PerfumeGrid listens for.
 */
export function FragranceFamilies() {
  return (
    <section className="bg-background py-14 md:py-20">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Shop by mood" title="Find your family" />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {FAMILIES.map((family, i) => (
            <Reveal key={family.id} delay={i * 100} variant="scale">
              <a
                href={`#family-${family.id}`}
                onClick={(e) => {
                  // Same hash again does not fire hashchange; re-dispatch so the grid still scrolls into view.
                  if (window.location.hash === `#family-${family.id}`) {
                    e.preventDefault();
                    window.dispatchEvent(new HashChangeEvent("hashchange"));
                  }
                }}
                className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl p-5 text-white shadow-sm transition-shadow duration-500 hover:shadow-2xl md:p-6"
                style={{ background: family.gradient }}
              >
                <Image
                  src={family.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover opacity-80 mix-blend-luminosity transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-100 group-hover:mix-blend-normal"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="relative">
                  <p className="text-[11px] tracking-[0.3em] text-white/70 uppercase">{family.notes}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <h3 className="font-heading text-2xl font-semibold md:text-3xl">{family.label}</h3>
                    <span className="grid size-9 place-items-center rounded-full bg-white/15 backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-black">
                      <ArrowUpRightIcon className="size-4" />
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
