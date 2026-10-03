/** Shared by the static snapshot generator and the token-free browser client. */
export const USER = "Mcxiaocaibug";
export const REPOSITORY = `${USER}/${USER}.github.io`;
export const WORKFLOW = "deploy-pages.yml";
export const ACTIONS_URL = `https://github.com/${REPOSITORY}/actions/workflows/${WORKFLOW}`;
export const EVENTS_PATH = `/users/${USER}/events/public?per_page=50`;
export const RUNS_PATH = `/repos/${REPOSITORY}/actions/workflows/${WORKFLOW}/runs?branch=main&per_page=3`;
export interface ActivityItem {
  time: string; dateTime: string; repo: string; repoUrl: string;
  action: string; title: string; url: string;
}
export interface WorkflowRun {
  id: number; number: number; title: string; url: string; status: string;
  conclusion: string | null; event: string; sha: string; updatedAt: string;
}
export interface GithubEvent {
  type: string; created_at: string; repo: { name: string };
  payload: {
    commits?: { message: string; sha: string }[]; head?: string; size?: number;
    ref?: string; ref_type?: string; action?: string; number?: number;
    pull_request?: { title?: string; html_url?: string; merged?: boolean; merged_at?: string };
    release?: { name?: string; tag_name?: string; html_url?: string };
  };
}
export const formatShanghai = (iso: string) => new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
}).format(new Date(iso));

// Never let remote event content supply executable or unrelated link schemes.
export function githubUrl(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  try {
    const url = new URL(value);
    return url.origin === "https://github.com" && !url.username && !url.password ? url.href : fallback;
  } catch { return fallback; }
}
export function normalizeEvents(value: unknown): ActivityItem[] {
  if (!Array.isArray(value)) throw new Error("Invalid GitHub activity response");
  const items: ActivityItem[] = [];
  const seen = new Set<string>();
  for (const raw of value) {
    if (!raw || typeof raw.repo?.name !== "string" || !raw.payload || !Number.isFinite(Date.parse(raw.created_at))) continue;
    const event = raw as GithubEvent;
    const name = event.repo.name;
    if (!/^[\w.-]+\/[\w.-]+$/.test(name) || name.toLowerCase() === `${USER}/${USER}`.toLowerCase()) continue;
    const repoUrl = `https://github.com/${name}`;
    const item = { time: formatShanghai(event.created_at), dateTime: event.created_at,
      repo: name.replace(new RegExp(`^${USER}/`, "i"), ""), repoUrl,
      action: "", title: "", url: repoUrl };
    const payload = event.payload;
    if (event.type === "PushEvent") {
      const commit = payload.commits?.at(-1);
      item.action = "提交";
      item.title = commit?.message?.split("\n")[0] || `推送至 ${payload.ref?.replace("refs/heads/", "") || "仓库"}`;
      const sha = commit?.sha || payload.head;
      item.url = sha && /^[a-f0-9]{7,40}$/i.test(sha) ? `${repoUrl}/commit/${sha}` : `${repoUrl}/commits`;
    } else if (event.type === "PullRequestEvent") {
      const key = `${name}#${payload.number}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const pr = payload.pull_request;
      item.action = pr?.merged || pr?.merged_at ? "合并" : payload.action === "opened" ? "发起" : payload.action === "closed" ? "关闭" : "更新";
      item.title = pr?.title || `Pull Request #${payload.number}`;
      item.url = githubUrl(pr?.html_url, `${repoUrl}/pull/${payload.number}`);
    } else if (event.type === "ReleaseEvent") {
      item.action = "发布";
      item.title = payload.release?.name || payload.release?.tag_name || "新版本";
      item.url = githubUrl(payload.release?.html_url, `${repoUrl}/releases`);
    } else if (event.type === "CreateEvent" && payload.ref_type === "repository") {
      item.action = "创建";
      item.title = "创建了一个新仓库";
    } else continue;
    // API strings are rendered as text by Svelte, never as HTML.
    item.title = String(item.title).slice(0, 220);
    items.push(item);
    if (items.length === 5) break;
  }
  return items;
}
export function normalizeRuns(value: unknown): WorkflowRun[] {
  if (!value || typeof value !== "object" || !("workflow_runs" in value) || !Array.isArray(value.workflow_runs)) {
    throw new Error("Invalid GitHub workflow response");
  }
  return value.workflow_runs.filter(run => run && Number.isFinite(run.id) && Number.isFinite(Date.parse(run.updated_at)))
    .slice(0, 3).map(run => ({
      id: run.id, number: run.run_number, title: String(run.display_title || run.name || "Pages deployment").slice(0, 160),
      url: githubUrl(run.html_url, ACTIONS_URL), status: String(run.status),
      conclusion: run.conclusion ? String(run.conclusion) : null, event: String(run.event),
      sha: String(run.head_sha || "").slice(0, 7), updatedAt: run.updated_at,
    }));
}
export function runState(run?: WorkflowRun) {
  if (!run) return { label: "等待记录", tone: "neutral", active: false };
  if (run.status !== "completed") {
    const running = run.status === "in_progress";
    return { label: running ? "运行中" : "等待运行", tone: "running", active: true };
  }
  if (run.conclusion === "success") return { label: "部署成功", tone: "success", active: false };
  if (["failure", "timed_out", "startup_failure", "action_required"].includes(run.conclusion || "")) {
    return { label: "需要检查", tone: "failure", active: false };
  }
  return { label: run.conclusion === "cancelled" ? "已取消" : "已结束", tone: "neutral", active: false };
}
export const pollDelay = (runs: WorkflowRun[]) => runs.some(run => runState(run).active) ? 60_000 : 300_000;
export class GithubError extends Error {
  retryAt: number;
  constructor(message: string, retryAt = Date.now() + 300_000) {
    super(message); this.retryAt = retryAt;
  }
}
export async function requestGithub(path: string, options: { signal?: AbortSignal; token?: string } = {}) {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const response = await fetch(`https://api.github.com${path}`, {
    headers, signal: options.signal, cache: "no-cache",
  });
  if (!response.ok) {
    const reset = Number(response.headers.get("x-ratelimit-reset")) * 1000;
    const retry = Number(response.headers.get("retry-after")) * 1000 + Date.now();
    throw new GithubError(`GitHub API ${response.status}`, Math.max(Date.now() + 300_000, reset || 0, retry || 0));
  }
  return response.json();
}
