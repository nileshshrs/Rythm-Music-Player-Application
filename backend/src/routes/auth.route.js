import { Router } from "express";
import { loginController, logoutController, refreshController, registerController, resetPasswordController, sendPasswordResetController } from "../controllers/auth.controller.js";

const authRoutes = Router()
authRoutes.post("/sign-up", registerController)
authRoutes.post("/sign-in", loginController)
authRoutes.get("/logout", logoutController)
authRoutes.get("/refresh", refreshController)
authRoutes.post("/account-recovery", sendPasswordResetController)
authRoutes.post("/reset-password", resetPasswordController)

export default authRoutes