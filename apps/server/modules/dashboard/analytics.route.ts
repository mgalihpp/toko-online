import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";

const analyticsRouter = Router();

/**
 * GET /api/v1/analytics/sales-summary
 * Get sales summary with trends and breakdowns
 */
analyticsRouter.get("/sales-summary", AnalyticsController.getSalesSummary);

/**
 * GET /api/v1/analytics/customer-insights
 * Get customer insights and segmentation
 */
analyticsRouter.get(
  "/customer-insights",
  AnalyticsController.getCustomerInsights,
);

/**
 * GET /api/v1/analytics/product-performance
 * Get product performance metrics
 */
analyticsRouter.get(
  "/product-performance",
  AnalyticsController.getProductPerformance,
);

export { analyticsRouter };
