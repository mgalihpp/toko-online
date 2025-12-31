import axios from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export type ReportPeriod = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export interface SalesReportSummary {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalItemsSold: number;
  avgOrderValue: number;
  avgOrderChange: number;
}

export interface RevenueByPeriod {
  label: string;
  revenue: number;
  orders: number;
}

export interface OrderByStatus {
  status: string;
  count: number;
  revenue: number;
}

export interface TopProduct {
  title: string;
  quantity: number;
  revenue: number;
}

export interface SalesReport {
  period: ReportPeriod;
  dateRange: {
    start: string;
    end: string;
  };
  summary: SalesReportSummary;
  revenueByPeriod: RevenueByPeriod[];
  ordersByStatus: OrderByStatus[];
  topProducts: TopProduct[];
}

export interface FinancialReportRevenue {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  netRevenue: number;
}

export interface PaymentMethodBreakdown {
  method: string;
  count: number;
  amount: number;
}

export interface FinancialReport {
  period: ReportPeriod;
  dateRange: {
    start: string;
    end: string;
  };
  revenue: FinancialReportRevenue;
  paymentMethods: PaymentMethodBreakdown[];
  refunds: {
    count: number;
    amount: number;
  };
  coupons: {
    used: number;
    totalDiscount: number;
  };
}

export interface ReportParams {
  period: ReportPeriod;
  start_date?: string;
  end_date?: string;
}

export const reportApi = {
  /**
   * Get sales report
   */
  getSalesReport: async (params: ReportParams): Promise<SalesReport> => {
    const searchParams = new URLSearchParams();
    searchParams.set("period", params.period);
    if (params.start_date) searchParams.set("start_date", params.start_date);
    if (params.end_date) searchParams.set("end_date", params.end_date);

    const res = await axios.get<ApiResponse<SalesReport>>(
      `/reports/sales?${searchParams.toString()}`
    );
    return res.data.data;
  },

  /**
   * Get financial report
   */
  getFinancialReport: async (params: ReportParams): Promise<FinancialReport> => {
    const searchParams = new URLSearchParams();
    searchParams.set("period", params.period);
    if (params.start_date) searchParams.set("start_date", params.start_date);
    if (params.end_date) searchParams.set("end_date", params.end_date);

    const res = await axios.get<ApiResponse<FinancialReport>>(
      `/reports/financial?${searchParams.toString()}`
    );
    return res.data.data;
  },
};
