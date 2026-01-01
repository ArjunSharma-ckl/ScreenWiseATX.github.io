
(() => {
  document.getElementById("darkBtn")?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  let lang = "en";
  document.getElementById("langBtn")?.addEventListener("click", () => {
    lang = lang === "en" ? "es" : "en";
    document.querySelectorAll("[data-en]").forEach(el => {
      el.textContent = lang === "es" ? el.dataset.es : el.dataset.en;
    });
  });
})();
