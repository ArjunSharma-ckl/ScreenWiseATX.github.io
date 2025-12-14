import { animate, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@10.18.0/+esm";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* HERO PARALLAX */
if (!reduce) {
  scroll(
    animate(".hero", {
      transform: ["translateY(0px)", "translateY(-90px)"],
      opacity: [1, 0.85]
    }),
    { offset: ["start start", "end start"] }
  );
}

/* CARDS LIFT */
document.querySelectorAll(".card").forEach(card => {
  if (reduce) return;
  scroll(
    animate(card, {
      opacity: [0.6, 1],
      transform: ["translateY(40px) scale(0.95)", "translateY(0) scale(1)"]
    }),
    { offset: ["start 85%", "start 50%"] }
  );
});

/* LIST STAGGER */
document.querySelectorAll("ul").forEach(list => {
  if (reduce) return;
  const items = list.querySelectorAll("li");
  scroll(
    animate(items, {
      opacity: [0, 1],
      transform: ["translateY(14px)", "translateY(0)"]
    }, { delay: stagger(0.08) }),
    { offset: ["start 90%", "start 55%"] }
  );
});
