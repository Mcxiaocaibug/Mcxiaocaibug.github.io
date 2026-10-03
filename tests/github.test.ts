import test from "node:test";
import assert from "node:assert/strict";
import { normalizeEvents, normalizeRuns, runState, pollDelay, githubUrl, requestGithub, GithubError, formatShanghai } from "../src/lib/github.ts";

const event = (type = "PushEvent", payload = {}) => ({ type, created_at: "2026-10-03T12:00:00Z", repo: { name: "Mcxiaocaibug/site" }, payload });
const rawRun = (status = "completed", conclusion: string | null = "success") => ({ id: 1, run_number: 3, display_title: "test", html_url: "https://github.com/Mcxiaocaibug/site/actions/runs/1", status, conclusion, event: "push", head_sha: "abcdef0123", updated_at: "2026-10-03T12:00:00Z" });
const run = (status = "completed", conclusion: string | null = "success") => normalizeRuns({ workflow_runs: [rawRun(status, conclusion)] })[0];

test("events normalize missing commit details and safely encode links", () => {
  const items = normalizeEvents([event("PushEvent", { ref: "refs/heads/main" }), event("ReleaseEvent", { release: { name: "v1", html_url: "javascript:alert(1)" } })]);
  assert.equal(items[0].title, "推送至 main");
  assert.equal(items[1].url, "https://github.com/Mcxiaocaibug/site/releases");
  assert.equal(formatShanghai(items[0].dateTime), "10/03 20:00");
});
test("commit title is first line and commit URLs use verified SHAs", () => {
  const items = normalizeEvents([event("PushEvent", { commits: [{ message: "feat: orbit\nbody", sha: "a".repeat(40) }] })]);
  assert.equal(items[0].title, "feat: orbit");
  assert.ok(items[0].url.endsWith(`/commit/${"a".repeat(40)}`));
});
test("pull requests are deduplicated and merged status wins", () => {
  const pr = event("PullRequestEvent", { number: 7, action: "closed", pull_request: { title: "Fix", merged: true } });
  assert.equal(normalizeEvents([pr, pr]).length, 1);
  assert.equal(normalizeEvents([pr])[0].action, "合并");
});
test("malformed, profile and unsupported events are skipped; feed is bounded", () => {
  const invalid = [null, {}, { ...event(), created_at: "bad" }, { ...event(), repo: { name: "../../bad" } }, { ...event(), repo: { name: "Mcxiaocaibug/Mcxiaocaibug" } }, event("WatchEvent")];
  assert.deepEqual(normalizeEvents(invalid), []);
  assert.equal(normalizeEvents(Array.from({ length: 10 }, () => event())).length, 5);
  assert.deepEqual(normalizeEvents([]), []);
  assert.throws(() => normalizeEvents({}));
});
test("workflow states never report pending, cancelled or failed as successful", () => {
  assert.equal(runState().tone, "neutral");
  assert.equal(runState(run("in_progress", null)).label, "运行中");
  assert.equal(runState(run("queued", null)).label, "等待运行");
  assert.equal(runState(run()).label, "部署成功");
  assert.equal(runState(run("completed", "failure")).tone, "failure");
  assert.equal(runState(run("completed", "timed_out")).tone, "failure");
  assert.equal(runState(run("completed", "cancelled")).label, "已取消");
  assert.equal(runState(run("completed", "skipped")).tone, "neutral");
  assert.equal(runState(run("completed", null)).tone, "neutral");
});
test("polling is faster only when there is an active workflow", () => {
  assert.equal(pollDelay([]), 300_000);
  assert.equal(pollDelay([run()]), 300_000);
  assert.equal(pollDelay([run("in_progress", null)]), 60_000);
});
test("untrusted workflow links are constrained to GitHub HTTPS", () => {
  for (const url of ["javascript:alert(1)", "https://github.com.evil.test", "http://github.com", "https://user@github.com"]) assert.equal(githubUrl(url, "fallback"), "fallback");
  assert.equal(githubUrl("https://github.com/a/b", "fallback"), "https://github.com/a/b");
  assert.throws(() => normalizeRuns({}));
  assert.deepEqual(normalizeRuns({ workflow_runs: [null, { id: "bad" }] }), []);
});
test("public requests send no authorization, and rate limits preserve retry time", async (t) => {
  let observedHeaders: HeadersInit | undefined;
  t.mock.method(globalThis, "fetch", async (_url: unknown, init?: RequestInit) => {
    observedHeaders = init?.headers;
    return new Response('{"workflow_runs":[]}', { status: 200 });
  });
  assert.deepEqual(await requestGithub("/test"), { workflow_runs: [] });
  assert.equal(new Headers(observedHeaders).has("Authorization"), false);
  const reset = Math.ceil(Date.now() / 1000) + 3600;
  t.mock.method(globalThis, "fetch", async () => new Response("", { status: 403, headers: { "x-ratelimit-reset": String(reset) } }));
  await assert.rejects(requestGithub("/test"), error => error instanceof GithubError && error.retryAt >= reset * 1000);
});
