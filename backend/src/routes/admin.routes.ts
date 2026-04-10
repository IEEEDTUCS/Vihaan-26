import { Router } from "express";
import { 
    adminLogin, 
    adminMe, 
    createAdmin, 
    getAllVolunteers, 
    deleteVolunteer, 
    getAllUsers, 
    getAllTeams, 
    updateTeam,
    getAllRooms,
    updateCheckpointStatus 
} from "../controllers/admin.controller";
import { adminAuth, createCheck, superAdminOnly } from "../middlewares/adminAuth";
import { validate } from "../middlewares/validate";
import { 
    adminLoginSchema, 
    adminRegisterSchema, 
    updateTeamSchema, 
    updateCheckpointStatusSchema 
} from "../schemas";
import { wrapAsync } from "../utils/wrapAsync";

const router = Router();


//create admin 
router.post("/create", createCheck, validate(adminRegisterSchema), wrapAsync(createAdmin));
// POST /api/admin/login
router.post("/login", validate(adminLoginSchema), wrapAsync(adminLogin));

// GET /api/admin/me  (protected)
router.get("/me", adminAuth, wrapAsync(adminMe));

// Manage Admins
router.get("/volunteers", adminAuth, superAdminOnly, wrapAsync(getAllVolunteers));

router.delete("/volunteer/:id", adminAuth, superAdminOnly, wrapAsync(deleteVolunteer));

// Manage Users (Dashboard Section 1)
router.get("/users", adminAuth, superAdminOnly, wrapAsync(getAllUsers));

// Manage Teams (Dashboard Section 2)
router.get("/teams", adminAuth, superAdminOnly, wrapAsync(getAllTeams));

router.put("/team/:id", adminAuth, superAdminOnly, validate(updateTeamSchema), wrapAsync(updateTeam));

router.patch("/team/:teamId/checkpoint", adminAuth, superAdminOnly, validate(updateCheckpointStatusSchema), wrapAsync(updateCheckpointStatus));

//get all rooms
router.get("/rooms", adminAuth, wrapAsync(getAllRooms));

export default router;
