"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface RevealProps extends React.ComponentProps<"div"> {
  /** Delay in ms, used to stagger items in a list. */
  delay?: number;
  variant?: "up" | "fade" | "scale";
}

/**
 * Fades/slides its children in the first time they scroll into view.
 * Styles live in globals.css ([data-reveal]); reduced-motion users see content immediately.
 */
export function Reveal({ delay = 0, variant = "up", className, style, children, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={variant === "up" ? "" : variant}
      className={cn(className)}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}
