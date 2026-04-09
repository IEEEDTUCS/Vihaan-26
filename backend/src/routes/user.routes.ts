import { Router } from "express";
import {
    findUserByQrCode,
    linkUserToQrCode,
    markUserPresent,
    userLogin,
    userMe,
    userVolunteerUpdatePayload,
    teamLeaderProjectSubmission, fetchRoomsForUser
} from "../controllers/user.controller";
import { submitInitial, submitCheckpoint } from "../controllers/submission.controller";
import { userAuth, leaderOnly } from "../middlewares/userAuth";
import { validate } from "../middlewares/validate";
import { userLoginSchema, submitRepoSchema, submitCheckpointSchema } from "../schemas";
import { wrapAsync } from "../utils/wrapAsync";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

// POST /api/user/login
router.post("/login", validate(userLoginSchema), wrapAsync(userLogin));

// GET /api/user/me  (protected)
router.get("/me", userAuth, wrapAsync(userMe));

// Submission routes (leader only)
router.post("/submit/initial", userAuth, leaderOnly, wrapAsync(submitInitial));
router.post("/submit/checkpoint", userAuth, leaderOnly, wrapAsync(submitCheckpoint));

// ── Volunteer / Admin routes ──────────────────────────────────────────────────
router.get("/scan/:qrHash", adminAuth, wrapAsync(findUserByQrCode));
router.post("/linkQr", adminAuth, wrapAsync(linkUserToQrCode));
router.post("/scan/:qrHash/present", adminAuth, wrapAsync(markUserPresent));
router.put("/scan/:qrHash/update", adminAuth, wrapAsync(userVolunteerUpdatePayload));
router.get("/scan/:qrHash/rooms", adminAuth, wrapAsync(fetchRoomsForUser));

router.put("/submitLink", userAuth, leaderOnly, wrapAsync(teamLeaderProjectSubmission));

export default router;
