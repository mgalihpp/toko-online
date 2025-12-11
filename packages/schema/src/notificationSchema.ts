import { z } from "zod";

/**
 * Notification types for User (customer)
 */
export const UserNotificationType = z.enum([
  "ORDER_CREATED", // Pesanan dibuat, menunggu pembayaran
  "ORDER_PAID", // Pembayaran berhasil
  "ORDER_SHIPPED", // Pesanan dalam pengiriman
  "ORDER_DELIVERED", // Pesanan telah sampai
  "ORDER_CANCELLED", // Pesanan dibatalkan
]);

/**
 * Notification types for Admin
 */
export const AdminNotificationType = z.enum([
  "NEW_ORDER", // Pesanan baru masuk
  "PAYMENT_RECEIVED", // Pembayaran diterima
  "RETURN_REQUEST", // Permintaan retur
  "LOW_STOCK", // Stok menipis
  "OUT_OF_STOCK", // Stok habis
]);

/**
 * Combined notification types
 */
export const NotificationType = z.enum([
  ...UserNotificationType.options,
  ...AdminNotificationType.options,
]);

export type NotificationType = z.infer<typeof NotificationType>;
export type UserNotificationType = z.infer<typeof UserNotificationType>;
export type AdminNotificationType = z.infer<typeof AdminNotificationType>;

/**
 * Notification payload schemas for different types
 */
export const OrderNotificationPayload = z.object({
  order_id: z.string().uuid(),
  order_status: z.string().optional(),
  total_cents: z.coerce.number().optional(),
  tracking_number: z.string().optional(),
});

export const StockNotificationPayload = z.object({
  product_id: z.string().uuid(),
  product_title: z.string(),
  variant_id: z.string().uuid().optional(),
  current_stock: z.number(),
  safety_stock: z.number().optional(),
});

export const ReturnNotificationPayload = z.object({
  return_id: z.string().uuid(),
  order_id: z.string().uuid(),
  reason: z.string().optional(),
});

/**
 * Generic notification payload (union of all payload types)
 */
export const NotificationPayload = z.union([
  OrderNotificationPayload,
  StockNotificationPayload,
  ReturnNotificationPayload,
  z.record(z.string(), z.unknown()), // Allow custom payloads
]);

export type NotificationPayload = z.infer<typeof NotificationPayload>;

/**
 * Create notification input
 */
export const createNotificationSchema = z.object({
  user_id: z.string(),
  type: NotificationType,
  payload: NotificationPayload.optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

/**
 * Query parameters for listing notifications
 */
export const listNotificationsQuerySchema = z.object({
  user_id: z.string().optional(),
  is_read: z.coerce.boolean().optional(),
  type: NotificationType.optional(),
  limit: z.coerce.number().int().positive().default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type ListNotificationsQuery = z.infer<
  typeof listNotificationsQuerySchema
>;

/**
 * Mark notification as read input
 */
export const markAsReadSchema = z.object({
  id: z.string().uuid(),
});

export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;
