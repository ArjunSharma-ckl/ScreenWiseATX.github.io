// Motion (motion.dev) ESM import via jsDelivr
// Source: Motion quick start (script tag + esm). https://motion.dev/docs/quick-start
import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

function safeAnimate(target, keyframes, options) {
  if (reduce) return;
  return animate(target, keyframes, options);
}

function runPageAnimations() {
  // Hero entrance
  safeAnimate(".kicker", { opacity: [0, 1], y: [10, 0] }, { duration: 0.5 });
  safeAnimate(".h1", { opacity: [0, 1], y: [14, 0] }, { duration: 0.65, delay: 0.05 });
  safeAnimate(".sub", { opacity: [0, 1], y: [10, 0] }, { duration: 0.6, delay: 0.12 });

  // Panels + cards reveal on scroll
  inView(".reveal", (el) => {
    safeAnimate(el, { opacity: [0, 1], y: [12, 0] }, { duration: 0.6, easing: "ease-out" });
  });

  // Stagger cards inside any grid
  inView(".grid", (grid) => {
    const items = grid.querySelectorAll(".card, .panel");
    if (!items.length) return;
    safeAnimate(items, { opacity: [0, 1], y: [10, 0] }, { delay: stagger(0.06), duration: 0.55 });
  });
}

document.addEventListener("DOMContentLoaded", runPageAnimations);
