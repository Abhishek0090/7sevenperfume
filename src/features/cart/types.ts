import type { Dealer } from "@/features/perfumes/types";

/**
 * A snapshot of the perfume at the time it was added. When a database is
 * added, persist `perfumeId` + `quantity` per user and re-read price/stock
 * from the server before checkout.
 */
export interface CartItem {
  perfumeId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  sizeMl: number;
  stock: number;
  dealer: Dealer;
  quantity: number;
}
