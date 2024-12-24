import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/signin", AuthController.loginUser);

router.post("/change-password", AuthController.changePassword);

router.post("/forget-password", AuthController.forgotPassword);

router.post("/reset-password", AuthController.resetPassword);

export const AuthRoutes = router;
