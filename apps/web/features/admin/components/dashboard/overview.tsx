"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Box, DollarSign, ShoppingCart, Users } from "lucide-react";
import { useDashboardStats } from "@/features/admin/queries/useDashboardQuery";
import { formatCurrency } from "@/features/admin/utils";

export function DashboardOverview() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Gagal memuat statistik dashboard
      </div>
    );
  }

  const { overview } = data;

  const stats = [
    {
      title: "Total Penghasilan",
      value: formatCurrency(overview.revenue.value),
      change: overview.revenue.change,
      icon: DollarSign,
      color: "text-emerald-600",
    },
    {
      title: "Total Pesanan",
      value: overview.orders.value.toLocaleString("id-ID"),
      change: overview.orders.change,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Total Pelanggan",
      value: overview.customers.value.toLocaleString("id-ID"),
      subtitle: `+${overview.customers.newThisMonth} bulan ini`,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Total Produk",
      value: overview.products.value.toLocaleString("id-ID"),
      subtitle: "Aktif",
      icon: Box,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const changeColor =
          stat.change && stat.change >= 0 ? "text-emerald-600" : "text-red-600";
        const changePrefix = stat.change && stat.change >= 0 ? "+" : "";

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change !== undefined && (
                <p className={`text-xs mt-1 ${changeColor}`}>
                  {changePrefix}
                  {stat.change}% dari bulan lalu
                </p>
              )}
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.subtitle}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
