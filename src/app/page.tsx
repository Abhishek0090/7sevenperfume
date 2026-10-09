import { BrandStory } from "@/features/home/components/brand-story";
// import { FragranceFamilies } from "@/features/home/components/fragrance-families";
import { HeroLogoReveal } from "@/features/home/components/hero-logo-reveal";
// import { HeroParallax, type HeroShade } from "@/features/home/components/hero-parallax";
import type { HeroStats } from "@/features/home/components/hero-parallax";
// import { MarqueeBand } from "@/features/home/components/marquee-band";
import { PerfumeCarousel } from "@/features/perfumes/components/perfume-carousel";
import { PerfumeGrid } from "@/features/perfumes/components/perfume-grid";
import { getAllPerfumes, getFeaturedPerfumes } from "@/features/perfumes/services/perfume.service";

export default async function HomePage() {
  const [featured, perfumes] = await Promise.all([getFeaturedPerfumes(), getAllPerfumes()]);

  // Hero facts come from the catalogue so they stay accurate as perfumes are added.
  const totalReviews = perfumes.reduce((sum, p) => sum + p.reviewCount, 0);
  const newest = [...perfumes].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const heroStats: HeroStats = {
    perfumeCount: perfumes.length,
    totalReviews,
    // Weighted by review count, like a store-wide average.
    averageRating: totalReviews ? perfumes.reduce((sum, p) => sum + p.rating * p.reviewCount, 0) / totalReviews : 0,
    concentrations: [...new Set(perfumes.map((p) => p.concentration))],
    newest: { name: newest.name, slug: newest.slug },
  };
  // Colours for the bottle hero (disabled below). Restore together with <HeroParallax />.
  // const heroShades: HeroShade[] = [...perfumes]
  //   .sort((a, b) => (a.family === "amber" ? -1 : b.family === "amber" ? 1 : 0))
  //   .map((p) => ({ name: p.name, slug: p.slug, tint: p.tint }));

  return (
    <>
      {/* Bottle hero disabled for now. Restore by uncommenting this, its import and heroShades above. */}
      {/* <HeroParallax stats={heroStats} shades={heroShades} /> */}
      <HeroLogoReveal />
      {/* Ticker band disabled for now. Restore by uncommenting this line and the import above. */}
      {/* <MarqueeBand /> */}
      <PerfumeCarousel perfumes={featured} />
      {/* "Find your family" disabled for now. Restore by uncommenting this line and its import. */}
      {/* <FragranceFamilies /> */}
      <BrandStory stats={heroStats} />
      <PerfumeGrid perfumes={perfumes} />
    </>
  );
}
