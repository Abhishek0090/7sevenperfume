import { cn } from "@/lib/utils";

/** Page-width wrapper. Every section uses this so side margins stay consistent. */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12", className)} {...props} />;
}
