import { lookupAddress } from "./lib/address-map.js";
import { bernDate } from "./src/assets/concert-date.js";

function dateISO(value) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value;
}

function isCalendarDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value);
  return Number.isFinite(+parsed) && parsed.toISOString().slice(0, 10) === value;
}

export default function (config) {
  config.addLiquidFilter("lookupAddress", lookupAddress);
  config.addPassthroughCopy({ "src/assets": "assets", "src/media": "media" });
  config.addGlobalData("buildDate", () => bernDate());

  config.addCollection("concerts", (api) =>
    api.getFilteredByTag("concert").map((item) => {
      const { eventDate, eventTime, endDate, endTime, ticketUrl } = item.data;
      const date = dateISO(eventDate);
      const lastDate = dateISO(endDate) || date;
      if (!isCalendarDate(date)) {
        throw new Error(`${item.inputPath}: eventDate must be a valid YYYY-MM-DD date`);
      }
      if (!isCalendarDate(lastDate) || lastDate < date) {
        throw new Error(`${item.inputPath}: endDate must be a valid date on or after eventDate`);
      }
      if (endTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(endTime)) {
        throw new Error(`${item.inputPath}: endTime must be in HH:MM format`);
      }
      if (eventTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(eventTime)) {
        throw new Error(`${item.inputPath}: eventTime must be in HH:MM format`);
      }
      if (ticketUrl && !/^https?:\/\//i.test(ticketUrl)) {
        throw new Error(`${item.inputPath}: ticketUrl must start with https:// or http://`);
      }
      return { url: item.url, data: item.data, inputPath: item.inputPath, eventDate: date, lastDate, sortKey: `${date}T${eventTime || "00:00"}` };
    }).sort((a, b) => a.sortKey.localeCompare(b.sortKey) || a.inputPath.localeCompare(b.inputPath))
  );

  config.addFilter("upcoming", (concerts, today) =>
    concerts.filter((concert) => concert.lastDate >= today)
  );
  config.addFilter("past", (concerts, today) =>
    concerts.filter((concert) => concert.lastDate < today).reverse()
  );
  config.addFilter("concertDate", (value) => {
    const date = typeof value === "string" ? new Date(value + "T00:00:00Z") : value;
    return new Intl.DateTimeFormat("de-CH", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  });
  config.addFilter("dateISO", dateISO);

  return {
    dir: { input: "src", output: "_site" },
    pathPrefix: process.env.PAGES_BASE_PATH || "/",
    markdownTemplateEngine: false,
  };
}
