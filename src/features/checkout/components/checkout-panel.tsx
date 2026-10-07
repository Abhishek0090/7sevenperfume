"use client";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { useCart } from "@/features/cart/store/cart-context";
import type { Perfume } from "@/features/perfumes/types";
import { formatPrice } from "@/lib/format";
import { openWhatsAppCheckout } from "../lib/whatsapp";

export function CheckoutPanel({ perfume }: { perfume: Perfume }) {
  const { getQuantity } = useCart();
  const soldOut = perfume.stock <= 0;
  // Buy-now uses the quantity already chosen in the cart, or 1.
  const quantity = Math.max(1, getQuantity(perfume.id));

  const handleCheckout = () =>
    openWhatsAppCheckout({
      dealer: perfume.dealer,
      lines: [
        {
          id: perfume.id,
          name: perfume.name,
          sizeMl: perfume.sizeMl,
          price: perfume.price,
          quantity,
        },
      ],
      pageUrl: window.location.href,
    });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <AddToCartButton perfume={perfume} className="w-full" />
        <Button size="lg" className="h-12 w-full text-base" disabled={soldOut} onClick={handleCheckout}>
          {!soldOut && <WhatsAppIcon />}
          {soldOut ? "Out of stock" : "Proceed to checkout"}
        </Button>
      </div>
      {!soldOut && (
        <p className="text-sm text-muted-foreground">
          {quantity} x {formatPrice(perfume.price)} ={" "}
          <span className="font-semibold text-foreground">{formatPrice(perfume.price * quantity)}</span>
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Checkout opens WhatsApp with your order details pre-filled for {perfume.dealer.name}.
      </p>
    </div>
  );
}
