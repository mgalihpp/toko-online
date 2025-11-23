import type { NextFunction, Request, Response } from "express";
import { HTTPSTATUS } from "@/configs/http";
import { AppError } from "@/utils/appError";
import { AppResponse } from "@/utils/appResponse";
import { asyncHandler } from "./asyncHandler";
import { authenticateMiddleware } from "./authenticated";

/**
 * Middleware admin, wajib sudah lewat authenticateMiddleware dulu
 */
export const adminMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        throw AppError.unauthorized();
      }

      if (user.role !== "admin") {
        return new AppResponse({
          res,
          statusCode: HTTPSTATUS.FORBIDDEN,
          message: "You are cannot access this features",
        });
      }

      next();
    } catch (error) {
      console.error(error);
      throw AppError.unauthorized();
    }
  }
);

export const requireAdmin = [authenticateMiddleware, adminMiddleware];
