"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Skeleton } from "@repo/ui/components/skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DataTable } from "@/features/admin/components/data-table";
import { useAuditLogs } from "@/features/admin/queries/useAuditLogQuery";
import { formatCurrency } from "@/features/admin/utils";
import type { AuditLog } from "@/lib/api/audit-log.api";

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "created_at",
    header: "Waktu",
    cell: ({ row }) =>
      format(new Date(row.getValue("created_at")), "dd MMM yyyy HH:mm"),
  },
  {
    accessorKey: "user",
    header: "Pengguna",
    cell: ({ row }) => {
      const user = row.original.user;
      return user ? (
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      ) : (
        <span className="text-muted-foreground italic">System / Guest</span>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Aksi",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("action")}</Badge>
    ),
  },
  {
    accessorKey: "object_type",
    header: "Tipe Objek",
    cell: ({ row }) => row.getValue("object_type"),
  },
  {
    accessorKey: "object_id",
    header: "ID Objek",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("object_id")}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const log = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/audit/${log.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface AuditLogTableProps {
  userId?: string;
  action?: string;
  type?: "user" | "system";
}

export function AuditLogTable({ userId, action, type }: AuditLogTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAuditLogs({
    page,
    limit: pageSize,
    search,
    user_id: userId,
    action,
    type,
  });

  const logs = data?.data || [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={logs}
      pageCount={meta?.totalPages || 1}
      page={page}
      onPageChange={setPage}
      onSearch={setSearch}
      searchPlaceholder="Cari aksi, tipe objek..."
    />
  );
}
