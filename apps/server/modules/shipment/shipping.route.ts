import { Router } from "express";
import { authenticateMiddleware } from "@/middleware/authenticated";
import { ShipmentController } from "./shipment.controller";

const shipmentRouter = Router();
const shipmentController = new ShipmentController();
/**
 * @swagger
 * tags:
 *   name: Shipment
 *   description: Shipment management endpoints
 */

shipmentRouter.post("/", authenticateMiddleware, shipmentController.create);
shipmentRouter.put("/:id", authenticateMiddleware, shipmentController.update);

export { shipmentRouter };
