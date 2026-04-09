import { Router } from "express";
import multer from "multer";
import {
    findUserByQrCode,
    linkUserToQrCode,
    markUserPresent,
    userLogin,
    userMe,
    userVolunteerUpdatePayload
} from "../controllers/user.controller";
import { submitInitial, submitCheckpoint, getTeamSubmission } from "../controllers/submission.controller";
import { userAuth } from "../middlewares/userAuth";
import { leaderOnly } from "../middlewares/userAuth";
import { validate } from "../middlewares/validate";
import { userLoginSchema } from "../schemas";
import { wrapAsync } from "../utils/wrapAsync";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

// Image upload (memory storage, max 400KB)
const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 400 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Only image files are allowed"));
    },
});

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post("/login", validate(userLoginSchema), wrapAsync(userLogin));
router.get("/me", userAuth, wrapAsync(userMe));

// ── Team submission (all members can GET, only leader can POST) ───────────────
router.get("/team", userAuth, wrapAsync(getTeamSubmission));
router.post("/submit/initial", userAuth, leaderOnly, imageUpload.single("image"), wrapAsync(submitInitial));
router.post("/submit/checkpoint", userAuth, leaderOnly, imageUpload.single("image"), wrapAsync(submitCheckpoint));

// ── Volunteer / Admin routes ──────────────────────────────────────────────────
router.get("/scan/:qrHash", adminAuth, wrapAsync(findUserByQrCode));
router.post("/linkQr", adminAuth, wrapAsync(linkUserToQrCode));
router.post("/scan/:qrHash/present", adminAuth, wrapAsync(markUserPresent));
router.put("/scan/:qrHash/update", adminAuth, wrapAsync(userVolunteerUpdatePayload));

export default router;
