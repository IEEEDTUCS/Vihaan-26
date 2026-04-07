import { Router } from "express";
import { adminLogin, adminMe, createAdmin } from "../controllers/admin.controller";
import { adminAuth, createCheck, superAdminOnly } from "../middlewares/adminAuth";
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

// Manage Admins
router.get("/volunteers", adminAuth, superAdminOnly, (req, res) => {
    res.status(501).json({ success: false, message: "Listing volunteers - Not Implemented" });
});

router.delete("/volunteer/:id", adminAuth, superAdminOnly, (req, res) => {
    res.status(501).json({ success: false, message: "Deleting volunteer - Not Implemented" });
});

// Manage Users (Dashboard Section 1)
router.get("/users", adminAuth, superAdminOnly, (req, res) => {
    res.status(501).json({ success: false, message: "Fetching all user details - Not Implemented" });
});

// Manage Teams (Dashboard Section 2)
router.get("/teams", adminAuth, superAdminOnly, (req, res) => {
    res.status(501).json({ success: false, message: "Fetching all team details - Not Implemented" });
});

router.put("/team/:id", adminAuth, superAdminOnly, (req, res) => {
    res.status(501).json({ success: false, message: "Updating team details (marks, stars, etc) - Not Implemented" });
});

router.patch("/team/:teamId/checkpoint", adminAuth, superAdminOnly, (req, res) => {
    res.status(501).json({ success: false, message: "Updating checkpoint status - Not Implemented" });
});

export default router;
