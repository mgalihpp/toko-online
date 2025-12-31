import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import type { ListNotificationsParams } from "@/lib/api/notification.api";

/**
 * Play notification sound
 */
const playNotificationSound = () => {
  const audio = new Audio("/notification.mp3");
  audio.volume = 0.5; // Set volume to 50%
  audio.play().catch((error) => {
    // Ignore errors (e.g., user hasn't interacted with page yet)
    console.warn("Could not play notification sound:", error);
  });
};

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
 * Akan memainkan suara ketika ada notifikasi baru
 */
export const useUnreadNotificationCount = (userId?: string) => {
  const previousCountRef = useRef<number | undefined>(undefined);

  const query = useQuery({
    queryKey: ["notifications", "unread-count", userId],
    queryFn: () => api.notification.getUnreadCount(userId as string),
    enabled: !!userId,
    staleTime: 1000 * 10, // 10 detik, refresh lebih sering
    refetchInterval: 1000 * 60, // Auto refresh setiap 1 menit
  });

  // Play sound when new notifications arrive
  useEffect(() => {
    const currentCount = query.data;
    const previousCount = previousCountRef.current;

    // Only play sound if:
    // 1. We have a current count
    // 2. We had a previous count (not first load)
    // 3. Current count is greater than previous count (new notifications)
    if (
      currentCount !== undefined &&
      previousCount !== undefined &&
      currentCount > previousCount
    ) {
      playNotificationSound();
    }

    // Update previous count
    previousCountRef.current = currentCount;
  }, [query.data]);

  return query;
};

/**
 * Hook untuk memainkan suara notifikasi secara manual
 */
export const useNotificationSound = () => {
  return useCallback(() => {
    playNotificationSound();
  }, []);
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
