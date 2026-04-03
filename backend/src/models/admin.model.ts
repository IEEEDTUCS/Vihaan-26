import mongoose, { Document, Schema, CallbackError } from "mongoose";
import bcrypt from "bcrypt";
/**
 * Admin Interface
 */
export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
    role: "SUPER_ADMIN" | "VOLUNTEER";

    comparePassword(candidatePassword: string): Promise<boolean>;

    createdAt: Date;
    updatedAt: Date;
}

/**
 * Admin Schema
 */
const AdminSchema = new Schema<IAdmin>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["SUPER_ADMIN", "VOLUNTEER"],
            default: "VOLUNTEER",
        },
    },
    {
        timestamps: true,
    }
);

/**
 * 🔐 Hash password before saving
 */
AdminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * 🔍 Compare password method
 */
AdminSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Index — email already has unique:true so no need to re-declare
 */

/**
 * Export Model
 */
export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);