import { Router } from "express";
import {
    findUserByQrCode,
    linkUserToQrCode,
    markUserPresent,
    userLogin,
    userMe,
    userVolunteerUpdatePayload,
    teamLeaderProjectSubmission
} from "../controllers/user.controller";
import { userAuth, leaderOnly } from "../middlewares/userAuth";
import { validate } from "../middlewares/validate";
import { userLoginSchema } from "../schemas";
import { wrapAsync } from "../utils/wrapAsync";
import {adminAuth} from "../middlewares/adminAuth";

const router = Router();

// POST /api/user/login
router.post("/login", validate(userLoginSchema), wrapAsync(userLogin));

// GET /api/user/me  (protected)
router.get("/me", userAuth, wrapAsync(userMe));
//user routes here like submitting links and images and deatils (use findone and update for each time as multiple uploads can be there with timings check also at backend side)
// Scan QR (GET User by QR)
router.get("/scan/:qrHash", adminAuth, wrapAsync(findUserByQrCode));

// Link User to QR
router.post("/linkQr", adminAuth, wrapAsync(linkUserToQrCode))

// Mark User Present
router.post("/scan/:qrHash/present", adminAuth, wrapAsync(markUserPresent));

// Update User Fields By Volunteer
router.put("/scan/:qrHash/update", adminAuth, wrapAsync(userVolunteerUpdatePayload));

router.put("/submitLink", userAuth, leaderOnly, wrapAsync(teamLeaderProjectSubmission));

export default router;
