export type NoteFamily =
  | "citrus"
  | "floral"
  | "woody"
  | "spicy"
  | "fresh"
  | "sweet"
  | "musky"
  | "green"
  | "fruity";

export type NoteLayer = "top" | "heart" | "base";

export type FragranceFamily = "floral" | "woody" | "fresh" | "amber";

export interface FragranceNote {
  name: string;
  family: NoteFamily;
  layer: NoteLayer;
}

export interface PerfumeImage {
  src: string;
  alt: string;
}

export interface Dealer {
  id: string;
  name: string;
  /** International format, digits only, e.g. 919876543210 */
  whatsappNumber: string;
}

/**
 * Shape mirrors a future `perfumes` table. Keep fields flat and serialisable
 * so the same type works for mock data, a REST API or an ORM model.
 */
export interface Perfume {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  price: number;
  /** Bottle size in millilitres */
  sizeMl: number;
  /** Units in stock */
  stock: number;
  concentration: "Eau de Parfum" | "Eau de Toilette" | "Parfum" | "Attar";
  gender: "Men" | "Women" | "Unisex";
  family: FragranceFamily;
  /** Brand colour of the scent, used for page tints and accents. */
  tint: string;
  /** First image is the cover used on cards, carousel and cart. */
  images: PerfumeImage[];
  notes: FragranceNote[];
  dealer: Dealer;
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}
