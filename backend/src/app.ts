import express, {Request, Response} from "express";
import {connectDB} from "./config/db";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// connect DB
connectDB();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello from Express + TypeScript 🚀");
});

export default app;