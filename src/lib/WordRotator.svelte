<script lang="ts">
  // Word rotator using the inline-grid stacking trick seen on the Kimi
  // WebBridge hero: each word occupies the same grid cell and transitions in
  // from below / out to above.
  type Props = {
    words: string[];
    interval?: number;
    paused?: boolean;
  };

  let { words, interval = 2600, paused = false }: Props = $props();

  let index = $state(0);
  let previous = $derived((index - 1 + words.length) % words.length);

  $effect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    function sync() {
      window.clearInterval(timer);
      if (media.matches || paused || document.hidden || words.length < 2)
        return;
      timer = window.setInterval(() => {
        index = (index + 1) % words.length;
      }, interval);
    }
    void paused;
    sync();
    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearInterval(timer);
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
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
