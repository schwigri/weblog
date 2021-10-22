"use strict";

(function () {
  const wrapper = document.getElementById("post-content");

  if (wrapper) {
    const headings = wrapper.querySelectorAll(":scope > h1, :scope > h2");
    const links = [...document.querySelectorAll("#post-toc a")];

    if (headings.length > 0 && links.length > 0) {
      // @TODO: Fix this via HTML
      [...headings].forEach(heading => heading.removeAttribute("tabindex"));

      const setCurrent = e => {
        e.map(i => {
          if (i.target.id === "post-content") {
            if (!i.isIntersecting) {
              links.forEach(link => link.removeAttribute("aria-current"));
            }
          } else if (i.intersectionRatio >= 1) {
            const link = links.find(link => (link.href = `#${i.target.id}`));
            if (link) {
              if (i.isIntersecting) {
                links.forEach(link => link.removeAttribute("aria-current"));
                link.setAttribute("aria-current", "location");
              }
            }
          }
        });
      };

      const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: [0, 1],
      };

      const observer = new IntersectionObserver(setCurrent, observerOptions);

      headings.forEach(heading => observer.observe(heading));
      observer.observe(wrapper);
    }
  }
})();
