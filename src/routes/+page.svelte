<script lang="ts">
  import { onMount } from "svelte";
  import LiveActivity from "$lib/LiveActivity.svelte";
  import ArrowSwap from "$lib/ArrowSwap.svelte";
  import Reveal from "$lib/Reveal.svelte";
  import WordRotator from "$lib/WordRotator.svelte";
  import CosmicScene from "$lib/CosmicScene.svelte";
  import ScrollStory from "$lib/ScrollStory.svelte";
  import ProjectVisual from "$lib/ProjectVisual.svelte";
  import { clamp, tilt } from "$lib/motion";

  let motionPaused = $state(false);
  $effect(() => {
    if (motionPaused) document.documentElement.dataset.motion = "paused";
    else delete document.documentElement.dataset.motion;
    return () => {
      delete document.documentElement.dataset.motion;
    };
  });
  let hero: HTMLElement;
  let headerDark = $state(true);
  let activeSection = $state("");
  const navItems = [
    { id: "about", label: "关于" },
    { id: "work", label: "作品" },
    { id: "stack", label: "技术" },
    { id: "now", label: "近况" },
  ];

  onMount(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let heroHeight = hero.offsetHeight;
    let pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const sections = navItems
      .map(({ id }) => document.getElementById(id)!)
      .filter(Boolean);
    let sectionTops: number[] = [];
    function measure() {
      heroHeight = hero.offsetHeight;
      pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      sectionTops = sections.map(
        (section) => section.getBoundingClientRect().top + window.scrollY,
      );
      queue();
    }
    function update() {
      frame = 0;
      const y = window.scrollY;
      headerDark = y < heroHeight - 90;
      document.documentElement.style.setProperty(
        "--page-progress",
        String(clamp(y / Math.max(1, pageHeight))),
      );
      if (!media.matches && y < heroHeight + 200) {
        hero.style.setProperty("--hero-travel", `${Math.min(y * 0.18, 150)}px`);
        hero.style.setProperty(
          "--hero-fade",
          String(1 - clamp(y / heroHeight) * 0.72),
        );
      } else {
        hero.style.setProperty("--hero-travel", "0px");
        hero.style.setProperty("--hero-fade", "1");
      }
      let active = "";
      sectionTops.forEach((top, index) => {
        if (y + window.innerHeight * 0.36 >= top) active = sections[index].id;
      });
      activeSection = active;
    }
    function queue() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    media.addEventListener("change", queue);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", measure);
      media.removeEventListener("change", queue);
      document.documentElement.style.removeProperty("--page-progress");
    };
  });

  const projects = [
    {
      index: "01",
      kind: "azure",
      category: "COMMUNITY / 社区体验",
      name: "AzureDreamWebsite",
      description:
        "一座现代、流动的社区网站，把视觉表达与多页面体验放在同一片云端。",
      stack: "Next.js · JavaScript",
      href: "https://github.com/Mcxiaocaibug/AzureDreamWebsite",
      note: "Community website",
    },
    {
      index: "02",
      kind: "neptunium",
      category: "MINECRAFT / 游戏工具",
      name: "Neptunium Web",
      description:
        "为 Minecraft 基岩版玩家打造的投影文件管理系统，让建筑灵感更容易抵达游戏。",
      stack: "TypeScript · Supabase · R2",
      href: "https://github.com/Mcxiaocaibug/neptunium-web",
      note: "Minecraft tools",
    },
    {
      index: "03",
      kind: "switch",
      category: "AI TOOLING / 人工智能",
      name: "Switch LLM",
      description:
        "一个轻巧的 IronClaw WASM 扩展，在聊天面板里切换模型与推理后端。",
      stack: "Rust · WebAssembly",
      href: "https://github.com/Mcxiaocaibug/Switch-LLM",
      note: "WASM tool",
    },
    {
      index: "04",
      kind: "dns",
      category: "INFRASTRUCTURE / 边缘服务",
      name: "六趣 DNS",
      description:
        "基于 Cloudflare API 的多服务商 DNS 管理系统，把繁杂的解析工作收进清晰界面。",
      stack: "PHP · SQLite · Cloudflare",
      href: "https://github.com/Mcxiaocaibug/easy-cloudflare-DNS",
      note: "Edge service",
    },
  ];

  const stackGroups = [
    {
      label: "Language",
      items: ["Rust", "TypeScript", "JavaScript", "Java", "Python", "Go"],
    },
    {
      label: "Web",
      items: ["Next.js", "React", "Spring Boot", "FastAPI", "Tailwind CSS"],
    },
    {
      label: "Data & Edge",
      items: [
        "PostgreSQL",
        "Redis",
        "Docker",
        "Cloudflare",
        "Supabase",
        "Linux",
      ],
    },
  ];

  const nowItems = [
    {
      label: "LEARNING",
      title: "Advanced Rust & WebAssembly",
      description: "继续靠近更可靠、更高效的系统与工具。",
    },
    {
      label: "BUILDING",
      title: "Full-stack & Open Source",
      description: "从浏览器到边缘网络，做能被真正使用的东西。",
    },
    {
      label: "PLAYING",
      title: "Minecraft",
      description: "在方块世界里造建筑，也寻找下一次灵感。",
    },
  ];

  const marqueeItems = [
    "Full-stack Development",
    "Open Source",
    "Rust & WebAssembly",
    "Edge Networks",
    "Quiet & Durable",
    "Minecraft Craft",
  ];
