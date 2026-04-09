import { Router } from "express";
import multer from "multer";
import { handleCSVUpload, handleImageUpload } from "../controllers/upload.controller";
import { adminAuth } from "../middlewares/adminAuth";
import { userAuth } from "../middlewares/userAuth";

const router = Router();
const memoryStorage = multer.memoryStorage();

const upload = multer({
    storage: memoryStorage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
            cb(null, true);
        } else {
            cb(new Error("Only CSV files are allowed"));
        }
    },
});
const imageUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 400 * 1024 , // 400 KB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// POST /api/upload/csv  — admin only
// router.post("/csv", adminAuth, upload.single("file"), handleCSVUpload);//upload.single gives us the req.file or whatever name we choose
// api/upload/image
router.post("/image", userAuth, imageUpload.single("file"), handleImageUpload);
export default router;

//delete afterwards 
// image upload here