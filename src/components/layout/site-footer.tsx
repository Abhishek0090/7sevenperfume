import Link from "next/link";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-primary text-primary-foreground">
      <Container className="grid gap-12 py-16 md:grid-cols-3 md:py-20">
        <div className="space-y-4">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-3xl font-semibold">7</span>
            <span className="text-sm font-medium tracking-[0.35em] uppercase">Seven</span>
          </div>
          <p className="max-w-xs text-sm text-primary-foreground/70">{siteConfig.description}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-widest uppercase">Explore</h3>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-primary-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-widest uppercase">Contact</h3>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li className="flex items-center gap-2">
              <MailIcon className="size-4" />
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-primary-foreground">
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="size-4" />
              {siteConfig.contact.phone}
            </li>
            <li className="flex items-center gap-2">
              <MapPinIcon className="size-4" />
              {siteConfig.contact.address}
            </li>
          </ul>
        </div>
      </Container>

      <Separator className="bg-primary-foreground/15" />
      <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-primary-foreground/60 md:flex-row">
        <p>
          &copy; {year} {siteConfig.name}. All rights reserved.
        </p>
        <p>Orders are confirmed over WhatsApp by our dealers.</p>
      </Container>
    </footer>
  );
}
