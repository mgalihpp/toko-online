"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit2, Mail } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/features/admin/components/data-table";
import { api } from "@/lib/api";
import type { UserWithRelations } from "@/types/index";
import { formatCurrency } from "../../utils";
import { DataTableSkeleton } from "../data-table-skeleton";
import { ErrorAlert } from "../error-alert";

export function CustomersTable() {
  const {
    data: customerData,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: api.customer.getAll,
  });

  const columns: ColumnDef<UserWithRelations>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email") as string;
        return (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            {email}
          </div>
        );
      },
    },
    {
      accessorKey: "segment",
      header: "Segment",
      cell: ({ row }) => {
        const segment = row.original.segment;
        if (!segment) {
          return <Badge variant="outline">-</Badge>;
        }
        return (
          <Badge
            style={{
              backgroundColor: segment.color || "#6b7280",
              color: "#fff",
            }}
          >
            {segment.name}
          </Badge>
        );
      },
    },
    // {
    //   accessorKey: "phone",
    //   header: "Phone",
    //   cell: ({ row }) => {
    //     const phone = row.getValue("phone") as string;
    //     return (
    //       <div className="flex items-center gap-2">
    //         <Phone className="w-4 h-4 text-muted-foreground" />
    //         {phone}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "orders",
    //   header: "Orders",
    //   cell: ({ row }) => {
    //     const total_orders = row.original.orders.length ?? 0;

    //     return total_orders;
    //   },
    // },
    {
      accessorKey: "spent",
      header: "Total Spent",
      cell: ({ row }) => {
        const total_spent = row.original.orders
          .filter((order) => order.status === "delivered")
          .reduce((acc, order) => acc + Number(order.total_cents), 0);

        return <span>{formatCurrency(total_spent)}</span>;
      },
    },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => {
    //     const status = row.getValue("status") as string;
    //     return (
    //       <Badge variant={status === "Active" ? "default" : "secondary"}>
    //         {status}
    //       </Badge>
    //     );
    //   },
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <Link href={`/dashboard/customers/${customer.id}`}>
            <Button variant="ghost" size="sm">
              <Edit2 className="w-4 h-4" />
            </Button>
          </Link>
        );
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Pelanggan</h3>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <DataTableSkeleton />
        ) : isError ? (
          <ErrorAlert
            description="Gagal mendapatkan data pelanggan"
            action={() => refetch()}
          />
        ) : (
          <DataTable
            columns={columns}
            data={customerData}
            searchPlaceholder="Search by name or email.."
            searchKey={["name", "email"]}
          />
        )}
      </CardContent>
    </Card>
  );
}
