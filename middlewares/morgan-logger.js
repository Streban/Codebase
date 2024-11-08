const fs = require("fs");
var morgan = require("morgan");
const rfs = require("rotating-file-stream");

function setupMorganLoggar(app) {
  let logDirectory = "./logs";
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

  let accessLogStream = rfs.createStream("access.log", {
    interval: "1d", // rotate daily
    size: "1M",
    path: logDirectory,
  });

  app.use(morgan("combined", { stream: accessLogStream }));
}

module.exports = {
  setupMorganLoggar,
};
