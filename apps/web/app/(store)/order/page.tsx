/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { format } from "date-fns";
import {
  AlertCircle,
  Check,
  Clock,
  Home,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cancelOrder, updatePaymentStatus } from "@/actions/payment";
import { ErrorAlert } from "@/features/admin/components/error-alert";
import { formatCurrency } from "@/features/admin/utils";
import { statusColors } from "@/features/order/constants/shipment";
import { useOrderWithPayment } from "@/features/order/queries/useOrderQuery";
import { mapGatewayResponseToPaymentDetail } from "@/features/order/utils/mapGateway";
import { useServerAction } from "@/hooks/useServerAction";
import type { PaymentDetail, Snap } from "@/types/midtrans";

declare global {
  interface Window {
    snap?: Snap;
  }
}

const scriptId = "midtrans-snap-script";

type StatusConfig = {
  icon: typeof Check;
  bgColor: string;
  textColor: string;
  title: string;
  message: string;
};

type OrderStep = {
  icon: typeof Check;
  label: string;
  active: boolean;
  date: string | Date | null | undefined;
};

type OrderItem = {
  id: string | number;
  title?: string | null;
  quantity: number;
  total_price_cents?: number | string | null;
  variant?: {
    option_values?: unknown;
    product: { product_images: Array<{ url: string }> };
    additional_price_cents?: number | string | null;
  } | null;
};

const extractStatusCode = (error: unknown) => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof (error as { response?: { status?: unknown } }).response?.status ===
      "number"
  ) {
    return (error as { response: { status: number } }).response.status;
  }
  return undefined;
};

const OrderDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id");
  const transaction_status =
    searchParams.get("transaction_status") || "settlement";
  const [runUpdatePaymentStatusAction] = useServerAction(updatePaymentStatus);
  const [runCancelOrderAction] = useServerAction(cancelOrder);

  const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(
    null,
  );
  const [hasAutoCancelled, setHasAutoCancelled] = useState(false);

  const {
    orderData,
    paymentData,
    isLoading,
    isError,
    isOrderError,
    isPaymentError,
    paymentError,
  } = useOrderWithPayment(order_id as string);

  const payment = orderData?.payments?.[0];
  const shipment = orderData?.shipments?.[0];
  const shippingStatus = shipment?.status ?? "";

  const statusConfig = getStatusConfig(payment?.status);
  const orderSteps = buildOrderSteps(
    shippingStatus,
    payment?.paid_at,
    shipment?.shipped_at,
    shipment?.delivered_at,
  );
  const isPendingPayment = payment?.status === "pending";
  const isFailedPayment = payment?.status === "failed";
  const isCancelledPayment =
    payment?.status === "cancelled" || payment?.status === "cancel";
  const isSettlement = payment?.status === "settlement";
  const paymentStatusCode = extractStatusCode(paymentError);
  const isPaymentNotFound = isPaymentError && paymentStatusCode === 404;
  const isPaymentServerError =
    isPaymentError &&
    typeof paymentStatusCode === "number" &&
    paymentStatusCode >= 500;
  const isOrderStatusCancelled =
    orderData?.status === "cancel" || orderData?.status === "cancelled";

  useEffect(() => {
    if (
      paymentData?.transaction_status === "cancel" &&
      !hasAutoCancelled &&
      !isCancelledPayment &&
      !isOrderStatusCancelled
    ) {
      runUpdatePaymentStatusAction({
        order_id: order_id as string,
        status: "cancel",
      });

      runCancelOrderAction(order_id as string);
      setHasAutoCancelled(true);
    }
  }, [
    order_id,
    paymentData?.transaction_status,
    hasAutoCancelled,
    isCancelledPayment,
    isOrderStatusCancelled,
    runUpdatePaymentStatusAction,
    runCancelOrderAction,
  ]);

  useEffect(() => {
    if (paymentData?.transaction_status === "settlement") {
      runUpdatePaymentStatusAction({
        order_id: order_id as string,
        status: "settlement",
      });
    }
  }, [order_id, paymentData?.transaction_status]);

  useEffect(() => {
    if (
      paymentData &&
      (transaction_status === "pending" || transaction_status === "settlement")
    ) {
      setPaymentDetail(mapGatewayResponseToPaymentDetail(paymentData));
    }
  }, [transaction_status, paymentData]);

  useEffect(() => {
    if (typeof window === "undefined" || window.snap) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      process.env.NODE_ENV === "production"
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY as string,
    );
    script.async = true;

    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      existingScript?.remove();
    };
  }, []);

  const handlePayment = () => {
    if (!orderData?.payments?.[0]?.provider_payment_id) {
      toast.error("Tidak bisa melakukan pembayaran");
      return;
    }

    if (!window.snap) {
      alert(
        "Sistem pembayaran sedang tidak tersedia. Silakan refresh halaman.",
      );
      return;
    }

    window.snap?.pay(orderData?.payments?.[0]?.provider_payment_id, {
      language: "id",
      onSuccess: async (result) => {
        console.log(result);
        await runUpdatePaymentStatusAction({
          order_id: result.order_id,
          status: "settlement",
        });
        router.push(`${result.finish_redirect_url}`);
      },
      onPending: async (result) => {
        console.log(result);
        router.push(`${result.finish_redirect_url}`);
      },
      onError: async (result) => {
        console.log(result);

        // Langunsung cancel order
        await runCancelOrderAction(order_id as string);

        router.push(`${result.finish_redirect_url}`);
      },
      onClose: () => {
        // clearCart();
        router.push(`/order?order_id=${order_id}`);
      },
    });
  };

  useEffect(() => {
    if (!isPaymentNotFound || !order_id || hasAutoCancelled) return;

    (async () => {
      try {
        await runUpdatePaymentStatusAction({
          order_id,
          status: "cancel",
        });
        await runCancelOrderAction(order_id);
        toast.error("Pembayaran tidak ditemukan, pesanan dibatalkan otomatis.");
      } catch (error) {
        console.error("Failed to auto cancel order", error);
      } finally {
        setHasAutoCancelled(true);
      }
    })();
  }, [
    isPaymentNotFound,
    order_id,
    hasAutoCancelled,
    runUpdatePaymentStatusAction,
    runCancelOrderAction,
  ]);

  useEffect(() => {
    if (
      !isPaymentServerError ||
      !order_id ||
      hasAutoCancelled ||
      isCancelledPayment ||
      isOrderStatusCancelled
    )
      return;

    (async () => {
      try {
        await runUpdatePaymentStatusAction({
          order_id,
          status: "cancel",
        });
        await runCancelOrderAction(order_id);
        toast.error(
          "Terjadi kendala pada pembayaran. Pesanan dibatalkan otomatis.",
        );
      } catch (error) {
        console.error("Failed to auto cancel order after server error", error);
      } finally {
        setHasAutoCancelled(true);
      }
    })();
  }, [
    isPaymentServerError,
    order_id,
    hasAutoCancelled,
    isCancelledPayment,
    isOrderStatusCancelled,
    runUpdatePaymentStatusAction,
    runCancelOrderAction,
  ]);

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (isOrderError) {
    return (
      <ErrorAlert
        title="Terjadi Kesalahan"
        description="Gagal memuat detail pesanan. Silakan coba lagi."
        action={() => window.location.reload()}
      />
    );
  }

  if (isPaymentError && !isPaymentNotFound && !isPaymentServerError) {
    return (
      <ErrorAlert
        title="Status Pembayaran Bermasalah"
        description={"Gagal memuat status pembayaran. Silakan coba lagi."}
        action={() => window.location.reload()}
      />
    );
  }

  if (isError && !isPaymentNotFound) {
    return (
      <ErrorAlert
        title="Terjadi Kesalahan"
        description="Gagal memuat detail pesanan. Silakan coba lagi."
        action={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <StatusHeader
            orderId={orderData?.id}
            config={statusConfig}
            isPending={isPendingPayment}
            isFailedOrCancelled={isFailedPayment || isCancelledPayment}
            expiryTime={paymentDetail?.expiryTime}
            message={statusConfig.message}
          />

          {isSettlement && <OrderTimeline steps={orderSteps} />}

          <OrderItemsCard
            items={orderData?.order_items as unknown as OrderItem[]}
            orderStatus={orderData?.status}
            totals={{
              subtotal: Number(orderData?.subtotal_cents),
              tax: Number(orderData?.tax_cents),
              shipping: Number(orderData?.shipping_cents),
              total: Number(orderData?.total_cents),
            }}
          />

          {paymentDetail && (
            <div className="grid md:grid-cols-2 gap-8">
              <AddressCard
                name={orderData?.address?.recipient_name}
                addressLine={orderData?.address?.address_line1}
                city={orderData?.address?.city}
                postalCode={orderData?.address?.postal_code}
                phone={orderData?.address?.phone}
              />

              <PaymentOrShippingCard
                transactionStatus={transaction_status}
                paymentStatus={payment?.status}
                paymentDetail={paymentDetail}
                paymentMethod={paymentDetail?.method}
                shipmentMethod={
                  orderData?.shipments?.[0]?.shipment_method?.name
                }
                deliveredAt={orderData?.shipments?.[0]?.delivered_at}
                trackingNumber={orderData?.shipments?.[0]?.tracking_number}
                onPay={handlePayment}
              />
            </div>
          )}

          <div className="flex max-sm:flex-col gap-4">
            <Button asChild className="flex-1 h-12">
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 h-12">
              <Link href="/products">Belanja Lagi</Link>
            </Button>
          </div>
        </div>
      </main>
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
    <>
      {opts.color && (
        <p className="text-sm text-muted-foreground">Warna: {opts.color}</p>
      )}
      {opts.size && (
        <p className="text-sm text-muted-foreground">Ukuran: {opts.size}</p>
      )}
    </>
  );
}

type StatusHeaderProps = {
  orderId?: string | number;
  config: StatusConfig;
  isPending: boolean;
  isFailedOrCancelled: boolean;
  expiryTime?: string;
  message: string;
};

function StatusHeader({
  orderId,
  config,
  isPending,
  isFailedOrCancelled,
  expiryTime,
  message,
}: StatusHeaderProps) {
  const Icon = config.icon;

  return (
    <div className="text-center space-y-4 border border-border p-8 rounded-lg">
      <div
        className={`w-16 h-16 ${config.bgColor} text-background rounded-full flex items-center justify-center mx-auto`}
      >
        <Icon className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{config.title}</h1>
        <p className="text-lg text-muted-foreground">Order ID: #{orderId}</p>
      </div>

      {isPending && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-2">
          <div className="flex items-center justify-center gap-2 text-yellow-600">
            <AlertCircle className="h-5 w-5" />
            <p className="font-semibold">
              Selesaikan pembayaran sebelum {expiryTime}
            </p>
          </div>
        </div>
      )}

      {isFailedOrCancelled && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-2">
          <p className="text-destructive font-semibold">{message}</p>
        </div>
      )}
    </div>
  );
}

