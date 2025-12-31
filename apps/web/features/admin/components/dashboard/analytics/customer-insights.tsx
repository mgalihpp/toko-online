"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownRight,
  ArrowUpRight,
  Crown,
  DollarSign,
  MapPin,
  Repeat,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
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
import { useCustomerInsights } from "@/features/admin/queries/useAnalyticsQuery";
import { formatCurrency } from "@/features/admin/utils";
import type { TopCustomer } from "@/lib/api/analytics.api";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export function CustomerInsights() {
  const { data, isLoading, isError } = useCustomerInsights(10);

  // Column definitions for top customers table
  const customerColumns: ColumnDef<TopCustomer>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Pelanggan",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={row.original.image} alt={row.original.name} />
              <AvatarFallback>
                {row.original.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-sm text-muted-foreground">
                {row.original.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "segment",
        header: "Segmen",
        cell: ({ row }) =>
          row.original.segment ? (
            <Badge
              variant="outline"
              style={{
                borderColor: row.original.segment.color,
                color: row.original.segment.color,
              }}
            >
              {row.original.segment.name}
            </Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          ),
      },
      {
        accessorKey: "orderCount",
        header: "Total Pesanan",
        cell: ({ row }) => <div>{row.original.orderCount}</div>,
      },
      {
        accessorKey: "lifetimeSpent",
        header: "Total Belanja",
        cell: ({ row }) => (
          <div className="font-medium">
            {formatCurrency(row.original.lifetimeSpent)}
          </div>
        ),
      },
      {
        accessorKey: "joinedAt",
        header: "Bergabung",
        cell: ({ row }) => (
          <div className="text-muted-foreground">
            {new Date(row.original.joinedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        ),
      },
    ],
    [],
  );

  if (isLoading) {
    return <CustomerInsightsSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Gagal memuat wawasan pelanggan
      </div>
    );
  }

  const { overview, byLocation, topCustomers, segments } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Wawasan Pelanggan</h2>
        <p className="text-muted-foreground">
          Analitik dan segmentasi pelanggan
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pelanggan"
          value={overview.totalCustomers.toLocaleString("id-ID")}
          icon={<Users className="h-4 w-4" />}
          color="blue"
        />
        <StatCard
          title="Pelanggan Baru"
          value={overview.newCustomersThisMonth.toLocaleString("id-ID")}
          change={overview.newCustomersChange}
          subtitle="bulan ini"
          icon={<UserPlus className="h-4 w-4" />}
          color="emerald"
        />
        <StatCard
          title="Tingkat Retensi"
          value={`${overview.retentionRate}%`}
          icon={<Repeat className="h-4 w-4" />}
          color="purple"
        />
        <StatCard
          title="Customer Lifetime Value"
          value={formatCurrency(overview.customerLifetimeValue)}
          icon={<DollarSign className="h-4 w-4" />}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Distribusi Lokasi
            </CardTitle>
            <CardDescription>Pelanggan berdasarkan provinsi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={byLocation.byProvince.slice(0, 8)}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-medium">{data.name}</p>
                          <p>Jumlah: {data.count} pelanggan</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Segmen Pelanggan
            </CardTitle>
            <CardDescription>Distribusi berdasarkan segmen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segments}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="customerCount"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {segments.map((segment, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={segment.color || COLORS[index % COLORS.length]}
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
                          <p>Pelanggan: {data.customerCount}</p>
                          <p>
                            Total Belanja: {formatCurrency(data.totalSpent)}
                          </p>
                          <p>Diskon: {data.discountPercent}%</p>
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

      {/* Top Customers Table with DataTable */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Pelanggan</CardTitle>
          <CardDescription>
            Pelanggan dengan nilai belanja tertinggi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={customerColumns}
            data={topCustomers}
            searchPlaceholder="Cari pelanggan..."
            searchKey={["name", "email"]}
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
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string;
  change?: number;
  subtitle?: string;
  icon: React.ReactNode;
  color: "emerald" | "blue" | "purple" | "orange";
}) {
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
          {change !== undefined && (
            <div
              className={`flex items-center gap-1 text-sm ${change >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {change >= 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CustomerInsightsSkeleton() {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
