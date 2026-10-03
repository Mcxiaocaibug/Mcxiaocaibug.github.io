<script lang="ts">
  import { onMount } from "svelte";
  import { clamp } from "$lib/motion";

  let { paused = false }: { paused?: boolean } = $props();
  let canvas: HTMLCanvasElement;
  let refresh: (() => void) | undefined;
  $effect(() => {
    void paused;
    refresh?.();
  });

  onMount(() => {
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    const ctx = context;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let last = 0;
    let elapsed = 0;
    let pointerX = 0;
    let pointerY = 0;
    let easedX = 0;
    let easedY = 0;
    let field: { x: number; y: number; size: number; phase: number }[] = [];
    let stars: {
      x: number;
      y: number;
      z: number;
      size: number;
      tone: number;
    }[] = [];

    // Deterministic terrain, generated once. No images, WebGL, or external assets.
    const texture = document.createElement("canvas");
    texture.width = texture.height = 680;
    const surface = texture.getContext("2d");
    let seed = 92107;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    if (surface) {
      const image = surface.createImageData(680, 680);
      for (let y = 0; y < 680; y++) {
        for (let x = 0; x < 680; x++) {
          const nx = (x - 340) / 340;
          const ny = (y - 340) / 340;
          const distance = nx * nx + ny * ny;
          const offset = (y * 680 + x) * 4;
          if (distance > 1) continue;
          const nz = Math.sqrt(1 - distance);
          const light = Math.max(0, -nx * 0.64 - ny * 0.42 + nz * 0.55);
          const terrain =
            Math.sin(nx * 13 + Math.sin(ny * 17)) * 9 +
            Math.cos(ny * 23 + nx * 8) * 6 +
            Math.sin(nx * 41 - ny * 36) * 4;
          const noise = (random() - 0.5) * 24;
          const tone = 24 + light * 174 + terrain + noise;
          image.data[offset] = clamp(tone + light * 21, 0, 255);
          image.data[offset + 1] = clamp(tone + light * 12, 0, 255);
          image.data[offset + 2] = clamp(tone + 12, 0, 255);
          image.data[offset + 3] = Math.min(255, (1 - distance) * 25000);
        }
      }
      surface.putImageData(image, 0, 0);
      surface.save();
      surface.beginPath();
      surface.arc(340, 340, 339, 0, Math.PI * 2);
      surface.clip();
      for (let i = 0; i < 105; i++) {
        const x = random() * 680;
        const y = random() * 680;
        const radius = random() * 18 + 3;
        const crater = surface.createRadialGradient(
          x - radius * 0.3,
          y - radius * 0.3,
          0,
          x,
          y,
          radius,
        );
        crater.addColorStop(0, "rgba(8, 16, 28, 0.24)");
        crater.addColorStop(0.68, "rgba(10, 18, 30, 0.12)");
        crater.addColorStop(0.84, "rgba(235, 227, 208, 0.13)");
        crater.addColorStop(1, "rgba(235, 227, 208, 0)");
        surface.fillStyle = crater;
        surface.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }
      surface.restore();
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from({ length: width < 700 ? 135 : 320 }, () => ({
        x: (random() - 0.5) * width * 2.5,
        y: (random() - 0.5) * height * 2.5,
        z: random() * 1.8 + 0.2,
        size: random() * 1.1 + 0.3,
        tone: random(),
      }));
      field = Array.from({ length: width < 700 ? 65 : 130 }, () => ({
        x: random() * width,
        y: random() * height,
        size: random() * 0.85 + 0.25,
        phase: random() * Math.PI * 2,
      }));
      draw(0);
    }

    function draw(dt: number) {
      if (!width || !height) return;
      elapsed += dt;
      easedX += (pointerX - easedX) * 0.045;
      easedY += (pointerY - easedY) * 0.045;
      ctx.clearRect(0, 0, width, height);
      const mobile = width < 700;
      const centerX = width * (mobile ? 0.65 : 0.72) + easedX * 18;
      const centerY = height * (mobile ? 0.31 : 0.44) + easedY * 12;

      for (const point of field) {
        const alpha = 0.13 + (Math.sin(elapsed * 0.7 + point.phase) + 1) * 0.11;
        ctx.fillStyle = `rgba(184,208,231,${alpha})`;
        ctx.beginPath();
        ctx.arc(
          point.x + easedX * 4,
          point.y + easedY * 3,
          point.size,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      for (const star of stars) {
        star.z -= dt * (0.075 + Math.max(0, 1 - elapsed / 3) * 0.16);
        if (star.z < 0.16) star.z = 2;
        const scale = 0.72 / star.z;
        const x = centerX + star.x * scale;
        const y = centerY + star.y * scale;
        if (x < -40 || x > width + 40 || y < -40 || y > height + 40) continue;
        const tail = reduced.matches ? 0 : (1 / star.z) * 0.032;
        const alpha = clamp((2 - star.z) * 0.42, 0.08, 0.76);
        ctx.strokeStyle =
          star.tone > 0.88
            ? `rgba(240,191,138,${alpha})`
            : `rgba(172,203,237,${alpha})`;
        ctx.lineWidth = star.size * Math.min(1.6, scale);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
          x + (x - centerX) * tail + 0.3,
          y + (y - centerY) * tail + 0.3,
        );
        ctx.stroke();
      }

      const radius = Math.min(
        width * (mobile ? 0.29 : 0.18),
        height * 0.28,
        270,
      );
      const moonY =
        centerY + (reduced.matches ? 0 : Math.sin(elapsed * 0.32) * 7);
      const glow = ctx.createRadialGradient(
        centerX,
        moonY,
        radius * 0.72,
        centerX,
        moonY,
        radius * 1.8,
      );
      glow.addColorStop(0, "rgba(79,117,173,0.03)");
      glow.addColorStop(0.55, "rgba(84,132,205,0.10)");
      glow.addColorStop(1, "rgba(54,102,188,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(
        centerX - radius * 2,
        moonY - radius * 2,
        radius * 4,
        radius * 4,
      );

      function orbit(back: boolean) {
        ctx.save();
        ctx.translate(centerX, moonY);
        ctx.rotate(-0.42);
        ctx.strokeStyle = back
          ? "rgba(166,198,227,0.10)"
          : "rgba(166,198,227,0.27)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          radius * 1.64,
          radius * 0.43,
          0,
          back ? Math.PI : 0,
          back ? Math.PI * 2 : Math.PI,
        );
        ctx.stroke();
        if (!back) {
          const angle = reduced.matches ? 0.62 : elapsed * 0.16 + 0.62;
          const satelliteX = Math.cos(angle) * radius * 1.64;
          const satelliteY = Math.sin(angle) * radius * 0.43;
          ctx.shadowColor = "#a4e9de";
          ctx.shadowBlur = 12;
          ctx.fillStyle = "#bcefe5";
          ctx.beginPath();
          ctx.arc(satelliteX, satelliteY, 3.1, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      orbit(true);
      ctx.drawImage(
        texture,
        centerX - radius,
        moonY - radius,
        radius * 2,
        radius * 2,
      );
      orbit(false);

      // A fine secondary orbit gives the scene depth without obscuring the copy.
      ctx.save();
      ctx.translate(centerX, moonY);
      ctx.rotate(0.7);
      ctx.strokeStyle = "rgba(163,196,234,0.08)";
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.46, radius * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    function tick(time: number) {
      frame = 0;
      const dt = last ? Math.min((time - last) / 1000, 0.045) : 0;
      last = time;
      draw(dt);
      if (visible && !document.hidden && !reduced.matches && !paused)
        frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (visible && !document.hidden) {
        if (reduced.matches || paused) draw(0);
        else frame = requestAnimationFrame(tick);
      }
    }
    const pointer = (event: PointerEvent) => {
      if (!fine.matches || reduced.matches || paused) return;
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(canvas);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pointermove", pointer, { passive: true });
    refresh = sync;
    resize();
    sync();
    return () => {
      refresh = undefined;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", pointer);
    };
  });
</script>

<div class="cosmic-scene" aria-hidden="true">
  <div class="cosmic-nebula"></div>
  <canvas bind:this={canvas}></canvas>
  <div class="cosmic-horizon"></div>
</div>

<style>
  .cosmic-scene {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .cosmic-nebula {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 76% 39%, #1b315552, transparent 48%),
      radial-gradient(ellipse at 18% 100%, #2e4d8955, transparent 55%),
      linear-gradient(160deg, #080d18 15%, #101a2c 63%, #22334b);
  }
  .cosmic-horizon {
    position: absolute;
    inset: 65% -20% -60%;
    background: radial-gradient(
      ellipse at 50% 80%,
      #98c8db66,
      #3c597837 45%,
      transparent 65%
    );
    filter: blur(45px);
  }
</style>
