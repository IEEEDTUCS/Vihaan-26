import { Request, Response } from "express";
import { Team } from "../models/team.model";
import { checkInitialRepo, checkCheckpointCommit, parseGitHubUrl } from "../services/github.service";
import ExpressError from "../utils/expressError";

// POST /api/user/submit/initial 
// Leader submits: type, category, description, repo_link OR image (hardware)
export const submitInitial = async (req: Request, res: Response) => {
    const user = req.user as any;
    const { type, category, description, repo_link } = req.body;

    const team = await Team.findOne({ team_id: user.team_id });
    if (!team) throw new ExpressError(404, "Team not found");

    // initial submission window (2–3 PM day 1)
    const now = Date.now();
    const windowOpen = new Date(process.env.INITIAL_SUBMIT_OPEN as string).getTime();
    const windowClose = new Date(process.env.INITIAL_SUBMIT_CLOSE as string).getTime();
    if (now < windowOpen || now > windowClose) {
        const fmt = (t: number) => new Date(t).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true });
        throw new ExpressError(403, `Initial submission is only allowed between ${fmt(windowOpen)} and ${fmt(windowClose)} on April 11`);
    }

    let githubCheck = null;

    if (repo_link) {
        parseGitHubUrl(repo_link); // throws if invalid GitHub URL
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

// POST /api/user/submit/checkpoint
// Leader submits commit link or image 
export const submitCheckpoint = async (req: Request, res: Response) => {
    const user = req.user as any;
    const { round_num, commit_link } = req.body;

    if (!round_num || round_num < 1 || round_num > 4) {
        throw new ExpressError(400, "round_num must be between 1 and 4");
    }

    const team = await Team.findById(user.team_id);
    if (!team) throw new ExpressError(404, "Team not found");

    const cpIndex = team.checkpoints.findIndex((c) => c.round_num === round_num);
    if (cpIndex === -1) throw new ExpressError(404, "Checkpoint not found");

    const cp = team.checkpoints[cpIndex];

    // checkpoint_time ± 30 min
    const cpTime = new Date(cp.checkpoint_time).getTime();
    const windowStart = new Date(cpTime - 30 * 60 * 1000).toISOString();
    const windowEnd = new Date(cpTime + 30 * 60 * 1000).toISOString();

    let githubCheck = null;

    if (commit_link) {
        githubCheck = await checkCheckpointCommit(commit_link, windowStart, windowEnd);
        team.checkpoints[cpIndex].submit_link = commit_link;
        team.checkpoints[cpIndex].submitted_at = new Date();
        team.checkpoints[cpIndex].status = githubCheck.status as "VERIFIED" | "FLAGGED" | "SUSPICIOUS";
    } else {
        // Image submission — always VERIFIED
        team.checkpoints[cpIndex].submitted_at = new Date();
        team.checkpoints[cpIndex].status = "VERIFIED";
        githubCheck = { status: "VERIFIED", severity: 0, flags: [] };
    }

    team.markModified("checkpoints");
    await team.save();

    res.status(200).json({
        success: true,
        message: `Checkpoint ${round_num} submitted`,
        githubCheck,
        checkpoint: team.checkpoints[cpIndex],
    });
};
