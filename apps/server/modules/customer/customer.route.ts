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

/**
 * @swagger
 * /api/v1/customers:
 *   get:
 *     summary: List customers
 *     description: Returns customers with total order amounts. Requires authentication.
 *     tags: [Customer]
 *     responses:
 *       200:
 *         description: Customers retrieved
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
 *                         allOf:
 *                           - $ref: '#/components/schemas/User'
 *                           - type: object
 *                             properties:
 *                               orders:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     total_cents:
 *                                       type: integer
 *                                       format: int64
 *       401:
 *         description: Unauthorized
 */
customerRouter.get("/", authenticateMiddleware, customerController.getAll);

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   get:
 *     summary: Get customer detail
 *     description: Returns a customer with addresses and orders.
 *     tags: [Customer]
 *     parameters:
 *       - $ref: '#/components/parameters/CustomerId'
 *     responses:
 *       200:
 *         description: Customer retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/User'
 *                         - type: object
 *                           properties:
 *                             addresses:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Address'
 *                             orders:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
customerRouter.get("/:id", authenticateMiddleware, customerController.getById);

export { customerRouter };
