import mongoose, { Document, Schema } from "mongoose";

/**
 * Checkpoint Interface (embedded in Team)
 */
export interface ICheckpoint {
    round_num: number;
    checkpoint_time: Date;
    commit_link: string | null;
    image: string | null;
    submitted_at: Date | null;
    status: "PENDING" | "VERIFIED" | "SUSPICIOUS";
}

/**
 * Team Interface
 */
export interface ITeam extends Document {
    team_id: string;   // from Unstop (external ID)
    team_name: string;

    // Project submission fields
    repo_link: string | null;
    image: string | null;
    type: "WOMEN" | "FRESHERS" | "IEEE" | "SOFTWARE" | "HARDWARE" | null;
    category: string[];
    description: string | null;
    room_number: string | null;
    ppt_link: string | null;
    panel_number: string | null;
    avg_points: number;
    stars: number;

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
        commit_link: {
            type: String,
            default: null,
        },
        image: {
            type: String,
            default: null,
        },
        submitted_at: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ["PENDING", "VERIFIED", "SUSPICIOUS"],
            default: "PENDING",
        },
    },
    { _id: false }
);

/**
 * Default 4 checkpoints with predecided times
 */
const defaultCheckpoints = (): ICheckpoint[] => [
    { round_num: 1, checkpoint_time: new Date("2026-04-04T21:00:00+05:30"), commit_link: null, image: null, submitted_at: null, status: "PENDING" },
    { round_num: 2, checkpoint_time: new Date("2026-04-05T01:00:00+05:30"), commit_link: null, image: null, submitted_at: null, status: "PENDING" },
    { round_num: 3, checkpoint_time: new Date("2026-04-05T05:00:00+05:30"), commit_link: null, image: null, submitted_at: null, status: "PENDING" },
    { round_num: 4, checkpoint_time: new Date("2026-04-05T09:00:00+05:30"), commit_link: null, image: null, submitted_at: null, status: "PENDING" },
];

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
        repo_link: {
            type: String,
            default: null,
        },
        image: {
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
        room_number: {
            type: String,
            default: null,
        },
        ppt_link: {
            type: String,
            default: null,
        },
        panel_number: {
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