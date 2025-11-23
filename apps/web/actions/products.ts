"use server";

import { db } from "@repo/db";

/**
 * Mendapatkan product berdasarkan slug.
 * Akan:
 *   - Mengembalikan data produk
 * @param slug - slug dari product url
 * @returns { product: ProductWithRelations }
 * @throws Error jika produk tidak ditemukan
 */
export const getProductBySlug = async (slug: string) => {
  try {
    const product = await db.product.findFirst({
      where: {
        slug,
      },
      include: {
        category: true,
        product_variants: {
          include: {
            inventory: true,
          },
        },
        product_images: true,
        reviews: true,
      },
    });

    return product;
  } catch (error) {
    console.error("[getProductBySlug] Error:", error);
  }
};
