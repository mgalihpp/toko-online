import type { Reviews } from "@repo/db";
import axios from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export interface ReviewWithRelations extends Reviews {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  product: {
    id: string;
    title: string;
    slug: string;
    product_images: {
      id: number;
      url: string;
      alt?: string | null;
    }[];
  };
}

export interface ReviewStats {
  total: number;
  pending: number;
  reported: number;
  averageRating: number;
}

export const reviewApi = {
  /**
   * Get all reviews
   */
  getAll: async () => {
    const res =
      await axios.get<ApiResponse<ReviewWithRelations[]>>("/reviews");
    return res.data.data;
  },

  /**
   * Get pending reviews
   */
  getPending: async () => {
    const res =
      await axios.get<ApiResponse<ReviewWithRelations[]>>("/reviews/pending");
    return res.data.data;
  },

  /**
   * Get reported reviews
   */
  getReported: async () => {
    const res =
      await axios.get<ApiResponse<ReviewWithRelations[]>>("/reviews/reported");
    return res.data.data;
  },

  /**
   * Get review by ID
   */
  getById: async (id: string) => {
    const res =
      await axios.get<ApiResponse<ReviewWithRelations>>(`/reviews/${id}`);
    return res.data.data;
  },

  /**
   * Get review statistics
   */
  getStats: async () => {
    const res = await axios.get<ApiResponse<ReviewStats>>("/reviews/stats");
    return res.data.data;
  },

  /**
   * Update review status
   */
  updateStatus: async (id: string, status: "approved" | "rejected") => {
    const res = await axios.patch<ApiResponse<ReviewWithRelations>>(
      `/reviews/${id}/status`,
      { status },
    );
    return res.data.data;
  },

  /**
   * Report a review
   */
  report: async (id: string, reason?: string) => {
    const res = await axios.patch<ApiResponse<ReviewWithRelations>>(
      `/reviews/${id}/report`,
      { reason },
    );
    return res.data.data;
  },

  /**
   * Clear report from review
   */
  clearReport: async (id: string) => {
    const res = await axios.patch<ApiResponse<ReviewWithRelations>>(
      `/reviews/${id}/clear-report`,
    );
    return res.data.data;
  },

  /**
   * Delete a review
   */
  delete: async (id: string) => {
    const res = await axios.delete<ApiResponse<Reviews>>(`/reviews/${id}`);
    return res.data.data;
  },
};
