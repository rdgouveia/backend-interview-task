import Router from "@koa/router";
import { auth } from "../controllers/userController.js";

const router = new Router();

// Public route
router.post("/auth", auth);

export default router;
