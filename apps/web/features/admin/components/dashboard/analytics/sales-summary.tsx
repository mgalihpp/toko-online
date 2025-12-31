"use client";

import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarIcon,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataTable } from "@/features/admin/components/data-table";
import { useSalesSummary } from "@/features/admin/queries/useAnalyticsQuery";
import { formatCurrency } from "@/features/admin/utils";
import type { SalesByStatus } from "@/lib/api/analytics.api";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export function SalesSummary() {
  const [period, setPeriod] = useState<
    "day" | "week" | "month" | "year" | "custom"
  >("month");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Calculate days based on period or custom date range
  const days = useMemo(() => {
    if (period === "custom" && dateRange?.from && dateRange?.to) {
      const diffTime = Math.abs(
        dateRange.to.getTime() - dateRange.from.getTime(),
      );
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    switch (period) {
      case "day":
        return 1;
      case "week":
        return 7;
      case "month":
        return 30;
      case "year":
        return 365;
      default:
        return 30;
    }
  }, [period, dateRange]);

  const { data, isLoading, isError } = useSalesSummary(
    period === "custom" ? "month" : period,
    days,
  );

  // Column definitions for status table
  const statusColumns: ColumnDef<SalesByStatus>[] = useMemo(
    () => [
      {
        accessorKey: "label",
        header: "Status",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.label}</span>
        ),
      },
      {
        accessorKey: "count",
        header: "Jumlah",
        cell: ({ row }) => row.original.count.toLocaleString("id-ID"),
      },
      {
        accessorKey: "revenue",
        header: "Pendapatan",
        cell: ({ row }) => (
          <div className=" font-medium">
            {formatCurrency(row.original.revenue)}
          </div>
        ),
      },
    ],
    [],
  );

  if (isLoading) {
    return <SalesSummarySkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Gagal memuat ringkasan penjualan
      </div>
    );
  }

  const { summary, trend, byCategory, byStatus } = data;

  const periodLabels = {
    day: "Hari Ini",
    week: "Minggu Ini",
    month: "Bulan Ini",
    year: "Tahun Ini",
    custom: "Kustom",
  };

  const getPeriodDescription = () => {
    if (period === "custom" && dateRange?.from) {
      if (dateRange.to) {
        return `${format(dateRange.from, "d MMM yyyy", { locale: id })} - ${format(dateRange.to, "d MMM yyyy", { locale: id })}`;
      }
      return format(dateRange.from, "d MMM yyyy", { locale: id });
    }
    return periodLabels[period].toLowerCase();
  };

  return (
    <div className="space-y-6">
      {/* Header dengan Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Ringkasan Penjualan</h2>
          <p className="text-muted-foreground">
            Analitik penjualan {getPeriodDescription()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={period}
            onValueChange={(v) => setPeriod(v as typeof period)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hari Ini</SelectItem>
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
              <SelectItem value="custom">Kustom</SelectItem>
            </SelectContent>
          </Select>

          {period === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "d MMM", { locale: id })} -{" "}
                        {format(dateRange.to, "d MMM yyyy", { locale: id })}
                      </>
                    ) : (
                      format(dateRange.from, "d MMM yyyy", { locale: id })
                    )
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={id}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Pendapatan"
          value={formatCurrency(summary.totalRevenue)}
          change={summary.revenueChange}
          icon={<DollarSign className="h-4 w-4" />}
          color="emerald"
        />
        <StatCard
          title="Total Pesanan"
          value={summary.totalOrders.toLocaleString("id-ID")}
          change={summary.ordersChange}
          icon={<ShoppingCart className="h-4 w-4" />}
          color="blue"
        />
        <StatCard
          title="Rata-rata Nilai Pesanan"
          value={formatCurrency(summary.averageOrderValue)}
          change={summary.aovChange}
          icon={<TrendingUp className="h-4 w-4" />}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tren Penjualan</CardTitle>
            <CardDescription>
              Pendapatan dan pesanan 30 hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      });
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}jt`
                    }
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload) return null;
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-medium">
                            {new Date(label).toLocaleDateString("id-ID")}
                          </p>
                          <p className="text-emerald-600">
                            Pendapatan:{" "}
                            {formatCurrency(payload[0]?.value as number)}
                          </p>
                          <p className="text-blue-600">
                            Pesanan: {payload[1]?.value}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                    name="Pendapatan"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Penjualan per Kategori</CardTitle>
            <CardDescription>
              Distribusi pendapatan berdasarkan kategori
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCategory.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="revenue"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {byCategory.slice(0, 6).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-medium">{data.name}</p>
                          <p>Pendapatan: {formatCurrency(data.revenue)}</p>
                          <p>Pesanan: {data.orders}</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown with DataTable */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Pesanan</CardTitle>
          <CardDescription>
            Distribusi pesanan berdasarkan status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={statusColumns}
            data={byStatus}
            searchPlaceholder="Cari status..."
            searchKey="label"
            stickyLastColumn={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
  color,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: "emerald" | "blue" | "purple" | "orange";
}) {
  const isPositive = change >= 0;
  const colorClasses = {
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
          <div
            className={`flex items-center gap-1 text-sm ${isPositive ? "text-emerald-600" : "text-red-600"}`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {Math.abs(change)}%
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SalesSummarySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-4 w-24 mt-4" />
              <Skeleton className="h-8 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
