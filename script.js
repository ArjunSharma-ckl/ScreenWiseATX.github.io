import { animate, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@10.18.0/+esm";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function parallax(selector, yTo, opTo, offsets) {
  if (reduce) return;
  const el = document.querySelector(selector);
  if (!el) return;
  scroll(
    animate(el, {
      transform: ["translateY(0px)", `translateY(${yTo}px)`],
      opacity: [1, opTo]
    }),
    { offset: offsets }
  );
}

// Vision-Pro-ish hero drift
parallax(".hero", -90, 0.86, ["start start", "end start"]);
parallax(".hero h1", -120, 0.65, ["start start", "end start"]);
parallax(".hero p", -70, 0.78, ["start start", "end start"]);

// Cards lift + scale as they enter viewport
document.querySelectorAll(".card").forEach((card) => {
  if (reduce) return;
  scroll(
    animate(card, {
      opacity: [0.65, 1],
      transform: ["translateY(44px) scale(0.96)", "translateY(0px) scale(1)"]
    }),
    { offset: ["start 88%", "start 52%"] }
  );
});

// Stagger list items (feels premium)
document.querySelectorAll("ul").forEach((list) => {
  if (reduce) return;
  const items = list.querySelectorAll("li");
  if (!items.length) return;
  scroll(
    animate(items, {
      opacity: [0, 1],
      transform: ["translateY(14px)", "translateY(0px)"]
    }, { delay: stagger(0.08) }),
    { offset: ["start 92%", "start 58%"] }
  );
});

// Soft panel glow entrance
document.querySelectorAll(".panel").forEach((p) => {
  if (reduce) return;
  scroll(
    animate(p, {
      opacity: [0.7, 1],
      transform: ["translateY(26px)", "translateY(0px)"]
    }),
    { offset: ["start 92%", "start 60%"] }
  );
});
