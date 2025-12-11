/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { format } from "date-fns";
import { CheckCircle, ChevronDown, Star } from "lucide-react";
import { useMemo, useState } from "react";
import type { ProductWithRelations } from "@/types/index";

type ProductTabsProps = {
  product: ProductWithRelations;
};

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [openSections, setOpenSections] = useState<string[]>(["description"]);
  const reviews = product.reviews || [];

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const ratingSummary = useMemo(() => {
    const ratingCount: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    let totalRating = 0;

    for (const review of reviews) {
      const safeRating = Math.min(5, Math.max(1, review.rating || 0));
      ratingCount[safeRating] = (ratingCount[safeRating] || 0) + 1;
      totalRating += safeRating;
    }

    const reviewCount = reviews.length;
    const average = reviewCount ? totalRating / reviewCount : 0;

    return { average, reviewCount, ratingCount };
  }, [reviews]);

  const renderStars = (value: number) => (
    <>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            value >= star - 0.25
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30",
          )}
        />
      ))}
    </>
  );

  const sections = [
    {
      id: "description",
      title: "Deskripsi Produk",
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {product.description || "Deskripsi produk belum tersedia."}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {["Premium Quality", "Comfortable Fit", "Easy Care", "Durable"].map(
              (feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ),
            )}
          </div>
        </div>
      ),
    },
    {
      id: "materials",
      title: "Material & Perawatan",
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold">Komposisi</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• 80% Premium Cotton</p>
              <p>• 20% Polyester</p>
              <p>• Weight: 320 GSM</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Cara Perawatan</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Cuci dengan air dingin</p>
              <p>• Hindari pemutih</p>
              <p>• Setrika suhu rendah</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "reviews",
      title: `Ulasan Pembeli (${reviews.length})`,
      content: (
        <div className="space-y-8">
          {/* Rating Summary */}
          {ratingSummary.reviewCount > 0 && (
            <div className="flex items-center gap-8 p-6 bg-secondary/50 rounded-2xl">
              <div className="text-center">
                <p className="text-5xl font-bold">
                  {ratingSummary.average.toFixed(1)}
                </p>
                <div className="flex gap-0.5 mt-2 justify-center">
                  {renderStars(ratingSummary.average)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {ratingSummary.reviewCount} ulasan
                </p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingSummary.ratingCount[star] || 0;
                  const percentage =
                    ratingSummary.reviewCount > 0
                      ? (count / ratingSummary.reviewCount) * 100
                      : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm w-3">{star}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Belum ada ulasan</p>
              <Button className="mt-4">Tulis Ulasan Pertama</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  className="p-6 rounded-xl border border-border"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        {review.user.image ? (
                          <img
                            src={review.user.image}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold">
                            {review.user?.name?.[0]?.toUpperCase() || "P"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {review.user?.name || "Pembeli"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(review.created_at), "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {renderStars(review.rating || 0)}
                    </div>
                  </div>
                  {review.title && (
                    <p className="font-medium mb-2">{review.title}</p>
                  )}
                  {review.body && (
                    <p className="text-muted-foreground text-sm">
                      {review.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mt-16 space-y-4">
      {sections.map((section) => {
        const isOpen = openSections.includes(section.id);
        return (
          <div
            key={section.id}
            className="border border-border rounded-2xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary/50 transition-colors"
            >
              <span className="text-lg font-semibold">{section.title}</span>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen && <div className="px-6 pb-6">{section.content}</div>}
          </div>
        );
      })}
    </div>
  );
};

export default ProductTabs;
