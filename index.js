// imports
const express = require("express");
const morgan = require("morgan");
// const bodyParser = require("body-parser");
const uuid = require("uuid");
const mongoose = require("mongoose");
const passport = require("passport");
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

mongoose.connect("mongodb://localhost:27017/movies_api", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const auth = require("./auth")(app);
require("./passport");

app.use(express.static("public"));
app.use(morgan("common"));

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
      .then((movies) => res.json(movies))
      .catch((err) => {
        console.log(err);
        res.status(500).send(`Error : ${err}`);
      });
  }
);

// Return a list of ALL users to the user;
app.get("/users", (req, res) => {
  Users.find()
    .then((users) => res.json(users))
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error : ${err}`);
    });
});
// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user;
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => res.json(movie))
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error : ${err}`);
    });
});
// Return user data by username to the user;
app.get("/users/:username", (req, res) => {
  Users.findOne({ userName: req.params.username })
    .then((user) => res.json(user))
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error : ${err}`);
    });
});
// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get("/movies/genre/:GenreTitle", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.GenreTitle })
    .then((movie) => res.json(movie.Genre.Description))
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error : ${err}`);
    });
});

// Return data about a director (bio, birth year, death year) by name
app.get("/movies/director/:DirectorName", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.DirectorName })
    .then((movie) => res.json(movie.Director))
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error : ${err}`);
    });
});
// -------------------Create-------------------

app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(`${req.body.Username}already exists`);
      }
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      })
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
});
// -------------------Update-------------------

app.put("/users/:UserName", (req, res) => {
  Users.findOneAndUpdate(
    { UserName: req.params.UserName },
    {
      $set: {
        UserName: req.body.UserName,
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
});

// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)

app.post("/users/:UserName/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { UserName: req.params.UserName },
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
});

// -------------------- Delete --------------------------

// Allow users to {remove} a movie from their list of favorites (showing only a text that a movie has been removed—more on this later);

app.delete("/users/:UserName/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { UserName: req.params.UserName },
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
});

// Allow existing users to deregister (showing only a text that a user email has been removed—more on this later).

// Delete a user by username
app.delete("/users/:UserName", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.UserName })
    .then((user) => {
      if (!user) {
        res.status(400).send(`${req.params.UserName} was not found`);
      } else {
        res.status(200).send(`${req.params.UserName} was deleted.`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});
