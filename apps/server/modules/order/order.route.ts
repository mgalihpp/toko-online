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

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: List all orders
 *     description: Admin endpoint to view orders along with items, payments, shipments, and user info.
 *     tags: [Order]
 *     parameters:
 *       - $ref: '#/components/parameters/OrderStatusQuery'
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/OrderWithRelations'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
orderRouter.get("/", requireAdmin, orderController.getAll);

/**
 * @swagger
 * /api/v1/orders/me:
 *   get:
 *     summary: List orders for authenticated user
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/OrderWithRelations'
 *       401:
 *         description: Unauthorized
 */
orderRouter.get("/me", authenticateMiddleware, orderController.getByUser);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: Fetch a single order with address, items (including variants/products), payments, shipments, and returns.
 *     tags: [Order]
 *     parameters:
 *       - $ref: '#/components/parameters/OrderId'
 *     responses:
 *       200:
 *         description: Order detail
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/OrderWithRelations'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
orderRouter.get("/:id", orderController.getById);

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create an order and initialize payment
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - items
 *             properties:
 *               user_id:
 *                 type: string
 *               address_id:
 *                 type: integer
 *                 nullable: true
 *               shipment_method_id:
 *                 type: integer
 *                 nullable: true
 *               coupon_code:
 *                 type: string
 *                 nullable: true
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [variant_id, quantity]
 *                   properties:
 *                     variant_id:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *               metadata:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       201:
 *         description: Order created and Snap transaction initialized
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/OrderCreationResult'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
orderRouter.post(
  "/",
  authenticateMiddleware,
  idempotencyMiddleware,
  orderController.create
);

/**
 * @swagger
 * /api/v1/orders/{id}/status:
 *   put:
 *     summary: Update order and shipment status
 *     description: Update order status, tracking number, and shipment method. Stock is adjusted when status moves to shipped.
 *     tags: [Order]
 *     parameters:
 *       - $ref: '#/components/parameters/OrderId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ready, pending, processing, shipped, in_transit, delivered, failed, returned, cancelled]
 *               tracking_number:
 *                 type: string
 *               shipment_method_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         order:
 *                           $ref: '#/components/schemas/Order'
 *                         shipment:
 *                           $ref: '#/components/schemas/Shipment'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
orderRouter.put("/:id/status", requireAdmin, orderController.updateStatus);

export { orderRouter };
