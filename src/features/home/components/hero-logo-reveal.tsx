"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowDownIcon } from "lucide-react";

import { LOGO_LETTERS, LOGO_VIEWBOX } from "@/components/brand/logo-paths";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

/**
 * Scroll timeline (fractions of the pinned scroll):
 * letters wait in a vertical column and scroll up into the row one by one -> logo glows ->
 * logo moves up -> content appears below it.
 */
const LETTERS_START = 0.03;
const LETTERS_END = 0.62;
const MOVE_END = 0.7;
const CONTENT_START = MOVE_END;
const CONTENT_STEP = 0.04;
const CONTENT_SPAN = 0.12;
/** Horizontal centre of each letter and of the whole logo, in logo units (viewBox 840 x 139). */
const LETTER_CENTERS = [62, 242, 420, 599, 772];
const LOGO_CENTER = 419;
/** Vertical gap between letters in the column, and where the column starts below the row (logo units). */
const COLUMN_STEP = 190;
const COLUMN_OFFSET = 200;
/** How quickly the animation catches up with the scroll position (per 60fps frame). Lower = silkier. */
const SMOOTHING = 0.14;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * Hero: the 7EVYN logo assembles letter by letter as the visitor scrolls, over parallax
 * layers (a drifting outlined watermark, a breathing glow, gold rules). Once the logo is
 * complete, the tagline and buttons appear below it.
 *
 * Performance: progress is eased toward the scroll position and written straight to the few
 * moving elements as transform/opacity; nothing is set on the section, so nothing else restyles.
 */
