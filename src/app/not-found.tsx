import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center gap-4 px-5 py-20 text-center">
      <p className="font-heading text-7xl font-semibold">404</p>
      <p className="text-muted-foreground">We could not find that page.</p>
      <Button asChild size="lg" className="h-10 px-5">
        <Link href="/">Back to home</Link>
      </Button>
    </section>
  );
}
