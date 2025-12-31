import type { Request, Response } from "express";
import { asyncHandler } from "@/middleware/asyncHandler";
import { AppResponse } from "@/utils/appResponse";
import { type ReportPeriod, ReportService } from "./report.service";

const reportService = new ReportService();

export class ReportController {
  /**
   * Get sales report
   * GET /api/reports/sales?period=daily|weekly|monthly|yearly&start_date=&end_date=
   */
  getSalesReport = asyncHandler(async (req: Request, res: Response) => {
    const period = (req.query.period as ReportPeriod) || "monthly";
    const startDate = req.query.start_date
      ? new Date(req.query.start_date as string)
      : undefined;
    const endDate = req.query.end_date
      ? new Date(req.query.end_date as string)
      : undefined;

    const report = await reportService.getSalesReport(
      period,
      startDate,
      endDate,
    );

    new AppResponse({
      res,
      data: report,
    });
  });

  /**
   * Get financial report
   * GET /api/reports/financial?period=daily|weekly|monthly|yearly&start_date=&end_date=
   */
  getFinancialReport = asyncHandler(async (req: Request, res: Response) => {
    const period = (req.query.period as ReportPeriod) || "monthly";
    const startDate = req.query.start_date
      ? new Date(req.query.start_date as string)
      : undefined;
    const endDate = req.query.end_date
      ? new Date(req.query.end_date as string)
      : undefined;

    const report = await reportService.getFinancialReport(
      period,
      startDate,
      endDate,
    );

    new AppResponse({
      res,
      data: report,
    });
  });

  /**
   * Get full report for export
   * GET /api/reports/export?period=daily|weekly|monthly|yearly&start_date=&end_date=
   */
  getExportReport = asyncHandler(async (req: Request, res: Response) => {
    const period = (req.query.period as ReportPeriod) || "monthly";
    const startDate = req.query.start_date
      ? new Date(req.query.start_date as string)
      : undefined;
    const endDate = req.query.end_date
      ? new Date(req.query.end_date as string)
      : undefined;

    const report = await reportService.getReportForExport(
      period,
      startDate,
      endDate,
    );

    new AppResponse({
      res,
      data: report,
    });
  });
}
