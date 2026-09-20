(function () {
  "use strict";

  var STORAGE_KEY = "unieast-lang";
  var DEFAULT_LANG = "ar";
  var prepared = false;

  /** Short category labels that already have English counterparts in the project copy */
  var CATEGORY_KEYS = {
    "بولي استر": "cat.polyester",
    "بولي يوريثان": "cat.polyurethane",
    "أكريليك 2K": "cat.acrylic2k",
    "نترو سيلولوزي": "cat.nitrocellulose",
    "صبغات": "cat.stains",
    "ورنيش 1K": "cat.varnish1k",
    "دهانات سنتاتيك": "cat.synthetic",
    "برايمر مقاوم للصدأ": "cat.antirustPrimer",
    "دهانات مائية إنشائية": "cat.waterborne"
  };

  function getDict(lang) {
    var pack = window.UNIEAST_I18N || {};
    return pack[lang] || pack[DEFAULT_LANG] || {};
  }

  function getQueryLang() {
    try {
      var q = new URLSearchParams(window.location.search).get("lang");
      if (q === "ar" || q === "en") return q;
    } catch (e) {}
    return null;
  }

  function getSavedLang() {
    var fromQuery = getQueryLang();
    if (fromQuery) {
      try {
        localStorage.setItem(STORAGE_KEY, fromQuery);
      } catch (e) {}
      return fromQuery;
    }
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "ar" || saved === "en") return saved;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  function setHtmlLang(lang) {
    var html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
    html.setAttribute("data-lang", lang);
  }

  function stripTags(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || "").replace(/\s+/g, " ").trim();
  }

  function prepareBilingualContent() {
    if (prepared) return;
    prepared = true;

    document.querySelectorAll(".product-name").forEach(function (el) {
      if (el.hasAttribute("data-ar") && el.hasAttribute("data-en")) return;
      var html = el.innerHTML;
      var parts = html.split(/<br\s*\/?>/i);
      if (parts.length >= 2) {
        el.setAttribute("data-ar", stripTags(parts[0]));
        el.setAttribute("data-en", stripTags(parts.slice(1).join(" ")));
      }
    });

    document.querySelectorAll(".product-category").forEach(function (el) {
      if (!el.hasAttribute("data-cat-source")) {
        el.setAttribute("data-cat-source", (el.textContent || "").trim());
      }
    });
  }

  function applyDualLangAttributes(lang) {
    document.querySelectorAll("[data-ar][data-en]").forEach(function (el) {
      var text = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-ar");
      if (text != null && text !== "") el.textContent = text;
    });
  }

  function applyCategoryLabels(lang) {
    var dict = getDict(lang);
    document.querySelectorAll(".product-category").forEach(function (el) {
      if (el.hasAttribute("data-i18n")) return;
      if (el.hasAttribute("data-ar") && el.hasAttribute("data-en")) return;

      var source = el.getAttribute("data-cat-source");
      if (!source) return;

      var key = CATEGORY_KEYS[source];
      if (key && dict[key] != null) {
        el.textContent = dict[key];
      } else {
        el.textContent = source;
      }
    });
  }

  function applyTranslations(lang) {
    var dict = getDict(lang);

    prepareBilingualContent();

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] != null) el.setAttribute("placeholder", dict[key]);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (dict[key] != null) el.setAttribute("aria-label", dict[key]);
    });

    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-title");
      if (dict[key] != null) {
        if (el.tagName === "TITLE" || el === document.querySelector("title")) {
          document.title = dict[key];
        } else {
          el.setAttribute("title", dict[key]);
        }
      }
    });

    var titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) {
      var tKey = titleEl.getAttribute("data-i18n");
      if (dict[tKey] != null) document.title = dict[tKey];
    }

    var metaDesc = document.querySelector('meta[name="description"][data-i18n]');
    if (metaDesc) {
      var dKey = metaDesc.getAttribute("data-i18n");
      if (dict[dKey] != null) metaDesc.setAttribute("content", dict[dKey]);
    }

    applyDualLangAttributes(lang);
    applyCategoryLabels(lang);

    document.querySelectorAll(".lang-switch [data-lang]").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (dict["page.downloadPdf"] != null) {
      document.querySelectorAll(".product-link").forEach(function (el) {
        el.setAttribute("data-i18n-pdf", "true");
        el.textContent = dict["page.downloadPdf"];
      });
    }
  }

  function syncUrlLang(lang) {
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      history.replaceState({}, "", url.pathname + url.search + url.hash);
    } catch (e) {}
  }

  function setLanguage(lang) {
    if (lang !== "ar" && lang !== "en") lang = DEFAULT_LANG;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    setHtmlLang(lang);
    applyTranslations(lang);
    syncUrlLang(lang);
    window.dispatchEvent(new CustomEvent("unieast:langchange", { detail: { lang: lang } }));
  }

  function t(key) {
    var lang = document.documentElement.getAttribute("data-lang") || getSavedLang();
    var dict = getDict(lang);
    return dict[key] != null ? dict[key] : key;
  }

  function initLangSwitcher() {
    document.querySelectorAll(".lang-switch [data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLanguage(btn.getAttribute("data-lang"));
      });
    });
  }

  function init() {
    var lang = getSavedLang();
    setHtmlLang(lang);
    applyTranslations(lang);
    initLangSwitcher();
  }

  window.UnieastI18n = {
    init: init,
    setLanguage: setLanguage,
    t: t,
    getLang: function () {
      return document.documentElement.getAttribute("data-lang") || getSavedLang();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
