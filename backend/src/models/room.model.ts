import mongoose, { Document, Schema } from "mongoose";

/**
 * Room Interface
 */
export interface IRoom extends Document {
    room_number: string;
    availability: number; // number of free slots
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Room Schema
 */
const RoomSchema = new Schema<IRoom>(
    {
        room_number: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        availability: {
            type: Number,
            required: true,
            min: 0,          // cannot go negative
            default: 0,
            index: true,     // fast filtering
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Indexes
 */
RoomSchema.index({ room_number: 1 });
RoomSchema.index({ availability: 1 });

export const Room = mongoose.model<IRoom>("Room", RoomSchema);