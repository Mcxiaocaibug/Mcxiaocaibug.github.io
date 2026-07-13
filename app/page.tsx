const projects = [
  {
    index: "01",
    name: "AzureDreamWebsite",
    description: "一座现代、流动的社区网站，把视觉表达与多页面体验放在同一片云端。",
    stack: "Next.js · JavaScript",
    href: "https://github.com/Mcxiaocaibug/AzureDreamWebsite",
    note: "345 stars",
  },
  {
    index: "02",
    name: "Neptunium Web",
    description: "为 Minecraft 基岩版玩家打造的投影文件管理系统，让建筑灵感更容易抵达游戏。",
    stack: "TypeScript · Supabase · R2",
    href: "https://github.com/Mcxiaocaibug/neptunium-web",
    note: "Minecraft tools",
  },
  {
    index: "03",
    name: "Switch LLM",
    description: "一个轻巧的 IronClaw WASM 扩展，在聊天面板里切换模型与推理后端。",
    stack: "Rust · WebAssembly",
    href: "https://github.com/Mcxiaocaibug/Switch-LLM",
    note: "WASM tool",
  },
  {
    index: "04",
    name: "六趣 DNS",
    description: "基于 Cloudflare API 的多服务商 DNS 管理系统，把繁杂的解析工作收进清晰界面。",
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
    items: ["PostgreSQL", "Redis", "Docker", "Cloudflare", "Supabase", "Linux"],
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

function ExternalArrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>

      <header className="site-header" id="top">
        <a className="brand" href="#top" aria-label="返回首页顶部">
          mcx<span>/</span>2026
        </a>

        <nav className="nav-links" aria-label="主要导航">
          <a href="#about">关于</a>
          <a href="#work">作品</a>
          <a href="#stack">技术</a>
          <a href="#now">近况</a>
        </nav>

        <a
          className="header-github"
          href="https://github.com/Mcxiaocaibug"
          target="_blank"
          rel="noreferrer"
        >
          GitHub <ExternalArrow />
        </a>
      </header>

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span aria-hidden="true" />
              FULL-STACK DEVELOPER · OPEN-SOURCE ENTHUSIAST
            </p>

            <h1 id="hero-title">
              写代码，
              <br />
              <em>也写风与月。</em>
            </h1>

            <p className="hero-intro">
              你好，我是 <strong>Mcxiaocaibug</strong>。
              <br />
              一名全栈开发者、开源爱好者，也是一位 Minecraft 玩家。
              喜欢把复杂的事物，做得安静、清楚、耐用。
            </p>

            <div className="hero-actions">
              <a className="primary-link" href="#work">
                看看我的作品 <span aria-hidden="true">↓</span>
              </a>
              <a
                className="text-link"
                href="https://github.com/Mcxiaocaibug"
                target="_blank"
                rel="noreferrer"
              >
                @Mcxiaocaibug <ExternalArrow />
              </a>
            </div>
          </div>

          <aside className="hero-visual" aria-label="一轮月与一则代码札记">
            <div className="moon" aria-hidden="true">
              <span className="moon-dot" />
              <span className="moon-line" />
            </div>

            <div className="code-note">
              <p>notes / 001</p>
              <code>
                <span>const</span>{" "}craft = &#123;
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

            <p className="vertical-poem" aria-hidden="true">
              清醒地创造
              <span>温柔地生活</span>
            </p>
          </aside>

          <p className="scroll-cue">
            SCROLL <span aria-hidden="true" /> 继续往下
          </p>
        </section>

        <section className="section about-section" id="about" aria-labelledby="about-title">
          <div className="section-label">
            <span>01</span>
            <p>ABOUT / 关于</p>
          </div>

          <div className="about-content">
            <h2 id="about-title">
              在逻辑与留白之间，
              <br />
              <span>做一些有用，也有温度的东西。</span>
            </h2>

            <div className="about-grid">
              <p>
                我的兴趣从网页延伸到服务器与边缘网络，也从全栈开发走进 Rust
                和 WebAssembly。工具会变化，但我始终在意同一件事：让技术退后一步，让体验自然发生。
              </p>
              <p>
                游戏之外，我也为 Minecraft 做工具。建筑、投影、服务器——方块世界里的秩序与创造，
                常常也是现实项目的灵感来源。
              </p>
            </div>

            <dl className="profile-facts">
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
          </div>
        </section>

        <section className="section work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div className="section-label">
              <span>02</span>
              <p>SELECTED WORK / 作品</p>
            </div>
            <div>
              <h2 id="work-title">最近写下的几行代码</h2>
              <p>从界面、基础设施，到游戏与 AI 工具。</p>
            </div>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <a
                className="project-row"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                key={project.name}
                aria-label={`${project.name}，在 GitHub 打开`}
              >
                <span className="project-index">{project.index}</span>
                <div className="project-name">
                  <h3>{project.name}</h3>
                  <span>{project.note}</span>
                </div>
                <p>{project.description}</p>
                <span className="project-stack">{project.stack}</span>
                <span className="project-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>

          <a
            className="all-projects-link"
            href="https://github.com/Mcxiaocaibug?tab=repositories"
            target="_blank"
            rel="noreferrer"
          >
            浏览全部公开仓库 <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section className="section stack-section" id="stack" aria-labelledby="stack-title">
          <div className="section-label">
            <span>03</span>
            <p>TOOLBOX / 技术</p>
          </div>

          <div className="stack-content">
            <div className="stack-intro">
              <h2 id="stack-title">工具不必喧哗，作品自会说话。</h2>
              <p>
                我根据问题选择技术，也喜欢理解它们为何这样工作。下面是我经常使用与持续学习的一部分。
              </p>
            </div>

            <div className="stack-groups">
              {stackGroups.map((group) => (
                <div className="stack-group" key={group.label}>
                  <h3>{group.label}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section now-section" id="now" aria-labelledby="now-title">
          <div className="section-label">
            <span>04</span>
            <p>NOW / 此刻</p>
          </div>

          <div className="now-content">
            <div className="now-heading">
              <p>2026 · CHINA · UTC+08</p>
              <h2 id="now-title">
                保持好奇，
                <br />
                <span>慢慢把世界写清楚。</span>
              </h2>
            </div>

            <div className="now-list">
              {nowItems.map((item) => (
                <article key={item.label}>
                  <p>{item.label}</p>
                  <h3>{item.title}</h3>
                  <span>{item.description}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <p className="footer-kicker">THE NEXT LINE IS WAITING.</p>
          <h2>下一行，见。</h2>
        </div>
        <div className="footer-links">
          <a
            href="https://github.com/Mcxiaocaibug"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ExternalArrow />
          </a>
          <a href="#top">回到顶部 ↑</a>
        </div>
        <div className="footer-meta">
          <p>© 2026 Mcxiaocaibug</p>
          <p>
            Typeset in{" "}
            <a
              href="https://github.com/subframe7536/maple-font"
              target="_blank"
              rel="noreferrer"
            >
              Maple Mono
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
