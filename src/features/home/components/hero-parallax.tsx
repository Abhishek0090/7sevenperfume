"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDownIcon, ArrowRightIcon, StarIcon } from "lucide-react";

import { LOGO_LETTERS, LOGO_VIEWBOX } from "@/components/brand/logo-paths";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

/** Catalogue facts shown in the hero, computed on the server from the perfume data. */
export interface HeroStats {
  perfumeCount: number;
  averageRating: number;
  totalReviews: number;
  concentrations: string[];
  newest: { name: string; slug: string };
}

/** A perfume colour the hero bottle can be filled with. */
export interface HeroShade {
  name: string;
  slug: string;
  tint: string;
}

/** How long each colour shows while the bottle cycles on its own (before the visitor picks one). */
const CYCLE_MS = 3200;

/** Scroll timeline (fractions of the pinned scroll): bottle opens, then the content arrives. */
const OPEN_END = 0.5;
const CONTENT_START = 0.3;
const CONTENT_END = 0.62;
/** Load timing for the logo on the bottle label: letters left to right, then one glow. */
const LETTER_DELAY_MS = 160;
const LETTER_DURATION_MS = 700;
const GLOW_DELAY_MS = 400 + LOGO_LETTERS.length * LETTER_DELAY_MS + LETTER_DURATION_MS;

/** Scroll progress helpers as CSS expressions (0..1), driven by --p. */
const range = (from: number, to: number) => `clamp(0, (var(--p) - ${from}) / ${to - from}, 1)`;
/** Ease-out: t * (2 - t). */
const easeOut = (t: string) => `(${t} * (2 - ${t}))`;

/** Metallic cap with gold collar. */
function BottleCap() {
  return (
    <svg viewBox="0 0 200 130" className="block h-auto w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]">
      <defs>
        <linearGradient id="hero-cap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2a2622" />
          <stop offset="0.35" stopColor="#8d8579" />
          <stop offset="0.5" stopColor="#f4efe6" />
          <stop offset="0.65" stopColor="#8d8579" />
          <stop offset="1" stopColor="#1c1916" />
        </linearGradient>
        <linearGradient id="hero-collar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7d6638" />
          <stop offset="0.45" stopColor="#f2deaa" />
          <stop offset="1" stopColor="#6a5530" />
        </linearGradient>
      </defs>
      <rect x="45" y="0" width="110" height="98" rx="14" fill="url(#hero-cap)" />
      <rect x="45" y="0" width="110" height="10" rx="5" fill="#fff" opacity="0.3" />
      <rect x="32" y="96" width="136" height="32" rx="5" fill="url(#hero-collar)" />
    </svg>
  );
}

