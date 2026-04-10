import mongoose, { Document, Schema } from "mongoose";

/**
 * Checkpoint Interface (embedded in Team)
 */
export interface ICheckpoint {
    round_num: number;
    checkpoint_time: Date;
    submit_link: string | null;//can be repo link or image link
    submitted_at: Date | null;
    status: "PENDING" | "VERIFIED" | "FLAGGED" | "SUSPICIOUS";
}

/**
 * Team Interface
 */
export interface ITeam extends Document {
    team_id: string;   // from Unstop (external ID)
    team_name: string;

    // Project submission fields
    repo_or_image_link: string | null;
    type: "WOMEN" | "FRESHERS" | "IEEE" | "SOFTWARE" | "HARDWARE" | null;
    category: string[];//keep in frontend
    description: string | null;
    room_number: string | null;
    ppt_link: string | null;
    panel_number: string | null;
    avg_points: number;
    stars: number;//1 to 5 

    // Checkpoints (4 rounds, embedded)
    checkpoints: ICheckpoint[];

    createdAt: Date;
    updatedAt: Date;
}

/**
 * Checkpoint Schema
 */
const CheckpointSchema = new Schema<ICheckpoint>(
    {
        round_num: {
            type: Number,
            required: true,
        },
        checkpoint_time: {
            type: Date,
            required: true,
        },
        submit_link: {
            type: String,
            default: null,
        },
        submitted_at: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ["PENDING", "VERIFIED", "FLAGGED", "SUSPICIOUS"],
            default: "PENDING",
        },
    },
    { _id: false }
);

/**
 * Default 4 checkpoints with predecided times
 */
const defaultCheckpoints = (): ICheckpoint[] => [//change times as per schedule
    { round_num: 1, checkpoint_time: new Date("2026-04-11T23:00:00+05:30"), submit_link: null, submitted_at: null, status: "PENDING" },
    { round_num: 2, checkpoint_time: new Date("2026-04-12T01:00:00+05:30"), submit_link: null, submitted_at: null, status: "PENDING" },
    { round_num: 3, checkpoint_time: new Date("2026-04-12T05:00:00+05:30"), submit_link: null, submitted_at: null, status: "PENDING" },
    { round_num: 4, checkpoint_time: new Date("2026-04-12T09:00:00+05:30"), submit_link: null, submitted_at: null, status: "PENDING" },];

/**
 * Team Schema
 */
const TeamSchema = new Schema<ITeam>(
    {
        team_id: {
            type: String,
            required: true,
            unique: true, // comes from Unstop
            index: true,
        },
        team_name: {
            type: String,
            required: true,
            trim: true,
        },
        repo_or_image_link: {
            type: String,
            default: null,
        },
        type: {
            type: String,
            enum: ["WOMEN", "FRESHERS", "IEEE", "SOFTWARE", "HARDWARE"],
            default: null,
        },
        category: {
            type: [String],
            default: [],
        },
        description: {
            type: String,
            default: null,
            trim: true,
        },
        room_number: {//by volunteer at checkin
            type: String,
            default: null,
        },
        ppt_link: {
            type: String,
            default: null,
        },
        panel_number: {//by admin
            type: String,
            default: null,
        },
        avg_points: {
            type: Number,
            default: 0,
            min: 0,
        },
        stars: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        checkpoints: {
            type: [CheckpointSchema],
            default: defaultCheckpoints,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Export Model
 */
export const Team = mongoose.model<ITeam>("Team", TeamSchema);