import { Router } from "express";
import { UserController } from "./user.controller";

const userRouter = Router();
const controller = new UserController();

userRouter.get("/", controller.getUsers);
userRouter.patch("/:id/role", controller.updateRole);

export { userRouter };
