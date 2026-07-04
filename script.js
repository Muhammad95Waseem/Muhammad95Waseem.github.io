/* =====================================================================
   MOHAMMAD WASEEM — PORTFOLIO SCRIPT
   ---------------------------------------------------------------------
   Plain vanilla JavaScript, no dependencies. Organized into small,
   independent modules — each wrapped in its own block and guarded so
   it simply does nothing if its markup isn't on the page. Safe to
   copy a module into a future page on its own.
   ===================================================================== */

(function () {
  "use strict";

  // Respect the user's reduced-motion preference across every module below.
  var PREFERS_REDUCED_MOTION = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ===================================================================
     Navbar Scroll Effect
     -------------------------------------------------------------------
     Adds `.is-scrolled` to the navbar once the page has scrolled past
     a small threshold, giving it a stronger glass background + shadow.
     =================================================================== */
  (function navbarScrollEffect() {
    var navbar = document.getElementById("navbar");
    if (!navbar) return;

    var SCROLL_THRESHOLD = 40;

    function updateNavbar() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        navbar.classList.add("is-scrolled");
      } else {
        navbar.classList.remove("is-scrolled");
      }
    }

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
    window.addEventListener("resize", updateNavbar, { passive: true });
  })();

  /* ===================================================================
     Mobile Nav Toggle
     -------------------------------------------------------------------
     Opens/closes the slide-down nav menu on small screens, and closes
     it automatically whenever a link inside it is clicked.
     =================================================================== */
  (function mobileNavToggle() {
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (!toggle || !links) return;

    function closeMenu() {
      toggle.classList.remove("is-active");
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.classList.toggle("is-active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape for keyboard users
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  })();

  /* ===================================================================
     Featured Poster Glow
     -------------------------------------------------------------------
     Reads the featured poster image and uses its dominant color for the
     surrounding glow so the effect feels tied to the artwork.
     =================================================================== */
  (function featuredPosterGlow() {
    var poster = document.querySelector(".featured-poster-wrap img");
    var card = document.querySelector(".featured-card");
    if (!poster || !card) return;

    function setPosterGlowColor() {
      if (!poster.complete || poster.naturalWidth < 1) return;

      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      var size = 48;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(poster, 0, 0, size, size);

      var data = ctx.getImageData(0, 0, size, size).data;
      var total = 0;
      var r = 0;
      var g = 0;
      var b = 0;

      for (var i = 0; i < data.length; i += 4) {
        var alpha = data[i + 3] / 255;
        if (alpha < 0.1) continue;
        r += data[i] * alpha;
        g += data[i + 1] * alpha;
        b += data[i + 2] * alpha;
        total += 1;
      }

      if (!total) return;

      var averageR = Math.round(r / total);
      var averageG = Math.round(g / total);
      var averageB = Math.round(b / total);
      card.style.setProperty("--poster-glow-rgb", averageR + ", " + averageG + ", " + averageB);
    }

    if (poster.complete) {
      setPosterGlowColor();
    } else {
      poster.addEventListener("load", setPosterGlowColor, { once: true });
    }
  })();

  /* ===================================================================
     Contact Orbit Preview
     -------------------------------------------------------------------
     Updates the centered preview in the contact section when a circular
     contact tile is hovered, focused, or clicked.
     =================================================================== */
  (function contactOrbitPreview() {
    var preview = document.getElementById("contactPreview");
    var tiles = document.querySelectorAll(".contact-tile");
    if (!preview || !tiles.length) return;

    var iconEl = preview.querySelector(".contact-preview-icon use");
    var labelEl = preview.querySelector(".contact-preview-label");
    var valueEl = preview.querySelector(".contact-preview-value");

    function setActive(tile) {
      tiles.forEach(function (item) {
        item.classList.toggle("is-active", item === tile);
      });

      if (!tile) return;

      var title = tile.getAttribute("data-title") || "";
      var value = tile.getAttribute("data-value") || "";
      var iconId = tile.getAttribute("data-icon") || "icon-mail";

      if (iconEl) {
        iconEl.setAttribute("href", "#" + iconId);
      }
      if (labelEl) labelEl.textContent = title;
      if (valueEl) valueEl.textContent = value;
    }

    tiles.forEach(function (tile) {
      tile.addEventListener("mouseenter", function () {
        setActive(tile);
      });
      tile.addEventListener("focus", function () {
        setActive(tile);
      });
      tile.addEventListener("click", function (event) {
        event.preventDefault();
        setActive(tile);
      });
    });

    setActive(document.querySelector(".contact-tile.is-active") || tiles[0]);
  })();

  /* ===================================================================
     Typewriter Animation
     -------------------------------------------------------------------
     Cycles the hero role text through ROLES, typing and deleting each
     one. Pauses on reduced-motion and simply shows the first role.
     =================================================================== */
  (function typewriterAnimation() {
    var el = document.getElementById("typedText");
    if (!el) return;

    var ROLES = [
      "Data Scientist",
      "ML Engineer",
      "Data Analyst",
      "AI Developer",
    ];

    if (PREFERS_REDUCED_MOTION) {
      el.textContent = ROLES[0];
      return;
    }

    var roleIndex = 0;
    var charIndex = 0;
    var isDeleting = false;

    var TYPE_SPEED = 75;
    var DELETE_SPEED = 40;
    var HOLD_AT_FULL_WORD = 1800;
    var HOLD_AT_EMPTY = 300;

    function tick() {
      var currentRole = ROLES[roleIndex];

      if (!isDeleting) {
        charIndex++;
        el.textContent = currentRole.slice(0, charIndex);

        if (charIndex === currentRole.length) {
          isDeleting = true;
          setTimeout(tick, HOLD_AT_FULL_WORD);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        el.textContent = currentRole.slice(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % ROLES.length;
          setTimeout(tick, HOLD_AT_EMPTY);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    setTimeout(tick, TYPE_SPEED);
  })();

  /* ===================================================================
     Scroll Reveal Animation
     -------------------------------------------------------------------
     Fades/slides in any element with the `.reveal` class as it enters
     the viewport. One shared IntersectionObserver for the whole page.
     =================================================================== */
  (function scrollRevealAnimation() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (PREFERS_REDUCED_MOTION || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    targets.forEach(function (el) {
      el.classList.remove("is-visible");
      observer.observe(el);
    });
  })();

  /* ===================================================================
     Hero Network Canvas
     -------------------------------------------------------------------
     Signature ambient background: a quiet field of drifting nodes with
     connecting lines, evoking a data/ML graph. Purely decorative, low
     density, and paused entirely under reduced-motion.
     =================================================================== */
  (function heroNetworkCanvas() {
    var canvas = document.getElementById("heroCanvas");
    if (canvas) {
      canvas.remove();
    }
  })();

  /* ===================================================================
     Featured Poster Glow Color
     -------------------------------------------------------------------
     Samples the featured poster and sets a CSS RGB variable so the poster
     outline glow borrows its color from the artwork.
     =================================================================== */
  (function featuredPosterGlowColor() {
    var img = document.querySelector(".featured-poster-wrap img");
    if (!img) return;

    var card = img.closest(".featured-card");
    if (!card) return;

    function samplePosterColor() {
      if (!img.naturalWidth || !img.naturalHeight) return;

      try {
        var canvas = document.createElement("canvas");
        var size = 48;
        canvas.width = size;
        canvas.height = size;

        var ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, size, size);

        var pixels = ctx.getImageData(0, 0, size, size).data;
        var sumR = 0;
        var sumG = 0;
        var sumB = 0;
        var sumWeight = 0;

        for (var i = 0; i < pixels.length; i += 4) {
          var r = pixels[i];
          var g = pixels[i + 1];
          var b = pixels[i + 2];
          var a = pixels[i + 3] / 255;
          if (a < 0.4) continue;

          var max = Math.max(r, g, b);
          var min = Math.min(r, g, b);
          var saturation = max === 0 ? 0 : (max - min) / max;
          var luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          if (saturation < 0.12 || luminance < 28 || luminance > 235) continue;

          var luminanceBalance = 1 - Math.min(Math.abs(luminance - 145) / 145, 0.82);
          var weight = saturation * saturation * luminanceBalance * a;

          sumR += r * weight;
          sumG += g * weight;
          sumB += b * weight;
          sumWeight += weight;
        }

        if (sumWeight < 1) return;

        card.style.setProperty(
          "--poster-glow-rgb",
          Math.round(sumR / sumWeight) + ", " +
            Math.round(sumG / sumWeight) + ", " +
            Math.round(sumB / sumWeight)
        );
      } catch (err) {
        // Keep the CSS fallback if pixel sampling is blocked.
      }
    }

    if (img.complete) {
      samplePosterColor();
    } else {
      img.addEventListener("load", samplePosterColor, { once: true });
    }
  })();

  /* ===================================================================
     Resume Print Button
     -------------------------------------------------------------------
     Only present on resume/resume.html — triggers the native browser
     print dialog, which (via the @media print rules) outputs just the
     A4 page itself, with the toolbar hidden.
     =================================================================== */
  (function resumePrintButton() {
    var btn = document.getElementById("printResumeBtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      window.print();
    });
  })();

  /* ===================================================================
     Footer Year
     -------------------------------------------------------------------
     Keeps the copyright year in the footer accurate automatically.
     =================================================================== */
  (function footerYear() {
    var el = document.getElementById("footerYear");
    if (!el) return;
    el.textContent = String(new Date().getFullYear());
  })();

})();
