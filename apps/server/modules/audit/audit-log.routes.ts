import { Router } from "express";
import { AuditLogController } from "./audit-log.controller";

const router = Router();
const controller = new AuditLogController();

router.get("/", controller.getAuditLogs);
router.get("/actions", controller.getActions);
router.get("/:id", controller.getAuditLogById);

export default router;
