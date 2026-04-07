import ExpressError from "../utils/expressError";

interface GitHubCommit {
    sha: string;
    commit: {
        message: string;
        author: { date: string };
    };
    stats?: { additions: number; deletions: number; total: number };
    files?: { filename: string; changes: number }[];
}

interface RepoInfo {
    created_at: string;
    size: number; // KB
    default_branch: string;
}

// Parse owner/repo from GitHub URL
export const parseGitHubUrl = (url: string): { owner: string; repo: string } => {
    const match = url.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
    if (!match) throw new ExpressError(400, "Invalid GitHub URL");
    return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
};

const ghFetch = async (path: string) => {
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`https://api.github.com${path}`, { headers });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new ExpressError(res.status, (err as any).message || "GitHub API error");
    }
    return res.json();
};

// Severity levels
// 0 = clean, 1 = soft warning (orange/FLAGGED), 2 = moderate (orange-red/FLAGGED), 3 = hard flag (red/SUSPICIOUS)
export interface CheckResult {
    status: "VERIFIED" | "FLAGGED" | "SUSPICIOUS";
    severity: 0 | 1 | 2 | 3;
    flags: string[];
}

// Initial repo check 
export const checkInitialRepo = async (
    repoUrl: string,
    eventStartISO: string
): Promise<CheckResult> => {
    const { owner, repo } = parseGitHubUrl(repoUrl);
    const flags: string[] = [];
    let severity: 0 | 1 | 2 | 3 = 0;

    const repoInfo: RepoInfo = await ghFetch(`/repos/${owner}/${repo}`);
    const commits: GitHubCommit[] = await ghFetch(
        `/repos/${owner}/${repo}/commits?per_page=10`
    );

    const eventStart = new Date(eventStartISO).getTime();
    const repoCreated = new Date(repoInfo.created_at).getTime();

    // Hard flag: repo created before event start
    if (repoCreated < eventStart) {
        flags.push("Repo was created before the event start time");
        severity = Math.max(severity, 3) as 3;
    }

    // Hard flag: repo must be completely empty (zero commits)
    if (commits.length > 0) {
        flags.push(`Repo already has ${commits.length} commit(s) — repo must be freshly created with no commits`);
        severity = Math.max(severity, 3) as 3;
    }

    // Moderate: repo size already large (>500 KB) even without commits
    if (repoInfo.size > 500) {
        flags.push(`Repo size is ${repoInfo.size} KB — unusually large for a fresh repo`);
        severity = Math.max(severity, 2) as 2;
    }

    const status = severity === 0 ? "VERIFIED" : severity <= 2 ? "FLAGGED" : "SUSPICIOUS";

    return { status, severity, flags };
};

// Checkpoint commit check 
export const checkCheckpointCommit = async (
    commitUrl: string,
    windowStart: string, // ISO
    windowEnd: string    // ISO
): Promise<CheckResult> => {
    // Parse commit URL: https://github.com/owner/repo/commit/sha
    const match = commitUrl.match(/github\.com\/([^/]+)\/([^/]+)\/commit\/([a-f0-9]+)/);
    if (!match) throw new ExpressError(400, "Invalid GitHub commit URL");

    const [, owner, repo, sha] = match;
    const flags: string[] = [];
    let severity: 0 | 1 | 2 | 3 = 0;

    const commit: any = await ghFetch(`/repos/${owner}/${repo}/commits/${sha}`);

    const commitTime = new Date(commit.commit.author.date).getTime();
    const start = new Date(windowStart).getTime();
    const end = new Date(windowEnd).getTime();

    // Hard flag: commit outside checkpoint window
    if (commitTime < start || commitTime > end) {
        flags.push("Commit timestamp is outside the checkpoint window");
        severity = Math.max(severity, 3) as 3;
    }

    const additions: number = commit.stats?.additions ?? 0;
    const deletions: number = commit.stats?.deletions ?? 0;
    const total = additions + deletions;
    const files: any[] = commit.files ?? [];

    // Hard flag: massive line dump (>2000 lines)
    if (total > 2000) {
        flags.push(`Commit has ${total} line changes — sudden large code dump`);
        severity = Math.max(severity, 3) as 3;
    }

    // Moderate: large commit (500–2000 lines)
    if (total > 500 && total <= 2000) {
        flags.push(`Commit has ${total} line changes — unusually large for a checkpoint`);
        severity = Math.max(severity, 2) as 2;
    }

    // Moderate: >80% binary/asset files with no real code
    const binaryExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".mp4", ".zip", ".pdf"];
    const binaryFiles = files.filter((f) =>
        binaryExtensions.some((ext) => f.filename.toLowerCase().endsWith(ext))
    );
    if (files.length > 0 && binaryFiles.length / files.length > 0.8) {
        flags.push("Most changed files are binary/assets with no code changes");
        severity = Math.max(severity, 2) as 2;
    }

    // Soft: generic commit message with large changes
    const genericMessages = ["update", "final", "done", "commit", "changes", "fix", "test"];
    const msg = commit.commit.message.trim().toLowerCase();
    if (genericMessages.some((g) => msg === g || msg.startsWith(g + " ")) && total > 200) {
        flags.push(`Generic commit message "${commit.commit.message}" with ${total} line changes`);
        severity = Math.max(severity, 1) as 1;
    }

    return {
        status: severity === 0 ? "VERIFIED" : severity <= 2 ? "FLAGGED" : "SUSPICIOUS",
        severity,
        flags,
    };
};
