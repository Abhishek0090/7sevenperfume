import type { FragranceFamily } from "./types";

export interface FamilyInfo {
  id: FragranceFamily;
  label: string;
  notes: string;
  gradient: string;
  image: string;
}

export const FAMILIES: FamilyInfo[] = [
  {
    id: "floral",
    label: "Floral",
    notes: "Rose · Iris · Peony",
    gradient: "linear-gradient(160deg,#f7c6d0,#c9476b)",
    image: "/images/perfumes/rose-eternelle/notes.svg",
  },
  {
    id: "woody",
    label: "Woody",
    notes: "Oud · Leather · Cedar",
    gradient: "linear-gradient(160deg,#c49a6c,#3d2615)",
    image: "/images/perfumes/oud-royale/notes.svg",
  },
  {
    id: "fresh",
    label: "Fresh",
    notes: "Citrus · Marine · Mint",
    gradient: "linear-gradient(160deg,#ffe39a,#5fa8d3)",
    image: "/images/perfumes/citrus-riviera/notes.svg",
  },
  {
    id: "amber",
    label: "Amber",
    notes: "Vanilla · Tonka · Spice",
    gradient: "linear-gradient(160deg,#f6c38b,#8a3b14)",
    image: "/images/perfumes/velvet-amber/notes.svg",
  },
];
