<script lang="ts">
  import type { Snippet } from "svelte";

  // Scroll-triggered reveal modeled on the Kimi WebBridge page pattern:
  // elements start slightly below/transparent and ease into place once they
  // enter the viewport. "rotate" adds the WebBridge 1.5deg turn from the
  // bottom-left corner; "fade" only crossfades. Respects reduced motion.
  type Props = {
    as?: string;
    class?: string;
    delay?: number;
    variant?: "rise" | "rotate" | "fade";
    children: Snippet;
  };

  let {
    as = "div",
    class: className = "",
    delay = 0,
    variant = "rise",
    children,
  }: Props = $props();

  let node: HTMLElement | undefined = $state();

  $effect(() => {
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      node.setAttribute("data-visible", "true");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  });
</script>

<svelte:element
  this={as}
  bind:this={node}
  class={["reveal", `reveal-${variant}`, className].filter(Boolean).join(" ")}
  style="--reveal-delay: {delay}ms"
>
  {@render children()}
</svelte:element>
