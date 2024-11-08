const log = (...log) => {
  let str = log.join(" ");
  console.log(`[${new Date().toString()}] | `, str);
};

const error = (...log) => {
  let str = log.join(" ");
  console.log(/* "\x1b[31m", */ `[ ${new Date().toString()} ] | `, str);
};

const info = (...log) => {
  let str = log.join(" ");
  console.log(/*"\x1b[34m",*/ `[${new Date().toString()}] | `, str);
};

const success = (...log) => {
  let str = log.join(" ");
  console.log(/*"\x1b[32m", */ `[${new Date().toString()}] | `, str);
};

const logger = (req, res, next) => {
  success(req.path);
  next();
};

module.exports = {
  log,
  info,
  error,
  success,
  logger,
};
