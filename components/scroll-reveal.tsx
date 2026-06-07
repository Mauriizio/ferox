"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = "[data-reveal]";

export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealElement = (element: HTMLElement) => {
      element.dataset.revealVisible = "true";
      element.classList.add("is-visible");
    };

    const revealNow = () => {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(revealElement);
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealNow();
      return;
    }

    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          revealElement(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
    );

    const observeElements = () => {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((element) => {
        if (element.dataset.revealVisible === "true") {
          return;
        }

        if (element.dataset.revealObserved !== "true") {
          element.dataset.revealObserved = "true";
          observer.observe(element);
        }
      });
    };

    const mutationObserver = new MutationObserver(observeElements);

    requestAnimationFrame(observeElements);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      revealNow();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
