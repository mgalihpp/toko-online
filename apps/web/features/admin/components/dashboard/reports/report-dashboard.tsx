"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { DatePickerWithRange } from "@repo/ui/components/date-picker-with-range";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { addDays } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  Download,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useFinancialReport,
  useSalesReport,
} from "@/features/admin/queries/useReportQuery";
import { formatCurrency } from "@/features/admin/utils";
import { ReportDashboardSkeleton } from "./report-dashboard-skeleton";

interface ReportDashboardProps {
  period: "daily" | "weekly" | "monthly" | "yearly" | "custom";
  title: string;
}

export function ReportDashboard({ period, title }: ReportDashboardProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const queryParams = {
    period,
    start_date: period === "custom" && dateRange?.from ? dateRange.from.toISOString() : undefined,
    end_date: period === "custom" && dateRange?.to ? dateRange.to.toISOString() : undefined,
  };

  const { data: salesReport, isLoading: isSalesLoading } = useSalesReport(queryParams);
  const { data: financialReport, isLoading: isFinancialLoading } = useFinancialReport(queryParams);

  if (isSalesLoading || isFinancialLoading) {
    return <ReportDashboardSkeleton />;
  }

  const summary = salesReport?.summary;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">
            Laporan lengkap untuk periode{" "}
            {period === "daily" ? "hari ini" : period}
          </p>
        </div>
        <div className="flex gap-2">
          {period === "custom" && (
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          )}
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendapatan
            </CardTitle>
            <span className="text-muted-foreground">Rp</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {summary && summary.revenueChange >= 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={
                  summary && summary.revenueChange >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {Math.abs(summary?.revenueChange || 0).toFixed(1)}%
              </span>
              <span className="ml-1">dari periode lalu</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {summary && summary.ordersChange >= 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={
                  summary && summary.ordersChange >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {Math.abs(summary?.ordersChange || 0).toFixed(1)}%
              </span>
              <span className="ml-1">dari periode lalu</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Barang Terjual
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalItemsSold}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unit produk terjual
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rata-rata Order
            </CardTitle>
            <span className="text-muted-foreground">Rp</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary?.avgOrderValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {summary && summary.avgOrderChange >= 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={
                  summary && summary.avgOrderChange >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {Math.abs(summary?.avgOrderChange || 0).toFixed(1)}%
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Penjualan</TabsTrigger>
          <TabsTrigger value="products">Produk</TabsTrigger>
          <TabsTrigger value="financial">Keuangan</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grafik Penjualan</CardTitle>
              <CardDescription>
                Tren pendapatan selama periode ini
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesReport?.revenueByPeriod}>
                    <XAxis
                      dataKey="label"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => {
                        if (value >= 1000000)
                          return `Rp${(value / 1000000).toFixed(1)}jt`;
                        if (value >= 1000)
                          return `Rp${(value / 1000).toFixed(0)}rb`;
                        return `Rp${value}`;
                      }}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelStyle={{ color: "black" }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="currentColor"
                      radius={[4, 4, 0, 0]}
                      className="fill-primary"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Produk Terlaris</CardTitle>
              <CardDescription>
                Top 10 produk dengan penjualan tertinggi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {salesReport?.topProducts.map((product, i) => (
                  <div key={i} className="flex items-center">
                    <div className="ml-4 space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">
                        {product.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {product.quantity} terjual
                      </p>
                    </div>
                    <div className="font-medium">
                      +{formatCurrency(product.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Rincian Pendapatan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    {formatCurrency(financialReport?.revenue.subtotal || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pajak</span>
                  <span>
                    {formatCurrency(financialReport?.revenue.tax || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pengiriman</span>
                  <span>
                    {formatCurrency(financialReport?.revenue.shipping || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Diskon</span>
                  <span>
                    -{formatCurrency(financialReport?.revenue.discount || 0)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Bersih</span>
                  <span>
                    {formatCurrency(financialReport?.revenue.netRevenue || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {financialReport?.paymentMethods.map((pm, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{pm.method}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {pm.count} transaksi
                      </span>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(pm.amount)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lainnya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Penggunaan Kupon</p>
                  <p className="text-2xl font-bold">
                    {financialReport?.coupons.used}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total diskon:{" "}
                    {formatCurrency(
                      financialReport?.coupons.totalDiscount || 0,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Pengembalian Dana (Refund)
                  </p>
                  <p className="text-2xl font-bold">
                    {financialReport?.refunds.count}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total refund:{" "}
                    {formatCurrency(financialReport?.refunds.amount || 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
