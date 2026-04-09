import mongoose, { Document, Schema } from "mongoose";

/*
 * User Interface
 */
export interface IUser extends Document {
    team_id: string;
    team_name: string;
    username: string;
    rsvp_code: string;
    email: string;
    college_name: string;
    role: "LEADER" | "MEMBER";
    qr_hash?: string | null;
    is_present: boolean;
    food_count: number;
    bedsheet_taken: boolean;
    room_allot: string | null;

    createdAt: Date;
    updatedAt: Date;
}

/**
 * Student Schema
 */
const UserSchema = new Schema<IUser>(
    {
        team_id: {
            type: String,
            required: true,
            index: true,
        },

        team_name: {
            type: String,
            required: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            trim: true,
        },

        rsvp_code: {
            type: String,
            required: true,
            unique: true,
            sparse: true, // Allow multiple null values
            match: [/^[A-Z0-9]{8}$/, "RSVP code must be 8 digits"],
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        college_name: {
            type: String,
            required: true,
            trim: true,
        },

        role: {
            type: String,
            enum: ["LEADER", "MEMBER"],
            required: true,
        },

        qr_hash: {
            type: String,
            unique: true,
            sparse: true, // Allow multiple null values
        },

        is_present: {
            type: Boolean,
            default: false,
        },

        food_count: {
            type: Number,
            default: 0,
            min: 0,
        },

        bedsheet_taken: {
            type: Boolean,
            default: false,
        },

        room_allot: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model<IUser>("Student", UserSchema);