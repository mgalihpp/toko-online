import axios from "@/lib/axios";

// Types for dashboard API responses
export interface DashboardOverview {
  revenue: { value: number; change: number };
  orders: { value: number; change: number };
  customers: { value: number; newThisMonth: number };
  products: { value: number };
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
}

export interface OrdersByStatus {
  status: string;
  label: string;
  count: number;
}

export interface DashboardStats {
  overview: DashboardOverview;
  revenueByMonth: RevenueByMonth[];
  ordersByStatus: OrdersByStatus[];
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
  itemCount: number;
}

export interface TopProduct {
  id: number;
  name: string;
  image?: string;
  sales: number;
  revenue: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  sku?: string;
  image?: string;
  stock: number;
  safetyStock?: number;
}

export interface Activity {
  type: string;
  message: string;
  date: string;
  icon: string;
}

export const dashboardApi = {
  /**
   * Get dashboard statistics (overview, charts data)
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await axios.get("/dashboard/stats");
    return response.data.data;
  },

  /**
   * Get recent orders
   */
  getRecentOrders: async (limit = 10): Promise<RecentOrder[]> => {
    const response = await axios.get("/dashboard/recent-orders", {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get top selling products
   */
  getTopProducts: async (limit = 5): Promise<TopProduct[]> => {
    const response = await axios.get("/dashboard/top-products", {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get low stock products
   */
  getLowStock: async (
    threshold = 10,
    limit = 5,
  ): Promise<LowStockProduct[]> => {
    const response = await axios.get("/dashboard/low-stock", {
      params: { threshold, limit },
    });
    return response.data.data;
  },

  /**
   * Get recent activities
   */
  getActivities: async (limit = 10): Promise<Activity[]> => {
    const response = await axios.get("/dashboard/activities", {
      params: { limit },
    });
    return response.data.data;
  },
};
