
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add("show");
  });
},{threshold:.15});

document.querySelectorAll(".fade").forEach(el=>obs.observe(el));