</script>

<div class="site-shell" id="top">
  <a class="skip-link" href="#main-content">跳到主要内容</a>
  <header class="site-header" class:header-dark={headerDark}>
    <div class="header-inner">
      <a class="brand" href="#top" aria-label="Mcxiaocaibug，返回顶部"
        ><span class="brand-symbol">m<span>↗</span></span><span
          >mcxiaocaibug<span class="brand-period">.</span></span
        ></a
      >
      <nav class="nav-links" aria-label="主要导航">
        {#each navItems as item}
          <a
            href="#{item.id}"
            class:active={activeSection === item.id}
            aria-current={activeSection === item.id ? "location" : undefined}
            >{item.label}<span></span></a
          >
        {/each}
      </nav>
      <a
        class="header-github"
        href="https://github.com/Mcxiaocaibug"
        target="_blank"
        rel="noreferrer">Let's build <ArrowSwap glyph="↗" /></a
      >
    </div>
    <div class="reading-progress" aria-hidden="true"></div>
  </header>

  <main id="main-content">
    <section class="hero" bind:this={hero} aria-labelledby="hero-title">
      <CosmicScene paused={motionPaused} />
      <div class="hero-fine-grid" aria-hidden="true"></div>
      <div class="hero-inner page-width">
        <div class="hero-copy">
          <p class="eyebrow hero-enter" style="--enter-delay: 80ms">
            <span class="status-dot"></span> INDEPENDENT DEVELOPER & DIGITAL CRAFTSMAN
          </p>
          <h1 id="hero-title">
            <span class="mask-line" style="--enter-delay: 180ms"
              ><span class="mask-line-inner">写代码，</span></span
            >
            <span class="mask-line" style="--enter-delay: 340ms"
              ><span class="mask-line-inner"
                >也写<span class="hero-title-accent">风与月</span>。</span
              ></span
            >
          </h1>
          <p class="hero-intro hero-enter" style="--enter-delay: 520ms">
            你好，我是 <strong>Mcxiaocaibug</strong>。<br />一名 <WordRotator
              paused={motionPaused}
              words={["全栈开发者", "开源爱好者", "Minecraft 玩家"]}
            />，<br />用一点理性，一点浪漫，构建触手可及的世界。
          </p>
          <div class="hero-actions hero-enter" style="--enter-delay: 660ms">
            <a class="primary-link" href="#work"
              >探索我的作品 <span><ArrowSwap glyph="↗" /></span></a
            >
            <a class="hero-secondary" href="#about"
              >关于我 <ArrowSwap glyph="↓" direction="down" /></a
            >
          </div>
        </div>
        <div
          class="moon-caption hero-enter"
          style="--enter-delay: 900ms"
          aria-hidden="true"
        >
          <span class="caption-cross">+</span><span
            >THE QUIET SIDE OF CREATIVITY<small>想象力，正在轨道上。</small
            ></span
          >
        </div>
        <div
          class="orbital-note hero-enter"
          style="--enter-delay: 1000ms"
          aria-hidden="true"
        >
          <span>01 / FIELD NOTES</span><code
            >logic <i>×</i> poetry<br />= <b>possibilities.</b><span
              class="note-cursor"
            ></span></code
          >
          <div><span class="status-dot"></span> ALWAYS EXPLORING</div>
        </div>
      </div>
      <div
        class="hero-bottom page-width hero-enter"
        style="--enter-delay: 1000ms"
      >
        <p>BASED IN CHINA <span>·</span> CREATING EVERYWHERE</p>
        <a href="#about" class="scroll-cue"
          ><span>SCROLL TO EXPLORE</span><i></i><b>↓</b></a
        >
        <div class="hero-tools">
          <button
            class="motion-toggle"
            onclick={() => (motionPaused = !motionPaused)}
            aria-pressed={motionPaused}
            aria-label={motionPaused ? "继续页面动效" : "暂停页面动效"}
            ><span aria-hidden="true">{motionPaused ? "▷" : "Ⅱ"}</span
            >{motionPaused ? "继续动效" : "暂停动效"}</button
          >
          <p class="hero-edition">PERSONAL PORTFOLIO <span>© 2026</span></p>
        </div>
      </div>
      <div class="hero-dawn" aria-hidden="true"></div>
    </section>

    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">
        {#each [0, 1] as copy}<div class="marquee-copy">
            {#each marqueeItems as item}<span class="marquee-star">✳</span><span
                >{item}</span
              >{/each}
          </div>{/each}
      </div>
    </div>

    <section
      class="section about-section page-width"
      id="about"
      aria-labelledby="about-title"
    >
      <Reveal class="section-label"
        ><span class="section-number">01 /</span>
        <p>ABOUT ME</p>
        <span class="section-label-cn">关于</span></Reveal
      >
      <div class="about-content">
        <Reveal variant="rotate"
          ><h2 id="about-title">
            在逻辑与留白之间，<br />做一些<span class="serif-accent"
              >有用，也有温度</span
            >的东西。
          </h2></Reveal
        >
        <div class="about-grid">
          <Reveal delay={100}
            ><p>
              我的兴趣从网页延伸到服务器与边缘网络，也从全栈开发走进 Rust 和
              WebAssembly。工具会变化，但我始终在意同一件事：<strong
                >让技术退后一步，让体验自然发生。</strong
              >
            </p></Reveal
          ><Reveal delay={180}
            ><p>
              游戏之外，我也为 Minecraft
              做工具。建筑、投影、服务器——方块世界里的秩序与创造，常常也是现实项目的灵感来源。
            </p></Reveal
          >
        </div>
        <Reveal delay={230}
          ><dl class="profile-facts">
            <div>
              <dt>01 / FOCUS</dt>
              <dd>Full-stack & Open Source</dd>
            </div>
            <div>
              <dt>02 / EXPLORING</dt>
              <dd>Rust · WASM · Edge</dd>
            </div>
            <div>
              <dt>03 / ELSEWHERE</dt>
              <dd>Minecraft & Digital Craft</dd>
            </div>
          </dl></Reveal
        >
      </div>
      <span class="about-asterisk" aria-hidden="true">✳</span>
    </section>

    <ScrollStory paused={motionPaused} />

    <section
      class="section work-section page-width"
      id="work"
      aria-labelledby="work-title"
    >
      <div class="section-heading">
        <div>
          <Reveal class="section-label"
            ><span class="section-number">02 /</span>
            <p>SELECTED WORK</p>
            <span class="section-label-cn">作品</span></Reveal
          ><Reveal delay={70}
            ><h2 id="work-title">
              一些想法，<br /><span class="serif-accent">已经有了形状。</span>
            </h2></Reveal
          >
        </div>
        <Reveal delay={120}
          ><p class="section-description">
            从界面到基础设施，从游戏到 AI。<br
            />不止写下代码，更让它们成为体验。<span
              >SELECTED PROJECTS / 01 — 04</span
            >
          </p></Reveal
        >
      </div>
      <div class="project-list">
        {#each projects as project, i (project.name)}
          <Reveal delay={(i % 2) * 100}>
            <a
              class="project-card project-{project.kind}"
              use:tilt={5}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              aria-label="{project.name}，在 GitHub 打开"
            >
              <div class="project-image">
                <ProjectVisual kind={project.kind} /><span class="project-open"
                  ><ArrowSwap glyph="↗" /></span
                ><span class="project-index">0{i + 1}</span>
              </div>
              <div class="project-info">
                <p class="project-category">{project.category}</p>
                <div class="project-title">
                  <h3>{project.name}</h3>
                  <span>↗</span>
                </div>
                <p class="project-description">{project.description}</p>
                <div class="project-meta">
                  <span>{project.stack}</span><span>{project.note}</span>
                </div>
              </div>
            </a>
          </Reveal>
        {/each}
      </div>
      <Reveal
        ><a
          class="all-projects"
          href="https://github.com/Mcxiaocaibug?tab=repositories"
          target="_blank"
          rel="noreferrer"
          ><span>还有更多，正在发生。</span><b
            >全部 GitHub 项目 <ArrowSwap glyph="↗" /></b
          ></a
        ></Reveal
      >
      <LiveActivity />
    </section>

    <section class="toolbox-wrap" id="stack" aria-labelledby="stack-title">
      <div class="section stack-section page-width">
        <Reveal class="section-label"
          ><span class="section-number">03 /</span>
          <p>THE TOOLBOX</p>
          <span class="section-label-cn">技术</span></Reveal
        >
        <div class="stack-content">
          <Reveal variant="rotate"
            ><h2 id="stack-title">
              工具不必喧哗，<br /><span class="serif-accent"
                >作品自会说话。</span
              >
            </h2>
            <p class="stack-description">
              根据问题选择技术，也喜欢理解它们为何这样工作。<br
              />从第一行代码，到最后一次部署。
            </p></Reveal
          >
          <div class="stack-groups">
            {#each stackGroups as group, i}<Reveal delay={i * 80}
                ><div class="stack-group">
                  <h3><span>0{i + 1}</span>{group.label}<span>↗</span></h3>
                  <ul>
                    {#each group.items as item}<li>{item}</li>{/each}
                  </ul>
                </div></Reveal
              >{/each}
          </div>
        </div>
        <span class="toolbox-watermark" aria-hidden="true">&#123; &#125;</span>
      </div>
    </section>

    <section
      class="section now-section page-width"
      id="now"
      aria-labelledby="now-title"
    >
      <Reveal class="section-label"
        ><span class="section-number">04 /</span>
        <p>IN THE MOMENT</p>
        <span class="section-label-cn">此刻</span></Reveal
      >
      <div class="now-content">
        <Reveal variant="rotate"
          ><p class="micro-label now-location">
            <span class="status-dot"></span> 2026 · CHINA · UTC+08
          </p>
          <h2 id="now-title">
            保持好奇，<br /><span class="serif-accent">慢慢把世界写清楚。</span>
          </h2></Reveal
        >
        <div class="now-list">
          {#each nowItems as item, i}<Reveal as="article" delay={i * 90}
              ><span class="now-icon" aria-hidden="true"
                >{["↗", "⌘", "✳"][i]}</span
              >
              <p>{item.label}</p>
              <h3>{item.title}</h3>
              <span class="now-description">{item.description}</span></Reveal
            >{/each}
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-orbit" aria-hidden="true"></div>
    <div class="page-width">
      <Reveal
        ><p class="footer-kicker">
          <span class="status-dot"></span> THE NEXT LINE IS WAITING.
        </p></Reveal
      ><Reveal variant="rotate"
        ><div class="footer-heading">
          <h2>下一行，<span>见。</span></h2>
          <a
            class="footer-cta"
            href="https://github.com/Mcxiaocaibug"
            target="_blank"
            rel="noreferrer"
            aria-label="在 GitHub 找到 Mcxiaocaibug"><ArrowSwap glyph="↗" /></a
          >
        </div></Reveal
      ><Reveal delay={120}
        ><div class="footer-caption">
          <p>清醒地创造，温柔地生活。</p>
          <a href="#top">回到起点 <ArrowSwap glyph="↑" /></a>
        </div></Reveal
      >
      <div class="footer-meta">
        <a class="brand" href="#top"
          >mcxiaocaibug<span class="brand-period">.</span></a
        >
        <p>© 2026 Mcxiaocaibug</p>
        <a
          href="https://github.com/subframe7536/maple-font"
          target="_blank"
          rel="noreferrer">TYPESET IN MAPLE MONO ↗</a
        ><span>MADE WITH CURIOSITY & CARE</span>
      </div>
    </div>
  </footer>
</div>
