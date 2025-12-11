import type { Product } from "@repo/db";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { format } from "date-fns";
import { ImageIcon, Package, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ErrorAlert } from "@/features/admin/components/error-alert";
import { formatCurrency } from "@/features/admin/utils";
import { statusColors } from "@/features/order/constants/shipment";
import { useUserOrders } from "@/features/order/queries/useOrderQuery";
import { authClient } from "@/lib/auth-client";
import ReviewDialog from "./review-dialog";

const statusLabels: Record<string, string> = {
  pending: "Menunggu Pembayaran",
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Terkirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  cancel: "Dibatalkan",
};

export const OrdersSection = () => {
  const { data: sessionData } = authClient.useSession();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<Product>();
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const userId = sessionData?.user.id;
  const {
    data: orderData,
    isPending,
    isError,
    refetch,
  } = useUserOrders(sessionData?.user.id as string);

  const mainFilteredOrders = orderData
    ?.filter(
      (order) =>
        !["cancel", "cancelled"].includes(order.status) &&
        (orderFilter === "all" ||
          orderFilter === "processing" ||
          orderFilter === "shipping" ||
          orderFilter === "delivered") &&
        (orderFilter === "all" || order.status === orderFilter),
    )
    ?.sort((a, b) => {
      const aIsCompleted = ["delivered", "completed"].includes(a.status);
      const bIsCompleted = ["delivered", "completed"].includes(b.status);

      if (aIsCompleted && !bIsCompleted) return 1;
      if (!aIsCompleted && bIsCompleted) return -1;

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  // Filter cancel (khusus dibatalkan)
  const cancelledOrders = orderData
    ?.filter((order) => ["cancel", "cancelled"].includes(order.status))
    ?.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const filteredOrders =
    orderFilter === "cancel" ? cancelledOrders : mainFilteredOrders;

  const handleReview = (product: Product) => {
    setReviewProduct(product);
    setReviewDialogOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Pesanan Saya</h2>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={orderFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setOrderFilter("all")}
          >
            Semua
          </Button>
          <Button
            variant={orderFilter === "processing" ? "default" : "outline"}
            size="sm"
            onClick={() => setOrderFilter("processing")}
          >
            Diproses
          </Button>
          <Button
            variant={orderFilter === "shipping" ? "default" : "outline"}
            size="sm"
            onClick={() => setOrderFilter("shipping")}
          >
            Dikirim
          </Button>
          <Button
            variant={orderFilter === "delivered" ? "default" : "outline"}
            size="sm"
            onClick={() => setOrderFilter("delivered")}
          >
            Selesai
          </Button>
          <Button
            variant={orderFilter === "cancel" ? "default" : "outline"}
            size="sm"
            onClick={() => setOrderFilter("cancel")}
          >
            Dibatalkan
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {isPending ? (
          <OrdersSkeleton />
        ) : isError ? (
          <ErrorAlert
            description="Gagal memuat pesanan. Coba ulangi."
            action={() => refetch()}
          />
        ) : (
          filteredOrders?.map((order) => {
            const isDelivered =
              order.status === "delivered" || order.status === "completed";
            const primaryProduct = order.order_items[0]?.variant?.product;
            const userReview = primaryProduct?.reviews?.find(
              (review) => review.user_id === userId,
            );
            const hasReview = !!userReview;
            const badgeColor =
              statusColors[order.status as keyof typeof statusColors] ??
              "bg-secondary text-secondary-foreground";
            const reviewLink =
              hasReview && primaryProduct?.slug
                ? `/product/${primaryProduct.slug}#reviews`
                : undefined;

            return (
              <div
                key={order.id}
                className="border border-border rounded-lg p-6 space-y-4 shadow-sm bg-card/50"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">Pesanan #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), "dd MMMM yyyy HH:mm")}{" "}
                      WIB
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={badgeColor}>
                      {statusLabels[order.status] ||
                        order.status.replace(/_/g, " ")}
                    </Badge>
                    <p className="font-semibold text-lg">
                      {formatCurrency(Number(order.total_cents))}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="space-y-3">
                    {order.order_items.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        {/* Image - mobile smaller */}
                        <div className="w-12 h-12 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                          {item.variant?.product.product_images[0]?.url ? (
                            <img
                              src={item.variant.product.product_images[0].url}
                              alt={item.title ?? ""}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <ImageIcon className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Content - full width on mobile */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="font-medium text-sm leading-4 line-clamp-2">
                            {item.title}
                          </p>
                          <VariantInfo variant={item.variant} />
                        </div>

                        {/* Quantity & Price - mobile stack */}
                        <div className="flex flex-col items-end gap-1.5 text-sm font-medium min-w-[50px]">
                          <span className="text-muted-foreground text-xs">
                            x{item.quantity}
                          </span>
                          <span className="text-foreground text-sm">
                            {formatCurrency(Number(item.total_price_cents))}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="default"
                    asChild
                    className="flex-1 h-11"
                  >
                    <Link href={`/order?order_id=${order.id}`}>
                      Lihat Detail
                    </Link>
                  </Button>
                  {isDelivered &&
                    (userReview && reviewLink ? (
                      <Button
                        variant="outline"
                        size="default"
                        className="flex-1 h-11"
                        asChild
                      >
                        <Link href={reviewLink}>
                          <Star className="h-4 w-4 mr-2" />
                          Lihat Ulasan
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="default"
                        className="flex-1 h-11"
                        disabled={!primaryProduct || hasReview}
                        onClick={() =>
                          !hasReview &&
                          primaryProduct &&
                          handleReview(primaryProduct)
                        }
                      >
                        <Star className="h-4 w-4 mr-2" />
                        {hasReview ? "Ulasan sudah dibuat" : "Beri Ulasan"}
                      </Button>
                    ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {!isPending && !isError && filteredOrders?.length === 0 && (
        <div className="text-center py-16 border border-border rounded-lg bg-card/50">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Tidak ada pesanan ditemukan</p>
        </div>
      )}

      {reviewProduct && (
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          product={reviewProduct}
        />
      )}
    </div>
  );
};

interface VariantOptions {
  color?: string;
  size?: string;
}

interface VariantInfoProps {
  variant?: {
    option_values?: unknown;
  } | null;
}

function VariantInfo({ variant }: VariantInfoProps) {
  const opts =
    variant?.option_values &&
    typeof variant.option_values === "object" &&
    !Array.isArray(variant.option_values)
      ? (variant.option_values as VariantOptions)
      : null;

  if (!opts) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
      {opts.color && <span>Warna: {opts.color}</span>}
      {opts.size && <span>Ukuran: {opts.size}</span>}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="border border-border rounded-lg p-6 space-y-4 bg-card/50"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
          <div className="border-t border-border pt-4 space-y-3">
            {[1, 2].map((line) => (
              <div
                key={line}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
