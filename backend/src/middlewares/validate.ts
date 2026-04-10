import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate =
    (schema: ZodType) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.issues.map((e) => e.message);
            res.status(400).json({ success: false, errors });
            console.log("Validation errors:", errors);
            return;
        }
        req.body = result.data;
        next();
    };
