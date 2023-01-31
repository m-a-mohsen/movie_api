// imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const { check, validationResult } = require("express-validator");
const Models = require("./models");

// --- Express ----
// app initialization
const app = express();

// listener
app.listen(8080, () => {
  console.log("movie_app server is running on port 8080.");
});

// ---- Mongoose ----
const Movies = Models.Movie;
const Users = Models.User;
console.log(process.env.CONNECTION_URI);
console.log(typeof process.env.CONNECTION_URI);
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:1234",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// eslint-disable-next-line no-unused-vars
const auth = require("./auth")(app);
require("./passport");

app.use(express.static("public"));

// --------------GET requests--------------------

// Redirect to documentation
app.get("/", (req, res) => {
  res.redirect("/documentation.html");
});

// Return a list of ALL movies to the user;
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .limit(100) // hard coded limit
      .then((movies) => res.json(movies))
      .catch((err) => {
        console.log(err);
        res.status(500).send(`Error : ${err}`);
      });
  }
);

// Return a list of ALL users to the user;
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => res.json(users))
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error : ${err}`);
      });
  }
);
// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user;
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((movie) => res.json(movie))
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error : ${err}`);
      });
  }
);
// Return user data by Username to the user;
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => res.json(user))
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error : ${err}`);
      });
  }
);
// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get(
  "/movies/genre/:GenreTitle",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.GenreTitle })
      .then((movie) => res.json(movie.Genre.Description))
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error : ${err}`);
      });
  }
);

// Return data about a director (bio, birth year, death year) by name
app.get(
  "/movies/director/:DirectorName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.DirectorName })
      .then((movie) => res.json(movie.Director))
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error : ${err}`);
      });
  }
);
// -------------------Create-------------------

app.post(
  "/users",
  // Validation logic here for request
  // you can either use a chain of methods like .not().isEmpty()
  // which means "opposite of isEmpty" in plain english "is not empty"
  // or use .isLength({min: 5}) which means
  // minimum value of 5 characters are only allowed
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  // eslint-disable-next-line consistent-return
  (req, res) => {
    // check the validation object for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested Username already exists
      // eslint-disable-next-line consistent-return
      .then((user) => {
        if (user) {
          // If the user is found, send a response that it already exists
          return res.status(400).send(`${req.body.Username} already exists`);
        }
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          // eslint-disable-next-line no-shadow
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send(`Error: ${error}`);
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send(`Error: ${error}`);
      });
  }
);
// -------------------Update-------------------

app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send(`Error: ${err}`);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)

app.post(
  "/users/:Username/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send(`Error: ${err}`);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// -------------------- Delete --------------------------

// Allow users to {remove} a movie from their list of favorites (showing only a text that a movie has been removed—more on this later);

app.delete(
  "/users/:Username/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send(`Error: ${err}`);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Allow existing users to deregister (showing only a text that a user email has been removed—more on this later).

// Delete a user by Username
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(`${req.params.Username} was not found`);
        } else {
          res.status(200).send(`${req.params.Username} was deleted.`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);
