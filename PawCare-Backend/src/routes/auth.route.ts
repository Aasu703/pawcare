import { Router } from "express";
import { AuthController } from "../controller/auth.controller";

const router: Router = Router();
const authController = new AuthController();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

export default router;

