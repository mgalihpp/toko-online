import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  recentOrders: (limit?: number) =>
    [...dashboardKeys.all, "recent-orders", limit] as const,
  topProducts: (limit?: number) =>
    [...dashboardKeys.all, "top-products", limit] as const,
  lowStock: (threshold?: number, limit?: number) =>
    [...dashboardKeys.all, "low-stock", threshold, limit] as const,
  activities: (limit?: number) =>
    [...dashboardKeys.all, "activities", limit] as const,
};

/**
 * Hook to fetch dashboard statistics
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => api.dashboard.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch recent orders
 */
export function useRecentOrders(limit = 10) {
  return useQuery({
    queryKey: dashboardKeys.recentOrders(limit),
    queryFn: () => api.dashboard.getRecentOrders(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to fetch top products
 */
export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: dashboardKeys.topProducts(limit),
    queryFn: () => api.dashboard.getTopProducts(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch low stock products
 */
export function useLowStock(threshold = 10, limit = 5) {
  return useQuery({
    queryKey: dashboardKeys.lowStock(threshold, limit),
    queryFn: () => api.dashboard.getLowStock(threshold, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch recent activities
 */
export function useActivities(limit = 10) {
  return useQuery({
    queryKey: dashboardKeys.activities(limit),
    queryFn: () => api.dashboard.getActivities(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
