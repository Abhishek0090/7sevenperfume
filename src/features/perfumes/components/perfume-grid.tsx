import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import type { Perfume } from "../types";
import { PerfumeCard } from "./perfume-card";

export function PerfumeGrid({ perfumes }: { perfumes: Perfume[] }) {
  return (
    <section id="perfumes" className="scroll-mt-16 py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="Shop" title="All perfumes" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
          {perfumes.map((perfume) => (
            <PerfumeCard key={perfume.id} perfume={perfume} />
          ))}
        </div>
      </Container>
    </section>
  );
}
