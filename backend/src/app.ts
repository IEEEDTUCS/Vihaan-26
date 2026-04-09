import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import uploadRoutes from "./routes/upload.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";
import ExpressError from "./utils/expressError";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")//will allow hoppscotch with proxy meaning request goes from browser - > hoppscotch proxy - > our server, so origin will be hoppscotch's url which we have allowed
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

  app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, origin);
    } else {
      return callback(new ExpressError(201, "Not allowed by CORS"));
    }
  },
  credentials: true,

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect DB
connectDB();

//cors setup and rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 500, // 500 requests per minute per IP
  message: "Too many requests, slow down!"
});

app.use(limiter);
// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.get("/", (_req: Request, res: Response) => {
    res.send("Vihaan-26 Backend 🚀");
});

// 404
app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, error: "Route not found" });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ExpressError) {
        return res.status(err.status).json({ success: false, error: err.message });
    }
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
});

export default app;
