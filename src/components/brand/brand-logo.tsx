import Image from "next/image";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const LOGO_WIDTH = 840;
const LOGO_HEIGHT = 139;

const SOURCES = {
  black: "/brand/seven_black.svg",
  white: "/brand/seven_white.svg",
} as const;

interface BrandLogoProps {
  /**
   * "auto" (default): black logo in light mode, white logo in dark mode.
   * "black" / "white": always that colour, e.g. white on the dark footer.
   */
  variant?: "auto" | "black" | "white";
  /** Size the logo with a height class, e.g. "h-6"; width follows the 840x139 ratio. */
  className?: string;
  /** Load eagerly when the logo is above the fold (header, hero). */
  priority?: boolean;
}

export function BrandLogo({ variant = "auto", className, priority = false }: BrandLogoProps) {
  const image = (color: keyof typeof SOURCES, extra?: string) => (
    <Image
      src={SOURCES[color]}
      alt={siteConfig.name}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={cn("h-full w-auto", extra)}
    />
  );

  return (
    <span className={cn("inline-flex h-6 shrink-0", className)}>
      {variant === "auto" ? (
        <>
          {image("black", "dark:hidden")}
          {image("white", "hidden dark:block")}
        </>
      ) : (
        image(variant)
      )}
    </span>
  );
}
