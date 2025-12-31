import { Router } from "express";
import { ReportController } from "./report.controller";

const router = Router();
const reportController = new ReportController();

// Sales report
router.get("/sales", reportController.getSalesReport);

// Financial report
router.get("/financial", reportController.getFinancialReport);

// Export report (combined)
router.get("/export", reportController.getExportReport);

export default router;
