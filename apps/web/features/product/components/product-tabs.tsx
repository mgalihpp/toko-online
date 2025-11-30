/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import { Button } from "@repo/ui/components/button";
import { format } from "date-fns";
import { Calendar, CheckCircle, Star } from "lucide-react";
import { useMemo, useState } from "react";
import type { ProductWithRelations } from "@/types/index";

type TabType = "description" | "specs" | "reviews" | "qa";
type ProductTabsProps = {
  product: ProductWithRelations;
};

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const reviews = product.reviews || [];

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

    return {
      average,
      reviewCount,
      ratingCount,
    };
  }, [reviews]);

  const renderStars = (value: number, size: "sm" | "md" = "md") => {
    const iconClass = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
    return (
      <>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = value >= star - 0.25;
          return (
            <Star
              key={star}
              className={`${iconClass} ${
                isFilled ? "fill-yellow-500 text-yellow-500" : "text-border"
              }`}
            />
          );
        })}
      </>
    );
  };

  const tabs = [
    { id: "description" as TabType, label: "Details" },
    { id: "specs" as TabType, label: "Materials & Care" },
    {
      id: "reviews" as TabType,
      label: `Reviews${reviews.length ? ` (${reviews.length})` : ""}`,
    },
    { id: "qa" as TabType, label: "Q&A" },
  ];

  return (
    <div className="border-t border-border bg-secondary/30">
      <div className="border-b border-border bg-background">
        <div className="container mx-auto">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 text-sm font-semibold whitespace-nowrap transition-all relative ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 bg-background">
        {activeTab === "description" && (
          <div className="max-w-3xl space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Product Details</h3>
              <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
                {product.description ||
                  "Deskripsi produk belum tersedia. Silakan cek kembali nanti."}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Features:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground flex-shrink-0" />
                  <span>Oversized, relaxed fit for maximum comfort</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground flex-shrink-0" />
                  <span>Premium cotton-polyester blend fabric</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground flex-shrink-0" />
                  <span>Soft brushed fleece interior</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground flex-shrink-0" />
                  <span>Adjustable drawstring hood</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground flex-shrink-0" />
                  <span>Ribbed cuffs and hem for shape retention</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="max-w-3xl space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Materials & Care</h3>
              <p className="text-muted-foreground">
                Our hoodies are crafted from premium materials for lasting
                quality and comfort.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Fabric Composition</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>- 80% Premium Cotton</p>
                  <p>- 20% Polyester</p>
                  <p>- Weight: 320 GSM (Heavyweight)</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Care Instructions</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>- Machine wash cold with similar colors</p>
                  <p>- Use mild detergent, avoid bleach</p>
                  <p>- Tumble dry low or hang dry</p>
                  <p>- Iron on low heat if needed</p>
                  <p>- Do not dry clean</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Fit & Sizing</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>- Oversized, relaxed fit</p>
                  <p>- True to size (size up for extra room)</p>
                  <p>- Model is 5'10" wearing size M</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Header dengan Rating Summary */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-3xl lg:text-4xl font-bold tracking-tight">
                  Ulasan Pembeli
                </h3>
                <p className="hidden lg:block text-lg text-muted-foreground">
                  {ratingSummary.reviewCount
                    ? `Berdasarkan ${ratingSummary.reviewCount.toLocaleString()} ulasan terverifikasi`
                    : "Belum ada ulasan. Jadilah yang pertama!"}
                </p>
              </div>

              {ratingSummary.reviewCount > 0 && (
                <div className="hidden lg:flex flex-col items-end gap-2 p-6 bg-background/80 backdrop-blur-sm rounded-2xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold text-foreground">
                      {ratingSummary.average.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(ratingSummary.average)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-right">
                    Rata-rata dari {ratingSummary.reviewCount.toLocaleString()}{" "}
                    ulasan
                  </p>
                </div>
              )}
            </div>

            {/* No Reviews State */}
            {ratingSummary.reviewCount === 0 ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-background/30 to-muted/30 rounded-3xl blur opacity-75"></div>
                <div className="relative bg-background/80 backdrop-blur-xl rounded-3xl border border-border/50 p-12 text-center shadow-sm">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/30 rounded-full flex items-center justify-center mb-6">
                    <Star className="w-12 h-12 text-amber-500/80" />
                  </div>
                  <h4 className="text-2xl font-semibold text-muted-foreground mb-3">
                    Belum ada ulasan
                  </h4>
                  <p className="text-muted-foreground/70 max-w-2xl mx-auto mb-8">
                    Produk ini belum memiliki ulasan dari pembeli. Jadilah yang
                    pertama memberikan pengalaman Anda!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="gap-2 shadow-sm">
                      <Star className="w-4 h-4 text-amber-500" />
                      Tulis Ulasan Pertama
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2">
                      Bagikan ke Teman
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Reviews Grid Layout */
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                {/* Rating Breakdown - Sticky */}
                <div className="lg:col-span-2 lg:sticky lg:top-24 lg:h-fit">
                  <div className="rounded-2xl border bg-background/80 backdrop-blur-xl p-6 xl:p-8 shadow-sm">
                    <div className="space-y-6">
                      {/* Overall Rating */}
                      <div className="text-center pb-6 border-b border-border/30">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                          Rating Keseluruhan
                        </p>
                        <div className="flex items-center justify-center gap-3 mt-3">
                          <span className="text-5xl font-extrabold text-foreground">
                            {ratingSummary.average.toFixed(1)}
                          </span>
                          <div className="flex items-center gap-1">
                            {renderStars(ratingSummary.average, "sm")}
                          </div>
                        </div>
                      </div>

                      {/* Rating Distribution */}
                      <div className="space-y-3">
                        <p className="font-semibold text-sm text-muted-foreground">
                          Distribusi Rating
                        </p>
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = ratingSummary.ratingCount[star] || 0;
                          const percentage =
                            ratingSummary.reviewCount > 0
                              ? Math.round(
                                  (count / ratingSummary.reviewCount) * 100
                                )
                              : 0;
                          return (
                            <div
                              key={star}
                              className="flex items-center justify-between gap-4 w-full"
                            >
                              {/* Label bintang - kiri */}
                              <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
                                <span className="font-semibold text-sm">
                                  {star}
                                </span>
                                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                              </div>

                              {/* Bar - tengah */}
                              <div className="flex-1 min-w-0 px-2">
                                <div className="h-2.5 bg-muted/80 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-amber-500 rounded-full transition-all duration-700 ease-out"
                                    style={{
                                      width: `${Math.max(percentage, 0)}%`, // minimal 3% biar jelas
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Percentage & Count - kanan */}
                              <div className="flex items-center gap-4 flex-shrink-0">
                                <span className="text-xs font-mono font-semibold text-foreground min-w-[28px] text-right">
                                  {percentage}%
                                </span>
                                <span className="text-xs text-muted-foreground font-medium min-w-[28px] text-right">
                                  {count}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-semibold">Ulasan Terbaru</h4>
                    {reviews.length > 3 && (
                      <Button variant="ghost" size="sm" className="gap-2 h-9">
                        Lihat Semua ({ratingSummary.reviewCount})
                      </Button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <article
                        key={review.id}
                        className={`
                group relative p-6 rounded-2xl border transition-all duration-300
                hover:shadow-lg hover:-translate-y-1
                ${
                  index % 2 === 0
                    ? "bg-background/80 border-border/50"
                    : "bg-muted/50 border-border/30"
                }
              `}
                      >
                        {/* Review Header */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center border border-border/50">
                                {review.user.image ? (
                                  <img
                                    src={review.user.image}
                                    alt="Avatar"
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-sm font-bold text-muted-foreground">
                                    {review.user?.name?.[0]?.toUpperCase() ||
                                      "P"}
                                  </span>
                                )}
                              </div>
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-muted/50 border border-border/30 rounded-full flex items-center justify-center ring-2 ring-background">
                                <CheckCircle className="w-3 h-3 text-muted-foreground" />
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <h5 className="font-semibold truncate pr-4 text-foreground">
                                  {review.user?.name || "Pembeli"}
                                </h5>
                                <div className="flex items-center gap-2">
                                  {renderStars(review.rating || 0, "sm")}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1.5">
                                {format(
                                  new Date(review.created_at),
                                  "dd MMM yyyy '•' HH:mm"
                                )}{" "}
                                WIB
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Review Title */}
                        {review.title && (
                          <h6 className="font-semibold text-foreground mb-3 px-1">
                            "{review.title}"
                          </h6>
                        )}

                        {/* Review Body */}
                        {review.body && (
                          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4 group-hover:line-clamp-none">
                            {review.body}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "qa" && (
          <div className="max-w-3xl space-y-8">
            <h3 className="text-2xl font-bold">Questions & Answers</h3>

            <div className="space-y-6">
              {[
                {
                  question: "What is the return policy?",
                  askedBy: "Michael",
                  date: "3 days ago",
                  answer:
                    "We offer a 30-day hassle-free return policy. If you're not completely satisfied with your purchase, you can return it for a full refund or exchange.",
                },
                {
                  question: "Is this hoodie pre-shrunk?",
                  askedBy: "Lisa",
                  date: "1 week ago",
                  answer:
                    "Yes, all our hoodies are pre-washed and pre-shrunk to ensure consistent sizing. We recommend following the care instructions to maintain the fit.",
                },
                {
                  question: "Do you ship internationally?",
                  askedBy: "Alex",
                  date: "2 weeks ago",
                  answer:
                    "Currently, we only ship within Indonesia. We're working on expanding our international shipping options. Stay tuned!",
                },
              ].map((qa, index) => (
                <div
                  key={index}
                  className="border-b border-border pb-6 last:border-0 space-y-4"
                >
                  <div>
                    <p className="font-semibold mb-1">Q: {qa.question}</p>
                    <p className="text-xs text-muted-foreground">
                      Asked by {qa.askedBy} - {qa.date}
                    </p>
                  </div>
                  <div className="pl-6 border-l-2 border-border">
                    <p className="text-muted-foreground leading-relaxed">
                      {qa.answer}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3 font-medium">
                      Answered by Monowear
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
