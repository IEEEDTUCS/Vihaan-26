import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import uploadRoutes from "./routes/upload.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";
import ExpressError from "./utils/expressError";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect DB
connectDB();

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
