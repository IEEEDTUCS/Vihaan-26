import { Request, Response } from "express";
import { Team } from "../models/team.model";
import { checkInitialRepo, checkCheckpointCommit, parseGitHubUrl } from "../services/github.service";
import { uploadImageBuffer } from "../config/cloudinary";
import ExpressError from "../utils/expressError";

// ── Time window helpers ───────────────────────────────────────────────────────
const isInWindow = (openKey: string, closeKey: string): boolean => {
    const now = Date.now();
    return now >= new Date(process.env[openKey] as string).getTime() &&
           now <= new Date(process.env[closeKey] as string).getTime();
};

const windowLabel = (openKey: string, closeKey: string): string => {
    const fmt = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true,
    });
    return `${fmt(process.env[openKey] as string)} – ${fmt(process.env[closeKey] as string)}`;
};

// ── GET /api/user/team ────────────────────────────────────────────────────────
// All team members can view their team's submission data
export const getTeamSubmission = async (req: Request, res: Response) => {
    const user = req.user as any;
    const team = await Team.findOne({ team_id: user.team_id }).select(
        "team_id team_name type category description repo_or_image_link checkpoints room_number panel_number avg_points stars"
    );
    if (!team) throw new ExpressError(404, "Team not found");
    res.status(200).json({ success: true, team });
};

// ── POST /api/user/submit/initial ─────────────────────────────────────────────
// Leader only — submit type, category, description + repo link or image
export const submitInitial = async (req: Request, res: Response) => {
    const user = req.user as any;
    const { type, category, description, repo_link } = req.body;

    if (!isInWindow("INITIAL_SUBMIT_OPEN", "INITIAL_SUBMIT_CLOSE")) {
        throw new ExpressError(403,
            `Initial submission window is ${windowLabel("INITIAL_SUBMIT_OPEN", "INITIAL_SUBMIT_CLOSE")} on April 11`
        );
    }

    const team = await Team.findOne({ team_id: user.team_id });
    if (!team) throw new ExpressError(404, "Team not found");

    // Already submitted — return existing data
    if (team.repo_or_image_link || team.description) {
        return res.status(200).json({
            success: true,
            alreadySubmitted: true,
            message: "Initial submission already done",
            team: {
                team_id: team.team_id,
                team_name: team.team_name,
                type: team.type,
                category: team.category,
                description: team.description,
                repo_or_image_link: team.repo_or_image_link,
            },
        });
    }

    let githubCheck = null;

    // Hardware — image upload via Cloudinary
    if (req.file) {
        const imageUrl = await uploadImageBuffer(req.file.buffer, "vihaan26/initial");
        team.repo_or_image_link = imageUrl;
    } else if (repo_link) {
        parseGitHubUrl(repo_link); // validate URL
        githubCheck = await checkInitialRepo(repo_link, process.env.EVENT_START as string);
        team.repo_or_image_link = repo_link;
    }

    if (type) team.type = type;
    if (category) {
        team.category = Array.isArray(category)
            ? category
            : category.split(",").map((c: string) => c.trim());
    }
    if (description) team.description = description;

    await team.save();

    res.status(200).json({
        success: true,
        alreadySubmitted: false,
        message: "Initial submission saved",
        githubCheck,
        team: {
            team_id: team.team_id,
            team_name: team.team_name,
            type: team.type,
            category: team.category,
            description: team.description,
            repo_or_image_link: team.repo_or_image_link,
        },
    });
};

// ── POST /api/user/submit/checkpoint ─────────────────────────────────────────
// Leader only — submit commit link or image per round
export const submitCheckpoint = async (req: Request, res: Response) => {
    const user = req.user as any;
    const { round_num, commit_link } = req.body;

    if (!round_num || round_num < 1 || round_num > 4) {
        throw new ExpressError(400, "round_num must be between 1 and 4");
    }

    const openKey = `CP${round_num}_OPEN`;
    const closeKey = `CP${round_num}_CLOSE`;

    if (!isInWindow(openKey, closeKey)) {
        throw new ExpressError(403,
            `Checkpoint ${round_num} window is ${windowLabel(openKey, closeKey)}`
        );
    }

    const team = await Team.findOne({ team_id: user.team_id });
    if (!team) throw new ExpressError(404, "Team not found");

    const cpIndex = team.checkpoints.findIndex((c) => c.round_num === round_num);
    if (cpIndex === -1) throw new ExpressError(404, "Checkpoint not found");

    const cp = team.checkpoints[cpIndex];

    // Already submitted — return existing data
    if (cp.submit_link || cp.submitted_at) {
        return res.status(200).json({
            success: true,
            alreadySubmitted: true,
            message: `Checkpoint ${round_num} already submitted`,
            checkpoint: cp,
        });
    }

    let githubCheck = null;

    if (req.file) {
        // Image submission — upload to Cloudinary, always VERIFIED
        const imageUrl = await uploadImageBuffer(req.file.buffer, `vihaan26/checkpoints/round${round_num}`);
        team.checkpoints[cpIndex].submit_link = imageUrl;
        team.checkpoints[cpIndex].submitted_at = new Date();
        team.checkpoints[cpIndex].status = "VERIFIED";
        githubCheck = { status: "VERIFIED", severity: 0, flags: [] };
    } else if (commit_link) {
        const windowStart = process.env[openKey] as string;
        const windowEnd = process.env[closeKey] as string;
        githubCheck = await checkCheckpointCommit(commit_link, windowStart, windowEnd);
        team.checkpoints[cpIndex].submit_link = commit_link;
        team.checkpoints[cpIndex].submitted_at = new Date();
        team.checkpoints[cpIndex].status = githubCheck.status as "VERIFIED" | "SUSPICIOUS";
    } else {
        throw new ExpressError(400, "Either commit_link or image file is required");
    }

    team.markModified("checkpoints");
    await team.save();

    res.status(200).json({
        success: true,
        alreadySubmitted: false,
        message: `Checkpoint ${round_num} submitted`,
        githubCheck,
        checkpoint: team.checkpoints[cpIndex],
    });
};
