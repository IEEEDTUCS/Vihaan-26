import mongoose, { Document, Schema } from "mongoose";

/**
 * Team Interface
 */
export interface ITeam extends Document {
    team_id: string;   // from Unstop (external ID)
    team_name: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Team Schema
 */
const TeamSchema = new Schema<ITeam>(
    {
        team_id: {
            type: String,
            required: true,
            unique: true, // important: comes from Unstop
            index: true,
        },
        team_name: {
            type: String,
            required: true,
            trim: true,
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