import { Router } from "express";
import { 
    adminLogin, 
    adminMe, 
    getAllUsers, 
    getAllTeams, 
    updateTeamDetails, 
    updateCheckpoint 
} from "../controllers/admin.controller";
import { adminAuth, superAdminOnly } from "../middlewares/adminAuth";
import { validate } from "../middlewares/validate";
import { adminLoginSchema } from "../schemas";
import { wrapAsync } from "../utils/wrapAsync";

const router = Router();

// --- Auth Routes ---

// POST /api/admin/login
router.post("/login", validate(adminLoginSchema), wrapAsync(adminLogin));

// GET /api/admin/me
router.get("/me", adminAuth, wrapAsync(adminMe));

// --- Manage Users ---

// GET /api/admin/users
router.get("/users", adminAuth, superAdminOnly, wrapAsync(getAllUsers));

// --- Manage Teams ---

// GET /api/admin/teams
router.get("/teams", adminAuth, superAdminOnly, wrapAsync(getAllTeams));

// PUT /api/admin/team/:id
router.put("/team/:id", adminAuth, superAdminOnly, wrapAsync(updateTeamDetails));

// PATCH /api/admin/team/:teamId/checkpoint
router.patch("/team/:teamId/checkpoint", adminAuth, superAdminOnly, wrapAsync(updateCheckpoint));

export default router;
