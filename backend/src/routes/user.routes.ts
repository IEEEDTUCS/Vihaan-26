import { Router } from "express";
import { userLogin, userMe } from "../controllers/user.controller";
import { userAuth } from "../middlewares/userAuth";
import { validate } from "../middlewares/validate";
import { userLoginSchema } from "../schemas";
import { wrapAsync } from "../utils/wrapAsync";

const router = Router();

// POST /api/user/login
router.post("/login", validate(userLoginSchema), wrapAsync(userLogin));

// GET /api/user/me  (protected)
router.get("/me", userAuth, wrapAsync(userMe));

export default router;
