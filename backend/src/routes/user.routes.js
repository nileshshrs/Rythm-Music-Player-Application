import { Router } from "express";
import { getAllUsersController, getUserByIdController, updateUserController, userController } from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.get("/get", userController);
userRoutes.get("/all", getAllUsersController)
userRoutes.patch("/update", updateUserController);
userRoutes.get("/:id", getUserByIdController)

export default userRoutes;