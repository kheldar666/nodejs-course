const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authError = new Error("Not Authenticated");
  authError.statusCode = 401;
  const authHeader = req.get("Authorization");

  let token = "";
  if (authHeader) {
    token = authHeader.split(" ")[1];
  } else {
    throw authError;
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    // Undefined when the token cannot be verified
    throw authError;
  }

  req.userId = decodedToken.userId;
  next();
};
