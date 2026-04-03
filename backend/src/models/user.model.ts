import mongoose, { Document, Schema, Types } from "mongoose";

/*
 * User Interface
 */
export interface IUser extends Document {
    team_id: Types.ObjectId;
    username: string;
    rsvp_code: string;
    email: string;
    college_name: string;
    role: "LEADER" | "MEMBER";

    qr_hash?: string | null;
    is_present: boolean;
    food_count: number;
    bedsheet_taken: number;
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
            type: Schema.Types.ObjectId,
            ref: "Team",
            required: true,
            index: true,
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
            match: [/^\d{6}$/, "RSVP code must be 6 digits"],
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
            default: null,
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
            type: Number,
            default: 0,
            min: 0,
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

/**
 * Indexes
 */
UserSchema.index({ team_id: 1 });
UserSchema.index({ rsvp_code: 1 });
UserSchema.index({ qr_hash: 1 });

export const User = mongoose.model<IUser>("Student", UserSchema);