import type { Payments } from "@repo/db";
import type { Request, Response } from "express";
import { asyncHandler } from "@/middleware/asyncHandler";
import { AppResponse } from "@/utils/appResponse";
import { BaseController } from "../controller";
import { PaymentService } from "./payment.service";

export class PaymentController extends BaseController<
  Payments,
  PaymentService
> {
  constructor() {
    super(new PaymentService());
  }

  getStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const paymentStatus = await this.service.status(id);

    return new AppResponse({
      res,
      data: paymentStatus,
    });
  });
}
