import type { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

const dashboardService = new DashboardService();

export const DashboardController = {
  /**
   * GET /api/v1/dashboard/stats
   * Get all dashboard statistics
   */
  getStats: async (_req: Request, res: Response) => {
    try {
      const [overview, revenueByMonth, ordersByStatus] = await Promise.all([
        dashboardService.getOverviewStats(),
        dashboardService.getRevenueByMonth(),
        dashboardService.getOrdersByStatus(),
      ]);

      res.json({
        success: true,
        data: {
          overview,
          revenueByMonth,
          ordersByStatus,
        },
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard statistics",
      });
    }
  },

  /**
   * GET /api/v1/dashboard/recent-orders
   * Get recent orders for dashboard
   */
  getRecentOrders: async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const orders = await dashboardService.getRecentOrders(limit);

      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error("Recent orders error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch recent orders",
      });
    }
  },

  /**
   * GET /api/v1/dashboard/top-products
   * Get top selling products
   */
  getTopProducts: async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const products = await dashboardService.getTopProducts(limit);

      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error("Top products error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch top products",
      });
    }
  },

  /**
   * GET /api/v1/dashboard/low-stock
   * Get low stock products
   */
  getLowStock: async (req: Request, res: Response) => {
    try {
      const threshold = parseInt(req.query.threshold as string) || 10;
      const limit = parseInt(req.query.limit as string) || 5;
      const products = await dashboardService.getLowStockProducts(
        threshold,
        limit,
      );

      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error("Low stock error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch low stock products",
      });
    }
  },

  /**
   * GET /api/v1/dashboard/activities
   * Get recent activities
   */
  getActivities: async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await dashboardService.getRecentActivities(limit);

      res.json({
        success: true,
        data: activities,
      });
    } catch (error) {
      console.error("Activities error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch activities",
      });
    }
  },
};
