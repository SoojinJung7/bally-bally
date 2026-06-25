/* ===== BALLY BALLY — interactions ===== */
(function () {
  "use strict";

  // ----- Data (original placeholder content) -----
  var works = [
    { num: "01", cat: "Soccer / Futsal", name: "축구 / 풋살", url: "https://bally-junior.com/sports/soccer.html", grad: "linear-gradient(135deg,#FF5F14,#C90404)" },
    { num: "02", cat: "Basketball", name: "농구", url: "https://bally-junior.com/sports/basketball.html", grad: "linear-gradient(135deg,#C90404,#1A1919)" },
    { num: "03", cat: "Badminton / Pickleball", name: "배드민턴 / 피클볼", url: "https://bally-junior.com/sports/badminton.html", grad: "linear-gradient(135deg,#FF5F14,#1A1919)" },
    { num: "04", cat: "Inline / Fitness", name: "인라인 / 생활체육", url: "https://bally-junior.com/sports/inline.html", grad: "linear-gradient(135deg,#1A1919,#FF5F14)" },
    { num: "05", cat: "Pilates", name: "필라테스", url: "https://bally-junior.com/sports/pilates.html", grad: "linear-gradient(135deg,#C90404,#FF5F14)" },
    { num: "06", cat: "Dance", name: "방송댄스", url: "https://bally-junior.com/sports/dance.html", grad: "linear-gradient(135deg,#1A1919,#C90404)" }
  ];

  // ----- Render works -----
  var wg = document.getElementById("worksGrid");
  works.forEach(function (w) {
    var a = document.createElement("a");
    a.className = "work";
    a.href = w.url || "#";
    if (w.url) { a.target = "_blank"; a.rel = "noopener"; }
    a.style.setProperty("--grad", w.grad);
    a.innerHTML =
      '<span class="work-num">' + w.num + "</span>" +
      '<div class="work-info">' +
      '<div class="work-cat">' + w.cat + "</div>" +
      '<div class="work-name">' + w.name + "</div>" +
      '<div class="work-go">소개 보기 →</div></div>';
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

  // ----- BALLY NEWS playlist (auto-advance + synced title/caption) -----
  (function initNews() {
    var video = document.getElementById("newsVideo");
    var titleEl = document.getElementById("newsTitle");
    var bodyEl = document.getElementById("newsBody");
    var indexEl = document.getElementById("newsIndex");
    var dotsEl = document.getElementById("newsDots");
    if (!video || !titleEl || !bodyEl) return;

    fetch("assets/news.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (cfg) { build((cfg && cfg.items) || []); })
      .catch(function () {/* leave static fallback content as-is */});

    function build(items) {
      if (!items.length) return;
      var current = 0;
      var pad = function (n) { return (n < 10 ? "0" : "") + n; };

      // indicator dots
      var dotEls = items.map(function (_, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "영상 " + (i + 1));
        b.addEventListener("click", function () { load(i, true); });
        dotsEl.appendChild(b);
        return b;
      });

      function paintMeta(i) {
        var it = items[i];
        // fade text out/in for a smooth swap
        titleEl.classList.add("news-fading");
        bodyEl.classList.add("news-fading");
        setTimeout(function () {
          titleEl.textContent = it.title || "";
          bodyEl.textContent = it.caption || "";
          indexEl.textContent = pad(i + 1) + " / " + pad(items.length);
          titleEl.classList.remove("news-fading");
          bodyEl.classList.remove("news-fading");
        }, 200);
        dotEls.forEach(function (d, di) { d.classList.toggle("active", di === i); });
      }

      function load(i, autoplay) {
        current = (i + items.length) % items.length;
        var it = items[current];
        video.src = it.src;
        video.load();
        paintMeta(current);
        if (autoplay) {
          var p = video.play();
          if (p && p.catch) p.catch(function () {/* autoplay blocked — user can press play */});
        }
      }

      // when a clip ends, immediately continue to the next one
      video.addEventListener("ended", function () { load(current + 1, true); });

      // initial clip (no autoplay yet — starts when scrolled into view)
      load(0, false);

      // muted autoplay once the section is visible (mobile-friendly)
      if ("IntersectionObserver" in window) {
        var started = false;
        var vio = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting && !started) {
                started = true;
                var p = video.play();
                if (p && p.catch) p.catch(function () {});
              }
            });
          },
          { threshold: 0.5 }
        );
        vio.observe(video);
      }
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
