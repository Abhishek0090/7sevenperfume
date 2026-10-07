"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const MARQUEE_WORD = "7 SEVEN PERFUME";

/**
 * Scroll-driven parallax: each layer reads the `--scroll` CSS variable and
 * moves at its own speed. One rAF-throttled listener, no re-renders.
 */
export function HeroParallax() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(window.scrollY, section.offsetHeight);
      section.style.setProperty("--scroll", String(progress));
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

  const row = Array.from({ length: 6 }, () => MARQUEE_WORD).join("  •  ");

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-background [--scroll:0]"
    >
      {/* Background rows moving in opposite directions */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-4 select-none">
        <p
          className="font-heading text-[14vw] leading-none font-bold whitespace-nowrap text-foreground/[0.04] will-change-transform"
          style={{ transform: "translateX(calc(-10% - var(--scroll) * 0.6px))" }}
        >
          {row}
        </p>
        <p
          className="font-heading text-[14vw] leading-none font-bold whitespace-nowrap text-transparent will-change-transform [-webkit-text-stroke:1px_var(--color-foreground)] opacity-15"
          style={{ transform: "translateX(calc(-40% + var(--scroll) * 0.6px))" }}
        >
          {row}
        </p>
        <p
          className="font-heading text-[14vw] leading-none font-bold whitespace-nowrap text-foreground/[0.04] will-change-transform"
          style={{ transform: "translateX(calc(-20% - var(--scroll) * 0.4px))" }}
        >
          {row}
        </p>
      </div>

      {/* Foreground content drifts up and fades as the user scrolls */}
      <div
        className="relative z-10 flex flex-col items-center px-4 text-center will-change-transform"
        style={{
          transform: "translateY(calc(var(--scroll) * 0.35px))",
          opacity: "calc(1 - var(--scroll) / 700)",
        }}
      >
        <span className="mb-6 text-xs font-medium tracking-[0.5em] text-muted-foreground uppercase">
          Luxury Fragrance House
        </span>
        <h1 className="font-heading text-7xl leading-[0.9] font-semibold tracking-tight md:text-[9rem]">
          7 Seven
        </h1>
        <p
          className="mt-2 text-lg tracking-[0.6em] uppercase md:text-2xl"
          style={{ letterSpacing: "calc(0.6em + var(--scroll) * 0.002em)" }}
        >
          Perfume
        </p>
        <p className="mt-8 max-w-md text-muted-foreground">
          Seven signatures. Crafted in small batches, delivered to your door.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="h-11 px-6">
            <Link href="#perfumes">Shop the collection</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11 px-6">
            <Link href="#collection">Featured</Link>
          </Button>
        </div>
      </div>

      <Link
        href="#collection"
        aria-label="Scroll to collection"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-muted-foreground"
      >
        <ArrowDownIcon className="size-5" />
      </Link>
    </section>
  );
}
