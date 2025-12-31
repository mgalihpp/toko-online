import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/analytics.api";

export const analyticsKeys = {
  all: ["analytics"] as const,
  salesSummary: (period?: string, days?: number) =>
    [...analyticsKeys.all, "sales-summary", period, days] as const,
  customerInsights: (limit?: number) =>
    [...analyticsKeys.all, "customer-insights", limit] as const,
  productPerformance: (limit?: number) =>
    [...analyticsKeys.all, "product-performance", limit] as const,
};

/**
 * Hook to fetch sales summary data
 */
export function useSalesSummary(
  period: "day" | "week" | "month" | "year" = "month",
  days = 30
) {
  return useQuery({
    queryKey: analyticsKeys.salesSummary(period, days),
    queryFn: () => analyticsApi.getSalesSummary(period, days),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch customer insights
 */
export function useCustomerInsights(limit = 10) {
  return useQuery({
    queryKey: analyticsKeys.customerInsights(limit),
    queryFn: () => analyticsApi.getCustomerInsights(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch product performance
 */
export function useProductPerformance(limit = 10) {
  return useQuery({
    queryKey: analyticsKeys.productPerformance(limit),
    queryFn: () => analyticsApi.getProductPerformance(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
