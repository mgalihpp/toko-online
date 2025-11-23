import { Router } from "express";
import { requireAdmin } from "@/middleware/admin";
import { authenticateMiddleware } from "@/middleware/authenticated";
import { idempotencyMiddleware } from "@/middleware/idempotency";
import { OrderController } from "./order.controller";

const orderRouter = Router();
const orderController = new OrderController();
/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order management endpoints
 */

orderRouter.get("/", requireAdmin, orderController.getAll);
orderRouter.get("/me", authenticateMiddleware, orderController.getByUser);
orderRouter.get("/:id", orderController.getById);
orderRouter.post(
  "/",
  authenticateMiddleware,
  idempotencyMiddleware,
  orderController.create
);
orderRouter.put("/:id/status", requireAdmin, orderController.updateStatus);

export { orderRouter };
