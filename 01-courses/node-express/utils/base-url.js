const baseUrl =
  process.env.APP_PROTOCOL +
  "://" +
  process.env.APP_HOST +
  (["80", "443"].includes(process.env.APP_PORT) ? "" : ":"+ process.env.APP_PORT);

module.exports = baseUrl;
