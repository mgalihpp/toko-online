import { Router } from "express";
import { requireAdmin } from "@/middleware/admin";
import { ShipmentController } from "./shipment.controller";

const shipmentRouter = Router();
const shipmentController = new ShipmentController();
/**
 * @swagger
 * tags:
 *   name: Shipment
 *   description: Shipment management endpoints
 */

shipmentRouter.post("/", requireAdmin, shipmentController.create);
shipmentRouter.put("/:id", requireAdmin, shipmentController.update);

export { shipmentRouter };
