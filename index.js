
//imports
const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

// app initialisation
const app = express();

// data
let users = [
    {
        id: 1,
        name : "Kim",
        favoriteMovies: []
    },
    {
        id: 2,
        name : "Mac",
        favoriteMovies: []
    }
]
let movies = [
    {
        title: 'Die hard',
        releaseDate: 1990
    },
    {
        title: 'Lord of the Rings',
        releaseDate: 2001
    },
    {
        title: 'Twilight',
        releaseDate: 2010
    }
];

// Middleware
app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to Movies database!');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

//listener
app.listen(8080, () => {
    console.log('movie_app server is running on port 8080.');
});