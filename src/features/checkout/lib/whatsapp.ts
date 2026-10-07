import { siteConfig } from "@/config/site";
import type { Dealer } from "@/features/perfumes/types";
import { formatPrice } from "@/lib/format";

export interface OrderLine {
  id: string;
  name: string;
  sizeMl: number;
  price: number;
  quantity: number;
}

interface WhatsAppOrder {
  dealer: Dealer;
  lines: OrderLine[];
  pageUrl?: string;
}

export function buildOrderMessage({ dealer, lines, pageUrl }: WhatsAppOrder) {
  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  const message = [`Hi ${dealer.name}, I would like to order:`, ""];
  lines.forEach((line, i) => {
    message.push(
      `${i + 1}. ${line.name} (${line.sizeMl} ml)`,
      `   Product ID: ${line.id}`,
      `   Quantity: ${line.quantity} x ${formatPrice(line.price)} = ${formatPrice(line.price * line.quantity)}`,
    );
  });
  message.push("", `Total: ${formatPrice(total)}`);
  if (pageUrl) message.push("", `Link: ${pageUrl}`);

  return message.join("\n");
}

/** Returns a wa.me link that opens a chat with the dealer and a pre-filled order message. */
export function buildWhatsAppCheckoutUrl(order: WhatsAppOrder) {
  const number = (order.dealer.whatsappNumber || siteConfig.defaultWhatsAppNumber).replace(/\D/g, "");
  // encodeURIComponent (not URLSearchParams) so spaces become %20 rather than "+".
  return `https://wa.me/${number}?text=${encodeURIComponent(buildOrderMessage(order))}`;
}

export function openWhatsAppCheckout(order: WhatsAppOrder) {
  window.open(buildWhatsAppCheckoutUrl(order), "_blank", "noopener,noreferrer");
}
