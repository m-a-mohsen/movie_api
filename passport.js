/* eslint-disable no-underscore-dangle */
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const Models = require("./models");

const Users = Models.User;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    async (username, password, callback) => {
      try {
        const user = await Users.findOne({ Username: username });
        if (!user) {
          console.log("incorrect username");
          return callback(null, false, { message: "Incorrect username." });
        }
        if (!user.validatePassword(password)) {
          console.log("incorrect password");
          return callback(null, false, { message: "Incorrect password." });
        }
        console.log("finished");
        return callback(null, user);
      } catch (error) {
        console.log(error);
        return callback(error);
      }
      // console.log(`${username}  ${password}`);
      // Users.findOne({ Username: username }, (error, user) => {
      //   if (error) {
      //     console.log(error);
      //     return callback(error);
      //   }
      //   if (!user) {
      //     console.log("incorrect username");
      //     return callback(null, false, { message: "Incorrect username." });
      //   }
      //   if (!user.validatePassword(password)) {
      //     console.log("incorrect password");
      //     return callback(null, false, { message: "Incorrect password." });
      //   }
      //   console.log("finished");
      //   return callback(null, user);
      // });
    }
    // end of function
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "secret",
    },
    (jwtPayload, callback) =>
      Users.findById(jwtPayload._id)
        .then((user) => callback(null, user))
        .catch((error) => callback(error))
  )
);
