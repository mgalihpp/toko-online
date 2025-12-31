"use client";

import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Award,
  Layers,
  Package,
  RotateCcw,
  Star,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataTable } from "@/features/admin/components/data-table";
import { useProductPerformance } from "@/features/admin/queries/useAnalyticsQuery";
import { formatCurrency } from "@/features/admin/utils";
import type {
  ReturnedProduct,
  TopRatedProduct,
  TopSellingProduct,
} from "@/lib/api/analytics.api";

export function ProductPerformance() {
  const { data, isLoading, isError } = useProductPerformance(10);

  // Column definitions for top selling products
  const topSellingColumns: ColumnDef<TopSellingProduct>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Produk",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.image && (
              <img
                src={row.original.image}
                alt={row.original.name}
                className="w-10 h-10 rounded object-cover"
              />
            )}
            <span
              className="font-medium truncate max-w-[200px]"
              title={row.original.name}
            >
              {row.original.name}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Kategori",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.category || "-"}</Badge>
        ),
      },
      {
        accessorKey: "sales",
        header: "Terjual",
        cell: ({ row }) => row.original.sales.toLocaleString("id-ID"),
      },
      {
        accessorKey: "revenue",
        header: "Pendapatan",
        cell: ({ row }) => (
          <div className="font-medium">
            {formatCurrency(row.original.revenue)}
          </div>
        ),
      },
    ],
    [],
  );

  // Column definitions for top rated products
  const topRatedColumns: ColumnDef<TopRatedProduct>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Produk",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.image && (
              <img
                src={row.original.image}
                alt={row.original.name}
                className="w-10 h-10 rounded object-cover"
              />
            )}
            <span
              className="font-medium truncate max-w-[200px]"
              title={row.original.name}
            >
              {row.original.name}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Kategori",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.category || "-"}</Badge>
        ),
      },
      {
        accessorKey: "avgRating",
        header: "Rating",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {row.original.avgRating}
          </div>
        ),
      },
      {
        accessorKey: "reviewCount",
        header: "Ulasan",
        cell: ({ row }) => row.original.reviewCount,
      },
    ],
    [],
  );

  // Column definitions for most returned products
  const returnedColumns: ColumnDef<ReturnedProduct>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Produk",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.image && (
              <img
                src={row.original.image}
                alt={row.original.name}
                className="w-10 h-10 rounded object-cover"
              />
            )}
            <span
              className="font-medium truncate max-w-[200px]"
              title={row.original.name}
            >
              {row.original.name}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Kategori",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.category || "-"}</Badge>
        ),
      },
      {
        accessorKey: "returnCount",
        header: "Jumlah Pengembalian",
        cell: ({ row }) => (
          <div className="text-red-600 font-medium">
            {row.original.returnCount}
          </div>
        ),
      },
    ],
    [],
  );

  if (isLoading) {
    return <ProductPerformanceSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Gagal memuat performa produk
      </div>
    );
  }

  const {
    totalProducts,
    totalCategories,
    topSelling,
    topRated,
    mostReturned,
    categoryPerformance,
  } = data;

  // Calculate best seller and highest rated
  const bestSeller = topSelling[0];
  const highestRated = topRated[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Performa Produk</h2>
        <p className="text-muted-foreground">
          Analitik penjualan dan rating produk
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Total Produk</p>
              <p className="text-2xl font-bold mt-1">
                {totalProducts.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Aktif</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Total Kategori</p>
              <p className="text-2xl font-bold mt-1">
                {totalCategories.toLocaleString("id-ID")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Best Seller</p>
              <p
                className="text-lg font-bold mt-1 truncate"
                title={bestSeller?.name}
              >
                {bestSeller?.name || "-"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {bestSeller ? `${bestSeller.sales} terjual` : "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30">
                <Star className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Rating Tertinggi</p>
              <p
                className="text-lg font-bold mt-1 truncate"
                title={highestRated?.name}
              >
                {highestRated?.name || "-"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {highestRated
                  ? `⭐ ${highestRated.avgRating} (${highestRated.reviewCount} ulasan)`
                  : "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performa Kategori
          </CardTitle>
          <CardDescription>Pendapatan per kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformance.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3">
                        <p className="font-medium">{data.name}</p>
                        <p>Produk: {data.productCount}</p>
                        <p>Penjualan: {data.totalSales}</p>
                        <p>Pendapatan: {formatCurrency(data.totalRevenue)}</p>
                        <p>Rating: ⭐ {data.avgRating}</p>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="totalRevenue"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Products Tables with DataTable */}
      <Tabs defaultValue="top-selling" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="top-selling" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Terlaris
          </TabsTrigger>
          <TabsTrigger value="top-rated" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Rating Tertinggi
          </TabsTrigger>
          <TabsTrigger
            value="most-returned"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Pengembalian
          </TabsTrigger>
        </TabsList>

        <TabsContent value="top-selling">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Produk Terlaris</CardTitle>
              <CardDescription>
                Produk dengan penjualan tertinggi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={topSellingColumns}
                data={topSelling}
                searchPlaceholder="Cari produk..."
                searchKey="name"
                stickyLastColumn={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-rated">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Produk Rating Tertinggi</CardTitle>
              <CardDescription>Produk dengan rating terbaik</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={topRatedColumns}
                data={topRated}
                searchPlaceholder="Cari produk..."
                searchKey="name"
                stickyLastColumn={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="most-returned">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Produk Sering Dikembalikan
              </CardTitle>
              <CardDescription>
                Produk dengan pengembalian tertinggi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mostReturned.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Tidak ada data pengembalian
                </div>
              ) : (
                <DataTable
                  columns={returnedColumns}
                  data={mostReturned}
                  searchPlaceholder="Cari produk..."
                  searchKey="name"
                  stickyLastColumn={false}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductPerformanceSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32 mt-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-4 w-24 mt-4" />
              <Skeleton className="h-8 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
