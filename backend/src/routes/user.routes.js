import { Router } from "express";
import { getAllUsersController, updateUserController, userController } from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.get("/get", userController);
userRoutes.get("/all", getAllUsersController)
userRoutes.patch("/update", updateUserController);

export default userRoutes;