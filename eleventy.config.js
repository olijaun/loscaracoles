import { bernDate } from "./src/assets/concert-date.js";

export default function (config) {
  config.addPassthroughCopy({ "src/assets": "assets", "src/media": "media" });
  config.addGlobalData("buildDate", () => bernDate());

  config.addCollection("concerts", (api) =>
    api.getFilteredByTag("concert").map((item) => {
      const { eventDate, eventTime, ticketUrl } = item.data;
      const date = eventDate instanceof Date ? eventDate.toISOString().slice(0, 10) : eventDate;
      const parsed = new Date(date);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(+parsed) || parsed.toISOString().slice(0, 10) !== date) {
        throw new Error(`${item.inputPath}: eventDate must be a valid YYYY-MM-DD date`);
      }
      if (eventTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(eventTime)) {
        throw new Error(`${item.inputPath}: eventTime must be in HH:MM format`);
      }
      if (ticketUrl && !/^https?:\/\//i.test(ticketUrl)) {
        throw new Error(`${item.inputPath}: ticketUrl must start with https:// or http://`);
      }
      return { url: item.url, data: item.data, inputPath: item.inputPath, eventDate: date, sortKey: `${date}T${eventTime || "00:00"}` };
    }).sort((a, b) => a.sortKey.localeCompare(b.sortKey) || a.inputPath.localeCompare(b.inputPath))
  );

  config.addFilter("upcoming", (concerts, today) =>
    concerts.filter((concert) => concert.eventDate >= today)
  );
  config.addFilter("past", (concerts, today) =>
    concerts.filter((concert) => concert.eventDate < today).reverse()
  );
  config.addFilter("concertDate", (value) => {
    const date = typeof value === "string" ? new Date(value + "T00:00:00Z") : value;
    return new Intl.DateTimeFormat("de-CH", { dateStyle: "long", timeZone: "UTC" }).format(date);
  });
  config.addFilter("dateISO", (value) => value instanceof Date ? value.toISOString().slice(0, 10) : value);

  return {
    dir: { input: "src", output: "_site" },
    pathPrefix: process.env.PAGES_BASE_PATH || "/",
    markdownTemplateEngine: false,
  };
}
