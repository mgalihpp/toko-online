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
import { Card } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import Link from "next/link";
import { clearCart as clearCartItems } from "@/actions/cart";
import { formatCurrency } from "@/features/admin/utils";
import { CartItem } from "@/features/cart/components/cart-item";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useServerAction } from "@/hooks/useServerAction";

export default function CartPage() {
  const {
    items,
    totalPrice,
    totalItems,
    clearCart,
    loading: isCartLoading,
  } = useCartStore();
  const [runClearCartItemsAction, isClearing] = useServerAction(clearCartItems);

  const subtotal = totalPrice();
  const tax = subtotal * 0.1; // 10% tax
  const shipping = 0;
  const total = subtotal + tax + shipping;

  if (isCartLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Cart</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl sm:text-3xl font-bold mt-4">
              Keranjang Kamu
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Skeleton Items List */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-9 w-40" />
                </div>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <Skeleton className="w-24 h-24 rounded-md" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-9 w-28" />
                      </div>
                      <Skeleton className="h-8 w-20 ml-auto" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Skeleton Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <Skeleton className="h-6 w-48 mb-6" />
                <div className="space-y-3 mb-6 pb-6 border-b">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-6">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-40" />
                </div>
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md mt-3" />
              </Card>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
                <BreadcrumbPage>Cart</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl sm:text-3xl font-bold mt-4">
            Keranjang Kamu
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-8">
        {items.length === 0 ? (
          // Empty Cart State
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Keranjang Anda kosong
            </h2>
            <p className="text-muted-foreground mb-6">
              Tambahkan beberapa item untuk memulai!
            </p>
            <Link href="/products">
              <Button>Lanjutkan Berbelanja</Button>
            </Link>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Items List */}
            <div className="lg:col-span-2">
              <Card className="p-4 sm:p-6">
                <div className="sm:flex hidden flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                  <h2 className="text-base sm:text-lg font-semibold">
                    Items ({totalItems()})
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isClearing}
                    onClick={async () => {
                      clearCart();

                      await runClearCartItemsAction({});
                    }}
                    className="text-destructive hover:text-destructive w-full sm:w-auto"
                  >
                    {isClearing ? "Mengosongkan..." : "Kosongkan Keranjang"}
                  </Button>
                </div>
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.variant_id} item={item} />
                  ))}
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h3 className="text-lg font-semibold mb-6">
                  Ringkasan Pesanan
                </h3>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pajak (10%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pengiriman</span>
                    <span>-</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(total)}
                  </span>
                </div>

                <Link href="/checkout">
                  <Button className="w-full" size="lg">
                    Lanjutkan ke Pembayaran
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full" size="lg">
                    Lanjutkan Berbelanja
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
