import { basename, extname } from "node:path";

export default {
  layout: "event.liquid",
  tags: ["concert"],
  section: "concerts",
  permalink: ({ page }) => `/events/${basename(page.inputPath, extname(page.inputPath))}/index.html`,
};
