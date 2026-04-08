import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Team } from "../models/team.model";
import { generateUserToken } from "../utils/generateToken";
import ExpressError from "../utils/expressError";

export const userLogin = async (req: Request, res: Response) => {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new ExpressError(401, "Invalid credentials");
    let password = user.qr_hash !== null ? user.qr_hash + user.rsvp_code : null ;
    if (password === null) throw new ExpressError(401, "User not registered.");

    if (password !== code) throw new ExpressError(401, "Invalid credentials");

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
        },
    });
};

export const userMe = async (req: Request, res: Response) => {
    const user = req.user as any;

    const team = await Team.findById(user.team_id).select(
        "team_name team_id type category checkpoints room_number panel_number avg_points stars repo_or_image_link description"
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


export const findUserByQrCode = async (req: Request, res: Response) => {
    const {qrHash} = req.params;
    if (!qrHash) throw new ExpressError(400, "qrHash is required");

    const user = await User.findOne({qr_hash: qrHash})
    if (!user) throw new ExpressError(404, "User not found");

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
    })
}

export const linkUserToQrCode = async (req: Request, res: Response) => {
    const {rsvpCode, qrHash} = req.body;
    if (!qrHash || !rsvpCode) throw new ExpressError(400, "qrHash and rsvpCode is required");

    const user = await User.findOne({qr_hash: qrHash})
    if (user) throw new ExpressError(400, "QR is already linked with a user");

    const update = await User.findOneAndUpdate({rsvp_code: rsvpCode}, {qr_hash: qrHash}, {returnDocument: 'after'})
    if (!update) throw new ExpressError(404, "User not found");

    res.status(200).json({
        success: true,
        message: `User linked successfully. Mark Present to complete Check-in`,
        user: {
            id: update._id,
            username: update.username,
            email: update.email,
            role: update.role,
            college_name: update.college_name,
            is_present: update.is_present,
            food_count: update.food_count,
            bedsheet_taken: update.bedsheet_taken,
            room_allot: update.room_allot,
            qr_hash: update.qr_hash,
        }
    })
}

export const markUserPresent = async (req: Request, res: Response) => {
    const {qrHash} = req.params;
    if (!qrHash) throw new ExpressError(400, "qrHash is required");

    const update = await User.findOneAndUpdate({qr_hash: qrHash}, {is_present: true}, {returnDocument: 'after'});
    if (!update) throw new ExpressError(404, "User not found");

    res.status(200).json({
        success: true,
        message: "User marked present. Check-in complete",
        user: {
            id: update._id,
            username: update.username,
            email: update.email,
            role: update.role,
            college_name: update.college_name,
            is_present: update.is_present,
            food_count: update.food_count,
            bedsheet_taken: update.bedsheet_taken,
            room_allot: update.room_allot,
            qr_hash: update.qr_hash,
        }
    })
}

interface userVolunteerUpdatePayload {
    foodCountInc?: boolean;
    roomAllot?: string;
    bedsheetTakenInc?: boolean;
}

export const userVolunteerUpdatePayload = async (req: Request, res: Response) => {
    const payload: userVolunteerUpdatePayload = req.body;
    const { qrHash } = req.params;
    if (!payload) throw new ExpressError(400, "No data provided in body");

    if (!payload || Object.keys(payload).length === 0) {
        throw new ExpressError(400, "No data provided in body");
    }

    const updateQuery: any = {};

    if (payload.foodCountInc) {
        updateQuery.$set = { ...(updateQuery.$inc || {}), food_count: payload.foodCountInc };
    }

    if (payload.bedsheetTakenInc) {
        updateQuery.$inc = { ...(updateQuery.$inc || {}), bedsheet_taken: 1 };
    }

    if (payload.roomAllot) {
        updateQuery.$set = { ...(updateQuery.$set || {}), room_allot: payload.roomAllot };
    }

    if (Object.keys(updateQuery).length === 0) {
        throw new ExpressError(400, "No valid fields to update");
    }

    const update = await User.findOneAndUpdate(
        {qr_hash: qrHash},
        updateQuery,
        {returnDocument: 'after'}
    )

    if (!update) throw new ExpressError(404, "User not found");

    res.status(200).json({
        success: true,
        message: "Data updated successfully",
        user: {
            id: update._id,
            username: update.username,
            email: update.email,
            role: update.role,
            college_name: update.college_name,
            is_present: update.is_present,
            food_count: update.food_count,
            bedsheet_taken: update.bedsheet_taken,
            room_allot: update.room_allot,
            qr_hash: update.qr_hash,
        }
    })
}

//ppt-link and repo link or image-link submission( team leader )
export const teamLeaderProjectSubmission = async (req: Request, res: Response) => {
    const { projectCategory, teamCategory, description, pptLink , projectLink } = req.body;
    const user = req.user as any;

    if (user.role !== "LEADER") throw new ExpressError(403, "Only team leaders can submit project links");
    if (!pptLink && !projectLink) throw new ExpressError(400, "At least one link is required");

    const team = await Team.findById(user.team_id);
    if (!team) throw new ExpressError(404, "Team not found");

    team.ppt_link = pptLink;
    team.repo_or_image_link= projectLink;
    await team.save();

    res.status(200).json({
        success: true,
        message: "Project links updated successfully"
        })
    
}


//commit links and image-link submission (team leader) 