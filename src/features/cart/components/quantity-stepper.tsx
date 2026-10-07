"use client";

import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
  size?: "sm" | "lg";
  className?: string;
}

/** Decreasing below 1 calls onChange(0), which removes the item from the cart. */
export function QuantityStepper({ quantity, max, onChange, size = "lg", className }: QuantityStepperProps) {
  const iconSize = size === "lg" ? "icon-lg" : "icon-sm";

  return (
    <div className={cn("flex items-center justify-between rounded-lg border bg-background", className)}>
      <Button
        variant="ghost"
        size={iconSize}
        aria-label={quantity <= 1 ? "Remove from cart" : "Decrease quantity"}
        onClick={() => onChange(quantity - 1)}
      >
        {quantity <= 1 ? <Trash2Icon /> : <MinusIcon />}
      </Button>
      <span className="min-w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <Button
        variant="ghost"
        size={iconSize}
        aria-label="Increase quantity"
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
