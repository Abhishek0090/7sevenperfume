"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowDownIcon, ArrowRightIcon, StarIcon } from "lucide-react";

import { LOGO_LETTERS, LOGO_VIEWBOX } from "@/components/brand/logo-paths";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

/** Load animation timing: letters arrive left to right, then the logo glows once. */
const LETTER_DELAY_MS = 160;
const LETTER_DURATION_MS = 700;
const GLOW_DELAY_MS = LOGO_LETTERS.length * LETTER_DELAY_MS + LETTER_DURATION_MS;

/** Scroll exit: letter i starts fading after i * LETTER_EXIT_STEP px and is gone LETTER_EXIT_SPAN px later. */
const LETTER_EXIT_STEP = 45;
const LETTER_EXIT_SPAN = 160;

/** Catalogue facts shown in the hero, computed on the server from the perfume data. */
export interface HeroStats {
  perfumeCount: number;
  averageRating: number;
  totalReviews: number;
  concentrations: string[];
  newest: { name: string; slug: string };
}

/**
 * Hero: on load the logo letters arrive one by one (left to right) and the logo glows once.
 * On scroll the letters fade away one by one, then the rest of the content fades.
 * Around the logo: a "new arrival" link and a row of catalogue facts.
 *
 * Performance: one rAF-throttled listener writes a single CSS variable (`--scroll`, px);
 * everything else is CSS opacity/transform, with no re-renders.
 */
export function HeroParallax({ stats }: { stats: HeroStats }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      section.style.setProperty("--scroll", String(Math.round(Math.min(window.scrollY, section.offsetHeight))));
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

  const facts = [
    { value: String(stats.perfumeCount), label: "Signature scents" },
    {
      value: (
        <span className="inline-flex items-center gap-1">
          {stats.averageRating.toFixed(1)}
          <StarIcon className="size-3.5 fill-gold text-gold" />
        </span>
      ),
      label: `${stats.totalReviews.toLocaleString(siteConfig.locale)} reviews`,
    },
    { value: stats.concentrations.length > 1 ? "EDP · EDT" : "EDP", label: "Long-lasting" },
    { value: "WhatsApp", label: "Order directly" },
  ];

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-background py-16 [--scroll:0]"
    >
      {/* Soft warm glow behind the logo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_45%,color-mix(in_oklch,var(--gold)_14%,transparent),transparent_70%)]"
      />

      {/* Editorial side captions (desktop only) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-6 hidden items-center lg:flex xl:left-10"
        style={{ opacity: "clamp(0, 1 - var(--scroll) / 300, 1)" }}
      >
        <span className="flex items-center gap-4 text-[11px] tracking-[0.4em] text-muted-foreground uppercase [writing-mode:vertical-rl] rotate-180">
          <span className="h-16 w-px bg-border" />
          Crafted in {siteConfig.contact.address.split(",")[0]}
        </span>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-6 hidden items-center lg:flex xl:right-10"
        style={{ opacity: "clamp(0, 1 - var(--scroll) / 300, 1)" }}
      >
        <span className="flex items-center gap-4 text-[11px] tracking-[0.4em] text-muted-foreground uppercase [writing-mode:vertical-rl]">
          Scroll to explore
          <span className="h-16 w-px bg-border" />
        </span>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center px-5 text-center">
        <div className="flex flex-col items-center" style={{ opacity: "clamp(0, 1 - var(--scroll) / 220, 1)" }}>
          <Link
            href={`/perfumes/${stats.newest.slug}`}
            className="group mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/70 py-1 pr-3 pl-1 text-xs backdrop-blur transition-colors hover:border-gold sm:mb-8"
          >
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium tracking-wider text-primary-foreground uppercase">
              New
            </span>
            <span className="text-muted-foreground">
              Meet <span className="font-medium text-foreground">{stats.newest.name}</span>
            </span>
            <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
          <span className="mb-6 text-[11px] font-medium tracking-[0.35em] text-muted-foreground uppercase sm:mb-8 sm:text-xs sm:tracking-[0.5em]">
            Luxury Fragrance House
          </span>
        </div>

        <h1 className="w-[min(84vw,640px)]">
          <span className="sr-only">{siteConfig.name}</span>
          {/* Inline logo; fill follows the text colour, so it is black in light mode and white in dark mode. */}
          <svg
            aria-hidden
            viewBox={LOGO_VIEWBOX}
            className="animate-logo-glow w-full overflow-visible fill-current text-foreground"
            style={{ animation: `logo-glow 1.6s ease-in-out ${GLOW_DELAY_MS}ms 1 both` }}
          >
            {LOGO_LETTERS.map((letter, i) => {
              // Scroll exit progress for this letter: 0 = fully shown, 1 = gone.
              const exit = `clamp(0, (var(--scroll) - ${i * LETTER_EXIT_STEP}) / ${LETTER_EXIT_SPAN}, 1)`;
              return (
                // Outer group: scroll exit (fade + lift). Inner group: one-time load entrance.
                // Kept separate because the entrance animation's fill would override inline styles.
                <g key={letter.id} style={{ opacity: `calc(1 - ${exit})`, transform: `translateY(calc(${exit} * -40px))` }}>
                  <g
                    className="animate-logo-letter"
                    style={{
                      animation: `logo-letter-in ${LETTER_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) ${i * LETTER_DELAY_MS}ms 1 both`,
                    }}
                  >
                    {letter.paths.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </g>
                </g>
              );
            })}
          </svg>
        </h1>

        <div className="flex w-full flex-col items-center" style={{ opacity: "clamp(0, 1 - var(--scroll) / 380, 1)" }}>
          <p className="mt-5 text-base tracking-[0.5em] uppercase sm:mt-6 sm:text-lg md:text-2xl md:tracking-[0.6em]">
            Perfume
          </p>
          <p className="mt-6 max-w-md text-sm text-muted-foreground sm:mt-8 sm:text-base">
            Seven signatures. Crafted in small batches, delivered to your door.
          </p>
          <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="h-11 px-6">
              <Link href="#perfumes">Shop the collection</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 bg-background/70 px-6 backdrop-blur">
              <Link href="#collection">Featured</Link>
            </Button>
          </div>

          {/* Catalogue facts */}
          <dl className="mt-12 grid w-full max-w-2xl grid-cols-2 border-y border-border/80 sm:mt-14 sm:grid-cols-4">
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                className={`flex flex-col items-center gap-1 px-3 py-4 ${i % 2 === 1 ? "border-l border-border/80" : ""} ${i >= 2 ? "border-t border-border/80 sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""}`}
              >
                <dd className="font-heading text-xl font-semibold sm:text-2xl">{fact.value}</dd>
                <dt className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase sm:text-[11px]">{fact.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <Link
        href="#collection"
        aria-label="Scroll to collection"
        className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 animate-bounce text-muted-foreground lg:hidden"
        style={{ opacity: "clamp(0, 1 - var(--scroll) / 200, 1)" }}
      >
        <ArrowDownIcon className="size-5" />
      </Link>
    </section>
  );
}
