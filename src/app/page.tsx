import { BrandStory } from "@/features/home/components/brand-story";
import { FragranceFamilies } from "@/features/home/components/fragrance-families";
import { HeroParallax } from "@/features/home/components/hero-parallax";
// import { MarqueeBand } from "@/features/home/components/marquee-band";
import { PerfumeCarousel } from "@/features/perfumes/components/perfume-carousel";
import { PerfumeGrid } from "@/features/perfumes/components/perfume-grid";
import { getAllPerfumes, getFeaturedPerfumes } from "@/features/perfumes/services/perfume.service";

export default async function HomePage() {
  const [featured, perfumes] = await Promise.all([getFeaturedPerfumes(), getAllPerfumes()]);

  return (
    <>
      <HeroParallax />
      {/* Ticker band disabled for now. Restore by uncommenting this line and the import above. */}
      {/* <MarqueeBand /> */}
      <PerfumeCarousel perfumes={featured} />
      <FragranceFamilies />
      <BrandStory />
      <PerfumeGrid perfumes={perfumes} />
    </>
  );
}
