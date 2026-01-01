import e from "express";
import { LoginController, SignupController } from "../Controller/AuthController";
import { authLimiter } from "../Middlewares/rateLimiter";

const router = e.Router();

router.post('/signup', authLimiter, SignupController)
router.post('/login', authLimiter, LoginController)

export default router