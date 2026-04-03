import { Router } from "express";
import {
    findUserByQrCode,
    linkUserToQrCode,
    markUserPresent,
    userLogin,
    userMe,
    userVolunteerUpdatePayload
} from "../controllers/user.controller";
import { userAuth } from "../middlewares/userAuth";
import { validate } from "../middlewares/validate";
import { userLoginSchema } from "../schemas";
import { wrapAsync } from "../utils/wrapAsync";
import {adminAuth} from "../middlewares/adminAuth";

const router = Router();

// POST /api/user/login
router.post("/login", validate(userLoginSchema), wrapAsync(userLogin));

// GET /api/user/me  (protected)
router.get("/me", userAuth, wrapAsync(userMe));

// Scan QR (GET User by QR)
router.get("/:qrHash", adminAuth, wrapAsync(findUserByQrCode));

// Link User to QR
router.post("/linkQr", adminAuth, wrapAsync(linkUserToQrCode))

// Mark User Present
router.post("/:qrHash/present", adminAuth, wrapAsync(markUserPresent));

// Update User Fields By Volunteer
router.put("/:qrHash/volunteer", adminAuth, wrapAsync(userVolunteerUpdatePayload));

export default router;
