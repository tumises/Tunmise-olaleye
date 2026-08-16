(() => {
  "use strict";

  /* ---------- theme toggle ---------- */
  const THEME_KEY = "tunmise-theme";
  const themeButtons = document.querySelectorAll(".theme-toggle-opt");

  function applyTheme(theme) {
    if (theme === "black") document.documentElement.setAttribute("data-theme", "black");
    else document.documentElement.removeAttribute("data-theme");
    themeButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.themeValue === theme);
    });
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.themeValue;
      localStorage.setItem(THEME_KEY, theme);
      applyTheme(theme);
    });
  });

  applyTheme(localStorage.getItem(THEME_KEY) || "red");

  /* ---------- mobile nav ---------- */
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  function setNavOpen(open) {
    mobileMenu.classList.toggle("is-open", open);
    navToggle.textContent = open ? "CLOSE" : "MENU";
    navToggle.setAttribute("aria-expanded", String(open));
  }

  navToggle.addEventListener("click", () => {
    setNavOpen(!mobileMenu.classList.contains("is-open"));
  });
  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setNavOpen(false));
  });
  window.matchMedia("(min-width:1181px)").addEventListener("change", (e) => {
    if (e.matches) setNavOpen(false);
  });

  /* ---------- magnetic buttons ---------- */
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.22;
      const y = (e.clientY - r.top - r.height / 2) * 0.32;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0,0)";
    });
  });

  /* ---------- scroll reveal ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

  /* ---------- animated counters ---------- */
  const heroStats = document.getElementById("heroStats");
  let countersStarted = false;

  function startCounters() {
    countersStarted = true;
    const counters = document.querySelectorAll("[data-counter]");
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      counters.forEach((el) => {
        const target = Number(el.dataset.target);
        const suffix = el.dataset.suffix || "";
        const value = Number.isInteger(target) ? Math.round(target * ease) : (target * ease).toFixed(1);
        el.textContent = value + suffix;
      });
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersStarted) {
          startCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(heroStats);
  }

  /* ---------- hero parallax ---------- */
  const heroVisual = document.getElementById("heroVisual");
  if (heroVisual) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      heroVisual.style.transform = `translateY(${Math.min(y * 0.06, 40)}px)`;
    }, { passive: true });
  }

  /* ---------- raw vs final slider ---------- */
  const compareRange = document.getElementById("compareRange");
  const compareFinal = document.getElementById("compareFinal");
  const compareLine = document.getElementById("compareLine");
  const compareHandle = document.getElementById("compareHandle");

  function updateCompare(val) {
    compareFinal.style.clipPath = `inset(0 0 0 ${val}%)`;
    compareLine.style.left = `${val}%`;
    compareHandle.style.left = `${val}%`;
  }
  if (compareRange) {
    compareRange.addEventListener("input", (e) => updateCompare(e.target.value));
  }

  /* ---------- contact form ---------- */
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      contactForm.hidden = true;
      formSuccess.hidden = false;
    });
  }
})();
