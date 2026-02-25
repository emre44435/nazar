"use strict";

(() => {
  if (window.__NAZAR_APP_V7__) return;
  window.__NAZAR_APP_V7__ = true;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Perf helpers
  const mm768 = window.matchMedia("(max-width: 768px)");
  const mm920 = window.matchMedia("(max-width: 920px)");
  const isMobile768 = () => mm768.matches;
  const isMobile920 = () => mm920.matches;

  const throttle = (fn, wait = 120) => {
    let last = 0;
    let t = 0;
    let lastArgs = null;

    return (...args) => {
      const now = performance.now();
      const remaining = wait - (now - last);
      lastArgs = args;

      if (remaining <= 0) {
        if (t) {
          clearTimeout(t);
          t = 0;
        }
        last = now;
        fn(...lastArgs);
        lastArgs = null;
        return;
      }

      if (!t) {
        t = window.setTimeout(() => {
          t = 0;
          last = performance.now();
          if (lastArgs) fn(...lastArgs);
          lastArgs = null;
        }, remaining);
      }
    };
  };

  const restartAnimClass = (el, cls) => {
    if (!el) return;
    el.classList.remove(cls);
    if (isMobile768()) {
      requestAnimationFrame(() => el.classList.add(cls));
    } else {
      void el.offsetWidth;
      el.classList.add(cls);
    }
  };

  /* =========================================================
     0) Canvas Safety Guard (mobilde asla çalışma)
     - Şu an canvas çizim kodun yok, ama ileride eklersen de mobilde güvenli olur.
  ========================================================= */
  const initCanvasGuard = () => {
    const canvas = $("#sparkCanvas");
    if (!canvas) return;

    if (isMobile768()) {
      canvas.style.display = "none";
      // Eğer bir yerde canvas için interval/raf eklenirse ileride buradan kapatabilirsin.
    }
  };

  /* =========================================================
     1) Footer Year
  ========================================================= */
  const initFooterYear = () => {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  };

  /* =========================================================
     2) Mobile Menu (tek, stabil + mobil performans fix)
  ========================================================= */
  const initMobileMenu = () => {
    if (window.__MOBILE_MENU_HARD_FIX__) return;
    window.__MOBILE_MENU_HARD_FIX__ = true;

    const burger = $("#burger");
    const baseMenu = $("#menu");
    if (!burger) return;

    const MOBILE_MAX = 920;
    let closeTimer = 0;

    const setImp = (el, prop, val) => {
      if (!el) return;
      el.style.setProperty(prop, val, "important");
    };

    const clearBodyLocks = () => {
      document.body.classList.remove("menu-open", "mobile-fix-open");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("left");
      document.body.style.removeProperty("right");
      document.body.style.removeProperty("width");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("touch-action");
    };

    clearBodyLocks();

    let backdrop = $("#mobileFixBackdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "mobileFixBackdrop";
      document.body.appendChild(backdrop);
    }

    let drawer = $("#mobileFixDrawer");
    if (!drawer) {
      drawer = document.createElement("aside");
      drawer.id = "mobileFixDrawer";
      drawer.setAttribute("aria-hidden", "true");
      drawer.innerHTML = `
        <p class="mfix-head">MENÜ</p>
        <nav class="mfix-links" aria-label="Mobil menü"></nav>
      `;
      document.body.appendChild(drawer);
    }

    let linksWrap = $(".mfix-links", drawer);
    if (!linksWrap) {
      linksWrap = document.createElement("nav");
      linksWrap.className = "mfix-links";
      linksWrap.setAttribute("aria-label", "Mobil menü");
      drawer.appendChild(linksWrap);
    }

    const fallbackLinks = [
      { href: "#hizmetler", text: "Hizmetler" },
      { href: "#hakkimizda", text: "Hakkımızda" },
      { href: "#yorumlar", text: "Yorumlar" },
      { href: "#iletisim", text: "İletişim" },
      { href: "#iletisim", text: "Randevu" }
    ];

    const styleBase = () => {
      setImp(backdrop, "position", "fixed");
      setImp(backdrop, "inset", "0");
      setImp(backdrop, "background", "rgba(0,0,0,.38)");

      if (window.innerWidth <= MOBILE_MAX) {
        setImp(backdrop, "backdrop-filter", "none");
        setImp(backdrop, "-webkit-backdrop-filter", "none");
      } else {
        setImp(backdrop, "backdrop-filter", "blur(2px)");
        setImp(backdrop, "-webkit-backdrop-filter", "blur(2px)");
      }

      setImp(backdrop, "z-index", "99990");
      setImp(backdrop, "opacity", "0");
      setImp(backdrop, "pointer-events", "none");
      setImp(backdrop, "display", "none");
      setImp(backdrop, "transition", "opacity .22s ease");

      setImp(drawer, "position", "fixed");
      setImp(drawer, "top", "0");
      setImp(drawer, "right", "0");
      setImp(drawer, "bottom", "0");
      setImp(drawer, "left", "auto");
      setImp(drawer, "width", "min(86vw, 340px)");
      setImp(drawer, "max-width", "340px");
      setImp(drawer, "max-height", "100dvh");
      setImp(drawer, "overflow-y", "auto");
      setImp(drawer, "overflow-x", "hidden");
      setImp(drawer, "padding", "84px 14px 16px");
      setImp(drawer, "background", "linear-gradient(160deg, rgba(20,20,24,.98), rgba(12,12,15,.95))");
      setImp(drawer, "border-left", "1px solid rgba(232,203,132,.35)");
      setImp(drawer, "border-radius", "18px 0 0 18px");
      setImp(drawer, "box-shadow", "-18px 0 46px rgba(0,0,0,.46)");
      setImp(drawer, "z-index", "99991");
      setImp(drawer, "display", "block");
      setImp(drawer, "opacity", "0");
      setImp(drawer, "pointer-events", "none");
      setImp(drawer, "transform", "translate3d(100%,0,0)");
      setImp(drawer, "transition", "transform .26s ease, opacity .2s ease");
      setImp(drawer, "touch-action", "pan-y");
      setImp(drawer, "overscroll-behavior", "contain");

      setImp(burger, "position", "relative");
      setImp(burger, "z-index", "99992");
    };

    const syncBaseMenuVisibility = () => {
      if (!baseMenu) return;
      if (window.innerWidth <= MOBILE_MAX) {
        setImp(baseMenu, "display", "none");
        setImp(baseMenu, "visibility", "hidden");
        setImp(baseMenu, "pointer-events", "none");
        baseMenu.setAttribute("aria-hidden", "true");
      } else {
        baseMenu.style.removeProperty("display");
        baseMenu.style.removeProperty("visibility");
        baseMenu.style.removeProperty("pointer-events");
        baseMenu.setAttribute("aria-hidden", "false");
      }
    };

    const buildLinks = () => {
      const src = baseMenu ? $$("a[href]", baseMenu) : [];
      const items = src.length
        ? src.map((a) => ({
            href: a.getAttribute("href") || "#",
            text: (a.textContent || "").trim() || "Link",
            target: a.getAttribute("target") || "",
            rel: a.getAttribute("rel") || ""
          }))
        : fallbackLinks;

      linksWrap.innerHTML = "";

      items.forEach((it) => {
        const a = document.createElement("a");
        a.href = it.href;
        a.textContent = it.text;
        if (it.target) a.target = it.target;
        if (it.rel) a.rel = it.rel;

        a.style.display = "flex";
        a.style.alignItems = "center";
        a.style.justifyContent = "space-between";
        a.style.minHeight = "50px";
        a.style.padding = "0 14px";
        a.style.marginTop = "10px";
        a.style.borderRadius = "12px";
        a.style.border = "1px solid rgba(255,255,255,.14)";
        a.style.background = "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03))";
        a.style.color = "#f8f8fb";
        a.style.textDecoration = "none";
        a.style.fontSize = "15px";
        a.style.fontWeight = "700";
        a.style.position = "relative";

        linksWrap.appendChild(a);
      });

      linksWrap.querySelectorAll(".mfix-arr").forEach((el) => el.remove());
    };

    const isOpen = () => drawer.classList.contains("is-open");

    const openMenu = () => {
      if (window.innerWidth > MOBILE_MAX) return;
      if (isOpen()) return;

      clearTimeout(closeTimer);
      styleBase();
      syncBaseMenuVisibility();
      buildLinks();

      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");

      setImp(backdrop, "display", "block");
      setImp(backdrop, "opacity", "1");
      setImp(backdrop, "pointer-events", "auto");

      setImp(drawer, "opacity", "1");
      setImp(drawer, "pointer-events", "auto");
      setImp(drawer, "transform", "translate3d(0,0,0)");

      document.body.classList.add("mobile-fix-open");
      setImp(document.body, "overflow", "hidden");
      setImp(document.body, "touch-action", "none");

      burger.setAttribute("aria-expanded", "true");
      drawer.setAttribute("aria-hidden", "false");
    };

    const closeMenu = (instant = false) => {
      if (!isOpen() && !instant) return;

      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-open");

      setImp(drawer, "opacity", "0");
      setImp(drawer, "pointer-events", "none");
      setImp(drawer, "transform", "translate3d(100%,0,0)");

      setImp(backdrop, "opacity", "0");
      setImp(backdrop, "pointer-events", "none");

      if (instant) {
        setImp(backdrop, "display", "none");
      } else {
        clearTimeout(closeTimer);
        closeTimer = window.setTimeout(() => {
          setImp(backdrop, "display", "none");
        }, 220);
      }

      document.body.classList.remove("mobile-fix-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("touch-action");

      burger.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
    };

    styleBase();
    syncBaseMenuVisibility();
    buildLinks();
    closeMenu(true);
    burger.setAttribute("aria-expanded", "false");

    burger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.innerWidth > MOBILE_MAX) return;
      if (isOpen()) closeMenu();
      else openMenu();
    });

    backdrop.addEventListener("click", () => closeMenu());

    drawer.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const link = t.closest("a[href]");
      if (link) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    const onResize = throttle(() => {
      syncBaseMenuVisibility();
      styleBase();
      if (window.innerWidth > MOBILE_MAX) closeMenu(true);
    }, 140);

    window.addEventListener("resize", onResize, { passive: true });
  };

  /* =========================================================
     3) Scroll Spy
  ========================================================= */
  const initScrollSpy = () => {
    const navLinks = $$('.nav .menu a[href^="#"], #menu a[href^="#"]').filter((a) => {
      const href = a.getAttribute("href");
      return href && href.length > 1;
    });

    if (!navLinks.length) return;

    const sectionMap = new Map();
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const sec = href ? document.querySelector(href) : null;
      if (sec) sectionMap.set(href, sec);
    });

    if (!sectionMap.size) return;

    const hrefs = Array.from(sectionMap.keys());

    const stickyOffset = () => {
      const topbar = $(".topbar");
      const nav = $(".nav");
      const topbarH = topbar ? topbar.offsetHeight : 0;
      const navH = nav ? nav.offsetHeight : 0;
      return topbarH + navH + 18;
    };

    const setActive = (hrefOrNull) => {
      navLinks.forEach((link) => {
        const active = hrefOrNull && link.getAttribute("href") === hrefOrNull;
        link.classList.toggle("active", !!active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    };

    let raf = 0;
    const updateByScroll = () => {
      const y = window.scrollY + stickyOffset();
      const firstHref = hrefs[0];
      const firstSec = sectionMap.get(firstHref);

      if (firstSec && window.scrollY < Math.max(0, firstSec.offsetTop - stickyOffset() - 8)) {
        setActive(null);
        raf = 0;
        return;
      }

      let currentHref = firstHref;
      for (const href of hrefs) {
        const sec = sectionMap.get(href);
        if (!sec) continue;
        if (y >= sec.offsetTop) currentHref = href;
      }

      setActive(currentHref);
      raf = 0;
    };

    const requestUpdate = () => {
      if (raf) return;
      raf = requestAnimationFrame(updateByScroll);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", throttle(requestUpdate, 140), { passive: true });
    requestUpdate();
  };

  /* =========================================================
     4) Hero Slider (stabil + ekranda değilse durur)
  ========================================================= */
  const initHeroSlider = () => {
    const root = $("#heroGallery");
    if (!root || root.dataset.sliderInit === "1") return;
    root.dataset.sliderInit = "1";

    const viewport = $(".mediaViewport", root);
    const slides = $$(".mediaViewport .mediaSlide", root);
    if (!viewport || slides.length < 2) return;

    const prevBtn = $(".mediaNav--prev", root);
    const nextBtn = $(".mediaNav--next", root);
    const captionEl = $("#heroCaption", root);
    const countEl = $("#heroCount", root);
    const progressEl =
      $("#heroProgress", root) ||
      $(".heroProgressFill", root) ||
      $(".mediaProgress > span", root);

    let dotsWrap = $("#heroDots", root) || $(".mediaDots", root);
    if (!dotsWrap) {
      dotsWrap = document.createElement("div");
      dotsWrap.className = "mediaDots";
      const overlay = $(".mediaOverlay", root) || root;
      overlay.appendChild(dotsWrap);
    }

    const reduceMotionQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animOn = () => !reduceMotionQ.matches;

    // Mobilde daha hafif
    const AUTO_MS = isMobile920() ? 7000 : 5200;
    const LOCK_MS = 620;
    const SWIPE_MIN = 45;

    let index = slides.findIndex(
      (s) =>
        s.classList.contains("is-active") ||
        s.classList.contains("active") ||
        s.getAttribute("aria-hidden") === "false"
    );
    if (index < 0) index = 0;

    let timer = 0;
    let raf = 0;
    let paused = false;
    let pausedElapsed = 0;
    let startedAt = 0;
    let locked = false;
    let inView = true; // IntersectionObserver ile güncellenecek
    const touch = { x: 0, y: 0 };

    const setImp = (el, prop, val) => {
      if (!el) return;
      el.style.setProperty(prop, val, "important");
    };

    const setProgress = (ratio) => {
      if (!progressEl) return;
      const r = Math.max(0, Math.min(1, ratio));
      progressEl.style.width = `${r * 100}%`;
    };

    const clearLoops = () => {
      if (timer) {
        clearTimeout(timer);
        timer = 0;
      }
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const getElapsedFromProgress = () => {
      if (!progressEl) return 0;
      const width = parseFloat(progressEl.style.width || "0");
      const pct = Number.isFinite(width) ? Math.max(0, Math.min(100, width)) : 0;
      return (pct / 100) * AUTO_MS;
    };

    const applySlideBase = (slide) => {
      setImp(slide, "position", "absolute");
      setImp(slide, "inset", "0");
      setImp(slide, "width", "100%");
      setImp(slide, "height", "100%");
      setImp(slide, "object-fit", "cover");
      setImp(slide, "object-position", "center center");
      setImp(slide, "backface-visibility", "hidden");
      setImp(slide, "will-change", "opacity, transform, filter");

      // Mobilde geçiş daha hafif
      if (isMobile920()) {
        setImp(slide, "transition", "opacity .55s ease, transform 1.6s ease, filter .6s ease");
      } else {
        setImp(
          slide,
          "transition",
          "opacity .85s cubic-bezier(.22,.61,.36,1), transform 1.15s cubic-bezier(.22,.61,.36,1), filter .9s ease"
        );
      }
    };

    const setSlideActive = (slide, active) => {
      if (active) {
        setImp(slide, "opacity", "1");
        setImp(slide, "transform", "translateZ(0) scale(1)");
        setImp(slide, "filter", isMobile920() ? "saturate(1.04) contrast(1.03)" : "saturate(1.07) contrast(1.05)");
        setImp(slide, "z-index", "2");
        slide.classList.add("is-active", "active");
        slide.setAttribute("aria-hidden", "false");
      } else {
        setImp(slide, "opacity", "0");
        setImp(slide, "transform", "translateZ(0) scale(1.03)");
        setImp(slide, "filter", "saturate(1.01) contrast(1.01)");
        setImp(slide, "z-index", "1");
        slide.classList.remove("is-active", "active");
        slide.setAttribute("aria-hidden", "true");
      }
    };

    slides.forEach((slide, i) => {
      applySlideBase(slide);
      setSlideActive(slide, i === index);
    });

    const pulseSweep = () => {
      // Mobilde sweep yok
      if (isMobile920()) return;
      viewport.classList.remove("is-sweeping");
      void viewport.offsetWidth;
      viewport.classList.add("is-sweeping");
    };

    const preloadCache = new Set();
    const preloadSrc = (src) => {
      if (!src || preloadCache.has(src)) return;
      preloadCache.add(src);
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = src;
    };

    const preloadAround = (i) => {
      [i, i + 1, i - 1].forEach((n) => {
        const s = slides[(n + slides.length) % slides.length];
        if (!s) return;
        const src = s.getAttribute("src");
        preloadSrc(src);
      });
    };

    let dots = [];

    const updateTextAndDots = () => {
      const activeSlide = slides[index];
      const caption = activeSlide.getAttribute("data-caption") || `Salon Görseli ${index + 1}`;

      if (captionEl) {
        captionEl.textContent = caption;
        restartAnimClass(captionEl, "cap-in");
      }

      if (countEl) {
        countEl.textContent = `${index + 1}/${slides.length}`;
        restartAnimClass(countEl, "cap-in");
      }

      dots.forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
      });
    };

    const animateProgress = (baseElapsed = 0) => {
      if (!animOn() || paused || !inView) {
        setProgress(1);
        return;
      }
      startedAt = performance.now();

      const tick = (ts) => {
        if (paused || !inView) return;
        const elapsed = baseElapsed + (ts - startedAt);
        setProgress(elapsed / AUTO_MS);
        if (elapsed < AUTO_MS) raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    };

    const scheduleNext = (delayMs, baseElapsed = 0) => {
      clearLoops();
      if (!animOn() || paused || !inView) {
        setProgress(1);
        return;
      }
      animateProgress(baseElapsed);
      timer = window.setTimeout(() => goTo(index + 1), delayMs);
    };

    const pauseAuto = () => {
      if (paused) return;
      paused = true;
      root.classList.add("is-paused");
      pausedElapsed = getElapsedFromProgress();
      clearLoops();
    };

    const resumeAuto = () => {
      if (!paused) return;
      paused = false;
      root.classList.remove("is-paused");

      if (!animOn() || !inView) {
        setProgress(1);
        return;
      }

      const remaining = Math.max(150, AUTO_MS - pausedElapsed);
      scheduleNext(remaining, pausedElapsed);
      pausedElapsed = 0;
    };

    const goTo = (newIndex) => {
      if (locked) return;
      const target = (newIndex + slides.length) % slides.length;

      if (target === index) {
        if (!paused && inView) scheduleNext(AUTO_MS, 0);
        return;
      }

      locked = true;

      const prevSlide = slides[index];
      const nextSlide = slides[target];

      setSlideActive(prevSlide, false);
      setSlideActive(nextSlide, true);
      index = target;

      updateTextAndDots();
      preloadAround(index);

      if (animOn()) pulseSweep();

      if (!paused && inView) {
        setProgress(0);
        scheduleNext(AUTO_MS, 0);
      }

      window.setTimeout(() => {
        locked = false;
      }, LOCK_MS);
    };

    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    dotsWrap.innerHTML = "";
    dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "mediaDot";
      b.setAttribute("aria-label", `${i + 1}. fotoğraf`);
      b.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(b);
      return b;
    });

    prevBtn?.addEventListener("click", prev);
    nextBtn?.addEventListener("click", next);

    // Mobilde hover event gereksiz
    if (!isMobile920()) {
      root.addEventListener("mouseenter", pauseAuto);
      root.addEventListener("mouseleave", resumeAuto);
    }
    root.addEventListener("focusin", pauseAuto);
    root.addEventListener("focusout", (e) => {
      const related = e.relatedTarget;
      if (!(related instanceof Node) || !root.contains(related)) resumeAuto();
    });

    root.addEventListener(
      "touchstart",
      (e) => {
        const t = e.changedTouches[0];
        touch.x = t.clientX;
        touch.y = t.clientY;
        pauseAuto();
      },
      { passive: true }
    );

    root.addEventListener(
      "touchend",
      (e) => {
        const t = e.changedTouches[0];
        const dx = t.clientX - touch.x;
        const dy = t.clientY - touch.y;

        if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) next();
          else prev();
        }
        resumeAuto();
      },
      { passive: true }
    );

    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        if (paused) resumeAuto();
        else pauseAuto();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pauseAuto();
      else resumeAuto();
    });

    // Ekranda değilse tamamen durdur (BÜYÜK perf farkı)
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          inView = !!entry && entry.isIntersecting;

          if (!inView) {
            clearLoops();
            setProgress(1);
          } else {
            if (!paused && animOn()) {
              setProgress(0);
              scheduleNext(AUTO_MS, 0);
            }
          }
        },
        { threshold: 0.15 }
      );
      io.observe(root);
    }

    if (typeof reduceMotionQ.addEventListener === "function") {
      reduceMotionQ.addEventListener("change", () => {
        if (!paused && inView) scheduleNext(AUTO_MS, 0);
      });
    } else if (typeof reduceMotionQ.addListener === "function") {
      reduceMotionQ.addListener(() => {
        if (!paused && inView) scheduleNext(AUTO_MS, 0);
      });
    }

    updateTextAndDots();
    preloadAround(index);

    if (animOn()) {
      setProgress(0);
      scheduleNext(AUTO_MS, 0);
      pulseSweep();
    } else {
      setProgress(1);
    }
  };

  /* =========================================================
     5) Review Reveal
  ========================================================= */
  const initReviewReveal = () => {
    const cards = $$(".nk-home-reviews .nk-rev-card, #yorumlar .nk-rev-card");
    if (!cards.length) return;

    cards.forEach((card, i) => {
      card.classList.add("reveal");
      if (!card.style.getPropertyValue("--rv-delay")) {
        card.style.setProperty("--rv-delay", `${i * 90}ms`);
      }
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      cards.forEach((card) => card.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    cards.forEach((card) => io.observe(card));
  };

  // Init
  initCanvasGuard();
  initFooterYear();
  initMobileMenu();
  initScrollSpy();
  initHeroSlider();
  initReviewReveal();
})();

// Floating Social FAB (WhatsApp + Instagram)
(function initFab() {
  const fab = document.querySelector("[data-fab]");
  if (!fab) return;

  const btn = document.getElementById("nkFabBtn");
  const panel = document.getElementById("nkFabPanel");
  const items = fab.querySelectorAll("[data-fab-item]");

  const setOpen = (open) => {
    fab.dataset.open = open ? "true" : "false";
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    panel.setAttribute("aria-hidden", open ? "false" : "true");
  };

  setOpen(false);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = fab.dataset.open === "true";
    setOpen(!isOpen);
  });

  document.addEventListener("click", (e) => {
    if (fab.dataset.open !== "true") return;
    if (!fab.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  items.forEach((a) => a.addEventListener("click", () => setOpen(false)));
})();