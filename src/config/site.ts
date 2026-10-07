export const siteConfig = {
  name: "7 Seven Perfume",
  shortName: "7 Seven",
  description:
    "Hand-picked luxury fragrances. Browse the 7 Seven collection and order directly on WhatsApp.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  currency: "INR",
  locale: "en-IN",
  /** Fallback dealer number (international format, digits only) used when a perfume has no dealer of its own. */
  defaultWhatsAppNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999",
  contact: {
    email: "hello@7seven.example",
    phone: "+91 99999 99999",
    address: "Mumbai, India",
  },
  nav: [
    { label: "Home", href: "/#top" },
    { label: "Collection", href: "/#collection" },
    { label: "All Perfumes", href: "/#perfumes" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;
