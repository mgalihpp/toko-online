"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Package } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/features/admin/components/data-table";
import { DataTableSkeleton } from "@/features/admin/components/data-table-skeleton";
import { ErrorAlert } from "@/features/admin/components/error-alert";
import { formatDate } from "@/features/admin/utils";
import { useReturns } from "@/features/order/queries/useReturnQuery";

// Status labels dan colors
const returnStatusLabels: Record<string, string> = {
  requested: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
  processing: "Diproses",
  completed: "Selesai",
};

const returnStatusColors: Record<string, string> = {
  requested: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  approved: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  rejected: "bg-red-500/20 text-red-600 border-red-500/30",
  processing: "bg-purple-500/20 text-purple-600 border-purple-500/30",
  completed: "bg-green-500/20 text-green-600 border-green-500/30",
};

interface ReturnItem {
  id: string;
  order_id: string;
  status: string;
  created_at: string;
  user?: {
    name?: string;
    email?: string;
  };
  return_items?: unknown[];
}

export default function ReturnsPage() {
  const { data: returns, isPending, isError, refetch } = useReturns();

  // Count by status
  const statusCounts = returns?.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const columns: ColumnDef<ReturnItem>[] = [
    {
      accessorKey: "id",
      header: "ID Return",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.id.slice(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: "order_id",
      header: "Pesanan",
      cell: ({ row }) => (
        <Link
          href={`/dashboard/orders/${row.original.order_id}`}
          className="text-primary hover:underline"
        >
          #{row.original.order_id?.slice(0, 8)}...
        </Link>
      ),
    },
    {
      accessorKey: "user.name",
      header: "Pelanggan",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.user?.name || "-"}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.user?.email}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Tanggal",
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      accessorKey: "return_items",
      header: "Item",
      cell: ({ row }) => (
        <span>{row.original.return_items?.length || 0} item</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={returnStatusColors[row.original.status]}>
          {returnStatusLabels[row.original.status] || row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/returns/${row.original.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            Detail
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pengembalian</h1>
        <p className="text-muted-foreground mt-2">
          Kelola permintaan pengembalian produk dari pelanggan
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{returns?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">
              Menunggu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {statusCounts?.requested || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              Disetujui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {statusCounts?.approved || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">
              Diproses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {statusCounts?.processing || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Selesai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {statusCounts?.completed || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Daftar Pengembalian
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <DataTableSkeleton columns={7} rows={5} />
          ) : isError ? (
            <ErrorAlert
              description="Gagal memuat data pengembalian."
              action={() => refetch()}
            />
          ) : returns?.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                Belum ada permintaan pengembalian
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={(returns as unknown as ReturnItem[]) ?? []}
              searchPlaceholder="Cari berdasarkan ID..."
              searchKey="id"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
