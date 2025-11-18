import { z } from "zod";

const transactionDetailsSchema = z.object({
  order_id: z
    .string()
    .max(50)
    .regex(/^[\w\-~.]+$/, "Allowed characters: letters, numbers, -, _, ~, ."),
  gross_amount: z.number().int().min(0),
});

const itemDetailSchema = z.object({
  id: z.string().max(50).optional(),
  price: z.number().int().min(0),
  quantity: z.number().int().min(1),
  name: z.string().max(50),
  brand: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
  merchant_name: z.string().max(50).optional(),
  url: z.string().url().max(50).optional(),
});

const itemDetailsSchema = z.array(itemDetailSchema).min(1);

const addressSchema = z.object({
  first_name: z.string().max(255).optional(),
  last_name: z.string().max(255).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(255).optional(),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  postal_code: z.string().max(10).optional(),
  country_code: z.string().max(10).optional(),
});

const customerDetailsSchema = z.object({
  first_name: z.string().max(255).optional(),
  last_name: z.string().max(255).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(255).optional(),
  billing_address: addressSchema.optional(),
  shipping_address: addressSchema.optional(),
});

const creditCardSchema = z.object({
  save_card: z.boolean().optional(),
  secure: z.boolean().optional(),
  channel: z.enum(["migs"]).optional(),
  bank: z
    .enum([
      "bca",
      "bni",
      "mandiri",
      "cimb",
      "bri",
      "danamon",
      "maybank",
      "mega",
    ])
    .optional(),
  type: z.enum(["authorize", "authorize_capture"]).optional(),
  whitelist_bins: z.array(z.string()).optional(),
  installment: z
    .object({
      required: z.boolean().optional(),
      terms: z.record(z.string(), z.array(z.number()).min(1)).optional(),
    })
    .optional(),
  dynamic_descriptor: z
    .object({
      merchant_name: z.string().max(25).optional(),
      city_name: z.string().max(13).optional(),
      country_code: z.string().length(2).optional(),
    })
    .optional(),
});

const vaSchema = z
  .object({
    va_number: z.string().optional(),
    sub_company_code: z.string().optional(),
    recipient_name: z.string().optional(),
    free_text: z
      .object({
        inquiry: z
          .array(z.object({ en: z.string().max(50), id: z.string().max(50) }))
          .optional(),
        payment: z
          .array(z.object({ en: z.string().max(50), id: z.string().max(50) }))
          .optional(),
      })
      .optional(),
  })
  .optional();

const gopaySchema = z
  .object({
    enable_callback: z.boolean().optional(),
    callback_url: z.string().url().optional(),
    tokenization: z.boolean().optional(),
    enforce_tokenization: z.boolean().optional(),
    phone_number: z.string().optional(),
    country_code: z.string().optional(),
  })
  .optional();

const shopeepaySchema = z
  .object({
    callback_url: z.string().url().optional(),
  })
  .optional();

const callbacksSchema = z
  .object({
    finish: z.string().url().optional(),
    error: z.string().url().optional(),
  })
  .optional();

const expirySchema = z
  .object({
    start_time: z.string().optional(), // yyyy-MM-dd HH:mm:ss Z
    unit: z.enum(["day", "hour", "minute", "days", "hours", "minutes"]),
    duration: z.number().int(),
  })
  .optional();

export const createSnapSchema = z.object({
  transaction_details: transactionDetailsSchema,
  item_details: itemDetailsSchema.optional(),
  customer_details: customerDetailsSchema.optional(),
  credit_card: creditCardSchema.optional(),
  bca_va: vaSchema.optional(),
  permata_va: vaSchema.optional(),
  bni_va: vaSchema.optional(),
  mandiri_bill: vaSchema.optional(),
  bri_va: vaSchema.optional(),
  cimb_va: vaSchema.optional(),
  danamon_va: vaSchema.optional(),
  bsi_va: vaSchema.optional(),
  gopay: gopaySchema.optional(),
  shopeepay: shopeepaySchema.optional(),
  cstore: z
    .object({
      alfamart_free_text_1: z.string().max(40).optional(),
      alfamart_free_text_2: z.string().max(40).optional(),
      alfamart_free_text_3: z.string().max(40).optional(),
    })
    .optional(),
  callbacks: callbacksSchema,
  expiry: expirySchema,
  page_expiry: expirySchema.optional(),
  recurring: z
    .object({
      required: z.boolean(),
      start_time: z.string().optional(),
      interval_unit: z.enum(["day", "week", "month"]).optional(),
    })
    .optional(),
});

export type CreateSnapInput = z.infer<typeof createSnapSchema>;
