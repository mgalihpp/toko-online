"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb";
import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Heart, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { getOrCreateWishlist } from "@/actions/wishlist";
import { formatCurrency } from "@/features/admin/utils";
import { getVariantStock } from "@/features/product/utils";
import { useWishlistStore } from "@/features/wishlist/store/useWishlistStore";
import { useServerAction } from "@/hooks/useServerAction";

export default function WishlistPage() {
  const {
    items,
    loading: isWishlistLoading,
    addToWishlist,
    removeFromWishlist,
    setLoading,
  } = useWishlistStore();
  const [runGetOrCreateWishlistAction] = useServerAction(getOrCreateWishlist);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const loadWishlist = async () => {
      if (items.length > 0) return;
      setLoading(true);
      const wishlist = await runGetOrCreateWishlistAction({});
      if (!wishlist?.wishlist_items?.length) {
        setLoading(false);
        return;
      }

      const wishlistItems = wishlist.wishlist_items.map((wi) => {
        const variant = wi.variant;
        const product = variant.product;

        // Ambil gambar pertama yang sort_order terkecil
        const imageUrl =
          product.product_images.sort((a, b) => a.sort_order - b.sort_order)[0]
            ?.url || "/placeholder.jpg";

        // Gabung harga produk + additional harga variant
        const totalPriceCents =
          Number(product.price_cents) + Number(variant.additional_price_cents);

        const stock = getVariantStock(wi.variant);

        return {
          product_id: wi.variant.product.id,
          wishlist_item_id: wi.id,
          name: wi.variant.product.title,
          slug: wi.variant.product.slug,
          image: imageUrl,
          inStock: stock > 0,
          price: totalPriceCents,
        };
      });
      wishlistItems.forEach((wi) => {
        addToWishlist(wi);
      });

      setLoading(false);
    };

    loadWishlist();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Wishlist</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl sm:text-3xl font-bold mt-4">Wishlist Kamu</h1>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isWishlistLoading ? (
          // Skeleton Grid - Layout 100% sama dengan yang asli
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="group relative">
                {/* Tombol X skeleton */}
                <Skeleton className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full" />

                {/* Gambar skeleton */}
                <Skeleton className="aspect-square w-full rounded-lg bg-muted" />

                {/* Text skeleton */}
                <div className="py-4 space-y-3">
                  <Skeleton className="h-5 w-11/12" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-7 w-1/2" />
                  <Skeleton className="h-4 w-28 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart />
            </div>
            <h2 className="text-xl font-semibold mb-2">Wishlist Anda kosong</h2>
            <p className="text-muted-foreground mb-6">
              Tambahkan produk favorit Anda ke wishlist
            </p>
            <Link href="/products">
              <Button>Lanjutkan Berbelanja</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Link
                href={`/product/${item.slug}`}
                key={item.product_id}
                className="group relative transition-all"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-8 w-8 bg-background/80 hover:bg-background"
                  onClick={() => removeFromWishlist(item.wishlist_item_id)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="overflow-hidden">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="py-4 space-y-2">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="font-bold text-base">
                    {formatCurrency(item.price)}
                  </p>
                  <div className="space-y-2">
                    {item.inStock ? (
                      <p className="text-xs text-center text-muted-foreground">
                        Stok tersedia
                      </p>
                    ) : (
                      <p className="text-xs text-center text-muted-foreground">
                        Stok Habis
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
