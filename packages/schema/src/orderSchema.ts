import { z } from "zod";
import { ShipmentStatus } from "./shippingSchema";

export const orderIdSchema = z.object({
  id: z.string().min(1),
});

export const createOrderSchema = z.object({
  user_id: z.string().min(1),
  address_id: z.number().int().optional().nullable(),
  shipment_method_id: z.number().int().optional().nullable(),
  coupon_code: z.string().optional().nullable(),
  items: z
    .array(
      z.object({
        variant_id: z.string().min(1),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: ShipmentStatus.optional(),
  tracking_number: z.string().optional(),
  shipment_method_id: z.number().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
