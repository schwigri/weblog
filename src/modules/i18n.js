const months = {
  "de-CH": [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ],
  "en-US": [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

const getMonthName = (month, locale) => {
  if (typeof month !== "number" && (month < 0 || month > 11)) return "";

  return months[locale] ? months[locale][month] : months["en-US"][month];
};

const getDate = (date, locale) => {
  const day = date.getDate();
  const month = getMonthName(date.getMonth(), locale);
  const year = date.getFullYear();

  switch (locale) {
    case "de-CH":
      return `${day}. ${month} ${year}`;

    case "ja":
      return `${year}年${date.getMonth() + 1}月${day}日`;

    default:
      return `${month} ${day}, ${year}`;
  }
};

module.exports = {
  getDate,
  getMonthName,
};
