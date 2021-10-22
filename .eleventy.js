const Image = require("@11ty/eleventy-img");
const debug = require("debug")("11ty");
const htmlmin = require("html-minifier");
const i18n = require("./src/modules/i18n");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const { minify } = require("terser");
const posthtml = require("posthtml");
const toc = require("eleventy-plugin-toc");
const translations = require("./src/data/t9n.json");
const uglify = require("posthtml-minify-classnames");

const getDateSlug = dateString => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDay();

  return `${year}/${month}/${day}/`;
};

const t9nGetString = (value, locale) => {
  if (locale && translations[value]) {
    return translations[value][locale] || value;
  }

  return value;
};

module.exports = eleventyConfig => {
  eleventyConfig.addPlugin(toc, {
    wrapper: "",
  });

  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.setFrontMatterParsingOptions({ excerpt: true });

  eleventyConfig.addFilter("t9n", t9nGetString);

  eleventyConfig.addFilter("i18n.date", (value, locale) => {
    const date = new Date(value);
    return i18n.getDate(date, locale);
  });

  eleventyConfig.addFilter("sameLocale", (value, locale) => {
    if (!Array.isArray(value) || !locale) return value;
    return value.filter(x => x.data.locale === locale);
  });

  eleventyConfig.addFilter("sameId", (value, id) => {
    if (!Array.isArray(value) || !id) return value;
    return value.filter(x => x.data.id === id);
  });

  eleventyConfig.addFilter("navigation", (value, locale) => {
    if (!Array.isArray(value) || !locale) return value;
    return value
      .filter(x => x.data.locale === locale && !!x.data.navigation)
      .sort((a, b) => a.data.navigation.order - b.data.navigation.order);
  });

  eleventyConfig.addFilter("permalink", (value, data) => {
    const date = data.date;
    const locale = data.locale ? data.locale.split("-")[0] : "en";
    const type = data.type || "page";

    const prefix = locale === "en" ? "/" : `/${locale}/`;

    switch (type) {
      case "post":
        if (!date) break;
        return `${prefix}${getDateSlug(date)}${value}/`;

      case "home":
        return prefix;

      default:
        return `${prefix}${value}/`;
    }
  });

  eleventyConfig.addNunjucksAsyncShortcode(
    "image",
    async (source, alt, width) => {
      const src = source.startsWith("http") ? source : `./src/images/${source}`;
      const widths = width ? [width, width * 2] : [];
      const metadata = await Image(src, {
        formats: ["avif", "webp", "jpg"],
        outputDir: "./_site/img",
        widths,
      });

      const imageAttributes = {
        alt,
        decoding: "async",
        loading: "lazy",
        sizes: "100vw",
      };

      return Image.generateHTML(metadata, imageAttributes, {
        whitespaceMode: "inline",
      });
    }
  );

  eleventyConfig.setLibrary(
    "md",
    markdownIt({
      html: true,
      linkify: true,
      typographer: true,
    }).use(markdownItAnchor, {})
  );

  eleventyConfig.addNunjucksAsyncFilter("jsmin", async (code, cb) => {
    try {
      const minified = await minify(code);
      cb(null, minified.code);
    } catch (e) {
      debug("Failed to minify code", code);
      cb(null, code);
    }
  });

  eleventyConfig.addTransform("htmlmin", async (content, outputPath) => {
    if (outputPath.endsWith("html")) {
      const { html } = await posthtml()
        //.use(uglify({ genNameId: false }))
        .process(content);

      return htmlmin.minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyAttributes: true,
        useShortDoctype: true,
      });
    }

    return content;
  });

  return {
    dir: {
      data: "../data",
      includes: "../includes",
      input: "./src/content",
      layouts: "../layouts",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
