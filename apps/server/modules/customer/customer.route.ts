import { Router } from "express";
import { authenticateMiddleware } from "@/middleware/authenticated";
import { CustomerController } from "./customer.controller";

const customerRouter = Router();
const customerController = new CustomerController();
/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Customer management endpoints
 */

customerRouter.get("/", authenticateMiddleware, customerController.getAll);
customerRouter.get("/:id", authenticateMiddleware, customerController.getById);

export { customerRouter };
