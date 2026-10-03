/** Small, dependency-free motion primitives. No wheel interception or scroll hijacking. */
export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
export const smoothstep = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};

export function tilt(node: HTMLElement, strength = 5) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  let frame = 0;
  let x = 0.5;
  let y = 0.5;
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
    node.style.setProperty("--spot-x", "50%");
    node.style.setProperty("--spot-y", "50%");
  };
  const update = () => {
    frame = 0;
    node.style.setProperty("--tilt-x", `${(0.5 - y) * strength}deg`);
    node.style.setProperty("--tilt-y", `${(x - 0.5) * strength}deg`);
    node.style.setProperty("--spot-x", `${x * 100}%`);
    node.style.setProperty("--spot-y", `${y * 100}%`);
  };
  const move = (event: PointerEvent) => {
    if (media.matches || !fine.matches) return;
    const rect = node.getBoundingClientRect();
    x = clamp((event.clientX - rect.left) / rect.width);
    y = clamp((event.clientY - rect.top) / rect.height);
    if (!frame) frame = requestAnimationFrame(update);
  };
  node.addEventListener("pointermove", move);
  node.addEventListener("pointerleave", reset);
  media.addEventListener("change", reset);
  return {
    destroy() {
      reset();
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", reset);
      media.removeEventListener("change", reset);
    },
  };
}
