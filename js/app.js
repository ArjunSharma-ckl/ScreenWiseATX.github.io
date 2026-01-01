
(() => {
  // Dark mode toggle
  const darkToggle = document.getElementById("darkToggle");
  if(darkToggle){
    darkToggle.addEventListener("change", () => {
      document.body.classList.toggle("dark", darkToggle.checked);
    });
  }

  // Language toggle (simple)
  const langToggle = document.getElementById("langToggle");
  let lang = "en";
  if(langToggle){
    langToggle.addEventListener("change", () => {
      lang = langToggle.checked ? "es" : "en";
      document.querySelectorAll("[data-en]").forEach(el => {
        el.textContent = lang === "es" ? el.dataset.es : el.dataset.en;
      });
    });
  }
})();
