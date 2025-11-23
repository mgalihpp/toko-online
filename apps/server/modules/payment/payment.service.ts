import type { Payments } from "@repo/db";
import Midtrans from "@repo/midtrans";
import { snap } from "@/lib/midtrans";
import { AppError } from "@/utils/appError";
import { BaseService } from "../service";

export class PaymentService extends BaseService<Payments, "payments"> {
  constructor() {
    super("payments");
  }

  status = async (order_id: string) => {
    try {
      const status = await snap.transaction.status(order_id);

      return status;
    } catch (error) {
      if (error instanceof Midtrans.MidtransError) {
        if (
          (error.ApiResponse as { status_code: string }).status_code === "404"
        ) {
          throw AppError.notFound(
            (error.ApiResponse as { status_message: string }).status_message,
          );
        }
      }

      console.error("UNKNOWN ERROR:", error);
      throw AppError.internalServerError();
    }
  };
}
