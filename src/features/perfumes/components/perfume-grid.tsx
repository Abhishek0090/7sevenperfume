"use client";

import { useEffect, useState } from "react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { FAMILIES } from "../families";
import type { FragranceFamily, Perfume } from "../types";
import { PerfumeCard } from "./perfume-card";

type Filter = FragranceFamily | "all";

const FILTERS: { id: Filter; label: string }[] = [{ id: "all", label: "All" }, ...FAMILIES.map((f) => ({ id: f.id, label: f.label }))];

/** Reads "#family-floral" style hashes set by the "Shop by mood" tiles. */
function familyFromHash(): Filter | null {
  const match = window.location.hash.match(/^#family-(\w+)$/);
  const id = match?.[1] as Filter | undefined;
  return id && FILTERS.some((f) => f.id === id) ? id : null;
}

export function PerfumeGrid({ perfumes }: { perfumes: Perfume[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const apply = () => {
      const family = familyFromHash();
      if (!family) return;
      setFilter(family);
      document.getElementById("perfumes")?.scrollIntoView({ behavior: "smooth" });
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const visible = filter === "all" ? perfumes : perfumes.filter((p) => p.family === filter);

  return (
    <section id="perfumes" className="relative scroll-mt-16 bg-sand/60 py-14 md:py-20">
      <Container>
        <Reveal>
          <SectionHeading eyebrow="Shop" title="All perfumes" />
        </Reveal>

        <Reveal delay={100}>
          <div role="tablist" aria-label="Filter by fragrance family" className="mb-8 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const count = f.id === "all" ? perfumes.length : perfumes.filter((p) => p.family === f.id).length;
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-background/70 hover:-translate-y-0.5 hover:border-gold hover:text-foreground",
                  )}
                >
                  {f.label}
                  <span className={cn("ml-1.5 text-xs", active ? "text-primary-foreground/60" : "text-muted-foreground")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* key={filter} remounts the grid so cards replay their staggered entrance on every filter change. */}
        <div key={filter} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
          {visible.map((perfume, i) => (
            <Reveal key={perfume.id} delay={(i % 4) * 90} className="h-full">
              <PerfumeCard perfume={perfume} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
