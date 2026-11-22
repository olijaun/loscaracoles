import assert from "node:assert/strict";
import test from "node:test";
import configure from "../eleventy.config.js";
import { bernDate } from "../src/assets/concert-date.js";

const filters = {};
const collections = {};
configure({
  addPassthroughCopy() {},
  addLiquidFilter() {},
  addGlobalData() {},
  addFilter(name, handler) { filters[name] = handler; },
  addCollection(name, handler) { collections[name] = handler; },
});

function entries(...dates) {
  return dates.map((eventDate, index) => ({
    inputPath: `concert-${index}.md`,
    url: `/konzerte/concert-${index}/`,
    data: { eventDate },
  }));
}

test("the concert day follows Bern midnight in winter and summer", () => {
  assert.equal(bernDate(new Date("2026-11-07T22:59:59Z")), "2026-11-07");
  assert.equal(bernDate(new Date("2026-11-07T23:00:00Z")), "2026-11-08");
  assert.equal(bernDate(new Date("2026-07-01T22:00:00Z")), "2026-07-02");
});

test("concerts stay upcoming on their date and move to the archive after midnight", () => {
  const concerts = collections.concerts({
    getFilteredByTag: () => entries("2026-11-09", new Date("2026-11-07"), "2026-11-06"),
  });
  const dates = (items) => items.map(({ eventDate }) => eventDate);
  assert.deepEqual(dates(filters.upcoming(concerts, "2026-11-07")), ["2026-11-07", "2026-11-09"]);
  assert.deepEqual(dates(filters.past(concerts, "2026-11-08")), ["2026-11-07", "2026-11-06"]);
});

test("an invalid calendar date identifies the event file", () => {
  assert.throws(
    () => collections.concerts({ getFilteredByTag: () => entries("2026-02-30") }),
    /concert-0\.md: eventDate/
  );
});
