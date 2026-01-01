
(() => {
  const darkBtn = document.getElementById("darkBtn");
  const langBtn = document.getElementById("langBtn");

  // DARK MODE
  darkBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  // LANGUAGE (simple demo)
  let lang = "en";
  langBtn.addEventListener("click", () => {
    lang = lang === "en" ? "es" : "en";
    document.querySelectorAll("[data-en]").forEach(el => {
      el.textContent = lang === "es" ? el.dataset.es : el.dataset.en;
    });
  });
})();
