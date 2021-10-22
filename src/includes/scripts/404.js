"use strict";

const supportedLocales = ["de-CH", "en-US", "ja"];

(function () {
  const savedLocale = window.localStorage.getItem("locale");
  const locale = supportedLocales.includes(savedLocale) ? savedLocale : "en-US";
  const content = document.querySelector(`[data-t9n="${locale}"]`);

  if (content) {
    content.setAttribute("data-visible", "true");
  }
})();
