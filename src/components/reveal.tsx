"use client";

import { useLayoutEffect } from "react";

const blocks = ".section, .band, .site-footer";

export function Reveal() {
  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const root = document.documentElement;
    root.classList.add("motion");

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(blocks));
    const pending = nodes.filter((node) => {
      const rect = node.getBoundingClientRect();
      const seen = rect.top < window.innerHeight - 64 && rect.bottom > 0;
      if (seen) node.classList.add("is-in");
      return !seen;
    });

    if (pending.length === 0) {
      return () => root.classList.remove("motion");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -64px 0px", threshold: 0 },
    );

    pending.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
      root.classList.remove("motion");
    };
  }, []);

  return null;
}
