import { mkdir, writeFile } from "node:fs/promises";
import { normalizeEvents, normalizeRuns, EVENTS_PATH, RUNS_PATH, requestGithub, formatShanghai } from "../src/lib/github.ts";

const tasks = [
  [EVENTS_PATH, "src/lib/recent-work.json", normalizeEvents, "items"],
  [RUNS_PATH, "src/lib/workflow-snapshot.json", normalizeRuns, "runs"],
];
let failures = 0;
for (const [endpoint, path, normalize, key] of tasks) {
  try {
    const data = normalize(await requestGithub(endpoint, { token: process.env.GH_TOKEN, signal: AbortSignal.timeout(20_000) }));
    const updatedAt = new Date().toISOString();
    const snapshot = { updatedAt, updatedAtLabel: formatShanghai(updatedAt), [key]: data };
    await writeFile(path, `${JSON.stringify(snapshot, null, 2)}\n`);
    await mkdir("static/data", { recursive: true });
    await writeFile(`static/data/${key === "items" ? "recent-work" : "workflow"}.json`, `${JSON.stringify(snapshot, null, 2)}\n`);
    console.log(`Synced ${data.length} ${key} to ${path}`);
  } catch (error) {
    failures++;
    console.warn(`::warning::${path}: ${error.message}. Retaining the last successful snapshot.`);
  }
}
// A transient API failure must not prevent shipping an otherwise valid site.
if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFile } = await import("node:fs/promises");
  await appendFile(process.env.GITHUB_STEP_SUMMARY, `### Orbit telemetry\n${failures ? `⚠ ${failures} feed(s) retained their previous snapshot.` : "✓ Public activity and deployment snapshots refreshed."}\n`);
}
