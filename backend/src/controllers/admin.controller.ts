import { Request, Response } from "express";
import { Admin } from "../models/admin.model";
import { generateAdminToken } from "../utils/generateToken";
import ExpressError from "../utils/expressError";


//create admin 


export const adminLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ name : username });
    if (!admin) throw new ExpressError(401, "Invalid credentials");

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) throw new ExpressError(401, "Invalid credentials");

    const token = generateAdminToken(String(admin._id), admin.role);

    res.status(200).json({
        success: true,
        token,
        admin: {
            id: admin._id,
            name: admin.name,
            role: admin.role,
        },
    });
};

export const adminMe = async (req: Request, res: Response) => {
    const admin = req.admin as any;
    res.status(200).json({
        success: true,
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        },
    });
};
