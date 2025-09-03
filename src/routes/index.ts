import Router from "@koa/router";
import { auth, getMe } from "../controllers/userController.js";
import { authenticate } from "../middlewares/auth.js";

const router = new Router();

// Public route
router.post("/auth", auth);

// Private route
router.get("/me", authenticate, getMe);

export default router;
