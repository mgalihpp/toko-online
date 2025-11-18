import { Router } from "express";
import { authenticateMiddleware } from "@/middleware/authenticated";
import { PaymentController } from "./payment.controller";

const paymentRouter = Router();
const paymentController = new PaymentController();
/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address management endpoints
 */

paymentRouter.get(
  "/status/:id",
  authenticateMiddleware,
  paymentController.getStatus,
);

export { paymentRouter };
