var jwt = require("jsonwebtoken");
const AuthUser = require("../models/authUser");

const requireAuth = (req, res, next) => {
  console.log("protection middleware");
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "SECRET_KEY", (err) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};
const checkIfUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    // login user
    jwt.verify(token, "SECRET_KEY", async (err, decoded) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const loginUser = await AuthUser.findById(decoded.id);

        res.locals.user = loginUser;
        next();
      }
    });
  } else {
    // no login user
    res.locals.user = null;
    next();
  }
};
module.exports = { requireAuth, checkIfUser };
