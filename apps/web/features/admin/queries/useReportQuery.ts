import { useQuery } from "@tanstack/react-query";
import {
  type FinancialReport,
  type ReportParams,
  reportApi,
  type SalesReport,
} from "@/lib/api/report.api";

/**
 * Hook untuk fetch sales report
 */
export const useSalesReport = (params: ReportParams, enabled = true) => {
  return useQuery<SalesReport>({
    queryKey: ["report", "sales", params],
    queryFn: () => reportApi.getSalesReport(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};

/**
 * Hook untuk fetch financial report
 */
export const useFinancialReport = (params: ReportParams, enabled = true) => {
  return useQuery<FinancialReport>({
    queryKey: ["report", "financial", params],
    queryFn: () => reportApi.getFinancialReport(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};
