/* ==========================================================================
   EdUHK Lacrosse Interest Group — behaviour
   Vanilla JS, no dependencies. Every feature degrades gracefully:
   with JS off you get a readable English page and working anchor links.
   ========================================================================== */

(function () {
  'use strict';

  var STRINGS = window.EDUHK_I18N || {};
  var STORE_KEY = 'eduhk-lang';
  var LANGS = ['en', 'zh-hant', 'zh-hans'];
  var HTML_LANG = { en: 'en', 'zh-hant': 'zh-Hant', 'zh-hans': 'zh-Hans' };

  /* ------------------------------------------------------------- helpers -- */

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function t(lang, key, vars) {
    var table = STRINGS[lang] || STRINGS.en || {};
    var s = table[key];
    if (s === undefined) { s = (STRINGS.en || {})[key]; }
    if (s === undefined) { return ''; }
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split('{' + k + '}').join(vars[k]);
      });
    }
    return s;
  }

  function readStore(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function writeStore(key, val) {
    try { window.localStorage.setItem(key, val); } catch (e) { /* private mode */ }
  }

  /* ------------------------------------------------------------ language -- */

  function detectLang() {
    // English is always the default. We deliberately do NOT sniff
    // navigator.language — the site opens in English for everyone, and only
    // an explicit click on the switcher changes (and remembers) it.
    var saved = readStore(STORE_KEY);
    if (saved && LANGS.indexOf(saved) !== -1) { return saved; }
    return 'en';
  }

  function applyLanguage(lang) {
    if (LANGS.indexOf(lang) === -1) { lang = 'en'; }

    document.documentElement.setAttribute('lang', HTML_LANG[lang]);
    document.documentElement.setAttribute('data-lang', lang);

    // Text nodes
    $$('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var n = el.getAttribute('data-i18n-n');
      var vars = n !== null ? { n: n } : null;
      var out = t(lang, key, vars);
      if (out !== '') { el.innerHTML = out; }
    });

    // Attributes — "attr:key" pairs, separated by ";"
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length !== 2) { return; }
        var attr = bits[0].trim();
        var val = t(lang, bits[1].trim());
        if (attr && val) { el.setAttribute(attr, val); }
      });
    });

    // Per-page <title> and meta description
    var page = document.body.getAttribute('data-page') || 'home';
    var title = t(lang, page + '.meta.title');
    var desc = t(lang, page + '.meta.desc');
    if (title) { document.title = title; }
    if (desc) {
      var meta = $('meta[name="description"]');
      if (meta) { meta.setAttribute('content', desc); }
    }

    // Switcher state
    $$('.language-switcher button').forEach(function (btn) {
      var on = btn.getAttribute('data-language') === lang;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    // Anything that reflects language in its own label
    updateGalleryToggle(lang);
    refreshLightboxCaption();
  }

  function initLanguageSwitcher() {
    $$('.language-switcher button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-language');
        writeStore(STORE_KEY, lang);
        applyLanguage(lang);
      });
    });
  }

  /* ---------------------------------------------------------- mobile nav -- */

  function initNav() {
    var toggle = $('.menu-toggle');
    var nav = $('#primary-navigation');
    if (!toggle || !nav) { return; }

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Any in-page jump closes the panel.
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // Returning to desktop width must not leave a hidden menu behind.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) { setOpen(false); }
    });
  }

  /* -------------------------------------------------------- faq accordion -- */

  function initFaq() {
    var buttons = $$('.faq-question');
    if (!buttons.length) { return; }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (!panel) { return; }
        var isOpen = btn.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
          collapse(panel);
          btn.setAttribute('aria-expanded', 'false');
        } else {
          expand(panel);
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    function expand(panel) {
      panel.hidden = false;
      var h = panel.scrollHeight;
      panel.style.overflow = 'hidden';
      panel.style.maxHeight = '0px';
      // Force a reflow so the transition has a starting value.
      void panel.offsetHeight;
      panel.style.transition = 'max-height .38s cubic-bezier(.22,.61,.36,1)';
      panel.style.maxHeight = h + 'px';
      window.setTimeout(function () {
        panel.style.maxHeight = '';
        panel.style.overflow = '';
        panel.style.transition = '';
      }, 400);
    }

    function collapse(panel) {
      var h = panel.scrollHeight;
      panel.style.overflow = 'hidden';
      panel.style.maxHeight = h + 'px';
      void panel.offsetHeight;
      panel.style.transition = 'max-height .3s cubic-bezier(.22,.61,.36,1)';
      panel.style.maxHeight = '0px';
      window.setTimeout(function () {
        panel.hidden = true;
        panel.style.maxHeight = '';
        panel.style.overflow = '';
        panel.style.transition = '';
      }, 320);
    }
  }

  /* ------------------------------------------------------- reveal on scroll -- */

  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) { return; }

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------- progress bar -- */

  function initProgress() {
    var fill = $('.progress-fill');
    var track = $('.progress-track');
    if (!fill || !track) { return; }

    var now = parseFloat(track.getAttribute('aria-valuenow')) || 0;
    var max = parseFloat(track.getAttribute('aria-valuemax')) || 1;
    var pct = Math.max(0, Math.min(100, (now / max) * 100));

    if (!('IntersectionObserver' in window)) {
      fill.style.width = pct + '%';
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        // Let the panel's own reveal transition start first.
        window.setTimeout(function () { fill.style.width = pct + '%'; }, 180);
        io.disconnect();
      });
    }, { threshold: 0.3 });

    io.observe(track);
  }

  /* -------------------------------------------------------------- gallery -- */

  function initGalleryToggle() {
    var btn = $('.gallery-toggle');
    var grid = $('#photo-grid');
    if (!btn || !grid) { return; }

    btn.addEventListener('click', function () {
      var collapsed = grid.getAttribute('data-collapsed') === 'true';
      grid.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
      btn.setAttribute('aria-expanded', collapsed ? 'true' : 'false');
      updateGalleryToggle(currentLang());

      if (collapsed) {
        // Nothing else to do — the extra cells simply appear.
      } else {
        var head = $('.gallery-full-head');
        if (head && head.getBoundingClientRect().top < 0) {
          head.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    updateGalleryToggle(currentLang());
  }

  function updateGalleryToggle(lang) {
    var btn = $('.gallery-toggle');
    var grid = $('#photo-grid');
    if (!btn || !grid) { return; }
    var collapsed = grid.getAttribute('data-collapsed') === 'true';
    btn.innerHTML = t(lang, collapsed ? 'gallery.expand' : 'gallery.collapse');
  }

  function currentLang() {
    return document.documentElement.getAttribute('data-lang') || 'en';
  }

  /* ------------------------------------------------------------- lightbox -- */

  var lb = {
    root: null, img: null, caption: null,
    items: [], index: 0, lastFocus: null
  };

  function initLightbox() {
    lb.root = $('#lightbox');
    if (!lb.root) { return; }
    lb.img = $('.lb-img', lb.root);
    lb.caption = $('.lb-count', lb.root);

    lb.items = $$('.photo-cell, .team-photo img[data-full]');

    lb.items.forEach(function (el, i) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openLightbox(i);
      });
    });

    $('.lb-close', lb.root).addEventListener('click', closeLightbox);
    $('.lb-prev', lb.root).addEventListener('click', function () { step(-1); });
    $('.lb-next', lb.root).addEventListener('click', function () { step(1); });

    // Click the backdrop (but not the image) to dismiss.
    lb.root.addEventListener('click', function (e) {
      if (e.target === lb.root || e.target.classList.contains('lb-figure')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (lb.root.hidden) { return; }
      if (e.key === 'Escape') { closeLightbox(); }
      else if (e.key === 'ArrowLeft') { step(-1); }
      else if (e.key === 'ArrowRight') { step(1); }
      else if (e.key === 'Tab') { trapFocus(e); }
    });

    // Swipe on touch devices
    var startX = null;
    lb.root.addEventListener('touchstart', function (e) {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });
    lb.root.addEventListener('touchend', function (e) {
      if (startX === null) { return; }
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) { step(dx > 0 ? -1 : 1); }
      startX = null;
    }, { passive: true });
  }

  function sourceOf(el) {
    return el.getAttribute('data-full') || el.getAttribute('href') || el.getAttribute('src');
  }
  function altOf(el) {
    var img = el.tagName === 'IMG' ? el : $('img', el);
    return img ? img.getAttribute('alt') || '' : '';
  }

  function openLightbox(i) {
    lb.index = (i + lb.items.length) % lb.items.length;
    lb.lastFocus = document.activeElement;
    renderLightbox();
    lb.root.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.lb-close', lb.root).focus();
  }

  function closeLightbox() {
    lb.root.hidden = true;
    document.body.style.overflow = '';
    if (lb.lastFocus && lb.lastFocus.focus) { lb.lastFocus.focus(); }
  }

  function step(delta) {
    lb.index = (lb.index + delta + lb.items.length) % lb.items.length;
    renderLightbox();
  }

  function renderLightbox() {
    var el = lb.items[lb.index];
    if (!el) { return; }
    lb.img.setAttribute('src', sourceOf(el));
    lb.img.setAttribute('alt', altOf(el));
    refreshLightboxCaption();

    // Warm the neighbours so paging feels instant.
    [1, -1].forEach(function (d) {
      var next = lb.items[(lb.index + d + lb.items.length) % lb.items.length];
      if (!next) { return; }
      var pre = new Image();
      pre.src = sourceOf(next);
    });
  }

  function refreshLightboxCaption() {
    if (!lb.caption) { return; }
    var el = lb.items[lb.index];
    var alt = el ? altOf(el) : '';
    var count = (lb.index + 1) + ' / ' + lb.items.length;
    lb.caption.textContent = alt ? alt + ' — ' + count : count;
  }

  function trapFocus(e) {
    var focusable = $$('button', lb.root);
    if (!focusable.length) { return; }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  /* ----------------------------------------------------------------- misc -- */

  function initYear() {
    var el = document.getElementById('current-year');
    if (el) { el.textContent = String(new Date().getFullYear()); }
  }

  function init() {
    initYear();
    initLanguageSwitcher();
    initNav();
    initFaq();
    initReveal();
    initProgress();
    initLightbox();
    initGalleryToggle();
    applyLanguage(detectLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
