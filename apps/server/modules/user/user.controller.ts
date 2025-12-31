import type { Request, Response } from "express";
import { asyncHandler } from "@/middleware/asyncHandler";
import { AppResponse } from "@/utils/appResponse";
import { UserService } from "./user.service";

const userService = new UserService();

export class UserController {
  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const role = req.query.role as string;

    const result = await userService.getUsers({
      page,
      limit,
      search,
      role,
    });

    new AppResponse({
      res,
      data: result,
    });
  });

  updateRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      res.status(400).json({ message: "Role is required" });
      return;
    }

    const result = await userService.updateUserRole(id, role);

    new AppResponse({
      res,
      data: result,
      message: "User role updated successfully",
    });
  });
}
