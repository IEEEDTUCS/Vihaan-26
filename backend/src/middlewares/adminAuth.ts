import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model";
import ExpressError from "../utils/expressError";

interface AdminJwtPayload {
    id: string;
    role: string;
    type: string;
}

declare global {
    namespace Express {
        interface Request {
            admin?: InstanceType<typeof Admin>;
        }
    }
}

export const adminAuth = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if (!token) throw new ExpressError(401, "No token provided");

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AdminJwtPayload;

        if (decoded.type !== "admin") throw new ExpressError(401, "Invalid token type");

        const admin = await Admin.findById(decoded.id).select("-password");
        if (!admin) throw new ExpressError(401, "Admin not found");

        req.admin = admin as any;
        next();
    } catch (err: any) {
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return next(new ExpressError(401, "Invalid or expired token"));
        }
        next(err);
    }
};

export const superAdminOnly = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin) return next(new ExpressError(401, "Not authenticated"));
    if ((req.admin as any).role !== "SUPER_ADMIN") {
        return next(new ExpressError(403, "Super admin access required"));
    }
    next();
};

//admin creation protection here
export const createCheck = (req: Request, _res: Response, next: NextFunction) => {
    const key = req.headers["x-admin-key"];
    try {
        if (!key || typeof key !== "string") {
        return next(new ExpressError(400, "Admin creation key is required"));
    }
    if (process.env.ADMIN_CREATION_KEY) {
        
        if (key !== process.env.ADMIN_CREATION_KEY) {
            return next(new ExpressError(403, "Invalid admin creation key"));
        }
    }
    } catch (error) {
        return next(new ExpressError(500, "Server error during admin creation key validation"));
    }
    
    next();
};
