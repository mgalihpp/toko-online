import type { Reviews } from "@repo/db";
import { AppError } from "@/utils/appError";
import { BaseService } from "../service";

export class ReviewService extends BaseService<Reviews, "reviews"> {
  constructor() {
    super("reviews");
  }

  /**
   * Get all reviews with user and product relations
   */
  findAll = async () => {
    return await this.db.reviews.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        product: {
          include: {
            product_images: {
              orderBy: { sort_order: "asc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
  };

  /**
   * Get pending reviews (not applicable since we use approved by default)
   * Keeping for future use if moderation is needed
   */
  findPending = async () => {
    return await this.db.reviews.findMany({
      where: { status: "pending" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        product: {
          include: {
            product_images: {
              orderBy: { sort_order: "asc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
  };

  /**
   * Get reported reviews
   */
  findReported = async () => {
    return await this.db.reviews.findMany({
      where: { is_reported: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        product: {
          include: {
            product_images: {
              orderBy: { sort_order: "asc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
  };

  /**
   * Get review by ID
   */
  findById = async (id: string) => {
    const review = await this.db.reviews.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        product: {
          include: {
            product_images: {
              orderBy: { sort_order: "asc" },
            },
          },
        },
      },
    });

    if (!review) {
      throw AppError.notFound("Ulasan tidak ditemukan");
    }

    return review;
  };

  /**
   * Update review status (approve/reject)
   */
  updateStatus = async (id: string, status: "approved" | "rejected") => {
    const review = await this.db.reviews.findUnique({
      where: { id },
    });

    if (!review) {
      throw AppError.notFound("Ulasan tidak ditemukan");
    }

    return await this.db.reviews.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: true,
      },
    });
  };

  /**
   * Mark review as reported (by user or admin)
   */
  markAsReported = async (id: string, reason?: string) => {
    const review = await this.db.reviews.findUnique({
      where: { id },
    });

    if (!review) {
      throw AppError.notFound("Ulasan tidak ditemukan");
    }

    return await this.db.reviews.update({
      where: { id },
      data: {
        is_reported: true,
        report_reason: reason || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: true,
      },
    });
  };

  /**
   * Clear report from review (admin action - dismiss report)
   */
  clearReport = async (id: string) => {
    const review = await this.db.reviews.findUnique({
      where: { id },
    });

    if (!review) {
      throw AppError.notFound("Ulasan tidak ditemukan");
    }

    return await this.db.reviews.update({
      where: { id },
      data: {
        is_reported: false,
        report_reason: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: true,
      },
    });
  };

  /**
   * Delete review
   */
  deleteReview = async (id: string) => {
    const review = await this.db.reviews.findUnique({
      where: { id },
    });

    if (!review) {
      throw AppError.notFound("Ulasan tidak ditemukan");
    }

    return await this.db.reviews.delete({
      where: { id },
    });
  };

  /**
   * Get review statistics for dashboard
   */
  getStats = async () => {
    const [total, pending, reported, ratings] = await Promise.all([
      this.db.reviews.count(),
      this.db.reviews.count({ where: { status: "pending" } }),
      this.db.reviews.count({ where: { is_reported: true } }),
      this.db.reviews.aggregate({
        _avg: { rating: true },
      }),
    ]);

    return {
      total,
      pending,
      reported,
      averageRating: ratings._avg.rating || 0,
    };
  };
}
