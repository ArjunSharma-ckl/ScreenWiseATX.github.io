/* =========================================================
   ScreenWiseATX – Global App Script
   - Scroll reveal
   - Dark mode (persisted)
   - Language toggle (persisted)
   ========================================================= */

(() => {
  /* ---------- Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));

  /* ---------- Dark Mode ---------- */
  const darkToggle = document.getElementById("darkToggle");

  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  if (savedDarkMode) document.body.classList.add("dark");
  if (darkToggle) darkToggle.checked = savedDarkMode;

  if (darkToggle) {
    darkToggle.addEventListener("change", () => {
      const enabled = darkToggle.checked;
      document.body.classList.toggle("dark", enabled);
      localStorage.setItem("darkMode", enabled);
    });
  }

  /* ---------- Language Toggle ---------- */
  const langToggle = document.getElementById("langToggle");
  const savedLang = localStorage.getItem("lang") || "en";

  document.documentElement.lang = savedLang;

  const applyLanguage = (lang) => {
    document.querySelectorAll("[data-en]").forEach((el) => {
      el.textContent = lang === "es" ? el.dataset.es : el.dataset.en;
    });
  };

  applyLanguage(savedLang);

  if (langToggle) {
    langToggle.checked = savedLang === "es";

    langToggle.addEventListener("change", () => {
      const lang = langToggle.checked ? "es" : "en";
      localStorage.setItem("lang", lang);
      document.documentElement.lang = lang;
      applyLanguage(lang);
    });
  }
})();
