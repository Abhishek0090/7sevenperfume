import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono, Jost } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { ThemeProvider, themeInitScript } from "@/components/theme/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { CartProvider } from "@/features/cart/store/cart-context";
import "./globals.css";

// Body and UI: clean geometric sans that matches the thin, round strokes of the logo.
const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Headings: high-contrast luxury serif.
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Luxury Fragrances`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${geistMono.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
      // themeInitScript adds the "dark" class before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <TooltipProvider>
            <CartProvider>
              <ScrollProgress />
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </CartProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
