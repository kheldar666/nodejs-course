const { validationResult } = require("express-validator");
module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.validationError = true;
    req.validationErrorArray = errors.array();
  } else {
    req.validationError = false;
    req.validationErrorArray = [];
  }
  next();
};
