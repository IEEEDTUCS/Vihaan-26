import { Request, Response } from "express";
import { Admin } from "../models/admin.model";
import { User } from "../models/user.model";
import { Team } from "../models/team.model";
import { generateAdminToken } from "../utils/generateToken";
import ExpressError from "../utils/expressError";

export const createAdmin = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    const existingAdmin = await Admin.findOne({ name: username });
    if(existingAdmin) {
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

// --- New User & Team Implementations ---

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await User.find({});
    res.status(200).json({
        success: true,
        users,
    });
};

export const getAllTeams = async (req: Request, res: Response) => {
    const teams = await Team.find({});
    res.status(200).json({
        success: true,
        teams,
    });
};

export const updateTeamDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const updatedTeam = await Team.findOneAndUpdate(
            { team_id: id }, // MUST query by team_id string
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedTeam) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        res.status(200).json({ success: true, team: updatedTeam });
    } catch (error: any) {
        console.error("PUT TEAM ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCheckpoint = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params; // This will be "T001"
        const { round_num, status } = req.body;

        // Ensure round_num is a number to match ICheckpoint interface
        const rNum = typeof round_num === 'string' ? parseInt(round_num) : round_num;

        //query by 'team_id'
        //match the specific round in the array
        const updatedTeam = await Team.findOneAndUpdate(
            { 
                team_id: teamId, 
                "checkpoints.round_num": rNum 
            },
            { 
                $set: { "checkpoints.$.status": status } 
            },
            { 
                new: true, 
                runValidators: true 
            }
        );

        if (!updatedTeam) {
            return res.status(404).json({ 
                success: false, 
                message: `Team with ID ${teamId} and Round ${rNum} not found.` 
            });
        }

        res.status(200).json({
            success: true,
            team: updatedTeam,
        });

    } catch (error: any) {
        console.error("UPDATE CHECKPOINT ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};