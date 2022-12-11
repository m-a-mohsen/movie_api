const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// --------- Schemas -------------
const movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

const userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.statics.hashPassword = (password) => bcrypt.hashSync(password, 10);

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// ------ models ---------
const Movie = mongoose.model("Movie", movieSchema);
const User = mongoose.model("User", userSchema);

// ----- exports -----------
module.exports.Movie = Movie;
module.exports.User = User;
