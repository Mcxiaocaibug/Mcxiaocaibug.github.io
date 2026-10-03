<script lang="ts">
  let { kind, compact = false }: { kind: string; compact?: boolean } = $props();
</script>

<div class="project-art art-{kind}" class:compact aria-hidden="true">
  {#if kind === "azure"}
    <div class="art-orbit orbit-one"></div>
    <div class="art-orbit orbit-two"></div>
    <div class="mini-browser azure-browser">
      <div class="browser-bar">
        <span class="window-dots"><i></i><i></i><i></i></span><span
          >azuredream / community</span
        ><span>↗</span>
      </div>
      <div class="azure-content">
        <div class="azure-nav">
          <b>Azure<span>Dream</span></b><span>探索 · 社区 · 关于</span>
        </div>
        <small>A SPACE FOR EVERY DREAM</small><strong
          >每一个想法，<br />都有一片天空。</strong
        ><span class="mini-pill">探索无限可能 ↗</span>
        <div class="azure-landscape"><i></i><i></i><i></i></div>
      </div>
    </div>
    <span class="floating-label azure-label"
      ><i></i> imagination, connected.</span
    >
  {:else if kind === "neptunium"}
    <div class="block-grid"></div>
    <div class="voxel-scene">
      <div class="voxel voxel-a"></div>
      <div class="voxel voxel-b"></div>
      <div class="voxel voxel-c"></div>
      <div class="voxel voxel-d"></div>
      <div class="voxel voxel-e"></div>
      <div class="voxel voxel-f"></div>
    </div>
    <div class="neptunium-ui">
      <span class="n-logo">N.</span>
      <div><small>NEPTUNIUM</small><b>Build beyond blocks.</b></div>
      <span>↗</span>
    </div>
    <span class="floating-label voxel-label"
      >SCHEMATIC_001 <span>✓ synced</span></span
    >
  {:else if kind === "switch"}
    <div class="switch-orb"></div>
    <div class="switch-ring"></div>
    <div class="model-panel">
      <div class="model-head">
        <span>⌘ &nbsp; Switch LLM</span><span>•••</span>
      </div>
      <small>YOUR THINKING ENGINE</small><strong
        >One switch.<br />Infinite possibilities.</strong
      >
      <div class="model-option">
        <span class="model-icon">✳</span><span
          >Reasoning model<small>Deep thinking, clear answers</small></span
        ><i>●</i>
      </div>
      <div class="model-option">
        <span class="model-icon">↯</span><span
          >Fast model<small>Built for the flow</small></span
        ><i>○</i>
      </div>
      <div class="model-footer">
        <span>Rust × WebAssembly</span><b>CONNECTED</b>
      </div>
    </div>
  {:else}
    <div class="dns-network">
      <div class="network-ring"></div>
      <div class="network-ring"></div>
      <div class="network-ring"></div>
      <span class="network-node node-one"></span><span
        class="network-node node-two"
      ></span><span class="network-node node-three"></span><span
        class="network-center">六趣<span>DNS</span></span
      >
    </div>
    <div class="dns-record">
      <span><i></i> ALL SYSTEMS OPERATIONAL</span>
      <div><b>A</b><span>dream.example</span><em>Proxied ✓</em></div>
      <div><b>CNAME</b><span>www → dream</span><em>Active ✓</em></div>
    </div>
  {/if}
</div>