/** Glass bottle with amber liquid and a cream label carrying the 7EVYN logo. */
function BottleBody() {
  return (
    <svg viewBox="0 0 400 500" className="block h-auto w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.3)]">
      <defs>
        <linearGradient id="hero-liquid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "color-mix(in oklch, var(--liquid) 70%, white)" }} />
          <stop offset="1" style={{ stopColor: "color-mix(in oklch, var(--liquid), black 30%)" }} />
        </linearGradient>
        <linearGradient id="hero-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="hero-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="hero-body">
          <rect x="0" y="0" width="400" height="500" rx="72" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="400" height="500" rx="72" style={{ fill: "var(--liquid)" }} opacity="0.15" />
      <g clipPath="url(#hero-body)">
        <rect x="0" y="110" width="400" height="400" fill="url(#hero-liquid)" />
        <ellipse cx="200" cy="110" rx="200" ry="10" fill="#fff" opacity="0.35" />
        <rect x="0" y="0" width="400" height="500" fill="url(#hero-glass)" />
        <rect x="28" y="24" width="58" height="452" rx="29" fill="url(#hero-shine)" />
        <rect x="340" y="40" width="16" height="300" rx="8" fill="#fff" opacity="0.4" />
      </g>
      <rect x="0" y="0" width="400" height="500" rx="72" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="4" />

      {/* Label */}
      <rect x="70" y="232" width="260" height="150" rx="6" fill="#fffaf2" />
      <rect x="80" y="242" width="240" height="130" rx="3" fill="none" stroke="#b8935a" strokeWidth="1.5" />
      {/* Logo on the label: letters arrive left to right, then the logo glows once */}
      <g className="animate-logo-glow" style={{ animation: `logo-glow 1.6s ease-in-out ${GLOW_DELAY_MS}ms 1 both` }}>
        <g transform="translate(100 272) scale(0.2381)" fill="#15120f">
          {LOGO_LETTERS.map((letter, i) => (
            <g
              key={letter.id}
              className="animate-logo-letter"
              style={{
                animation: `logo-letter-in ${LETTER_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) ${400 + i * LETTER_DELAY_MS}ms 1 both`,
              }}
            >
              {letter.paths.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
          ))}
        </g>
      </g>
      <text x="200" y="344" textAnchor="middle" fontSize="12" letterSpacing="6" fill="#8a7a5a" style={{ fontFamily: "var(--font-sans)" }}>
        EAU DE PARFUM
      </text>
    </svg>
  );
}

/**
 * Hero, pinned while the user scrolls through it:
 * 1. On landing: a perfume bottle with the 7EVYN logo on its label (logo letters arrive, then glow).
 * 2. Scrolling: the cap drifts to the left, the bottle to the right.
 * 3. The hero content (logo, tagline, buttons, facts) fades in between them.
 *
 * Performance: one rAF-throttled listener writes `--p` (0..1); everything else is CSS
 * transforms and opacity, with no re-renders.
 */
export function HeroParallax({ stats, shades }: { stats: HeroStats; shades: HeroShade[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [shadeIndex, setShadeIndex] = useState(0);
  const [picked, setPicked] = useState(false);
  const shade = shades[shadeIndex] ?? shades[0];

  // Cycle through the colours until the visitor picks one (skipped for reduced motion).
  useEffect(() => {
    if (picked || shades.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setShadeIndex((i) => (i + 1) % shades.length), CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [picked, shades.length]);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.dataset.static = "true";
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = section.offsetHeight - stage.offsetHeight;
      // The stage pins below the sticky header, so progress starts when the section reaches that offset.
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
      const p = Math.min(1, Math.max(0, (stickyTop - section.getBoundingClientRect().top) / Math.max(scrollable, 1)));
      section.style.setProperty("--p", p.toFixed(4));
      section.dataset.revealed = String(p >= CONTENT_END - 0.05);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const open = easeOut(range(0, OPEN_END));
  const content = range(CONTENT_START, CONTENT_END);

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
      // --side: how far the cap/bottle travel sideways; --rest: their opacity once open (fainter on phones).
      style={{ ["--liquid" as string]: shade?.tint }}
      className="group/hero relative h-[240svh] transition-[--liquid] duration-1000 ease-in-out bg-background [--p:0] [--rest:0.12] [--side:52vw] data-[static=true]:h-auto data-[static=true]:[--p:1] md:[--rest:1] md:[--side:30vw]"
    >
      <div
        ref={stageRef}
        className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden group-data-[static=true]/hero:static group-data-[static=true]/hero:min-h-[calc(100svh-4rem)]"
      >
        {/* Spotlight behind the bottle */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_50%_50%,color-mix(in_oklch,var(--liquid)_28%,transparent),transparent_70%)]"
        />

        {/* Bottle: cap and body move apart as the user scrolls */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="animate-hero-rise relative w-[min(31svh,56vw)]"
            // Room for the cap above; the bottle sits a little high to leave space for the colour picker below.
            style={{ marginTop: "calc(min(31svh, 56vw) * 0.3)", translate: "0 -6svh" }}
          >
            {/* Cap: sits on the bottle, then lifts and drifts left */}
            <div
              className="absolute bottom-full left-1/2 w-1/2 will-change-transform"
              style={{
                transform: `translate(calc(-50% - var(--side) * ${open}), calc(-8svh * ${open})) rotate(calc(-22deg * ${open})) scale(calc(1 - 0.3 * ${open}))`,
                opacity: `calc(1 - (1 - var(--rest)) * ${open})`,
                marginBottom: "-2%",
              }}
            >
              <BottleCap />
            </div>
            {/* Body: drifts right and shrinks */}
            <div
              className="will-change-transform"
              style={{
                transform: `translate(calc(var(--side) * ${open}), calc(6svh * ${open})) rotate(calc(8deg * ${open})) scale(calc(1 - 0.42 * ${open}))`,
                opacity: `calc(1 - (1 - var(--rest)) * ${open})`,
              }}
            >
              <BottleBody />
            </div>
          </div>
        </div>

        {/* Hero content, revealed between the cap and the bottle */}
        <div
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center group-data-[revealed=true]/hero:pointer-events-auto group-data-[static=true]/hero:pointer-events-auto"
          style={{ opacity: content, transform: `translateY(calc((1 - ${content}) * 30px))` }}
        >
          <Link
            href={`/perfumes/${stats.newest.slug}`}
            className="group mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/70 py-1 pr-3 pl-1 text-xs backdrop-blur transition-colors hover:border-gold sm:mb-7"
          >
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium tracking-wider text-primary-foreground uppercase">
              New
            </span>
            <span className="text-muted-foreground">
              Meet <span className="font-medium text-foreground">{stats.newest.name}</span>
            </span>
            <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
          <span className="mb-5 text-[11px] font-medium tracking-[0.35em] text-muted-foreground uppercase sm:mb-7 sm:text-xs sm:tracking-[0.5em]">
            Luxury Fragrance House
          </span>

          <h1 className="w-[min(78vw,560px)]">
            <span className="sr-only">{siteConfig.name}</span>
            <svg
              aria-hidden
              viewBox={LOGO_VIEWBOX}
              className="w-full fill-current text-foreground group-data-[revealed=true]/hero:animate-[logo-glow_1.6s_ease-in-out_1]"
            >
              {LOGO_LETTERS.map((letter, i) => {
                // Letters arrive left to right as the content fades in.
                const t = range(CONTENT_START + i * 0.04, CONTENT_START + i * 0.04 + 0.14);
                return (
                  <g key={letter.id} style={{ opacity: t, transform: `translateX(calc((1 - ${t}) * -30px))` }}>
                    {letter.paths.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </g>
                );
              })}
            </svg>
          </h1>

          <p className="mt-4 text-base tracking-[0.5em] uppercase sm:mt-5 sm:text-lg md:text-2xl md:tracking-[0.6em]">
            Perfume
          </p>
          <p className="mt-4 max-w-md text-sm text-muted-foreground sm:mt-6 sm:text-base">
            Seven signatures. Crafted in small batches, delivered to your door.
          </p>
          <div className="mt-6 flex w-full max-w-xs flex-col justify-center gap-3 sm:mt-8 sm:w-auto sm:max-w-none sm:flex-row">
            <Button asChild size="lg" className="h-11 px-6">
              <Link href="#perfumes">Shop the collection</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 bg-background/70 px-6 backdrop-blur">
              <Link href="#collection">Featured</Link>
            </Button>
          </div>

          <dl className="mt-8 grid w-full max-w-2xl grid-cols-2 border-y border-border/80 sm:mt-10 sm:grid-cols-4">
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                className={`flex flex-col items-center gap-1 px-3 py-3 sm:py-4 ${i % 2 === 1 ? "border-l border-border/80" : ""} ${i >= 2 ? "border-t border-border/80 sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""}`}
              >
                <dd className="font-heading text-lg font-semibold sm:text-2xl">{fact.value}</dd>
                <dt className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase sm:text-[11px]">{fact.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Colour picker, only before the bottle opens */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[4.5rem] z-20 flex flex-col items-center gap-3 px-5 *:pointer-events-auto group-data-[revealed=true]/hero:*:pointer-events-none"
          style={{ opacity: `calc(1 - ${range(0, 0.12)})` }}
        >
          <div role="radiogroup" aria-label="Perfume colour" className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5">
            {shades.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                role="radio"
                aria-checked={i === shadeIndex}
                aria-label={s.name}
                title={s.name}
                onClick={() => {
                  setPicked(true);
                  setShadeIndex(i);
                }}
                className={`size-6 rounded-full ring-offset-2 ring-offset-background transition-all duration-300 hover:scale-110 ${i === shadeIndex ? "scale-110 ring-2 ring-gold" : "ring-1 ring-white/20"}`}
                style={{ background: s.tint }}
              />
            ))}
          </div>
          <Link
            href={`/perfumes/${shade?.slug}`}
            className="font-heading text-lg tracking-wide text-foreground/90 transition-colors hover:text-gold"
          >
            {shade?.name}
          </Link>
        </div>

        {/* Scroll hint, only before the bottle opens */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-[11px] tracking-[0.35em] text-muted-foreground uppercase"
          style={{ opacity: `calc(1 - ${range(0, 0.08)})` }}
        >
          Scroll to open
          <ArrowDownIcon className="size-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
