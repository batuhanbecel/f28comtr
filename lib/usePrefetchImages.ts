"use client";

import { useEffect } from "react";

/** Prefetch adjacent image URLs while browsing a gallery lightbox. */
export function usePrefetchImages(
  sources: readonly string[],
  activeIndex: number | null,
  radius = 1
) {
  useEffect(() => {
    if (activeIndex === null) return;

    const links: HTMLLinkElement[] = [];

    for (let offset = 1; offset <= radius; offset++) {
      for (const i of [activeIndex - offset, activeIndex + offset]) {
        if (i < 0 || i >= sources.length) continue;
        const href = sources[i];
        if (!href) continue;
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.as = "image";
        link.href = href;
        document.head.appendChild(link);
        links.push(link);
      }
    }

    return () => {
      links.forEach((link) => link.remove());
    };
  }, [activeIndex, sources, radius]);
}
