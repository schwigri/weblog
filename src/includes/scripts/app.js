"use strict";

(function () {
  const locale = document.documentElement.getAttribute("lang");
  if (locale !== "x-default") {
    window.localStorage.setItem("locale", locale);
  }
})();
