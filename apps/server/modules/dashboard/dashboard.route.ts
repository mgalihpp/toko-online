import { Router } from "express";
import { DashboardController } from "./dashboard.controller";

const dashboardRouter = Router();

/**
 * GET /api/v1/dashboard/stats
 * Get all dashboard statistics (overview, charts data)
 */
dashboardRouter.get("/stats", DashboardController.getStats);

/**
 * GET /api/v1/dashboard/recent-orders
 * Get recent orders for dashboard
 */
dashboardRouter.get("/recent-orders", DashboardController.getRecentOrders);

/**
 * GET /api/v1/dashboard/top-products
 * Get top selling products
 */
dashboardRouter.get("/top-products", DashboardController.getTopProducts);

/**
 * GET /api/v1/dashboard/low-stock
 * Get low stock products alert
 */
dashboardRouter.get("/low-stock", DashboardController.getLowStock);

/**
 * GET /api/v1/dashboard/activities
 * Get recent activities
 */
dashboardRouter.get("/activities", DashboardController.getActivities);

export { dashboardRouter };
