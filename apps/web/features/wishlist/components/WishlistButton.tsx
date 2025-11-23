import { Button } from "@repo/ui/components/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { addItemToWishlist, deleteWishlistItem } from "@/actions/wishlist";
import { useWishlistStore } from "@/features/wishlist/store/useWishlistStore";
import { useServerAction } from "@/hooks/useServerAction";
import type { ProductWithRelations } from "@/types/index";

type WishlistButtonProps = {
  product: ProductWithRelations;
};

export const WishlistButton = ({ product }: WishlistButtonProps) => {
  const { items, addToWishlist, removeFromWishlist } = useWishlistStore();
  const inWishlist = items.find((p) => p.product_id === product.id);
  const [runAddItemToWishlistAction] = useServerAction(addItemToWishlist);
  const [runDeleteItemToWishlistAction] = useServerAction(deleteWishlistItem);

  const inventories = product.product_variants
    .map((variant) => variant.inventory?.[0])
    .filter(Boolean);

  // Menjumlahkan stok
  const totalStock = inventories.reduce(
    (sum, inv) => sum + (inv?.stock_quantity ?? 0),
    0
  );

  const handleOnClick = async (product: ProductWithRelations) => {
    if (!product.id) return;

    if (inWishlist) {
      await runDeleteItemToWishlistAction({
        wishlist_item_id: inWishlist.wishlist_item_id,
      });
      removeFromWishlist(inWishlist.wishlist_item_id);

      toast.success("Dihapus dari Wishlist");
    } else {
      const wishlist_item = await runAddItemToWishlistAction({
        variant_id: product.product_variants[0]?.id ?? "",
      });
      addToWishlist({
        product_id: product.id,
        wishlist_item_id: wishlist_item?.id as number,
        name: product.title,
        slug: product.slug,
        image: product.product_images[0]?.url as string,
        price: Number(product.price_cents),
        inStock: totalStock > 0,
      });

      toast.success("Ditambahkan ke Wishlist");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-11 w-11 hover:bg-secondary"
      onClick={() => handleOnClick(product)}
    >
      <Heart className={`h-5 w-5 ${inWishlist ? "fill-rose-400" : ""}`} />
    </Button>
  );
};
