import type { User } from "@repo/db";

declare global {
  namespace Express {
    interface Request {
      reqId?: string;
      user?: User | null;
      idempotencyKey: string;
    }
  }
}
