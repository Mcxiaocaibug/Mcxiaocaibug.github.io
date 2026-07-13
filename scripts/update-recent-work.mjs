import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const username = "Mcxiaocaibug";
const profileRepository = `${username}/${username}`.toLowerCase();
const outputPath = resolve("app/recent-work.json");
const timeZone = "Asia/Shanghai";
const maximumItems = 5;

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "mcxiaocaibug-portfolio",
};

if (process.env.GH_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
}

async function github(path) {
  const response = await fetch(path.startsWith("http") ? path : `https://api.github.com${path}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

function formatShanghai(isoDate) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(isoDate))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

function repoDetails(event) {
  const fullName = event.repo.name;
  return {
    repo: fullName.replace(`${username}/`, ""),
    repoUrl: `https://github.com/${fullName}`,
  };
}

function baseItem(event) {
  return {
    time: formatShanghai(event.created_at),
    dateTime: event.created_at,
    ...repoDetails(event),
  };
}

async function pushItem(event) {
  const lastCommit = event.payload.commits?.at(-1);
  let title = lastCommit?.message?.split("\n")[0];
  let url = lastCommit?.url?.replace("api.github.com/repos", "github.com").replace("/commits/", "/commit/");

  if (!title && event.payload.head) {
    const commit = await github(`/repos/${event.repo.name}/commits/${event.payload.head}`);
    title = commit.commit.message.split("\n")[0];
    url = commit.html_url;
  }

  return {
    ...baseItem(event),
    action: "提交",
    title: title || `推送 ${event.payload.size || 1} 个提交`,
    url: url || `https://github.com/${event.repo.name}/commits/${event.payload.ref?.replace("refs/heads/", "") || ""}`,
  };
}

async function pullRequestItem(event) {
  const pull = event.payload.pull_request?.url
    ? await github(event.payload.pull_request.url)
    : event.payload.pull_request;
  const merged = Boolean(pull?.merged_at || pull?.merged);
  const action = merged
    ? "合并"
    : event.payload.action === "opened"
      ? "发起"
      : event.payload.action === "closed"
        ? "关闭"
        : "更新";

  return {
    ...baseItem(event),
    action,
    title: pull?.title || `Pull Request #${event.payload.number}`,
    url: pull?.html_url || `https://github.com/${event.repo.name}/pull/${event.payload.number}`,
  };
}

function releaseItem(event) {
  const release = event.payload.release;
  return {
    ...baseItem(event),
    action: "发布",
    title: release?.name || release?.tag_name || "新版本",
    url: release?.html_url || `https://github.com/${event.repo.name}/releases`,
  };
}

function repositoryItem(event) {
  return {
    ...baseItem(event),
    action: "创建",
    title: "创建了一个新仓库",
    url: `https://github.com/${event.repo.name}`,
  };
}

const events = await github(`/users/${username}/events/public?per_page=100`);
const pullRequestTimes = events
  .filter((event) => event.type === "PullRequestEvent")
  .map((event) => ({ repo: event.repo.name, time: Date.parse(event.created_at) }));
const seenPullRequests = new Set();
const items = [];

for (const event of events) {
  if (items.length >= maximumItems) break;
  if (event.repo.name.toLowerCase() === profileRepository) continue;

  if (event.type === "PushEvent") {
    const eventTime = Date.parse(event.created_at);
    const nearPullRequest = pullRequestTimes.some(
      ({ repo, time }) => repo === event.repo.name && Math.abs(eventTime - time) < 10 * 60 * 1000,
    );
    if (nearPullRequest) continue;
    items.push(await pushItem(event));
  } else if (event.type === "PullRequestEvent") {
    const key = `${event.repo.name}#${event.payload.number}`;
    if (seenPullRequests.has(key)) continue;
    seenPullRequests.add(key);
    items.push(await pullRequestItem(event));
  } else if (event.type === "ReleaseEvent") {
    items.push(releaseItem(event));
  } else if (event.type === "CreateEvent" && event.payload.ref_type === "repository") {
    items.push(repositoryItem(event));
  }
}

const updatedAt = new Date().toISOString();
const recentWork = {
  updatedAt,
  updatedAtLabel: formatShanghai(updatedAt),
  items:
    items.length > 0
      ? items
      : [
          {
            time: formatShanghai(updatedAt),
            dateTime: updatedAt,
            repo: username,
            repoUrl: `https://github.com/${username}`,
            action: "记录",
            title: "代码暂歇，灵感仍在路上。",
            url: `https://github.com/${username}`,
          },
        ],
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(recentWork, null, 2)}\n`);
console.log(`Wrote ${recentWork.items.length} recent work items to ${outputPath}`);
