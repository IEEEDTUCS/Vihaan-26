import { parse } from "csv-parse";
import { Team } from "../models/team.model";
import { User } from "../models/user.model";
import { csvUserRowSchema } from "../schemas";

interface CSVRow {
    [key: string]: string;
}

/**
 * Normalize role string from Unstop CSV to LEADER | MEMBER
 */
const normalizeRole = (raw: string): "LEADER" | "MEMBER" => {
    const val = raw.trim().toLowerCase();
    if (["team leader", "leader", "lead"].includes(val)) return "LEADER";
    if (["team member", "member", "mem"].includes(val)) return "MEMBER";
    throw new Error(`Invalid role value: "${raw}"`);
};


const parseCSVBuffer = (buffer: Buffer): Promise<CSVRow[]> => {
    return new Promise((resolve, reject) => {
        parse(buffer, { columns: true, skip_empty_lines: true, trim: true }, (err, records: CSVRow[]) => {
            if (err) reject(err);
            else resolve(records);
        });
    });
};

export const uploadCSV = async (buffer: Buffer) => {
    const rows = await parseCSVBuffer(buffer);
    const errors: { row: number; error: string }[] = [];
    let created = 0;
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
        const raw = rows[i];

        // Normalize role
        let normalizedRole: "LEADER" | "MEMBER";
        try {
            normalizedRole = normalizeRole(raw["Candidate role"] ?? raw["Role"] ?? "");
        } catch (e: any) {
            errors.push({ row: i + 1, error: e.message });
            continue;
        }

        const rowToValidate = {
            team_id: raw["Team Id"] ?? raw["Team ID"] ?? "",
            team_name: raw["Team Name"] ?? "",
            username: raw["Candidate's Name"] ?? raw["Name"] ?? "",
            email: raw["Candidate's Email"] ?? raw["Email"] ?? "",
            college_name: raw["College"] ?? raw["College Name"] ?? "",
            rsvp_code: raw["Reg. Stan Ref Code"] ?? raw["RSVP Code"] ?? "",
            role: normalizedRole,
        };

        // Zod validation per row
        const parsed = csvUserRowSchema.safeParse(rowToValidate);
        if (!parsed.success) {
            errors.push({
                row: i + 1,
                error: parsed.error.issues.map((e) => e.message).join(", "),
            });
            continue;
        }

        const { team_id, team_name, username, email, college_name, rsvp_code, role } = parsed.data;

        try {
            // Upsert team
            let team = await Team.findOne({ team_id });
            if (!team) {
                team = await Team.create({ team_id, team_name });
            }

            // Skip duplicate email
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                skipped++;
                continue;
            }

            await User.create({
                team_id: team._id,
                username,
                email,
                college_name,
                rsvp_code,
                role,
            });

            created++;
        } catch (err: any) {
            errors.push({ row: i + 1, error: err.message });
        }
    }

    return { created, skipped, errors };
};
