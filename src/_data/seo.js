const origin = process.env.PAGES_ORIGIN ? new URL(process.env.PAGES_ORIGIN).origin : "";

export default {
  origin,
  staging: origin === "https://loscaracoles.jaun.org",
};
