import express, { Request, Response } from "express";
import { connectDB } from "./config/db";
import uploadRoutes from "./routes/upload.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect DB
connectDB();

// Routes
app.use("/api/upload", uploadRoutes);

app.get("/", (_req: Request, res: Response) => {
    res.send("Hello from Express + TypeScript 🚀");
});

export default app;