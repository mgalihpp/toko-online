import { Router } from "express";
import { requireAdmin } from "@/middleware/admin";
import { authenticateMiddleware } from "@/middleware/authenticated";
import { ReviewController } from "./review.controller";

const reviewRouter = Router();
const reviewController = new ReviewController();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product review management
 */

/* ---------------------- ADMIN ROUTES ---------------------- */

/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reviews
 */
reviewRouter.get("/", requireAdmin, reviewController.getAll);

/**
 * @swagger
 * /api/v1/reviews/stats:
 *   get:
 *     summary: Get review statistics
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Review statistics
 */
reviewRouter.get("/stats", requireAdmin, reviewController.getStats);

/**
 * @swagger
 * /api/v1/reviews/pending:
 *   get:
 *     summary: Get pending reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending reviews
 */
reviewRouter.get("/pending", requireAdmin, reviewController.getPending);

/**
 * @swagger
 * /api/v1/reviews/reported:
 *   get:
 *     summary: Get reported reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reported reviews
 */
reviewRouter.get("/reported", requireAdmin, reviewController.getReported);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 *       404:
 *         description: Review not found
 */
reviewRouter.get("/:id", requireAdmin, reviewController.getById);

/**
 * @swagger
 * /api/v1/reviews/{id}/status:
 *   patch:
 *     summary: Update review status
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Review status updated
 */
reviewRouter.patch("/:id/status", requireAdmin, reviewController.updateStatus);

/**
 * @swagger
 * /api/v1/reviews/{id}/report:
 *   patch:
 *     summary: Report a review (user or admin)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review reported
 */
reviewRouter.patch(
  "/:id/report",
  authenticateMiddleware,
  reviewController.markAsReported,
);

/**
 * @swagger
 * /api/v1/reviews/{id}/clear-report:
 *   patch:
 *     summary: Clear report from review (admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report cleared
 */
reviewRouter.patch(
  "/:id/clear-report",
  requireAdmin,
  reviewController.clearReport,
);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 *       404:
 *         description: Review not found
 */
reviewRouter.delete("/:id", requireAdmin, reviewController.deleteReview);

export { reviewRouter };
