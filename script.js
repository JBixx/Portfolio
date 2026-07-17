/* Portfolio interactions: theme, menu, reveal, newsletter */
(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  var navOverlay = document.getElementById("nav-overlay");
  var themeToggle = document.getElementById("theme-toggle");
  var backTop = document.getElementById("back-top");
  var newsletterForm = document.getElementById("newsletter-form");
  var newsletterMsg = document.getElementById("newsletter-msg");

  function isDark() {
    return root.getAttribute("data-theme") === "dark";
  }

  function setTheme(mode) {
    if (mode === "dark") {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      if (themeToggle) themeToggle.setAttribute("aria-label", "Activer le mode clair");
    } else {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      if (themeToggle) themeToggle.setAttribute("aria-label", "Activer le mode sombre");
    }
  }

  function closeMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Ouvrir le menu");
    navLinks.classList.remove("is-open");
    if (navOverlay) {
      navOverlay.classList.remove("is-open");
      navOverlay.hidden = true;
    }
    body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Fermer le menu");
    navLinks.classList.add("is-open");
    if (navOverlay) {
      navOverlay.hidden = false;
      navOverlay.classList.add("is-open");
    }
    body.classList.add("menu-open");
  }

  if (themeToggle) {
    if (isDark()) themeToggle.setAttribute("aria-label", "Activer le mode clair");
    themeToggle.addEventListener("click", function () {
      setTheme(isDark() ? "light" : "dark");
    });
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      if (navToggle.getAttribute("aria-expanded") === "true") closeMenu();
      else openMenu();
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", closeMenu);
  }

  if (navLinks) {
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // Scroll reveal + skill bars
  var revealEls = document.querySelectorAll(".reveal");
  var bars = document.querySelectorAll(".bar span[data-width]");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });

    var barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var bar = entry.target;
          bar.style.width = bar.getAttribute("data-width") || "0%";
          barObserver.unobserve(bar);
        });
      },
      { threshold: 0.4 }
    );

    bars.forEach(function (bar) {
      barObserver.observe(bar);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
    bars.forEach(function (bar) {
      bar.style.width = bar.getAttribute("data-width") || "0%";
    });
  }

  // Back to top
  if (backTop) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 380) backTop.classList.add("is-visible");
        else backTop.classList.remove("is-visible");
      },
      { passive: true }
    );
  }

  // Newsletter (front-end only)
  if (newsletterForm && newsletterMsg) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("newsletter-email");
      var email = input ? input.value.trim() : "";
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      newsletterMsg.classList.remove("is-error");

      if (!valid) {
        newsletterMsg.textContent = "Merci d’entrer une adresse email valide.";
        newsletterMsg.classList.add("is-error");
        return;
      }

      newsletterMsg.textContent = "Merci ! Vous êtes bien inscrit.";
      newsletterForm.reset();
    });
  }
})();
