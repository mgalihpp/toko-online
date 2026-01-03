"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@repo/ui/components/sidebar";
import { useQuery } from "@tanstack/react-query";
import { ADMIN_NAV_DATA } from "@/features/admin/constants/navigation";
import { dashboardApi } from "@/lib/api/dashboard.api";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // Fetch dashboard stats for badges
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardApi.getStats,
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
  });

  // Calculate badges
  const pendingOrderCount =
    stats?.ordersByStatus.find((s) => s.status === "pending")?.count || 0;
  const processingOrderCount =
    stats?.ordersByStatus.find((s) => s.status === "processing")?.count || 0;

  const badges = {
    "/orders/pending": pendingOrderCount > 0 ? pendingOrderCount : 0,
    "/orders/processing": processingOrderCount > 0 ? processingOrderCount : 0,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={ADMIN_NAV_DATA.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={ADMIN_NAV_DATA.navMain} badges={badges} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
