import { Router } from "express";
import multer from "multer";
import { handleCSVUpload } from "../controllers/upload.controller";

const router = Router();

// Store file in memory as buffer (no disk writes)
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

// POST /api/upload/csv
// multipart/form-data with field name "file"
router.post("/csv", upload.single("file"), handleCSVUpload);

export default router;
