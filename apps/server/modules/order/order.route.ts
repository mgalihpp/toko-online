import { Router } from "express";
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

orderRouter.get("/", authenticateMiddleware, orderController.getAll);
orderRouter.get("/me", authenticateMiddleware, orderController.getByUser);
orderRouter.get("/:id", orderController.getById);
orderRouter.post(
  "/",
  authenticateMiddleware,
  idempotencyMiddleware,
  orderController.create,
);
orderRouter.put("/:id/status", orderController.updateStatus);

export { orderRouter };
