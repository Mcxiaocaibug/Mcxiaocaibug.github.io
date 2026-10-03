<script lang="ts">
  import { onMount, untrack } from "svelte";
  import { clamp, smoothstep } from "$lib/motion";
  import ProjectVisual from "$lib/ProjectVisual.svelte";

  let { paused = false }: { paused?: boolean } = $props();
  let refresh: (() => void) | undefined;
  $effect(() => {
    void paused;
    untrack(() => refresh?.());
  });
  let section: HTMLElement;
  let progress = $state(1);
  let enabled = $state(false);
  const phase = $derived(progress < 0.34 ? 0 : progress < 0.7 ? 1 : 2);
  const phases = ["灵感", "构建", "抵达"];

  onMount(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let inView = false;
    let start = 0;
    let distance = 1;
    function measure() {
      start = section.getBoundingClientRect().top + window.scrollY;
      distance = Math.max(1, section.offsetHeight - window.innerHeight);
      queue();
    }
    function update() {
      frame = 0;
      progress = !enabled ? 1 : clamp((window.scrollY - start) / distance);
      section.style.setProperty("--story-progress", String(progress));
      section.style.setProperty(
        "--story-build",
        String(smoothstep(0.1, 0.55, progress)),
      );
      section.style.setProperty(
        "--story-launch",
        String(smoothstep(0.65, 0.95, progress)),
      );
    }
    function queue() {
      if ((inView || !enabled) && !frame) frame = requestAnimationFrame(update);
    }
    function preference() {
      enabled = !media.matches && !paused && window.innerHeight >= 680;
      measure();
      update();
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) measure();
      },
      { rootMargin: "100px" },
    );
    const resizeObserver = new ResizeObserver(measure);
    observer.observe(section);
    resizeObserver.observe(section);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", preference, { passive: true });
    media.addEventListener("change", preference);
    refresh = preference;
    preference();
    return () => {
      refresh = undefined;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", preference);
      media.removeEventListener("change", preference);
    };
  });
</script>

<section
  class="scroll-story"
  class:story-enabled={enabled}
  bind:this={section}
  aria-labelledby="story-title"
>
  <div class="story-sticky">
    <div class="story-topline">
      <span>THE MAKING OF AN IDEA</span><span>从一行代码，到一个世界。</span>
    </div>
    <div class="story-layout">
      <div class="story-copy">
        <p class="micro-label">CRAFT / 创造的过程</p>
        <h2 id="story-title">让灵感<br /><span>不止于想象。</span></h2>
        <div class="story-captions" aria-live="off">
          <p class:active={phase === 0} aria-hidden={phase !== 0}>
            一个闪过的念头，<br />值得被认真写下。
          </p>
          <p class:active={phase === 1} aria-hidden={phase !== 1}>
            把复杂藏进代码，<br />把自然留给体验。
          </p>
          <p class:active={phase === 2} aria-hidden={phase !== 2}>
            直到它走出编辑器，<br />成为触手可及的真实。
          </p>
        </div>
        <div class="story-steps" aria-label="创造阶段">
          {#each phases as label, index}
            <div class:current={phase === index} class:complete={phase > index}>
              <span>0{index + 1}</span><b>{label}</b><i></i>
            </div>
          {/each}
        </div>
      </div>
      <div class="story-stage" aria-hidden="true">
        <div class="stage-grid"></div>
        <div class="stage-glow"></div>
        <div class="story-editor">
          <div class="editor-top">
            <span class="window-dots"><i></i><i></i><i></i></span><span
              >dream.ts</span
            ><span>↗</span>
          </div>
          <div class="editor-body">
            <div class="line-numbers">
              01<br />02<br />03<br />04<br />05<br />06<br />07<br />08
            </div>
            <code
              ><span class="code-comment">// make something that matters</span
              ><br /><span class="code-purple">const</span> dream = &#123;<br
              />&nbsp;&nbsp;idea:
              <span class="code-green">"a little curiosity"</span>,<br
              />&nbsp;&nbsp;craft:
              <span class="code-green">"a lot of care"</span>,<br
              />&nbsp;&nbsp;possibilities:
              <span class="code-orange">Infinity</span><br />&#125;;<br /><br
              /><span class="code-purple">await</span> build(dream);<span
                class="code-cursor"
              ></span></code
            >
          </div>
          <div class="editor-status">
            <span>◉ main*</span><span>TypeScript &nbsp; UTF-8</span>
          </div>
        </div>
        <div class="story-result"><ProjectVisual kind="azure" compact /></div>
        <div class="deploy-badge">
          <span class="deploy-check">✓</span>
          <div>
            <b>想法，已上线。</b><span
              >Built with curiosity. Shipped with care.</span
            >
          </div>
          <i></i>
        </div>
        <span class="stage-coordinate">IDEA → CODE → EXPERIENCE</span>
      </div>
    </div>
    <div class="story-bottom">
      <span>SCROLL TO CREATE</span>
      <div><i></i></div>
      <span>继续，让想法成形 ↓</span>
    </div>
  </div>
</section>
