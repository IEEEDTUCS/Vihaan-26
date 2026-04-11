import ExpressError from "../utils/expressError";

// Simple in-memory cache to avoid duplicate API calls
const cache = new Map<string, any>();

export const parseGitHubUrl = (url: string): { owner: string; repo: string } => {
    const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
    if (!match) throw new ExpressError(400, "Invalid GitHub URL");
    return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
};

const ghFetch = async (path: string) => {
    if (cache.has(path)) return cache.get(path);

    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`https://api.github.com${path}`, { headers });

    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining) console.log(`[GitHub] Rate limit remaining: ${remaining}`);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new ExpressError(res.status, (err as any).message || "GitHub API error");
    }

    const data = await res.json();
    cache.set(path, data);
    return data;
};

export interface CheckResult {
    status: "VERIFIED" | "SUSPICIOUS";
    severity: 0 | 1 | 2 | 3;
    flags: string[];
}

// ── Initial repo check ────────────────────────────────────────────────────────
export const checkInitialRepo = async (
    repoUrl: string,
    eventStartISO: string
): Promise<CheckResult> => {
    const { owner, repo } = parseGitHubUrl(repoUrl);
    const flags: string[] = [];
    let severity: 0 | 1 | 2 | 3 = 0;

    const repoInfo: any = await ghFetch(`/repos/${owner}/${repo}`);
    // per_page=1 — we only need to know if any commits exist
    const commits: any[] = await ghFetch(`/repos/${owner}/${repo}/commits?per_page=1`);

    const eventStart = new Date(eventStartISO).getTime();
    const repoCreated = new Date(repoInfo.created_at).getTime();

    if (repoCreated < eventStart) {
        flags.push("Repo was created before the event start time");
        severity = Math.max(severity, 3) as 3;
    }

    if(commits.length === 0) {
        flags.push("Repo has no commits — must be freshly created");
        severity = Math.max(severity, 1) as 1;
    }
    if (commits.length > 3) {   
        flags.push("Repo already has commits — must be freshly created with zero commits");
        severity = Math.max(severity, 3) as 3;
    }

    if (repoInfo.size > 500) {
        flags.push(`Repo size is ${repoInfo.size} KB — unusually large for a fresh repo`);
        severity = Math.max(severity, 2) as 2;
    }

    return {
        status: severity >= 2 ? "SUSPICIOUS" : "VERIFIED",
        severity,
        flags,
    };
};

// ── Checkpoint commit check ───────────────────────────────────────────────────
export const checkCheckpointCommit = async (
    commitUrl: string,
    windowStart: string,
    windowEnd: string
): Promise<CheckResult> => {
    const match = commitUrl.match(/github\.com\/([^/]+)\/([^/]+)\/commit\/([a-f0-9]+)/);
    if (!match) throw new ExpressError(400, "Invalid GitHub commit URL");

    const [, owner, repo, sha] = match;
    const flags: string[] = [];
    let severity: 0 | 1 | 2 | 3 = 0;

    const commit: any = await ghFetch(`/repos/${owner}/${repo}/commits/${sha}`);

    const commitTime = new Date(commit.commit.author.date).getTime();
    const start = new Date(windowStart).getTime();
    const end = new Date(windowEnd).getTime();

    if (commitTime < start || commitTime > end) {
        flags.push("Commit timestamp is outside the checkpoint window");
        severity = Math.max(severity, 3) as 3;
    }

    const total = (commit.stats?.additions ?? 0) + (commit.stats?.deletions ?? 0);
    const files: any[] = commit.files ?? [];

    if (total > 2000) {
        flags.push(`Commit has ${total} line changes — sudden large code dump`);
        severity = Math.max(severity, 3) as 3;
    } else if (total > 500) {
        flags.push(`Commit has ${total} line changes — unusually large for a checkpoint`);
        severity = Math.max(severity, 2) as 2;
    }

    const binaryExts = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".mp4", ".zip", ".pdf"];
    const binaryFiles = files.filter((f) => binaryExts.some((ext) => f.filename.toLowerCase().endsWith(ext)));
    if (files.length > 0 && binaryFiles.length / files.length > 0.8) {
        flags.push("Most changed files are binary/assets with no code changes");
        severity = Math.max(severity, 2) as 2;
    }

    const genericMessages = ["update", "final", "done", "commit", "changes", "fix", "test"];
    const msg = commit.commit.message.trim().toLowerCase();
    if (genericMessages.some((g) => msg === g || msg.startsWith(g + " ")) && total > 200) {
        flags.push(`Generic commit message "${commit.commit.message}" with ${total} line changes`);
        severity = Math.max(severity, 2) as 2;
    }

    return {
        status: severity >= 2 ? "SUSPICIOUS" : "VERIFIED",
        severity,
        flags,
    };
};
