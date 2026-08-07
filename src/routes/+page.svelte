<script lang="ts">
  import recentWork from "$lib/recent-work.json";
  import ArrowSwap from "$lib/ArrowSwap.svelte";
  import Reveal from "$lib/Reveal.svelte";
  import WordRotator from "$lib/WordRotator.svelte";

  const projects = [
    {
      index: "01",
      name: "AzureDreamWebsite",
      description:
        "一座现代、流动的社区网站，把视觉表达与多页面体验放在同一片云端。",
      stack: "Next.js · JavaScript",
      href: "https://github.com/Mcxiaocaibug/AzureDreamWebsite",
      note: "345 stars",
    },
    {
      index: "02",
      name: "Neptunium Web",
      description:
        "为 Minecraft 基岩版玩家打造的投影文件管理系统，让建筑灵感更容易抵达游戏。",
      stack: "TypeScript · Supabase · R2",
      href: "https://github.com/Mcxiaocaibug/neptunium-web",
      note: "Minecraft tools",
    },
    {
      index: "03",
      name: "Switch LLM",
      description:
        "一个轻巧的 IronClaw WASM 扩展，在聊天面板里切换模型与推理后端。",
      stack: "Rust · WebAssembly",
      href: "https://github.com/Mcxiaocaibug/Switch-LLM",
      note: "WASM tool",
    },
    {
      index: "04",
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

<div class="site-shell">
  <a class="skip-link" href="#main-content">跳到主要内容</a>

  <header class="site-header" id="top">
    <a class="brand" href="#top" aria-label="返回首页顶部">mcx<span>/</span>2026</a>

    <nav class="nav-links" aria-label="主要导航">
      <a href="#about">关于</a>
      <a href="#work">作品</a>
      <a href="#stack">技术</a>
      <a href="#now">近况</a>
    </nav>

    <a
      class="header-github"
      href="https://github.com/Mcxiaocaibug"
      target="_blank"
      rel="noreferrer"
    >
      GitHub <ArrowSwap glyph="↗" />
    </a>
  </header>

  <main id="main-content">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow hero-enter" style="--enter-delay: 0ms">
          <span aria-hidden="true"></span>
          FULL-STACK DEVELOPER · OPEN-SOURCE ENTHUSIAST
        </p>

        <h1 id="hero-title">
          <span class="mask-line" style="--enter-delay: 120ms">
            <span class="mask-line-inner">写代码，</span>
          </span>
          <span class="mask-line" style="--enter-delay: 260ms">
            <span class="mask-line-inner"><em>也写风与月。</em></span>
          </span>
        </h1>

        <p class="hero-intro hero-enter" style="--enter-delay: 420ms">
          你好，我是 <strong>Mcxiaocaibug</strong>。
          <br />
          一名
          <WordRotator words={["全栈开发者", "开源爱好者", "Minecraft 玩家"]} />
          。
          <br />
          喜欢把复杂的事物，做得安静、清楚、耐用。
        </p>

        <div class="hero-actions hero-enter" style="--enter-delay: 560ms">
          <a class="primary-link" href="#work">
            看看我的作品 <ArrowSwap glyph="↓" direction="down" />
          </a>
          <a
            class="text-link"
            href="https://github.com/Mcxiaocaibug"
            target="_blank"
            rel="noreferrer"
          >
            @Mcxiaocaibug <ArrowSwap glyph="↗" />
          </a>
        </div>
      </div>

      <aside
        class="hero-visual hero-enter"
        aria-label="一轮月与一则代码札记"
        style="--enter-delay: 240ms"
      >
        <span class="hero-star" aria-hidden="true"></span>
        <span class="hero-star" aria-hidden="true"></span>
        <span class="hero-star" aria-hidden="true"></span>
        <span class="hero-star" aria-hidden="true"></span>
        <span class="hero-star" aria-hidden="true"></span>

        <div class="moon" aria-hidden="true">
          <span class="moon-dot"></span>
          <span class="moon-line"></span>
        </div>

        <div class="code-note">
          <p>notes / 001</p>
          <code>
            <span>const</span> craft = &#123;
            <br />
            &nbsp;&nbsp;logic: <i>&quot;clear&quot;</i>,
            <br />
            &nbsp;&nbsp;detail: <i>&quot;quiet&quot;</i>,
            <br />
            &nbsp;&nbsp;heart: <i>&quot;warm&quot;</i>
            <br />
            &#125;;
          </code>
        </div>

        <p class="vertical-poem hero-enter" aria-hidden="true" style="--enter-delay: 700ms">
          清醒地创造
          <span>温柔地生活</span>
        </p>
      </aside>

      <p class="scroll-cue hero-enter" style="--enter-delay: 860ms">
        SCROLL <span aria-hidden="true"></span> 继续往下
      </p>
    </section>

    <div class="marquee" aria-hidden="true">
      <Reveal variant="fade">
        <div class="marquee-track">
          {#each [0, 1] as copy (copy)}
            <div class="marquee-copy">
              {#each marqueeItems as item (item)}
                <span class="marquee-dot"></span>
                <span>{item}</span>
              {/each}
              <span class="marquee-dot"></span>
            </div>
          {/each}
        </div>
      </Reveal>
    </div>

    <section class="section about-section" id="about" aria-labelledby="about-title">
      <Reveal class="section-label">
        <span>01</span>
        <p>ABOUT / 关于</p>
      </Reveal>

      <div class="about-content">
        <Reveal delay={60} variant="rotate">
          <h2 id="about-title">
            在逻辑与留白之间，
            <br />
            <span>做一些有用，也有温度的东西。</span>
          </h2>
        </Reveal>

        <div class="about-grid">
          <Reveal delay={140}>
            <p>
              我的兴趣从网页延伸到服务器与边缘网络，也从全栈开发走进 Rust
              和 WebAssembly。工具会变化，但我始终在意同一件事：让技术退后一步，让体验自然发生。
            </p>
          </Reveal>
          <Reveal delay={230}>
            <p>
              游戏之外，我也为 Minecraft 做工具。建筑、投影、服务器——方块世界里的秩序与创造，
              常常也是现实项目的灵感来源。
            </p>
          </Reveal>
        </div>

        <Reveal delay={320}>
          <dl class="profile-facts">
            <div>
              <dt>FOCUS</dt>
              <dd>Full-stack / Open Source</dd>
            </div>
            <div>
              <dt>EXPLORING</dt>
              <dd>Rust / WASM / Edge</dd>
            </div>
            <div>
              <dt>ELSEWHERE</dt>
              <dd>Minecraft / Digital Craft</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>

    <section class="section work-section" id="work" aria-labelledby="work-title">
      <div class="section-heading">
        <Reveal class="section-label">
          <span>02</span>
          <p>SELECTED WORK / 作品</p>
        </Reveal>
        <Reveal delay={80} variant="rotate">
          <div>
            <h2 id="work-title">最近写下的几行代码</h2>
            <p>从界面、基础设施，到游戏与 AI 工具。</p>
          </div>
        </Reveal>
      </div>

      <div class="project-list">
        {#each projects as project, i (project.name)}
          <Reveal delay={i * 90}>
            <a
              class="project-row"
              href={project.href}
              target="_blank"
              rel="noreferrer"
              aria-label="{project.name}，在 GitHub 打开"
            >
              <span class="project-index">{project.index}</span>
              <div class="project-name">
                <h3>{project.name}</h3>
                <span>{project.note}</span>
              </div>
              <p>{project.description}</p>
              <span class="project-stack">{project.stack}</span>
              <span class="project-arrow">
                <ArrowSwap glyph="↗" />
              </span>
            </a>
          </Reveal>
        {/each}
      </div>

      <Reveal delay={200}>
        <a
          class="all-projects-link"
          href="https://github.com/Mcxiaocaibug?tab=repositories"
          target="_blank"
          rel="noreferrer"
        >
          浏览全部公开仓库 <ArrowSwap glyph="↗" />
        </a>
      </Reveal>

      <section class="recent-work" aria-labelledby="recent-work-title">
        <Reveal>
          <div class="recent-work-intro">
            <p class="live-label">
              <span aria-hidden="true"></span> LIVE LOG
            </p>
            <h3 id="recent-work-title">最近在写</h3>
            <p>
              每小时同步 GitHub 公开活动
              <br />
              UPDATED {recentWork.updatedAtLabel}
            </p>
          </div>
        </Reveal>

        <ol class="activity-list">
          {#each recentWork.items as item, i (`${item.dateTime}-${item.repo}-${item.url}`)}
            <Reveal as="li" delay={Math.min(i * 60, 420)}>
              <a href={item.url} target="_blank" rel="noreferrer">
                <time datetime={item.dateTime}>{item.time}</time>
                <span class="activity-action">{item.action}</span>
                <strong>{item.repo}</strong>
                <p>{item.title}</p>
                <span class="activity-arrow">
                  <ArrowSwap glyph="↗" />
                </span>
              </a>
            </Reveal>
          {/each}
        </ol>
      </section>
    </section>

    <section class="section stack-section" id="stack" aria-labelledby="stack-title">
      <Reveal class="section-label">
        <span>03</span>
        <p>TOOLBOX / 技术</p>
      </Reveal>

      <div class="stack-content">
        <Reveal delay={80} variant="rotate">
          <div class="stack-intro">
            <h2 id="stack-title">工具不必喧哗，作品自会说话。</h2>
            <p>
              我根据问题选择技术，也喜欢理解它们为何这样工作。下面是我经常使用与持续学习的一部分。
            </p>
          </div>
        </Reveal>

        <div class="stack-groups">
          {#each stackGroups as group, i (group.label)}
            <Reveal delay={i * 100}>
              <div class="stack-group">
                <h3>{group.label}</h3>
                <ul>
                  {#each group.items as item (item)}
                    <li>{item}</li>
                  {/each}
                </ul>
              </div>
            </Reveal>
          {/each}
        </div>
      </div>
    </section>

    <section class="section now-section" id="now" aria-labelledby="now-title">
      <Reveal class="section-label">
        <span>04</span>
        <p>NOW / 此刻</p>
      </Reveal>

      <div class="now-content">
        <Reveal delay={80} variant="rotate">
          <div class="now-heading">
            <p>2026 · CHINA · UTC+08</p>
            <h2 id="now-title">
              保持好奇，
              <br />
              <span>慢慢把世界写清楚。</span>
            </h2>
          </div>
        </Reveal>

        <div class="now-list">
          {#each nowItems as item, i (item.label)}
            <Reveal as="article" delay={i * 100}>
              <p>{item.label}</p>
              <h3>{item.title}</h3>
              <span>{item.description}</span>
            </Reveal>
          {/each}
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <Reveal variant="rotate">
      <div>
        <p class="footer-kicker">THE NEXT LINE IS WAITING.</p>
        <h2>下一行，见。</h2>
      </div>
    </Reveal>
    <Reveal delay={100}>
      <div class="footer-links">
        <a
          href="https://github.com/Mcxiaocaibug"
          target="_blank"
          rel="noreferrer"
        >
          GitHub <ArrowSwap glyph="↗" />
        </a>
        <a href="#top">回到顶部 ↑</a>
      </div>
    </Reveal>
    <Reveal delay={180}>
      <div class="footer-meta">
        <p>© 2026 Mcxiaocaibug</p>
        <p>
          Typeset in
          <a
            href="https://github.com/subframe7536/maple-font"
            target="_blank"
            rel="noreferrer">Maple Mono</a
          >
        </p>
      </div>
    </Reveal>
  </footer>
</div>
