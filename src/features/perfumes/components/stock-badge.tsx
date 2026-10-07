import { Badge } from "@/components/ui/badge";

const LOW_STOCK_THRESHOLD = 10;

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <Badge variant="secondary">Out of stock</Badge>;
  if (stock <= LOW_STOCK_THRESHOLD) return <Badge variant="outline">Only {stock} left</Badge>;
  return <Badge variant="outline">In stock</Badge>;
}
