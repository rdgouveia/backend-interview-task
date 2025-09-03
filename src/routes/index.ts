import Router from "@koa/router";
import { auth, getMe, allUsers } from "../controllers/userController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = new Router();

// Public route
router.post("/auth", auth);

// Private route
router.get("/me", authenticate, getMe);
router.get("/users", authenticate, authorize(["admin"]), allUsers);

export default router;