function OrderTimeline({ steps }: { steps: OrderStep[] }) {
  return (
    <div className="border border-border p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Status Pesanan</h2>
      <div className="block md:relative">
        <div className="hidden md:block">
          <div className="absolute inset-x-0 top-6 flex items-center pointer-events-none">
            <div className="flex-1 flex justify-between items-center px-[80px]">
              {steps.map((_, index) => {
                if (index === steps.length - 1) return null;

                const isActive = steps[index + 1]?.active;

                return (
                  <div
                    key={index}
                    className="flex-1 flex items-center justify-center relative"
                  >
                    <div
                      className={`absolute w-full h-0.5 transition-all duration-500 ease-in-out ${
                        isActive ? "bg-foreground" : "bg-border"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const stepDate = step.date
                ? format(new Date(step.date), "dd MMM yyyy HH:mm")
                : null;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 relative z-10"
                >
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-3 transition-all ${
                      step.active
                        ? "bg-foreground border-foreground text-background scale-110"
                        : "border-border bg-background"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="text-center">
                    <p
                      className={`text-sm font-medium ${step.active ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </p>
                    {step.active && stepDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {stepDate} WIB
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:hidden space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const stepDate = step.date
              ? format(new Date(step.date), "dd MMM yyyy HH:mm")
              : null;

            return (
              <div key={index} className="flex items-start gap-4">
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      step.active
                        ? "bg-foreground border-foreground text-background"
                        : "border-border bg-background"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-12 left-6 w-0.5 h-16 -translate-x-1/2 transition-all ${
                        steps[index + 1]?.active ? "bg-foreground" : "bg-border"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 pb-8">
                  <p
                    className={`font-medium ${step.active ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {step.label}
                  </p>
                  {step.active && stepDate && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {stepDate} WIB
                    </p>
                  )}
                  {step.active && !stepDate && (
                    <p className="text-sm text-muted-foreground mt-1">-</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type OrderItemsCardProps = {
  items?: OrderItem[];
  orderStatus?: string | null;
  totals: {
    subtotal?: number | null;
    tax?: number | null;
    shipping?: number | null;
    total?: number | null;
  };
};

function OrderItemsCard({ items, orderStatus, totals }: OrderItemsCardProps) {
  const statusClass = orderStatus
    ? statusColors[orderStatus as keyof typeof statusColors]
    : "bg-muted text-foreground";

  return (
    <div className="border border-border p-8 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Detail Pesanan</h2>
        </div>
        <Badge className={statusClass}>{orderStatus}</Badge>
      </div>
      <div className="space-y-4">
        {items?.map((item) => (
          <div
            key={item.id}
            className="flex gap-6 pb-4 border-b border-border last:border-0 last:pb-0"
          >
            <div className="w-24 h-24 bg-secondary border border-border flex-shrink-0 rounded-md overflow-hidden">
              <img
                src={item.variant?.product?.product_images?.[0]?.url ?? ""}
                alt={item.title ?? ""}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="font-bold">{item.title}</h3>
              <VariantInfo variant={item.variant} />
              <p className="text-sm text-muted-foreground">
                Jumlah: {item.quantity}
              </p>
              <p className="font-bold mt-2">
                {formatCurrency(Number(item.total_price_cents))}{" "}
                {item.variant?.additional_price_cents &&
                Number(item.variant.additional_price_cents) > 0
                  ? `(+${formatCurrency(
                      Number(item.variant.additional_price_cents),
                    )})`
                  : ""}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 py-4 mt-4 border-t border-border">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">
            {formatCurrency(totals.subtotal ?? 0)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pajak</span>
          <span className="font-medium">{formatCurrency(totals.tax ?? 0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pengiriman</span>
          <span className="font-medium">
            {formatCurrency(totals.shipping ?? 0)}
          </span>
        </div>
        <div className="flex justify-between text-xl font-bold pt-3">
          <span>Total</span>
          <span>{formatCurrency(totals.total ?? 0)}</span>
        </div>
      </div>
    </div>
  );
}

type AddressCardProps = {
  name?: string | null;
  addressLine?: string | null;
  city?: string | null;
  postalCode?: string | null;
  phone?: string | null;
};

function AddressCard({
  name,
  addressLine,
  city,
  postalCode,
  phone,
}: AddressCardProps) {
  return (
    <div className="border border-border p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Alamat Pengiriman</h2>
      <div className="space-y-2 text-muted-foreground">
        <p className="font-semibold text-foreground">{name}</p>
        <p>{addressLine}</p>
        <p>
          {city}, {postalCode}
        </p>
        <p>{phone}</p>
      </div>
    </div>
  );
}

type PaymentOrShippingCardProps = {
  transactionStatus: string;
  paymentStatus?: string | null;
  paymentDetail: PaymentDetail | null;
  paymentMethod?: string | null;
  shipmentMethod?: string | null;
  deliveredAt?: string | Date | null;
  trackingNumber?: string | null;
  onPay: () => void;
};

function PaymentOrShippingCard({
  transactionStatus,
  paymentStatus,
  paymentDetail,
  paymentMethod,
  shipmentMethod,
  deliveredAt,
  trackingNumber,
  onPay,
}: PaymentOrShippingCardProps) {
  const displayStatus = paymentStatus || transactionStatus;
  const isPending = displayStatus === "pending";
  const isFailed = displayStatus === "failed";

  const deliveredDate = deliveredAt
    ? `${format(new Date(deliveredAt), "dd MMMM yyyy HH:mm")} WIB`
    : "-";

  if (isPending || !paymentDetail) {
    return (
      <div className="border border-border p-8 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold mb-2">Informasi Pembayaran</h2>

        <div>
          <p className="text-sm text-muted-foreground">Metode Pembayaran</p>
          <p className="font-medium">{paymentDetail?.method}</p>
        </div>

        {paymentDetail?.bank && (
          <div>
            <p className="text-sm text-muted-foreground">Bank</p>
            <p className="font-medium">{paymentDetail.bank}</p>
          </div>
        )}

        {paymentDetail?.accountNumber && (
          <div>
            <p className="text-sm text-muted-foreground">No. Virtual Account</p>
            <p className="font-medium text-lg">{paymentDetail.accountNumber}</p>
          </div>
        )}

        {paymentDetail?.expiryTime && (
          <div>
            <p className="text-sm text-muted-foreground">
              Batas Waktu Pembayaran
            </p>
            <p className="font-medium text-yellow-600 text-lg">
              {paymentDetail.expiryTime}
            </p>
          </div>
        )}

        <Button className="w-full mt-2" onClick={onPay}>
          Bayar Sekarang
        </Button>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="border border-border p-8 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold mb-2">Informasi Pembayaran</h2>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">
            Metode Pembayaran
          </p>
          <p className="font-medium">{paymentMethod || "Unknown"}</p>
          <p className="text-destructive text-sm mt-2">
            Pembayaran tidak berhasil diproses
          </p>
        </div>
        <Button className="w-full mt-4" variant="destructive">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-border p-8 rounded-lg space-y-4">
      <h2 className="text-2xl font-bold mb-2">Informasi Pengiriman</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField label="Tanggal Pembelian" value={paymentDetail?.paidAt} />
        <InfoField label="Kurir" value={shipmentMethod || "-"} />
        <InfoField label="Tanggal Terkirim" value={deliveredDate} />
        <InfoField label="No. Resi" value={trackingNumber || "-"} mono />
      </div>
    </div>
  );
}

type InfoFieldProps = {
  label: string;
  value?: string | null;
  mono?: boolean;
};

function InfoField({ label, value, mono }: InfoFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`font-medium text-foreground ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function getStatusConfig(status?: string | null): StatusConfig {
  switch (status) {
    case "pending":
      return {
        icon: Clock,
        bgColor: "bg-yellow-500",
        textColor: "text-yellow-500",
        title: "Menunggu Pembayaran",
        message: "Silakan selesaikan pembayaran sebelum waktu berakhir",
      };
    case "failed":
      return {
        icon: XCircle,
        bgColor: "bg-destructive",
        textColor: "text-destructive",
        title: "Pembayaran Gagal",
        message: "Pembayaran Anda tidak berhasil diproses",
      };
    case "cancelled":
    case "cancel":
      return {
        icon: XCircle,
        bgColor: "bg-destructive",
        textColor: "text-destructive",
        title: "Transaksi dibatalkan",
        message: "Transaksi Anda dibatalkan, silahkan coba lagi",
      };
    default:
      return {
        icon: Check,
        bgColor: "bg-foreground",
        textColor: "text-foreground",
        title: "Pesanan Berhasil!",
        message: "Pesanan Anda sedang diproses",
      };
  }
}

function buildOrderSteps(
  shippingStatus: string,
  paidAt?: string | Date | null,
  shippedAt?: string | Date | null,
  deliveredAt?: string | Date | null,
): OrderStep[] {
  return [
    {
      icon: Check,
      label: "Pesanan Diterima",
      active: [
        "ready",
        "processing",
        "shipped",
        "in_transit",
        "delivered",
      ].includes(shippingStatus),
      date: paidAt,
    },
    {
      icon: Package,
      label: "Sedang Diproses",
      active: ["processing", "shipped", "in_transit", "delivered"].includes(
        shippingStatus,
      ),
      date: paidAt,
    },
    {
      icon: Truck,
      label: "Dalam Pengiriman",
      active: ["shipped", "in_transit", "delivered"].includes(shippingStatus),
      date: shippedAt,
    },
    {
      icon: Home,
      label: "Terkirim",
      active: ["delivered"].includes(shippingStatus),
      date: deliveredAt,
    },
  ];
}

function OrderSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Skeleton className="w-16 h-16 rounded-full mx-auto" />
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-40 mx-auto" />
          </div>

          {/* Timeline */}
          <div className="border border-border p-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="hidden md:flex justify-between">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <Skeleton className="w-12 h-12 rounded-full mb-3" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24 mt-2" />
                </div>
              ))}
            </div>
            <div className="md:hidden space-y-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Pesanan */}
          <div className="border border-border p-8">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="space-y-6">
              {[0, 1].map((i) => (
                <div key={i} className="flex gap-6 pb-6 border-b">
                  <Skeleton className="w-24 h-24 rounded-md flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </div>
          </div>

          {/* Alamat + Info Pembayaran/Pengiriman */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-border p-8 space-y-4">
              <Skeleton className="h-8 w-48 mb-4" />
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-4 w-64" />
              ))}
            </div>
            <div className="border border-border p-8 space-y-4">
              <Skeleton className="h-8 w-56 mb-4" />
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-48" />
                </div>
              ))}
              <Skeleton className="h-12 w-full mt-6" />
            </div>
          </div>

          {/* Tombol */}
          <div className="flex max-sm:flex-col gap-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 flex-1" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderDetails;
