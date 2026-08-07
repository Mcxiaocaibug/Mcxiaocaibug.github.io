<script lang="ts">
  // Word rotator using the inline-grid stacking trick seen on the Kimi
  // WebBridge hero: each word occupies the same grid cell and transitions in
  // from below / out to above.
  type Props = {
    words: string[];
    interval?: number;
  };

  let { words, interval = 2600 }: Props = $props();

  let index = $state(0);
  let previous = $derived((index - 1 + words.length) % words.length);

  $effect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      index = (index + 1) % words.length;
    }, interval);

    return () => window.clearInterval(timer);
  });
</script>

<span class="rotator" aria-live="off">
  {#each words as word, i (word)}
    <span
      class="rotator-word"
      data-active={i === index ? "" : undefined}
      data-past={i === previous ? "" : undefined}
      aria-hidden={i === index ? undefined : true}>{word}</span
    >
  {/each}
</span>
