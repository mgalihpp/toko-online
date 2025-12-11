"use client";

import { Separator } from "@repo/ui/components/separator";
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { SearchCommand } from "@/components/search-command";
import { NotificationBell } from "@/features/user/components/settings/notification/notification-bell";
import { Breadcrumb } from "./breadcrumb";

export function TopNav() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 gap-4 w-full">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <SearchCommand />
        <NotificationBell />
      </div>
    </header>
  );
}
