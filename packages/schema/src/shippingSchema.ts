import { z } from "zod";

export const ShipmentStatus = z.enum([
  "ready",
  "pending",
  "processing",
  "shipped",
  "in_transit",
  "delivered",
  "failed",
  "returned",
  "cancelled",
]);

export const shipmentIdParams = z.object({
  id: z.uuid(),
});

export const createShipmentsMethodSchema = z.object({
  id: z.number().int(),
  name: z.string().max(150).nullable().optional(),
  carrier_code: z.string().max(50).nullable().optional(),
});

export const createShipmentsSchema = z.object({
  order_id: z.uuid(),
  shipment_method_id: z.number().int().nullable().optional(),
  tracking_number: z.string().max(200).nullable().optional(),
  status: ShipmentStatus.optional(),
  shipped_at: z.date().nullable().optional(),
  delivered_at: z.date().nullable().optional(),
  // relasi biasanya divalidasi di logic, bukan di schema
});

export const updateShipmetsSchema = createShipmentsSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Minimal satu field harus diisi untuk update",
  });

export type ShipmentStatusType = z.infer<typeof ShipmentStatus>;

export type CreateShipmentsInput = z.infer<typeof createShipmentsSchema>;

export type UpdateShipmetsSchema = z.infer<typeof updateShipmetsSchema>;

export type CreateShipmentsMethodInput = z.infer<
  typeof createShipmentsMethodSchema
>;
