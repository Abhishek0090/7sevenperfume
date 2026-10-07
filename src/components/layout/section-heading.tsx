import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  className?: string;
  children?: React.ReactNode;
}

/** Eyebrow + title used at the top of each section. `children` render on the right (e.g. carousel arrows). */
export function SectionHeading({ eyebrow, title, className, children }: SectionHeadingProps) {
  return (
    <div className={cn("mb-12 flex items-end justify-between gap-6 md:mb-16", className)}>
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium tracking-[0.4em] text-muted-foreground uppercase">{eyebrow}</span>
        <h2 className="font-heading text-4xl font-semibold md:text-5xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}
