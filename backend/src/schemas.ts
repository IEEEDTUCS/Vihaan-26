import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectId = z.string().regex(objectIdRegex, "Must be a valid ObjectId");

// ─── Admin ───────

export const adminLoginSchema = z.object({
    email: z.string().email("Please provide a valid email address").trim().toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const adminRegisterSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").trim(),
    email: z.string().email("Please provide a valid email address").trim().toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["SUPER_ADMIN", "VOLUNTEER"]).default("VOLUNTEER"),
});

// ─── User Login ────────

export const userLoginSchema = z.object({
    email: z.string().email("Please provide a valid email address").trim().toLowerCase(),
    rsvp_code: z.string().regex(/^\d{6}$/, "RSVP code must be exactly 6 digits"),
});

// ─── CSV Upload (single row parsed from CSV) ────────

export const csvUserRowSchema = z.object({
    team_id: z.string().trim().min(1, "team_id is required"),
    team_name: z.string().trim().min(1, "team_name is required"),
    username: z.string().trim().min(1, "username is required"),
    email: z.string().email("Invalid email").trim().toLowerCase(),
    college_name: z.string().trim().min(1, "college_name is required"),
    rsvp_code: z.string().regex(/^\d{6}$/, "RSVP code must be exactly 6 digits"),
    role: z.enum(["LEADER", "MEMBER"], { error: "role must be LEADER or MEMBER" }),
});

// ─── Admin: Mark Attendance / Food / Bedsheet ──────

export const markPresentSchema = z.object({
    user_id: objectId,
    is_present: z.boolean(),
});

export const markFoodSchema = z.object({
    user_id: objectId,
    food_count: z.number().int().min(0, "food_count cannot be negative"),
});

export const markBedsheetSchema = z.object({
    user_id: objectId,
    bedsheet_taken: z.number().int().min(0, "bedsheet_taken cannot be negative"),
});

export const assignRoomSchema = z.object({
    user_id: objectId,
    room_allot: z.string().trim().min(1, "room_allot is required"),
});

// ─── QR Assignment ────
export const assignQrSchema = z.object({
    rsvp_code: z.string().regex(/^\d{6}$/, "RSVP code must be exactly 6 digits"),
    qr_hash: z.string().trim().min(1, "qr_hash is required"),
});

// ─── Team: Project Submission ─────────

export const submitRepoSchema = z.object({
    repo_link: z.string().url("repo_link must be a valid URL"),
});

export const submitCheckpointSchema = z.object({
    round_num: z.number().int().min(1).max(4),
    commit_link: z.string().url("commit_link must be a valid URL").optional(),
    image: z.string().optional(),
});

// ─── Super Admin: Update Team Details ─────

export const updateTeamSchema = z
    .object({
        avg_points: z.number().min(0).optional(),
        stars: z.number().min(0).optional(),
        room_number: z.string().trim().optional(),
        panel_number: z.string().trim().optional(),
        ppt_link: z.string().url("ppt_link must be a valid URL").optional(),
        type: z.enum(["WOMEN", "FRESHERS", "IEEE", "SOFTWARE", "HARDWARE"]).optional(),
        category: z.array(z.string().trim()).optional(),
        description: z.string().trim().optional(),
    })
    .strict();

// ─── Checkpoint Status Update (Super Admin) ─────

export const updateCheckpointStatusSchema = z.object({
    round_num: z.number().int().min(1).max(4),
    status: z.enum(["PENDING", "VERIFIED", "SUSPICIOUS"]),
});

// types

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type CsvUserRowInput = z.infer<typeof csvUserRowSchema>;
export type MarkPresentInput = z.infer<typeof markPresentSchema>;
export type MarkFoodInput = z.infer<typeof markFoodSchema>;
export type MarkBedsheetInput = z.infer<typeof markBedsheetSchema>;
export type AssignRoomInput = z.infer<typeof assignRoomSchema>;
export type AssignQrInput = z.infer<typeof assignQrSchema>;
export type SubmitRepoInput = z.infer<typeof submitRepoSchema>;
export type SubmitCheckpointInput = z.infer<typeof submitCheckpointSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type UpdateCheckpointStatusInput = z.infer<typeof updateCheckpointStatusSchema>;
