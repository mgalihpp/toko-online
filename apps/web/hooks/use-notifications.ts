import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ListNotificationsParams } from "@/lib/api/notification.api";

/**
 * Hook untuk mengambil daftar notifikasi
 */
export const useNotifications = (
  params: ListNotificationsParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => api.notification.getAll(params),
    enabled: !!params.user_id && enabled,
    staleTime: 1000 * 30, // 30 detik
  });
};

/**
 * Hook untuk mengambil jumlah notifikasi yang belum dibaca
 */
export const useUnreadNotificationCount = (userId?: string) => {
  return useQuery({
    queryKey: ["notifications", "unread-count", userId],
    queryFn: () => api.notification.getUnreadCount(userId as string),
    enabled: !!userId,
    staleTime: 1000 * 10, // 10 detik, refresh lebih sering
    refetchInterval: 1000 * 60, // Auto refresh setiap 1 menit
  });
};

/**
 * Hook untuk menandai satu notifikasi sebagai sudah dibaca
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.notification.markAsRead(id),
    onSuccess: () => {
      // Invalidate notifications queries untuk refresh data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

/**
 * Hook untuk menandai semua notifikasi sebagai sudah dibaca
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => api.notification.markAllAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

/**
 * Hook untuk menghapus satu notifikasi
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.notification.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

/**
 * Hook untuk menghapus semua notifikasi yang sudah dibaca
 */
export const useDeleteReadNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => api.notification.deleteRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
