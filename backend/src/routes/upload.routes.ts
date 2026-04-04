import { Router } from "express";
import multer from "multer";
import { handleCSVUpload } from "../controllers/upload.controller";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
            cb(null, true);
        } else {
            cb(new Error("Only CSV files are allowed"));
        }
    },
});

// POST /api/upload/csv  — admin only
router.post("/csv", adminAuth, upload.single("file"), handleCSVUpload);

export default router;
