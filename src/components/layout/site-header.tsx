"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { CartSheet } from "@/features/cart/components/cart-sheet";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        scrolled ? "border-b bg-background/85 backdrop-blur-md" : "bg-background",
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" aria-label={`${siteConfig.name} home`} className="flex items-center">
          <BrandLogo priority className="h-5 md:h-6" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <CartSheet />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{siteConfig.name}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {siteConfig.nav.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link href={item.href} className="rounded-md px-2 py-3 text-base hover:bg-muted">
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
