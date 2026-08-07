<script lang="ts">
  // Arrow that rolls out diagonally (or straight down) on hover while its twin
  // slides in to replace it — the WebBridge CTA arrow pattern. The motion is
  // pure CSS driven by the parent anchor's :hover; this component only renders
  // the two stacked glyphs.
  type Props = {
    glyph?: string;
    direction?: "diagonal" | "down";
  };

  let { glyph = "↗", direction = "diagonal" }: Props = $props();
</script>

<span class="arrow-swap" data-direction={direction} aria-hidden="true">
  <span>{glyph}</span>
  <span>{glyph}</span>
</span>
