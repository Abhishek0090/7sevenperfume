"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { HeroStats } from "./hero-parallax";

/** Counts a number up from 0 the first time it scrolls into view. */
function CountUp({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const format = (n: number) => n.toFixed(decimals) + suffix;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = format(value);
      return;
    }
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1600);
        el.textContent = format(value * (1 - (1 - t) ** 3));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, suffix, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {(0).toFixed(decimals) + suffix}
    </span>
  );
}

/** Dark storytelling section with parallax image stack and animated stats. */
export function BrandStory({ stats }: { stats: HeroStats }) {
  const sectionRef = useRef<HTMLElement>(null);
  // Same catalogue figures as the hero, so the page never contradicts itself.
  const STATS = [
    { value: stats.perfumeCount, suffix: "", label: "Signature scents" },
    { value: Number(stats.averageRating.toFixed(1)), suffix: "", label: "Average rating", decimals: 1 },
    { value: stats.totalReviews, suffix: "", label: "Customer reviews" },
    { value: 12, suffix: "h", label: "Lasting wear" },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      // -1 when the section enters from the bottom, 1 when it leaves at the top.
      const p = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight));
      section.style.setProperty("--p", String(p));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-noir py-20 text-[#f5ede2] [--p:0] md:py-28">
      <div
        aria-hidden
        className="absolute -top-40 -right-40 size-[40rem] rounded-full bg-[radial-gradient(circle,rgba(184,147,90,0.25),transparent_65%)]"
      />
      <Container className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <span className="text-xs tracking-[0.4em] text-gold uppercase">Our story</span>
            <h2 className="mt-4 font-heading text-4xl leading-tight font-semibold md:text-6xl">
              Scent is memory, <span className="text-gold-light italic">bottled.</span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 max-w-lg leading-relaxed text-[#f5ede2]/70">
              Every 7 Seven fragrance starts with a single ingredient we love: a Damask rose, a piece of aged oud, a
              sun-warmed lemon. We blend in small batches, rest each perfume for weeks, and bottle it by hand.
            </p>
          </Reveal>

          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={200 + i * 100}>
                <dd className="font-heading text-4xl font-semibold text-gold-light md:text-5xl">
                  <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </dd>
                <dt className="mt-2 text-xs tracking-[0.2em] text-[#f5ede2]/60 uppercase">{stat.label}</dt>
              </Reveal>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
          <div
            className="absolute inset-y-6 left-0 w-3/5 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gold/30"
            style={{ transform: "translate3d(0, calc(var(--p) * -40px), 0) rotate(-4deg)" }}
          >
            <Image src="/images/perfumes/oud-royale/notes.svg" alt="" fill sizes="300px" className="object-cover" />
          </div>
          <div
            className="absolute inset-y-0 right-0 w-3/5 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gold/30"
            style={{ transform: "translate3d(0, calc(var(--p) * 50px), 0) rotate(3deg)" }}
          >
            <Image src="/images/perfumes/rose-eternelle/notes.svg" alt="" fill sizes="300px" className="object-cover" />
          </div>
        </div>
      </Container>
    </section>
  );
}
