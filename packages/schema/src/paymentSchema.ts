import z from "zod";

export const createPaymentSchema = z.object({
  order_id: z.uuid(),
  provider: z.string().max(100).optional().nullable(),
  provider_payment_id: z.string().max(200).optional().nullable(),
  status: z.string().max(50).optional().nullable(),
  amount_cents: z.bigint(),
  currency: z.enum(["IDR"]), // Since default is "IDR"
  paid_at: z.date().optional().nullable(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
