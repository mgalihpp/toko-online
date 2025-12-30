import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

const REVIEW_QUERY_KEYS = {
  all: ["reviews"] as const,
  pending: ["reviews", "pending"] as const,
  reported: ["reviews", "reported"] as const,
  stats: ["reviews", "stats"] as const,
  detail: (id: string) => ["reviews", id] as const,
};

/**
 * Hook to fetch all reviews
 */
export function useReviews() {
  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.all,
    queryFn: () => api.review.getAll(),
  });
}

/**
 * Hook to fetch pending reviews
 */
export function usePendingReviews() {
  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.pending,
    queryFn: () => api.review.getPending(),
  });
}

/**
 * Hook to fetch reported reviews
 */
export function useReportedReviews() {
  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.reported,
    queryFn: () => api.review.getReported(),
  });
}

/**
 * Hook to fetch review statistics
 */
export function useReviewStats() {
  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.stats,
    queryFn: () => api.review.getStats(),
  });
}

/**
 * Hook to fetch a single review by ID
 */
export function useReviewById(id: string) {
  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.detail(id),
    queryFn: () => api.review.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to update review status
 */
export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "rejected";
    }) => api.review.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.pending });
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.stats });
      queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.detail(variables.id),
      });
      toast.success(
        variables.status === "approved"
          ? "Ulasan berhasil disetujui"
          : "Ulasan berhasil ditolak",
      );
    },
    onError: () => {
      toast.error("Gagal mengubah status ulasan");
    },
  });
}

/**
 * Hook to report a review
 */
export function useReportReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      api.review.report(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.reported });
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.stats });
      queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.detail(variables.id),
      });
      toast.success("Ulasan berhasil dilaporkan");
    },
    onError: () => {
      toast.error("Gagal melaporkan ulasan");
    },
  });
}

/**
 * Hook to clear report from a review
 */
export function useClearReviewReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.review.clearReport(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.reported });
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.stats });
      queryClient.invalidateQueries({
        queryKey: REVIEW_QUERY_KEYS.detail(id),
      });
      toast.success("Laporan berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus laporan");
    },
  });
}

/**
 * Hook to delete a review
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.review.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.pending });
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.reported });
      queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEYS.stats });
      toast.success("Ulasan berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus ulasan");
    },
  });
}
