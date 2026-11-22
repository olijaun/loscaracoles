import { basename, extname } from "node:path";

export default {
  layout: "concert.liquid",
  tags: ["concert"],
  section: "concerts",
  permalink: ({ page }) => `/konzerte/${basename(page.inputPath, extname(page.inputPath))}/index.html`,
};
