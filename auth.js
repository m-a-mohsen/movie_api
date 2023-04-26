const jwtSecret = "secret";

const jwt = require("jsonwebtoken");
const passport = require("passport");

require("./passport");

const generateJWTToken = (user) =>
  jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: "7d",
    algorithm: "HS256",
  });

/* POST login. */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      console.log(error);
      console.log(user);
      console.log(info);
      if (error || !user) {
        return res.status(400).json({
          message: info,
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          console.log(error);
          res.send(error);
        }
        const token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
