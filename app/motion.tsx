"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

// Motion system modeled on kimi.com/features/webbridge. What we take from
// that page:
//  - an expo-out easing (cubic-bezier(0.16, 1, 0.3, 1)) with a fast attack
//    and a long, soft landing;
//  - scroll reveals that rise ~30px over ~0.9s, plus a variant that also
//    turns 1.5deg from the bottom-left corner over ~1.05s;
//  - link arrows that roll out on hover while a twin slides in;
//  - everything quiet, slow, and respectful of prefers-reduced-motion.
// No external animation library needed.

type RevealVariant = "rise" | "rotate" | "fade";

type RevealProps = {
  as?: ElementType;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  children: ReactNode;
};

export function Reveal({
  as,
  className,
  delay = 0,
  variant = "rise",
  children,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
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
  }, []);

  const classes = ["reveal", `reveal-${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={ref}
      className={classes}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

// Arrow that rolls out diagonally (or straight down) on hover while its twin
// slides in to replace it — the WebBridge CTA arrow pattern. The motion is
// pure CSS driven by the parent anchor's :hover; this component only renders
// the two stacked glyphs.
export function ArrowSwap({
  glyph = "↗",
  direction = "diagonal",
}: {
  glyph?: string;
  direction?: "diagonal" | "down";
}) {
  return (
    <span className="arrow-swap" data-direction={direction} aria-hidden="true">
      <span>{glyph}</span>
      <span>{glyph}</span>
    </span>
  );
}

// Word rotator using the same inline-grid stacking trick seen on the Kimi
// WebBridge hero: each word occupies the same grid cell and transitions in
// from below / out to above.
export function WordRotator({
  words,
  interval = 2600,
}: {
  words: string[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [words.length, interval]);

  const previous = (index - 1 + words.length) % words.length;

  return (
    <span className="rotator" aria-live="off">
      {words.map((word, i) => (
        <span
          key={word}
          className="rotator-word"
          data-active={i === index ? "" : undefined}
          data-past={i === previous ? "" : undefined}
          aria-hidden={i === index ? undefined : true}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
