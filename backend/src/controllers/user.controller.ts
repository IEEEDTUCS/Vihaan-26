import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Team } from "../models/team.model";
import { Room } from "../models/room.model";
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

    const team = await Team.find({ team_id: user.team_id }).select(
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

export const userTeamInfo = async (req: Request, res: Response) => {
    const user = req.user as any;

    const team = await Team.findOne({ team_id: user.team_id }).select(
        "team_name team_id type category checkpoints room_number panel_number avg_points stars repo_or_image_link description"
    );

    res.status(200).json({
        success: true,
        team,
    });
};

export const userRsvpCodeByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    if (!email) throw new ExpressError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw new ExpressError(404, "User not found");
    res.status(200).json({
        success: true,
        rsvp_code: user.rsvp_code
    });

}

type Room = {
    roomNo: string;
    availability: number;
}

async function allotRoom(teamSize: number, isHardware: boolean) {
    const query = isHardware ? {room_number: "201"} : {
        room_number: { $ne: "201" },
        availability: { $gte: teamSize },
    }

    const bestRoom = await Room.findOneAndUpdate(
        query,
        {$inc: {availability: -teamSize}},
        {
            sort: isHardware ? undefined : { availability: -1 },
            returnDocument: "after"
        }
    )
    if (!bestRoom) {
        throw new ExpressError(500, "Room allotment failed");
    }

    return bestRoom.room_number;
}

export const findUserByQrCode = async (req: Request, res: Response) => {
    const {qrHash} = req.params;
    if (!qrHash) throw new ExpressError(400, "qrHash is required");

    const user = await User.findOne({qr_hash: qrHash})
    if (!user) throw new ExpressError(404, "User not found");
    const team = await Team.findOne({team_id: user.team_id})
    if (!team) throw new ExpressError(404, "User not found");

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            college_name: user.college_name,
            team_name: team.team_name,
            is_present: user.is_present,
            food_count: user.food_count,
            bedsheet_taken: user.bedsheet_taken,
            room_allot: team.room_number,
            qr_hash: user.qr_hash,
        },
    })
}

export const linkUserToQrCode = async (req: Request, res: Response) => {
    const {rsvpCode, qrHash} = req.body;
    if (!qrHash || !rsvpCode) throw new ExpressError(400, "qrHash and rsvpCode is required");

    const user = await User.findOne({rsvp_code: rsvpCode})
    if (!user) throw new ExpressError(404, "User not found");
    const team = await Team.findOne({team_id: user.team_id})
    if (!team) throw new ExpressError(404, "User not found");

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
            team_name: team.team_name,
            is_present: update.is_present,
            food_count: update.food_count,
            bedsheet_taken: update.bedsheet_taken,
            room_allot: team.room_number,
            qr_hash: update.qr_hash,
        },
    })
}

export const markUserPresent = async (req: Request, res: Response) => {
    const {qrHash} = req.params;
    if (!qrHash) throw new ExpressError(400, "qrHash is required");

    const update = await User.findOneAndUpdate({qr_hash: qrHash}, {is_present: true}, {returnDocument: 'after'});
    if (!update) throw new ExpressError(404, "User not found");
    let team = await Team.findOne({team_id: update.team_id})
    if (!team) throw new ExpressError(404, "Team not found");

    if (!team.room_number) {
        const count = await User.countDocuments({
            team_id: team.team_id,
        });
        const isHardware = team.type === "HARDWARE";
        const room = await allotRoom(count, isHardware);

        team = await Team.findOneAndUpdate({team_id: team.team_id}, {room_number: room}, {returnDocument: "after"})
        if (!team) throw new ExpressError(404, "Couldn't find room");
    }

    res.status(200).json({
        success: true,
        message: "User marked present. Check-in complete",
        user: {
            id: update._id,
            username: update.username,
            email: update.email,
            role: update.role,
            team_name: team.team_name,
            college_name: update.college_name,
            is_present: update.is_present,
            food_count: update.food_count,
            bedsheet_taken: update.bedsheet_taken,
            room_allot: team.room_number,
            qr_hash: update.qr_hash,
        }
    })
}

interface UserVolunteerUpdatePayload {
    foodCountInc?: boolean;
    foodCountDec?: boolean;
    roomAllot?: string;
    bedsheetTaken?: boolean;
    unCheckIn?: boolean;
}

export const userVolunteerUpdatePayload = async (req: Request, res: Response) => {
    const payload: UserVolunteerUpdatePayload = req.body;
    const { qrHash } = req.params;

    if (!payload || Object.keys(payload).length === 0) {
        throw new ExpressError(400, "No data provided in body");
    }

    if (payload.foodCountInc && payload.foodCountDec) {
        throw new ExpressError(400, "Food count cannot be increased and decreased together");
    }
    const updateQuery: any = {};

    // Food count logic
    if (payload.foodCountInc) {
        updateQuery.$inc = { ...(updateQuery.$inc || {}), food_count: 1 };
    }

    if (payload.foodCountDec) {
        updateQuery.$inc = { ...(updateQuery.$inc || {}), food_count: -1 };
    }

    // Bedsheet boolean logic
    if (payload.bedsheetTaken !== undefined) {
        updateQuery.$set = {
            ...(updateQuery.$set || {}),
            bedsheet_taken: payload.bedsheetTaken,
        };
    }
    if (payload.unCheckIn) {
        updateQuery.$set = {
            ...(updateQuery.$set || {}),
            is_present: false,
        }
    }

    if (Object.keys(updateQuery).length === 0 && !payload.roomAllot) {
        throw new ExpressError(400, "No valid fields to update");
    }

    const updatedUser = await User.findOneAndUpdate(
        {
            qr_hash: qrHash,
            ...(payload.foodCountDec && { food_count: { $gt: 0 } }),
        },
        updateQuery,
        {
            returnDocument: "after",
            runValidators: true,
        }
    );

    if (!updatedUser) throw new ExpressError(404, "User not found or invalid decrement");

    if (payload.roomAllot) {
        const room = await Room.findOne({room_number: payload.roomAllot})
        if (!room) throw new ExpressError(404, "Room not found");

        const teamSize = await User.countDocuments({
            team_id: updatedUser.team_id,
        });

        if (room.availability < teamSize) {
            throw new ExpressError(400, "Room availability too low");
        }

        await Room.updateOne(
            {room_number: room.room_number},
            {availability: room.availability - teamSize},
        )

        await Team.updateOne(
            { team_id: updatedUser.team_id },
            { $set: { room_number: payload.roomAllot } }
        );
    }
    const team = await Team.findOne({ team_id: updatedUser.team_id }).lean();
    if (!team) throw new ExpressError(404, "Team not found");

    res.status(200).json({
        success: true,
        message: "Data updated successfully",
        user: {
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            team_name: team.team_name,
            college_name: updatedUser.college_name,
            is_present: updatedUser.is_present,
            food_count: updatedUser.food_count,
            bedsheet_taken: updatedUser.bedsheet_taken,
            room_allot: team.room_number,
            qr_hash: updatedUser.qr_hash,
        },
    });
}

export const fetchRoomsForUser = async (req: Request, res: Response) => {
    const { qrHash } = req.params;
    if (!qrHash) throw new ExpressError(400, "qrHash is required");

    const user = await User.findOne({qr_hash: qrHash})
    if (!user) throw new ExpressError(404, "User not found");
    const team = await Team.findOne({team_id: user.team_id})
    if (!team) throw new ExpressError(404, "User not found");

    const teamSize = await User.countDocuments({
        team_id: team.team_id,
    });

    const rooms = await Room.find({availability: {$gte: teamSize}})

    return res.status(200).json({
        rooms
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