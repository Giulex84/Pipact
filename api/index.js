const backend = require("../packages/backend/dist");

const handler = backend.handler || backend.default;

if (!handler) {
  throw new Error("Backend handler could not be loaded from packages/backend/dist");
}

module.exports = handler;