export function HeroLogoReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const letterRefs = useRef<(SVGGElement | null)[]>([]);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rulesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const logoWrap = logoWrapRef.current;
    if (!section || !stage || !logoWrap) return;

    let sectionTop = 0;
    let stickyTop = 0;
    let scrollable = 1;
    let contentHeight = 0;
    let glowed = false;
    let revealed = false;

    /** Cache layout values so the per-frame work never reads layout. */
    const measure = () => {
      stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      scrollable = Math.max(section.offsetHeight - stage.offsetHeight, 1);
      contentHeight = blockRefs.current.reduce((sum, el) => sum + (el?.offsetHeight ?? 0), 0);
    };
    const readProgress = () => clamp01((window.scrollY + stickyTop - sectionTop) / scrollable);

    /** Write the scene for progress p (0 = empty stage, 1 = logo and content shown). */
    const apply = (p: number) => {
      const vh = window.innerHeight / 100;

      // Letters wait in a centred vertical column below the row. Scrolling moves the column up;
      // each letter, on reaching the row, slides sideways into its place. Units are the logo's own.
      const placed = clamp01((p - LETTERS_START) / (LETTERS_END - LETTERS_START)) * LOGO_LETTERS.length;
      letterRefs.current.forEach((g, i) => {
        if (!g) return;
        const t = easeOut(clamp01(placed - i));
        const startX = LOGO_CENTER - LETTER_CENTERS[i];
        const startY = COLUMN_OFFSET + Math.max(0, i - placed) * COLUMN_STEP;
        g.style.opacity = String(0.25 + 0.75 * clamp01(1 - (i - placed) / 3));
        g.style.transform = `translate3d(${startX * (1 - t)}px, ${startY * (1 - t)}px, 0)`;
      });

      // Once the logo is complete it moves up to make room, then the content fades in below it.
      const move = easeOut(clamp01((p - LETTERS_END) / (MOVE_END - LETTERS_END)));
      logoWrap.style.transform = `translate3d(0, ${(1 - move) * (contentHeight / 2)}px, 0)`;
      const c = clamp01((p - CONTENT_START) / (CONTENT_SPAN + CONTENT_STEP * (blockRefs.current.length - 1)));
      blockRefs.current.forEach((el, i) => {
        if (!el) return;
        const t = easeOut(clamp01((p - CONTENT_START - i * CONTENT_STEP) / CONTENT_SPAN));
        el.style.opacity = String(t);
        el.style.transform = `translate3d(0, ${(1 - t) * 28}px, 0)`;
      });

      // Parallax layers.
      if (watermarkRef.current) {
        watermarkRef.current.style.transform = `translate3d(${-p * 12}vw, ${(0.5 - p) * 18 * vh}px, 0) scale(${1.15 - p * 0.15})`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `scale(${0.7 + clamp01(p / LETTERS_END) * 0.5})`;
        glowRef.current.style.opacity = String(0.35 + 0.65 * clamp01(p / LETTERS_END));
      }
      const lettersDone = clamp01((p - LETTERS_END) / (MOVE_END - LETTERS_END));
      rulesRef.current.forEach((el) => el && (el.style.transform = `scaleX(${lettersDone})`));
      if (eyebrowRef.current) eyebrowRef.current.style.opacity = String(0.35 + 0.65 * clamp01(p / 0.15));
      if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp01(p / 0.08));

      // Logo glows once when it is complete; buttons become clickable once the content is visible.
      const nowRevealed = c > 0.6;
      if (nowRevealed !== revealed) {
        revealed = nowRevealed;
        section.dataset.revealed = String(revealed);
      }
      if (!glowed && p >= LETTERS_END && logoRef.current) {
        glowed = true;
        const logo = logoRef.current;
        logo.style.animation = "logo-glow 1.6s ease-in-out 1";
        logo.addEventListener("animationend", () => (logo.style.animation = ""), { once: true });
      }
    };

    // A reload should replay the hero from the top instead of jumping to the restored scroll
    // position and then animating to catch up. Section links (#perfumes etc.) are left alone.
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    // "instant": the site uses smooth scrolling, which would turn this reset into a visible glide.
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });

    measure();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.dataset.static = "true";
      glowed = true;
      apply(1);
      return;
    }

    // Start from the beginning and glide to the scroll position (e.g. when opened via a #section link).
    let current = 0;
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
    onScroll();
    return () => {
      window.history.scrollRestoration = previousRestoration;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="group/hero relative h-[340svh] bg-background data-[static=true]:h-auto"
    >
      <div
        ref={stageRef}
        className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden [contain:paint] group-data-[static=true]/hero:static group-data-[static=true]/hero:min-h-[calc(100svh-4rem)]"
      >
        {/* Parallax: breathing gold glow */}
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_50%_48%,color-mix(in_oklch,var(--gold)_22%,transparent),transparent_70%)] opacity-35 will-change-transform"
        />

        {/* Parallax: huge outlined logo watermark drifting behind */}
        <div aria-hidden className="animate-hero-rise pointer-events-none absolute inset-0 flex items-center justify-center">
          <div ref={watermarkRef} className="w-[150vw] max-w-none will-change-transform">
            <svg viewBox={LOGO_VIEWBOX} className="w-full text-foreground/[0.06]" fill="none" stroke="currentColor">
              {LOGO_LETTERS.flatMap((letter) =>
                letter.paths.map((d) => <path key={letter.id + d} d={d} vectorEffect="non-scaling-stroke" strokeWidth={1} />),
              )}
            </svg>
          </div>
        </div>

        {/* Fades and rises in on load, so the first frame never pops */}
        <div className="animate-hero-rise relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          <div ref={logoWrapRef} className="flex w-full flex-col items-center will-change-transform">
            <div ref={eyebrowRef} className="mb-6 flex flex-col items-center opacity-35 sm:mb-8">
              <span className="text-[11px] font-medium tracking-[0.35em] text-muted-foreground uppercase sm:text-xs sm:tracking-[0.5em]">
                Luxury Fragrance House
              </span>
            </div>

            {/* Logo with gold rules that draw outward when it is complete */}
            <div className="flex w-full items-center justify-center gap-4 sm:gap-8">
              <span
                ref={(el) => {
                  rulesRef.current[0] = el;
                }}
                aria-hidden
                className="hidden h-px flex-1 origin-right bg-gradient-to-l from-gold to-transparent sm:block"
                style={{ transform: "scaleX(0)" }}
              />
              <h1 className="w-[min(78vw,620px)] shrink-0">
                <span className="sr-only">{siteConfig.name}</span>
                <svg ref={logoRef} aria-hidden viewBox={LOGO_VIEWBOX} className="w-full overflow-visible fill-current text-foreground">
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
              <span
                ref={(el) => {
                  rulesRef.current[1] = el;
                }}
                aria-hidden
                className="hidden h-px flex-1 origin-left bg-gradient-to-r from-gold to-transparent sm:block"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>

          {/* Content below the logo, revealed after the last letter lands */}
          <div className="pointer-events-none flex w-full flex-col items-center group-data-[revealed=true]/hero:pointer-events-auto group-data-[static=true]/hero:pointer-events-auto">
            <div ref={(el) => {
              blockRefs.current[0] = el;
            }} style={{ opacity: 0 }}>
              <p className="mt-5 text-base tracking-[0.5em] uppercase sm:mt-6 sm:text-lg md:text-2xl md:tracking-[0.6em]">
                Perfume
              </p>
            </div>
            <div ref={(el) => {
              blockRefs.current[1] = el;
            }} style={{ opacity: 0 }}>
              <p className="mt-5 font-heading text-2xl sm:mt-7 sm:text-3xl md:text-4xl">
                Seven scents. <span className="text-gold-light italic">Infinite stories.</span>
              </p>
              <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
                Crafted in small batches, delivered to your door.
              </p>
            </div>
            <div ref={(el) => {
              blockRefs.current[2] = el;
            }} className="w-full sm:w-auto" style={{ opacity: 0 }}>
              <div className="mx-auto mt-6 flex w-full max-w-xs flex-col justify-center gap-3 sm:mt-8 sm:max-w-none sm:flex-row">
                <Button asChild size="lg" className="h-11 px-6">
                  <Link href="#perfumes">Shop the collection</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-11 bg-background/85 px-6">
                  <Link href="#collection">Featured</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint, only before the letters start */}
        <div
          ref={hintRef}
          aria-hidden
          className="pointer-events-none absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-[11px] tracking-[0.35em] text-muted-foreground uppercase"
        >
          Scroll
          <ArrowDownIcon className="size-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
