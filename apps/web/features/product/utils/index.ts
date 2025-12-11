import type { Inventory } from "@repo/db";
import type { ProductWithRelations } from "@/types/index";

// -------------------------
// Helpers
// -------------------------

export const parseOptions = (value: any) =>
  typeof value === "string" ? JSON.parse(value) : value;

export const findVariant = (
  product: ProductWithRelations,
  size: string | undefined,
  color: string | undefined,
) => {
  // Handle simple product (single variant, no options)
  if (product.product_variants.length === 1) {
    const variant = product.product_variants[0];
    const opts = parseOptions(variant?.option_values);
    if (!opts || Object.keys(opts).length === 0) {
      return variant;
    }
  }

  return product.product_variants.find((v) => {
    const opts = parseOptions(v.option_values);
    return (
      opts?.size?.toLowerCase() === size?.toLowerCase() &&
      opts?.color?.toLowerCase() === color?.toLowerCase()
    );
  });
};

export const getVariantStock = (variant: { inventory: Inventory[] }) =>
  variant?.inventory?.reduce(
    (total, inv) =>
      total + (inv.stock_quantity - inv.reserved_quantity - inv.safety_stock),
    0,
  ) ?? 0;
