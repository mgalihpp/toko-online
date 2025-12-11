"use client";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { AlertTriangle, ImageIcon, Package } from "lucide-react";
import Link from "next/link";
import { useLowStock } from "@/features/admin/queries/useDashboardQuery";

export function LowStockAlert() {
  const { data: products, isLoading, isError } = useLowStock(10, 5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-28" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <Skeleton className="w-10 h-10 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Peringatan Stok
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            Gagal memuat data stok
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-500" />
            Status Stok
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-emerald-200 bg-emerald-50">
            <Package className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-emerald-800">Stok Aman</AlertTitle>
            <AlertDescription className="text-emerald-700">
              Semua produk memiliki stok yang cukup.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Stok Menipis
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/inventory">Kelola Stok</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map((product, index) => {
            const isOutOfStock = product.stock === 0;

            return (
              <div
                key={`${product.id}-${product.sku}-${index}`}
                className={`flex items-center gap-3 p-3 border rounded-lg ${
                  isOutOfStock
                    ? "border-red-200 bg-red-50"
                    : "border-orange-200 bg-orange-50"
                }`}
              >
                <div className="w-10 h-10 rounded bg-white flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  {product.sku && (
                    <p className="text-xs text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                  )}
                </div>
                <div
                  className={`text-sm font-semibold px-2 py-1 rounded ${
                    isOutOfStock
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {isOutOfStock ? "Habis" : `${product.stock} tersisa`}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
