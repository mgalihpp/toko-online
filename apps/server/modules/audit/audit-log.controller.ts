import type { Request, Response } from "express";
import { asyncHandler } from "@/middleware/asyncHandler";
import { AppResponse } from "@/utils/appResponse";
import { AuditLogService } from "./audit-log.service";

const auditLogService = new AuditLogService();

export class AuditLogController {
  getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const action = req.query.action as string;
    const userId = req.query.user_id as string;
    const type = req.query.type as "user" | "system";
    const startDate = req.query.start_date
      ? new Date(req.query.start_date as string)
      : undefined;
    const endDate = req.query.end_date
      ? new Date(req.query.end_date as string)
      : undefined;

    const result = await auditLogService.getAuditLogs({
      page,
      limit,
      search,
      action,
      userId,
      type,
      startDate,
      endDate,
    });

    new AppResponse({
      res,
      data: result,
    });
  });

  getAuditLogById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const log = await auditLogService.getAuditLogById(id);

    if (!log) {
      res.status(404).json({ message: "Audit log not found" });
      return;
    }

    new AppResponse({
      res,
      data: log,
    });
  });

  getActions = asyncHandler(async (req: Request, res: Response) => {
    const actions = await auditLogService.getDistinctActions();
    new AppResponse({
      res,
      data: actions,
    });
  });
}
