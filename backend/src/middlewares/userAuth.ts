import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import ExpressError from "../utils/expressError";

interface UserJwtPayload {
    id: string;
    teamId: string;
    role: string;
    type: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: InstanceType<typeof User>;
        }
    }
}

export const userAuth = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if (!token) throw new ExpressError(401, "No token provided");

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserJwtPayload;

        if (decoded.type !== "user") throw new ExpressError(401, "Invalid token type");

        const user = await User.findById(decoded.id);
        if (!user) throw new ExpressError(401, "User not found");

        req.user = user as any;
        next();
    } catch (err: any) {
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return next(new ExpressError(401, "Invalid or expired token"));
        }
        next(err);
    }
};

export const leaderOnly = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ExpressError(401, "Not authenticated"));
    if ((req.user as any).role !== "LEADER") {
        return next(new ExpressError(403, "Team leader access required"));
    }
    next();
};
