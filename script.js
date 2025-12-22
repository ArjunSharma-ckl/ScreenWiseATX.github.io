import { animate, scroll } from "https://cdn.jsdelivr.net/npm/motion@10.18.0/+esm";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* CINEMATIC HERO DEPTH */
if (!reduce) {
  scroll(
    animate(".hero", {
      transform:["translateY(0) scale(1)","translateY(-90px) scale(.96)"],
      opacity:[1,.85]
    }),
    { offset:["start start","end start"] }
  );
}

/* PANEL LIFT + DEPTH */
document.querySelectorAll(".panel").forEach(panel=>{
  if(reduce)return;
  scroll(
    animate(panel,{
      opacity:[0,1],
      transform:["translateY(26px) scale(.96)","translateY(0) scale(1)"]
    },{duration:.26}),
    {offset:["start 92%","start 60%"]}
  );
});

/* CHIP MICRO INTERACTION */
document.querySelectorAll(".chip").forEach(chip=>{
  chip.addEventListener("mouseenter",()=>{
    if(reduce)return;
    animate(chip,{scale:[1,1.05]},{duration:.12});
  });
  chip.addEventListener("mouseleave",()=>{
    if(reduce)return;
    animate(chip,{scale:1},{duration:.12});
  });
});
