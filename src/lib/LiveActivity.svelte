<script lang="ts">
  import { onMount } from "svelte";
  import recentSnapshot from "$lib/recent-work.json";
  import workflowSnapshot from "$lib/workflow-snapshot.json";
  import { ACTIONS_URL, EVENTS_PATH, RUNS_PATH, GithubError, formatShanghai,
    normalizeEvents, normalizeRuns, pollDelay, requestGithub, runState, type WorkflowRun } from "$lib/github";

  let section: HTMLElement;
  let items = $state(recentSnapshot.items);
  let activityTime = $state<string | null>(recentSnapshot.updatedAt);
  let runs = $state<WorkflowRun[]>(workflowSnapshot.runs);
  let workflowTime = $state<string | null>(workflowSnapshot.updatedAt);
  let activityMode = $state("快照");
  let workflowMode = $state("快照");
  let isVisible = $state(false);
  const current = $derived(runs[0]);
  const currentStatus = $derived(runState(current));

  onMount(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;
    let controller: AbortController | null = null;
    let inFlight = false;
    const due = { events: 0, runs: 0 };
    let rateLimitUntil = 0;
    async function refresh() {
      clearTimeout(timer);
      if (disposed || !isVisible || document.hidden || inFlight) return;
      if (!navigator.onLine) {
        activityMode = workflowMode = "离线 · 保留快照";
        return;
      }
      inFlight = true;
      controller = new AbortController();
      const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(12_000)]);
      const now = Date.now();
      const fetchFeed = async (kind: "events" | "runs") => {
        if (now < Math.max(due[kind], rateLimitUntil)) return;
        try {
          const data = await requestGithub(kind === "events" ? EVENTS_PATH : RUNS_PATH, { signal });
          const time = new Date().toISOString();
          if (disposed) return;
          if (kind === "events") {
            items = normalizeEvents(data); activityTime = time; activityMode = "已连接";
            due.events = Date.now() + 300_000;
          } else {
            runs = normalizeRuns(data); workflowTime = time; workflowMode = "已连接";
            due.runs = Date.now() + pollDelay(runs);
          }
        } catch (error) {
          if (disposed || controller?.signal.aborted) return;
          due[kind] = error instanceof GithubError ? error.retryAt : Date.now() + 300_000;
          if (error instanceof GithubError && /403|429/.test(error.message)) rateLimitUntil = error.retryAt;
          const label = error instanceof GithubError && /403|429/.test(error.message) ? "API 限流 · 保留快照" : "连接中断 · 保留快照";
          if (kind === "events") activityMode = label; else workflowMode = label;
        }
      };
      await Promise.all([fetchFeed("events"), fetchFeed("runs")]);
      inFlight = false;
      if (!disposed && isVisible && !document.hidden) {
        timer = setTimeout(refresh, Math.max(1000, Math.max(Math.min(due.events, due.runs), rateLimitUntil) - Date.now()));
      }
    }
    function resume() { void refresh(); }
    function offline() {
      clearTimeout(timer);
      activityMode = workflowMode = "离线 · 保留快照";
    }
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) resume(); else clearTimeout(timer);
    }, { rootMargin: "160px" });
    observer.observe(section);
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("online", resume);
    window.addEventListener("offline", offline);
    return () => {
      disposed = true; observer.disconnect(); clearTimeout(timer); controller?.abort();
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("online", resume); window.removeEventListener("offline", offline);
    };
  });
</script>

<section bind:this={section} class="live-section" class:in-view={isVisible} aria-labelledby="activity-title">
  <div class="live-heading">
    <div><p class="micro-label">05 / SIGNALS FROM THE WORKSPACE</p><h3 id="activity-title">创造，从未停机。</h3></div>
    <p>每一次提交，都是新的星光。<br />代码的足迹，也在这里实时延续。</p>
  </div>
  <div class="mission-panel" data-tone={currentStatus.tone}>
    <div class="mission-glow" aria-hidden="true"></div>
    <div class="mission-topline"><span><i></i> AUTOMATION / MISSION CONTROL</span><a href={ACTIONS_URL} target="_blank" rel="noreferrer">GITHUB ACTIONS ↗</a></div>
    <div class="mission-body">
      <div class="mission-copy">
        <p class="mission-eyebrow">从一行代码，到一片星空。</p>
        <h4>Commit.<br /><span>Build. Go live.</span></h4>
        <p class="mission-description">公开动态自动同步，检查与构建逐站完成。<br />让每一次创造，都有清晰的回响。</p>
        <div class="pipeline" aria-label="自动部署流程：同步动态、类型与测试检查、构建并发布 GitHub Pages">
          <span><b>01</b> SYNC</span><i aria-hidden="true"></i><span><b>02</b> CHECK</span><i aria-hidden="true"></i><span><b>03</b> DEPLOY</span>
        </div>
      </div>
      <div class="telemetry">
        <div class="telemetry-orbit" aria-hidden="true"><i></i><i></i><span>↗</span></div>
        <p class="telemetry-caption">LATEST TRANSMISSION</p>
        <p class="run-state" role="status"><span class="live-dot"></span>{currentStatus.label}</p>
        {#if current}<a class="current-run" href={current.url} target="_blank" rel="noreferrer">RUN #{current.number} · {current.sha} ↗</a>{:else}<a class="current-run" href={ACTIONS_URL} target="_blank" rel="noreferrer">查看工作流 ↗</a>{/if}
        <span class="connection-label">{workflowMode}</span>
      </div>
    </div>
    <div class="mission-runs" aria-label="最近的部署记录">
      {#each runs as run (run.id)}
        {@const status = runState(run)}
        <a href={run.url} target="_blank" rel="noreferrer" data-tone={status.tone}>
          <span class="run-number">#{run.number}</span><span class="run-title">{run.title}</span><span class="run-label"><i class="live-dot"></i>{status.label}</span><span aria-hidden="true">↗</span>
        </a>
      {:else}<p class="empty-runs">暂无运行快照，连接 GitHub 后显示真实部署记录。</p>{/each}
    </div>
    <div class="mission-bottomline"><span>运行中 60 秒 / 空闲 5 分钟刷新 · 仅在此区域可见时</span><span>{#if workflowTime}<time datetime={workflowTime}>核对于 {formatShanghai(workflowTime)} UTC+08</time>{:else}等待首次同步{/if}</span></div>
  </div>

  <div class="feed-heading"><p><span class="feed-dot"></span> THE COMMIT LOG <span>/ 公开动态</span></p><span>{activityMode}{#if activityTime} · <time datetime={activityTime}>{formatShanghai(activityTime)} UTC+08</time>{/if}</span></div>
  <ol class="signal-feed">
    {#each items as item (`${item.dateTime}-${item.url}`)}
      <li><a href={item.url} target="_blank" rel="noreferrer"><time datetime={item.dateTime}>{item.time}</time><span class="signal-action">{item.action}</span><div><strong>{item.repo}</strong><p>{item.title}</p></div><span class="signal-arrow" aria-hidden="true">↗</span></a></li>
    {:else}<li class="empty-feed">近期暂无公开活动，灵感仍在路上。</li>{/each}
  </ol>
  <p class="feed-note">公开活动每 5 分钟刷新；GitHub 事件流本身可能延迟。断网或限流时显示最近快照，不将快照标为实时。</p>
  <noscript><p class="feed-note">当前显示构建时快照。启用 JavaScript 后可自动更新。</p></noscript>
</section>
