import { Router } from "express";
import { adminLogin, adminMe, createAdmin } from "../controllers/admin.controller";
import { adminAuth, createCheck } from "../middlewares/adminAuth";
import { validate } from "../middlewares/validate";
import { adminLoginSchema, adminRegisterSchema } from "../schemas";
import { wrapAsync } from "../utils/wrapAsync";

const router = Router();


//create admin 
router.post("/create", createCheck, validate(adminRegisterSchema), wrapAsync(createAdmin));
// POST /api/admin/login
router.post("/login", validate(adminLoginSchema), wrapAsync(adminLogin));

// GET /api/admin/me  (protected)
router.get("/me", adminAuth, wrapAsync(adminMe));

export default router;
