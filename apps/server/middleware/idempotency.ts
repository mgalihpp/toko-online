import { db } from "@repo/db";
import type { NextFunction, Request, Response } from "express";

export const idempotencyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const key = (req.header("x-idempotency-key") || "").trim();
  if (!key) return next();

  const record = await db.idempotencyKeys.findUnique({ where: { key } });
  if (record?.order_id) {
    // order already created for this key — return it immediately
    const order = await db.orders.findUnique({
      where: { id: record.order_id },
      include: { order_items: true, payments: true },
    });
    return res.status(200).json({ idempotent: true, order });
  }

  // attach key to request for later saving by controller/service
  req.idempotencyKey = key;
  next();
};
