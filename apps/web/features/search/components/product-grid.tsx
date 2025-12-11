/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import type { Reviews } from "@repo/db";
import { Star } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { formatCurrency } from "@/features/admin/utils";
import type { ProductWithRelations } from "@/types/index";

export const ProductGrid = memo(function ProductGrid({
  products,
}: {
  products: ProductWithRelations[];
}) {
  const renderStars = (reviews: Reviews[]) => {
    const total =
      reviews?.reduce((acc, review) => acc + (review.rating || 0), 0) || 0;
    const count = reviews?.length || 0;
    const avgRating = count > 0 ? total / count : 0;
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating % 1 >= 0.5;

    return (
      <>
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <Star
              key={`full-${i}`}
              className="w-3 h-3 fill-current text-yellow-500"
            />
          ))}
        {hasHalfStar && (
          <Star key="half" className="w-3 h-3 fill-current text-yellow-400" />
        )}
        {Array(5 - fullStars - (hasHalfStar ? 1 : 0))
          .fill(0)
          .map((_, i) => (
            <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
          ))}
      </>
    );
  };

  if (products.length === 0)
    return (
      <div className="text-center py-16">
        <p className="text-xl text-muted-foreground">
          Tidak ada produk ditemukan
        </p>
      </div>
    );

  return (
    <div className="lg:col-span-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            className="group relative transition-all"
          >
            <div className="overflow-hidden">
              <img
                src={p.product_images[0]?.url || "/placeholder.png"}
                alt={p.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="py-4 space-y-2">
              <h3 className="font-medium text-sm line-clamp-1">{p.title}</h3>
              <div className="flex items-center gap-1">
                {p.reviews.length !== 0 && renderStars(p.reviews)}
                <span className="text-xs text-muted-foreground ml-1">
                  {(() => {
                    const total =
                      p.reviews?.reduce(
                        (acc, review) => acc + (review.rating || 0),
                        0,
                      ) || 0;
                    const count = p.reviews?.length || 0;
                    return count > 0
                      ? `${(total / count).toFixed(1)} (${count})`
                      : "Belum ada ulasan";
                  })()}
                </span>
              </div>
              <p className="font-bold text-base">
                {formatCurrency(Number(p.price_cents))}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});
