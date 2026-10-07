import { HeroParallax } from "@/features/home/components/hero-parallax";
import { PerfumeCarousel } from "@/features/perfumes/components/perfume-carousel";
import { PerfumeGrid } from "@/features/perfumes/components/perfume-grid";
import { getAllPerfumes, getFeaturedPerfumes } from "@/features/perfumes/services/perfume.service";

export default async function HomePage() {
  const [featured, perfumes] = await Promise.all([getFeaturedPerfumes(), getAllPerfumes()]);

  return (
    <>
      <HeroParallax />
      <PerfumeCarousel perfumes={featured} />
      <PerfumeGrid perfumes={perfumes} />
    </>
  );
}
