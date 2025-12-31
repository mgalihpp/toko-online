"use client";

import { UsersTable } from "@/features/admin/components/settings/users-table";

export default function RolesPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Peran & Izin</h1>
          <p className="text-muted-foreground mt-2">
            Kelola akses pengguna dan administrator
          </p>
        </div>
      </div>

      <UsersTable />
    </div>
  );
}
