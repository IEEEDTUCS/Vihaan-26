import { Request, Response } from "express";
import { Team } from "../models/team.model";
import { checkInitialRepo, checkCheckpointCommit } from "../services/github.service";
import { uploadImageToCloudinary } from "../services/cloundinar.service";
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

// ── Regex validators ──────────────────────────────────────────────────────────
const GITHUB_REPO_REGEX = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\.git)?\/?$/;
const GITHUB_COMMIT_REGEX = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/commit\/[a-f0-9]{7,40}$/;
const CLOUDINARY_REGEX = /^https:\/\/res\.cloudinary\.com\//;

// ── GET /api/user/team ────────────────────────────────────────────────────────
export const getTeamSubmission = async (req: Request, res: Response) => {
    const user = req.user as any;
    const team = await Team.findOne({ team_id: user.team_id }).select(
        "team_id team_name type category description repo_or_image_link checkpoints room_number panel_number avg_points stars"
    );
    if (!team) throw new ExpressError(404, "Team not found");
    res.status(200).json({ success: true, team });
};

// ── POST /api/user/submit/initial ─────────────────────────────────────────────
export const submitInitial = async (req: Request, res: Response) => {
    const user = req.user as any;
    const { type, category, description, repo_link } = req.body;

    if (!isInWindow("INITIAL_SUBMIT_OPEN", "INITIAL_SUBMIT_CLOSE")) {
        throw new ExpressError(403,
            `Initial submission window is ${windowLabel("INITIAL_SUBMIT_OPEN", "INITIAL_SUBMIT_CLOSE")} on April 11`
        );
    }

    if (!type || !category || !description) {
        throw new ExpressError(400, "type, category and description are required");
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

    if (req.file) {
        // Hardware image — upload to Cloudinary
        const result = await uploadImageToCloudinary(req.file.buffer, "vihaan26/initial");
        team.repo_or_image_link = result.secure_url;
    } else if (repo_link) {
        if (CLOUDINARY_REGEX.test(repo_link)) {
            // Already a Cloudinary URL (hardware image uploaded separately)
            team.repo_or_image_link = repo_link;
        } else if (GITHUB_REPO_REGEX.test(repo_link)) {
            // Valid GitHub repo URL — run checks
            githubCheck = await checkInitialRepo(repo_link, process.env.EVENT_START as string);
            team.repo_or_image_link = repo_link;
        } else {
            throw new ExpressError(400, "repo_link must be a valid GitHub repo URL (https://github.com/owner/repo)");
        }
    } else {
        throw new ExpressError(400, "Either a repo_link or an image file is required");
    }

    team.type = type;
    team.category = Array.isArray(category) ? category : category.split(",").map((c: string) => c.trim());
    team.description = description;

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
        // Image — upload to Cloudinary, always VERIFIED
        const result = await uploadImageToCloudinary(req.file.buffer, `vihaan26/checkpoints/round${round_num}`);
        team.checkpoints[cpIndex].submit_link = result.secure_url;
        team.checkpoints[cpIndex].submitted_at = new Date();
        team.checkpoints[cpIndex].status = "VERIFIED";
        githubCheck = { status: "VERIFIED", severity: 0, flags: [] };
    } else if (commit_link) {
        if (!GITHUB_COMMIT_REGEX.test(commit_link)) {
            throw new ExpressError(400, "commit_link must be a valid GitHub commit URL (https://github.com/owner/repo/commit/sha)");
        }
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
