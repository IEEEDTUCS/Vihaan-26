import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Team } from "../models/team.model";
import { generateUserToken } from "../utils/generateToken";
import ExpressError from "../utils/expressError";

export const userLogin = async (req: Request, res: Response) => {
    const { email, rsvp_code } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new ExpressError(401, "Invalid credentials");

    if (user.rsvp_code !== rsvp_code) throw new ExpressError(401, "Invalid credentials");

    const token = generateUserToken(String(user._id), String(user.team_id), user.role);

    res.status(200).json({
        success: true,
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            is_present: user.is_present,
            food_count: user.food_count,
            bedsheet_taken: user.bedsheet_taken,
            qr_hash: user.qr_hash,
        },
    });
};

export const userMe = async (req: Request, res: Response) => {
    const user = req.user as any;

    const team = await Team.findById(user.team_id).select(
        "team_name team_id type category checkpoints avg_points stars room_number panel_number"
    );

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            college_name: user.college_name,
            is_present: user.is_present,
            food_count: user.food_count,
            bedsheet_taken: user.bedsheet_taken,
            room_allot: user.room_allot,
            qr_hash: user.qr_hash,
        },
        team,
    });
};
