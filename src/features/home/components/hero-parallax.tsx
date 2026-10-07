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

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => t * (2 - t);
/** How quickly the animation catches up with the scroll position (per 60fps frame). Lower = silkier. */
const SMOOTHING = 0.14;

/**
 * Faceted gold cap with a dark ring and a sleeve that covers the bottle neck.
 * Drawn at the same scale as the body (cap viewBox width 200 = half the body width).
 */
function BottleCap() {
  return (
    <svg viewBox="0 0 200 170" className="block h-auto w-full drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)]">
      <defs>
        <linearGradient id="cap-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5e4520" />
          <stop offset="0.16" stopColor="#d9bd7f" />
          <stop offset="0.28" stopColor="#fff4d2" />
          <stop offset="0.45" stopColor="#b8935a" />
          <stop offset="0.68" stopColor="#f0d9a2" />
          <stop offset="0.86" stopColor="#9a7a43" />
          <stop offset="1" stopColor="#4e391a" />
        </linearGradient>
        <linearGradient id="cap-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff8e2" />
          <stop offset="1" stopColor="#c9a86a" />
        </linearGradient>
      </defs>
      {/* Faceted block with a bevelled top */}
      <path d="M44 22 L60 6 H140 L156 22 V122 H44 Z" fill="url(#cap-gold)" />
      <path d="M60 6 H140 L156 22 H44 Z" fill="url(#cap-top)" />
      <rect x="70" y="24" width="3" height="96" fill="#fff" opacity="0.45" />
      <rect x="128" y="24" width="2" height="96" fill="#000" opacity="0.18" />
      <rect x="44" y="118" width="112" height="4" fill="#000" opacity="0.2" />
      {/* Dark ring and sleeve */}
      <rect x="54" y="122" width="92" height="10" rx="2" fill="#1d1813" />
      <rect x="60" y="132" width="80" height="36" rx="4" fill="url(#cap-gold)" />
      <rect x="60" y="132" width="80" height="4" fill="#000" opacity="0.25" />
    </svg>
  );
}

/**
 * Heavy glass flacon: thick walls around a liquid cavity, refracting base, gold-foil branding,
 * and a coloured light pool with a soft reflection underneath. Liquid colour comes from --liquid.
 */
function BottleBody() {
  return (
    <svg viewBox="0 0 400 640" className="block h-auto w-full overflow-visible">
      <defs>
        <linearGradient id="fl-liquid" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" style={{ stopColor: "color-mix(in oklch, var(--liquid) 72%, white)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--liquid)" }} />
          <stop offset="1" style={{ stopColor: "color-mix(in oklch, var(--liquid), black 38%)" }} />
        </linearGradient>
        <linearGradient id="fl-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "color-mix(in oklch, var(--liquid), black 45%)" }} stopOpacity="0.85" />
          <stop offset="1" style={{ stopColor: "color-mix(in oklch, var(--liquid), black 20%)" }} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="fl-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.12" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.85" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.38" />
        </linearGradient>
        <linearGradient id="fl-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fl-foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3cf" />
          <stop offset="0.35" stopColor="#e2c27f" />
          <stop offset="0.6" stopColor="#fff0c4" />
          <stop offset="1" stopColor="#c9a05a" />
        </linearGradient>
        <linearGradient id="fl-reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--liquid)" }} stopOpacity="0.32" />
          <stop offset="1" style={{ stopColor: "var(--liquid)" }} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="fl-pool">
          <stop offset="0" style={{ stopColor: "var(--liquid)" }} stopOpacity="0.5" />
          <stop offset="1" style={{ stopColor: "var(--liquid)" }} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fl-contact">
          <stop offset="0" stopColor="#000" stopOpacity="0.5" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <clipPath id="fl-body">
          <rect x="10" y="36" width="380" height="484" rx="34" />
        </clipPath>
      </defs>

      {/* Coloured light pool and contact shadow on the surface */}
      <ellipse cx="200" cy="540" rx="215" ry="44" fill="url(#fl-pool)" />
      <ellipse cx="200" cy="524" rx="175" ry="16" fill="url(#fl-contact)" />

      {/* Faded reflection on the polished surface */}
      <rect x="10" y="522" width="380" height="110" rx="20" fill="url(#fl-reflect)" />

      {/* Neck */}
      <rect x="162" y="4" width="76" height="44" rx="6" fill="#fff" opacity="0.18" stroke="#fff" strokeOpacity="0.6" strokeWidth="2" />

      {/* Glass body */}
      <rect x="10" y="36" width="380" height="484" rx="34" fill="#fff" opacity="0.06" />
      <g clipPath="url(#fl-body)">
        {/* Liquid cavity inside thick walls */}
        <rect x="34" y="118" width="332" height="336" rx="18" fill="url(#fl-liquid)" />
        <ellipse cx="200" cy="118" rx="166" ry="6" fill="#fff" opacity="0.4" />
        {/* Heavy base refracting the liquid colour */}
        <rect x="10" y="456" width="380" height="64" fill="url(#fl-base)" />
        <rect x="10" y="456" width="380" height="2" fill="#fff" opacity="0.45" />
        {/* Glass edges and reflections */}
        <rect x="10" y="36" width="380" height="484" fill="url(#fl-glass)" />
        <rect x="24" y="54" width="20" height="452" rx="10" fill="url(#fl-shine)" />
        <rect x="52" y="70" width="5" height="380" rx="2.5" fill="#fff" opacity="0.35" />
        <rect x="330" y="66" width="34" height="370" rx="17" fill="#fff" opacity="0.12" />
        <path d="M60 52 Q200 40 340 52" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" fill="none" />
      </g>
      <rect x="10" y="36" width="380" height="484" rx="34" fill="none" stroke="#fff" strokeOpacity="0.75" strokeWidth="3" />
      <rect x="34" y="118" width="332" height="336" rx="18" fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1.5" />

      {/* Plaque, logo and text, scaled down as one group around the label centre */}
      <g transform="translate(200 281) scale(0.78) translate(-200 -281)">
        {/* Smoked-glass plaque so the gold branding stays readable on every liquid colour */}
        <rect x="72" y="206" width="256" height="150" rx="8" fill="#0d0a07" opacity="0.62" />
        <rect x="80" y="214" width="240" height="134" rx="5" fill="none" stroke="url(#fl-foil)" strokeOpacity="0.7" strokeWidth="1.2" />

        {/* Gold-foil branding: letters arrive left to right, then the logo glows once */}
        <g className="animate-logo-glow" style={{ animation: `logo-glow 1.6s ease-in-out ${GLOW_DELAY_MS}ms 1 both` }}>
          <g transform="translate(95 236) scale(0.25)" fill="url(#fl-foil)">
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
        <rect x="150" y="290" width="100" height="1.2" fill="url(#fl-foil)" />
        <text
          x="200"
          y="314"
          textAnchor="middle"
          fontSize="13"
          letterSpacing="7"
          fill="#f3dca4"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          EAU DE PARFUM
        </text>
        <text
          x="200"
          y="334"
          textAnchor="middle"
          fontSize="10"
          letterSpacing="4"
          fill="#e8d3a2"
          opacity="0.85"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          50 ML · 1.7 FL.OZ
        </text>
      </g>
    </svg>
  );
}

