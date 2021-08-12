const { validationResult } = require("express-validator");
module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.validationError = true
    res.locals.errorMessage = errors.array()[0].msg;
  } else {
    req.validationError = false;
    res.locals.errorMessage = null;
  }
  next();
};
