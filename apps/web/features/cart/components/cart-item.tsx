"use client";

import { Button } from "@repo/ui/components/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import {
  deleteCartItem,
  updateQuantity as updateCartItemQuantity,
} from "@/actions/cart";
import { formatCurrency } from "@/features/admin/utils";
import { useCartStore } from "@/features/cart/store/useCartStore";
import type { CartItem as CartItemType } from "@/features/cart/types/cart.types";
import { useServerAction } from "@/hooks/useServerAction";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCartStore();
  const [runUpdateCartItemQuantityAction] = useServerAction(
    updateCartItemQuantity
  );
  const [runDeleteCartItemAction] = useServerAction(deleteCartItem);

  const incrementQuantity = async () => {
    const newQty = item.quantity + 1;

    updateQuantity(item.cart_item_id, item.variant_id, newQty);

    await runUpdateCartItemQuantityAction({
      cart_item_id: item.cart_item_id,
      quantity: newQty,
    });
  };

  const decrementQuantity = async () => {
    const newQty = item.quantity - 1;

    if (newQty > 0) {
      updateQuantity(item.cart_item_id, item.variant_id, newQty);
    } else {
      removeFromCart(item.cart_item_id, item.variant_id);
    }

    if (newQty <= 0) {
      await runDeleteCartItemAction({
        cart_item_id: item.cart_item_id,
      });
    } else {
      await runUpdateCartItemQuantityAction({
        cart_item_id: item.cart_item_id,
        quantity: newQty,
      });
    }
  };

  return (
    <div className="flex items-start gap-4 border-b pb-4 w-full">
      {/* Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-contain"
        />
      </div>

      {/* Middle Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm text-foreground truncate">
            {item.name}
          </h3>

          <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
            {item.color && <span>Color: {item.color}</span>}
            {item.size && <span>Size: {item.size}</span>}
            {item.storage && <span>Stock: {item.storage}</span>}
          </div>
        </div>

        <p className="mt-2 font-medium text-sm text-foreground">
          {formatCurrency(item.price * item.quantity)}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex flex-col items-end flex-shrink-0 gap-2">
        {/* Remove */}
        <Button
          variant="ghost"
          size="icon"
          onClick={async () => {
            removeFromCart(item.cart_item_id, item.variant_id);

            await runDeleteCartItemAction({ cart_item_id: item.cart_item_id });
          }}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>

        {/* Quantity Box */}
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={decrementQuantity}
            className="h-7 w-7 p-0"
          >
            <Minus className="w-3 h-3" />
          </Button>

          <span className="w-6 text-center text-sm">{item.quantity}</span>

          <Button
            variant="ghost"
            size="icon"
            onClick={incrementQuantity}
            className="h-7 w-7 p-0"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
