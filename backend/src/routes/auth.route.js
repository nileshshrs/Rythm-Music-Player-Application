import { Router } from "express";
import { loginController, registerController } from "../controllers/auth.controller.js";

const authRoutes = Router()
authRoutes.post("/sign-up", registerController)
authRoutes.post("/sign-in", loginController)

export default authRoutes