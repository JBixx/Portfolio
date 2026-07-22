/* Portfolio interactions: boot, theme, menu, reveal, newsletter */
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
  var loadingScreen = document.getElementById("loading-screen");

  /* ---------- Tech boot loader ---------- */
  function runBootLoader() {
    if (!loadingScreen) return;

    var statusEl = document.getElementById("loader-status");
    var barEl = document.getElementById("loader-bar");
    var pctEl = document.getElementById("loader-pct");
    var progressCircle = loadingScreen.querySelector(".loader-progress");
    var circumference = 276.46;
    var steps = [
      "Initializing kernel…",
      "Mounting asset pipeline…",
      "Hydrating UI modules…",
      "Syncing design tokens…",
      "Compiling interface…",
      "System ready."
    ];
    var i = 0;
    var pct = 0;

    body.style.overflow = "hidden";

    var tick = setInterval(function () {
      pct = Math.min(100, pct + (pct < 70 ? 4 : pct < 90 ? 2 : 1));
      if (barEl) barEl.style.width = pct + "%";
      if (pctEl) pctEl.textContent = pct + "%";
      if (progressCircle) {
        progressCircle.style.strokeDashoffset = String(
          circumference - (circumference * pct) / 100
        );
      }
      if (statusEl && i < steps.length) {
        var target = Math.floor(((i + 1) / steps.length) * 100);
        if (pct >= target - 5) {
          statusEl.textContent = "> " + steps[i];
          i += 1;
        }
      }
      if (pct >= 100) {
        clearInterval(tick);
        if (statusEl) statusEl.textContent = "> " + steps[steps.length - 1];
        setTimeout(function () {
          loadingScreen.classList.add("is-done");
          body.style.overflow = "";
          setTimeout(function () {
            loadingScreen.remove();
          }, 600);
        }, 280);
      }
    }, 45);
  }

  if (loadingScreen && !body.classList.contains("page-project")) {
    runBootLoader();
  } else if (loadingScreen) {
    loadingScreen.remove();
  }

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

  if (navOverlay) navOverlay.addEventListener("click", closeMenu);

  if (navLinks) {
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Scroll reveal + skill bars ---------- */
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

    revealEls.forEach(function (el, index) {
      el.style.transitionDelay = Math.min(index % 6, 5) * 0.06 + "s";
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

  /* ---------- Animated counters ---------- */
  function animateCount(el, target) {
    var suffix = el.textContent.replace(/[0-9]/g, "");
    var current = 0;
    var step = Math.max(1, Math.ceil(target / 40));
    el.classList.add("is-counting");
    var timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        el.classList.remove("is-counting");
      }
      el.textContent = current + suffix;
    }, 30);
  }

  var stats = document.querySelectorAll(".hero-stats strong, .side-stats strong");
  if ("IntersectionObserver" in window && stats.length) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var num = parseInt(el.textContent, 10);
          if (!isNaN(num)) animateCount(el, num);
          statsObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    stats.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".header");
  if (header) {
    window.addEventListener(
      "scroll",
      function () {
        header.classList.toggle("is-scrolled", window.scrollY > 20);
      },
      { passive: true }
    );
  }

  /* ---------- Back to top ---------- */
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

  /* ---------- Newsletter ---------- */
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
