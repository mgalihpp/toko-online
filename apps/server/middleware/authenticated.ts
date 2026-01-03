import type { User } from "@repo/db";
import type { NextFunction, Request, Response } from "express";
import appConfig from "@/configs/appConfig";
import { AppError } from "@/utils/appError";
import { asyncHandler } from "./asyncHandler";

export const authenticateMiddleware = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Fetch session from better auth nextjs routes handler
      const res = await fetch(
        `${appConfig.CLIENT_ORIGIN}/api/auth/get-session`,
        {
          headers: {
            cookie: req.headers.cookie || "", // Forward the cookies from the request
          },
          credentials: "include",
        },
      );

      const data = await res.json();

      req.user = data?.user as User;

      if (!req.user) {
        throw AppError.unauthorized();
      }
    } catch {
      throw AppError.unauthorized();
    }
    next();
  },
);
