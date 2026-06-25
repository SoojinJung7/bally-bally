/* ===== BALLY BALLY — interactions ===== */
(function () {
  "use strict";

  // ----- Data (original placeholder content) -----
  var updates = [
    { tag: "Launch", date: "2026.06.20", title: "bally-bally 홈페이지 오픈", arrow: "자세히 →" },
    { tag: "Build", date: "2026.06.12", title: "주말 해커톤: 48시간 만에 만든 미니 앱", arrow: "자세히 →" },
    { tag: "Note", date: "2026.05.30", title: "빨리 만들고 빨리 고치는 법에 대한 메모", arrow: "자세히 →" }
  ];

  var works = [
    { num: "01", cat: "Web App", name: "Quick Notes", grad: "linear-gradient(135deg,#FF5F14,#C90404)" },
    { num: "02", cat: "Experiment", name: "Pixel Playground", grad: "linear-gradient(135deg,#C90404,#1A1919)" },
    { num: "03", cat: "Tool", name: "Color Swapper", grad: "linear-gradient(135deg,#FF5F14,#1A1919)" },
    { num: "04", cat: "Prototype", name: "Motion Lab", grad: "linear-gradient(135deg,#1A1919,#FF5F14)" }
  ];

  // ----- Render updates -----
  var ug = document.getElementById("updatesGrid");
  updates.forEach(function (u) {
    var c = document.createElement("article");
    c.className = "card";
    c.innerHTML =
      '<span class="card-tag">' + u.tag + "</span>" +
      '<span class="card-date">' + u.date + "</span>" +
      '<h3 class="card-title">' + u.title + "</h3>" +
      '<span class="card-arrow">' + u.arrow + "</span>";
    ug.appendChild(c);
  });

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
