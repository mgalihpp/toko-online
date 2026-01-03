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
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Shield, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/features/admin/components/data-table";
import { DataTableSkeleton } from "@/features/admin/components/data-table-skeleton";
import {
  useUpdateUserRole,
  useUsers,
} from "@/features/admin/queries/useUserQuery";
import type { User } from "@/lib/api/user.api";

export function UsersTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const { mutate: updateRole } = useUpdateUserRole();

  const { data, isFetching } = useUsers({
    page,
    limit: pageSize,
    search,
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.getValue("email"),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const isAdmin = role === "admin";
        return (
          <Badge variant={isAdmin ? "default" : "secondary"}>
            {isAdmin ? (
              <Shield className="w-3 h-3 mr-1" />
            ) : (
              <UserIcon className="w-3 h-3 mr-1" />
            )}
            {role || "user"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const user = row.original;
        const isAdmin = user.role === "admin";

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
              <DropdownMenuItem
                onClick={() =>
                  updateRole({
                    id: user.id,
                    role: isAdmin ? "user" : "admin",
                  })
                }
              >
                {isAdmin ? (
                  <>
                    <UserIcon className="w-4 h-4 mr-2" />
                    Ubah ke User
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Jadikan Admin
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isFetching) {
    return <DataTableSkeleton columns={4} />;
  }

  return (
    <DataTable
      columns={columns}
      data={data?.data || []}
      pageCount={data?.meta.totalPages || 1}
      page={page}
      onPageChange={setPage}
      onSearch={setSearch}
      searchPlaceholder="Cari pengguna..."
    />
  );
}
