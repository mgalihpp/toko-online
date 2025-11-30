import { Router } from "express";
import { authenticateMiddleware } from "@/middleware/authenticated";
import { AddressController } from "./address.controller";

const addressRouter = Router();
const addressController = new AddressController();
/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Address management endpoints
 */

/**
 * @swagger
 * /api/v1/address:
 *   get:
 *     summary: List addresses of authenticated user
 *     tags: [Address]
 *     responses:
 *       200:
 *         description: Addresses retrieved
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
 *                         $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 */
addressRouter.get("/", authenticateMiddleware, addressController.getAll);

/**
 * @swagger
 * /api/v1/address:
 *   post:
 *     summary: Create address
 *     description: User ID is taken from authentication context.
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipient_name
 *             properties:
 *               recipient_name:
 *                 type: string
 *               label:
 *                 type: string
 *                 nullable: true
 *               address_line1:
 *                 type: string
 *                 nullable: true
 *               address_line2:
 *                 type: string
 *                 nullable: true
 *               city:
 *                 type: string
 *                 nullable: true
 *               province:
 *                 type: string
 *                 nullable: true
 *               postal_code:
 *                 type: string
 *                 nullable: true
 *               country:
 *                 type: string
 *                 nullable: true
 *               phone:
 *                 type: string
 *                 nullable: true
 *               lat:
 *                 type: number
 *                 nullable: true
 *               lng:
 *                 type: number
 *                 nullable: true
 *               is_default:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Address created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
addressRouter.post("/", authenticateMiddleware, addressController.create);

/**
 * @swagger
 * /api/v1/address/{id}:
 *   put:
 *     summary: Update address
 *     tags: [Address]
 *     parameters:
 *       - $ref: '#/components/parameters/AddressId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipient_name:
 *                 type: string
 *               label:
 *                 type: string
 *                 nullable: true
 *               address_line1:
 *                 type: string
 *                 nullable: true
 *               address_line2:
 *                 type: string
 *                 nullable: true
 *               city:
 *                 type: string
 *                 nullable: true
 *               province:
 *                 type: string
 *                 nullable: true
 *               postal_code:
 *                 type: string
 *                 nullable: true
 *               country:
 *                 type: string
 *                 nullable: true
 *               phone:
 *                 type: string
 *                 nullable: true
 *               lat:
 *                 type: number
 *                 nullable: true
 *               lng:
 *                 type: number
 *                 nullable: true
 *               is_default:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
addressRouter.put("/:id", authenticateMiddleware, addressController.update);

/**
 * @swagger
 * /api/v1/address/{id}:
 *   delete:
 *     summary: Delete address
 *     tags: [Address]
 *     parameters:
 *       - $ref: '#/components/parameters/AddressId'
 *     responses:
 *       200:
 *         description: Address deleted
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
addressRouter.delete("/:id", authenticateMiddleware, addressController.delete);

export { addressRouter };
