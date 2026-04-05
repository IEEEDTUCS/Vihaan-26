import { Router } from "express";
import { adminLogin, adminMe } from "../controllers/admin.controller";
import { adminAuth } from "../middlewares/adminAuth";
import { validate } from "../middlewares/validate";
import { adminLoginSchema } from "../schemas";
import { wrapAsync } from "../utils/wrapAsync";

const router = Router();


//create admin 

// POST /api/admin/login
router.post("/login", validate(adminLoginSchema), wrapAsync(adminLogin));

// GET /api/admin/me  (protected)
router.get("/me", adminAuth, wrapAsync(adminMe));

export default router;
