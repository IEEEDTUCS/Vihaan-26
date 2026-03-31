import express, {Request, Response} from "express";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello from Express + TypeScript 🚀");
});

export default app;