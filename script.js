/* ===== BALLY BALLY — interactions ===== */
(function () {
  "use strict";

  // ----- Data (original placeholder content) -----
  var works = [
    { num: "01", cat: "Web App", name: "Quick Notes", grad: "linear-gradient(135deg,#FF5F14,#C90404)" },
    { num: "02", cat: "Experiment", name: "Pixel Playground", grad: "linear-gradient(135deg,#C90404,#1A1919)" },
    { num: "03", cat: "Tool", name: "Color Swapper", grad: "linear-gradient(135deg,#FF5F14,#1A1919)" },
    { num: "04", cat: "Prototype", name: "Motion Lab", grad: "linear-gradient(135deg,#1A1919,#FF5F14)" }
  ];

  // ----- Render works -----
  var wg = document.getElementById("worksGrid");
  works.forEach(function (w) {
    var a = document.createElement("a");
    a.className = "work";
    a.href = "#";
    a.style.setProperty("--grad", w.grad);
    a.innerHTML =
      '<span class="work-num">' + w.num + "</span>" +
      '<div class="work-info">' +
      '<div class="work-cat">' + w.cat + "</div>" +
      '<div class="work-name">' + w.name + "</div></div>";
    wg.appendChild(a);
  });

  // ----- Hero slideshow (data-driven from assets/slides.json) -----
  (function initSlideshow() {
    var stage = document.getElementById("heroSlideshow");
    if (!stage) return;

    var FALLBACK = {
      intervalMs: 3000,
      slides: [
        { src: "assets/slides/slide-1.jpg", alt: "" },
        { src: "assets/slides/slide-2.jpg", alt: "" },
        { src: "assets/slides/slide-3.jpg", alt: "" }
      ]
    };

    fetch("assets/slides.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(build)
      .catch(function () { build(FALLBACK); });

    function build(cfg) {
      var slides = (cfg && cfg.slides) || [];
      if (!slides.length) return;
      var interval = (cfg && cfg.intervalMs) || 3000;

      var els = slides.map(function (s, i) {
        var div = document.createElement("div");
        div.className = "hero-slide" + (i === 0 ? " active" : "");
        div.style.backgroundImage = 'url("' + s.src + '")';
        div.setAttribute("role", "img");
        if (s.alt) div.setAttribute("aria-label", s.alt);
        stage.appendChild(div);
        // preload
        var img = new Image();
        img.src = s.src;
        return div;
      });

      // indicator dots
      var dots = document.createElement("div");
      dots.className = "hero-dots";
      var dotEls = slides.map(function (_, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "슬라이드 " + (i + 1));
        if (i === 0) b.className = "active";
        b.addEventListener("click", function () { go(i); restart(); });
        dots.appendChild(b);
        return b;
      });
      stage.parentNode.appendChild(dots);

      var current = 0, timer = null;
      function go(n) {
        els[current].classList.remove("active");
        dotEls[current].classList.remove("active");
        current = (n + els.length) % els.length;
        els[current].classList.add("active");
        dotEls[current].classList.add("active");
      }
      function next() { go(current + 1); }
      function start() {
        if (els.length > 1) timer = setInterval(next, interval);
      }
      function restart() { clearInterval(timer); start(); }
      start();

      // pause when tab is hidden
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) clearInterval(timer);
        else restart();
      });
    }
  })();

  // ----- Sticky header on scroll -----
  var header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 20) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ----- Mobile menu -----
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // ----- Language toggle (label only) -----
  var langBtn = document.getElementById("langBtn");
  langBtn.addEventListener("click", function () {
    langBtn.textContent = langBtn.textContent === "KR" ? "EN" : "KR";
  });

  // ----- Reveal on scroll -----
  var revealEls = document.querySelectorAll(".card, .work");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e, i) {
          if (e.isIntersecting) {
            setTimeout(function () { e.target.classList.add("in"); }, i * 80);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // ----- Animated counters -----
  var counters = document.querySelectorAll(".stat-num");
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var statIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCounter(e.target); statIO.unobserve(e.target); }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (c) { statIO.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  // ----- Year -----
  var yr = document.getElementById("year");
  if (yr) yr.textContent = "2026";
})();