/**
 * Hero, pinned while the user scrolls through it:
 * 1. On landing: a perfume bottle with the 7EVYN logo on its label (logo letters arrive, then glow).
 * 2. Scrolling: the cap drifts to the left, the bottle to the right.
 * 3. The hero content (logo, tagline, buttons, facts) fades in between them.
 *
 * Performance: scroll progress is eased toward the scroll position (so mouse-wheel steps glide)
 * and written straight to the few moving elements as GPU-friendly transform/opacity. Nothing is
 * set on the section itself, so the rest of the hero is never restyled while scrolling.
 */
export function HeroParallax({ stats, shades }: { stats: HeroStats; shades: HeroShade[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(SVGGElement | null)[]>([]);
  const [shadeIndex, setShadeIndex] = useState(0);
  // Cycling stops when the visitor picks a colour or starts scrolling.
  const [cycling, setCycling] = useState(true);
  const stopCyclingRef = useRef(() => setCycling(false));
  const logoRef = useRef<SVGSVGElement>(null);
  const shade = shades[shadeIndex] ?? shades[0];

  // Cycle through the colours until the visitor picks one (skipped for reduced motion).
  useEffect(() => {
    if (!cycling || shades.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setShadeIndex((i) => (i + 1) % shades.length), CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [cycling, shades.length]);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const cap = capRef.current;
    const body = bodyRef.current;
    const content = contentRef.current;
    if (!section || !stage || !cap || !body || !content) return;

    let wide = false;
    let sectionTop = 0;
    let stickyTop = 0;
    let scrollable = 1;
    let revealed = false;
    let glowed = false;
    let cycleStopped = false;

    /** Cache layout values so the per-frame work never reads layout. */
    const measure = () => {
      wide = window.matchMedia("(min-width: 768px)").matches;
      stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      scrollable = Math.max(section.offsetHeight - stage.offsetHeight, 1);
    };
    const readProgress = () => clamp01((window.scrollY + stickyTop - sectionTop) / scrollable);

    /** Write the scene for progress p (0 = closed bottle, 1 = content shown). */
    const apply = (p: number) => {
      const open = easeOut(clamp01(p / OPEN_END));
      const side = window.innerWidth * (wide ? 0.3 : 0.52);
      const vh = window.innerHeight / 100;
      // Cap and bottle stay fully visible on wide screens; on phones they fade back behind the content.
      const fade = String(1 - (1 - (wide ? 1 : 0.12)) * open);

      cap.style.transform = `translate3d(${-side * open}px, ${-8 * vh * open}px, 0) rotate(${-22 * open}deg) scale(${1 - 0.3 * open})`;
      cap.style.opacity = fade;
      body.style.transform = `translate3d(${side * open}px, ${6 * vh * open}px, 0) rotate(${8 * open}deg) scale(${1 - 0.42 * open})`;
      body.style.opacity = fade;

      const c = clamp01((p - CONTENT_START) / (CONTENT_END - CONTENT_START));
      content.style.opacity = String(c);
      content.style.transform = `translate3d(0, ${(1 - c) * 30}px, 0)`;
      letterRefs.current.forEach((g, i) => {
        if (!g) return;
        const t = clamp01((p - CONTENT_START - i * 0.04) / 0.14);
        g.style.opacity = String(t);
        g.style.transform = `translateX(${(1 - t) * -30}px)`;
      });
      if (pickerRef.current) pickerRef.current.style.opacity = String(1 - clamp01(p / 0.12));
      if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp01(p / 0.08));

      if (!cycleStopped && p > 0.02) {
        cycleStopped = true;
        stopCyclingRef.current();
      }

      const nowRevealed = p >= CONTENT_END - 0.05;
      if (nowRevealed !== revealed) {
        revealed = nowRevealed;
        section.dataset.revealed = String(revealed);
        // One-time glow (a filter animation), not replayed every time the reveal point is crossed.
        if (revealed && !glowed && logoRef.current) {
          glowed = true;
          const logo = logoRef.current;
          logo.classList.add("animate-logo-glow");
          logo.style.animation = "logo-glow 1.6s ease-in-out 1";
          logo.addEventListener("animationend", () => (logo.style.animation = ""), { once: true });
        }
      }
    };

    measure();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.dataset.static = "true";
      apply(1);
      return;
    }

    let current = readProgress();
    let frame = 0;
    let last = performance.now();
    apply(current);

    // Ease the drawn progress toward the scroll position, independent of frame rate.
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      const target = readProgress();
      const k = 1 - Math.pow(1 - SMOOTHING, dt / 16.7);
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) current = target;
      apply(current);
      frame = current === target ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const onResize = () => {
      measure();
      apply(current);
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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
      className="group/hero relative h-[240svh] bg-background data-[static=true]:h-auto"
    >
      <div
        ref={stageRef}
        className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden [contain:paint] group-data-[static=true]/hero:static group-data-[static=true]/hero:min-h-[calc(100svh-4rem)]"
      >
        {/* The liquid colour lives only on this layer, so colour changes never restyle the rest of the hero. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-[--liquid] duration-1000 ease-in-out"
          style={{ ["--liquid" as string]: shade?.tint }}
        >
          {/* Spotlight behind the bottle */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_50%_50%,color-mix(in_oklch,var(--liquid)_28%,transparent),transparent_70%)]" />

          {/* Bottle: cap and body move apart as the user scrolls */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="animate-hero-rise relative w-[min(27svh,52vw)]"
              // Room for the cap above; the bottle sits a little high to leave space for the colour picker below.
              style={{ marginTop: "calc(min(27svh, 52vw) * 0.32)", translate: "0 -2svh" }}
            >
              {/* Cap: sits on the bottle, then lifts and drifts left */}
              <div
                ref={capRef}
                className="absolute bottom-full left-1/2 w-1/2 -translate-x-1/2 will-change-transform"
                style={{ marginBottom: "-11%" }}
              >
                <BottleCap />
              </div>
              {/* Body: drifts right and shrinks */}
              <div ref={bodyRef} className="will-change-transform">
                <BottleBody />
              </div>
            </div>
          </div>
        </div>

        {/* Hero content, revealed between the cap and the bottle */}
        <div
          ref={contentRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center will-change-[opacity,transform] group-data-[revealed=true]/hero:pointer-events-auto group-data-[static=true]/hero:pointer-events-auto"
          style={{ opacity: 0 }}
        >
          <Link
            href={`/perfumes/${stats.newest.slug}`}
            className="group mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/85 py-1 pr-3 pl-1 text-xs transition-colors hover:border-gold sm:mb-7"
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
              ref={logoRef}
              className="w-full fill-current text-foreground"
            >
              {/* Letters arrive left to right as the content fades in (driven by the scroll effect). */}
              {LOGO_LETTERS.map((letter, i) => (
                <g
                  key={letter.id}
                  ref={(el) => {
                    letterRefs.current[i] = el;
                  }}
                  style={{ opacity: 0 }}
                >
                  {letter.paths.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </g>
              ))}
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
            <Button asChild size="lg" variant="outline" className="h-11 bg-background/85 px-6">
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
          ref={pickerRef}
          className="pointer-events-none absolute inset-x-0 bottom-[4.5rem] z-20 flex flex-col items-center gap-3 px-5 *:pointer-events-auto group-data-[revealed=true]/hero:*:pointer-events-none"
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
                  setCycling(false);
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
          ref={hintRef}
          aria-hidden
          className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-[11px] tracking-[0.35em] text-muted-foreground uppercase"
        >
          Scroll to open
          <ArrowDownIcon className="size-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
