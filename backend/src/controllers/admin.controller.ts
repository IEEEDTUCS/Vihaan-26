import { Request, Response } from "express";
import { Admin } from "../models/admin.model";
import { User } from "../models/user.model";
import { Team } from "../models/team.model";
import { generateAdminToken } from "../utils/generateToken";
import ExpressError from "../utils/expressError";

// ─── Super Admin Functions ───────────────────────────────────────────────────

export const getAllVolunteers = async (_req: Request, res: Response) => {
    const volunteers = await Admin.find({ role: "VOLUNTEER" }).select("-password");
    res.status(200).json({
        success: true,
        count: volunteers.length,
        volunteers,
    });
};

export const deleteVolunteer = async (req: Request, res: Response) => {
    const { id } = req.params;
    const volunteer = await Admin.findOneAndDelete({ _id: id, role: "VOLUNTEER" });
    
    if (!volunteer) {
        throw new ExpressError(404, "Volunteer not found");
    }

    res.status(200).json({
        success: true,
        message: "Volunteer deleted successfully",
    });
};

export const getAllUsers = async (_req: Request, res: Response) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        count: users.length,
        users,
    });
};

export const getAllTeams = async (_req: Request, res: Response) => {
    const teams = await Team.find().sort({ team_id: 1 });
    res.status(200).json({
        success: true,
        count: teams.length,
        teams,
    });
};

export const updateTeam = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const team = await Team.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    if (!team) {
        throw new ExpressError(404, "Team not found");
    }

    res.status(200).json({
        success: true,
        message: "Team updated successfully",
        team,
    });
};

export const updateCheckpointStatus = async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const { round_num, status } = req.body;

    const team = await Team.findOne({ team_id: teamId });
    if (!team) {
        throw new ExpressError(404, "Team not found");
    }

    const checkpoint = team.checkpoints.find((cp) => cp.round_num === round_num);
    if (!checkpoint) {
        throw new ExpressError(400, `Round ${round_num} not found for this team`);
    }

    checkpoint.status = status;
    await team.save();

    res.status(200).json({
        success: true,
        message: `Round ${round_num} status updated to ${status}`,
        checkpoint,
    });
};

// ─── Existing Admin Functions ────────────────────────────────────────────────


export const createAdmin = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    const existingAdmin = await Admin.findOne({ name: username });
    if (existingAdmin) {
        throw new ExpressError(400, "Admin with this username already exists");
    }

    const newAdmin = new Admin({
        name: username,
        password,
        role,
    })

    await newAdmin.save();

    res.status(201).json({
        success: true,
        admin: {
            id: newAdmin._id,
            name: newAdmin.name,
            role: newAdmin.role,
        },
    });
}

export const adminLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ name: username });
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
