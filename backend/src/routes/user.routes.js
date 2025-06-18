import { Router } from "express";
import { getAllUsersController, userController } from "../controllers/user.controller.js";

const userRoutes = Router();

userRoutes.get("/get", userController);
userRoutes.get("/all", getAllUsersController)

export default userRoutes;