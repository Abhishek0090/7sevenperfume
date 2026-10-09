import { perfumeImage } from "@/lib/perfume-image";
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
    notes: "Peach · Jasmine · Vanilla",
    gradient: "linear-gradient(160deg,#f5e8d8,#b88b52)",
    image: perfumeImage("sweet-talk", "notes.svg"),
  },
  {
    id: "woody",
    label: "Woody",
    notes: "Oud · Saffron · Orange",
    gradient: "linear-gradient(160deg,#e9d8f0,#75469a)",
    image: perfumeImage("plump-me-up", "notes.svg"),
  },
  {
    id: "fresh",
    label: "Fresh",
    notes: "Citrus · Mint · Fig",
    gradient: "linear-gradient(160deg,#d9f0f7,#087eaa)",
    image: perfumeImage("beach-please", "notes.svg"),
  },
  {
    id: "amber",
    label: "Amber",
    notes: "Rum · Leather · Toffee",
    gradient: "linear-gradient(160deg,#c9705a,#68191d)",
    image: perfumeImage("bombastic", "notes.svg"),
  },
];
