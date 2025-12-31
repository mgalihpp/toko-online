import axios from "@/lib/axios";

// ========================
// SALES SUMMARY TYPES
// ========================

export interface SalesSummary {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  averageOrderValue: number;
  aovChange: number;
  period: "day" | "week" | "month" | "year";
}

export interface SalesTrend {
  date: string;
  revenue: number;
  orders: number;
}

export interface SalesByCategory {
  name: string;
  revenue: number;
  orders: number;
}

export interface SalesByStatus {
  status: string;
  label: string;
  count: number;
  revenue: number;
}

export interface SalesSummaryResponse {
  summary: SalesSummary;
  trend: SalesTrend[];
  byCategory: SalesByCategory[];
  byStatus: SalesByStatus[];
}

// ========================
// CUSTOMER INSIGHTS TYPES
// ========================

export interface CustomerOverview {
  totalCustomers: number;
  newCustomersThisMonth: number;
  newCustomersChange: number;
  customerLifetimeValue: number;
  retentionRate: number;
  customersWithOrders: number;
}

export interface LocationData {
  name: string;
  count: number;
}

export interface CustomersByLocation {
  byCity: LocationData[];
  byProvince: LocationData[];
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  image?: string;
  lifetimeSpent: number;
  orderCount: number;
  segment?: { name: string; color?: string };
  joinedAt: string;
}

export interface CustomerSegment {
  id: number;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  customerCount: number;
  totalSpent: number;
  discountPercent: number;
}

export interface CustomerInsightsResponse {
  overview: CustomerOverview;
  byLocation: CustomersByLocation;
  topCustomers: TopCustomer[];
  segments: CustomerSegment[];
}

// ========================
// PRODUCT PERFORMANCE TYPES
// ========================

export interface TopSellingProduct {
  id: string;
  name: string;
  slug: string;
  image?: string;
  category?: string;
  sales: number;
  revenue: number;
}

export interface TopRatedProduct {
  id: string;
  name: string;
  slug: string;
  image?: string;
  category?: string;
  avgRating: number;
  reviewCount: number;
}

export interface ReturnedProduct {
  id: string;
  name: string;
  image?: string;
  category?: string;
  returnCount: number;
}

export interface CategoryPerformance {
  id: number;
  name: string;
  slug: string;
  productCount: number;
  totalSales: number;
  totalRevenue: number;
  avgRating: number;
}

export interface ProductPerformanceResponse {
  totalProducts: number;
  totalCategories: number;
  topSelling: TopSellingProduct[];
  topRated: TopRatedProduct[];
  mostReturned: ReturnedProduct[];
  categoryPerformance: CategoryPerformance[];
}

// ========================
// API METHODS
// ========================

export const analyticsApi = {
  /**
   * Get sales summary with trends and breakdowns
   */
  getSalesSummary: async (
    period: "day" | "week" | "month" | "year" = "month",
    days = 30,
  ): Promise<SalesSummaryResponse> => {
    const response = await axios.get("/analytics/sales-summary", {
      params: { period, days },
    });
    return response.data.data;
  },

  /**
   * Get customer insights and segmentation
   */
  getCustomerInsights: async (
    limit = 10,
  ): Promise<CustomerInsightsResponse> => {
    const response = await axios.get("/analytics/customer-insights", {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get product performance metrics
   */
  getProductPerformance: async (
    limit = 10,
  ): Promise<ProductPerformanceResponse> => {
    const response = await axios.get("/analytics/product-performance", {
      params: { limit },
    });
    return response.data.data;
  },
};
