var express = require('express');
var app = express();
var Datastore = require('nedb');
var db = {};
var responder = require('./httpResponder');

// Connect to an NeDB database
db.movies = new Datastore({ filename: 'db/movies', autoload: true });

// Necessary for accessing POST data via req.body object
app.use(express.bodyParser());

// Catch-all route to set global values
app.use(function (req, res, next) {
    res.type('application/json');
    res.locals.respond = responder.setup(res);
    next();
});

// Routes
app.get('/', function (req, res) {
    res.send('The API is working.');
});

app.get('/movies', function (req, res) {
    db.movies.find({}, res.locals.respond);
});

app.post('/movies', function (req, res) {
    db.movies.insert({ title: req.body.title }, res.locals.respond);
});

app.get('/movies/:id', function (req, res) {
    db.movies.findOne({ _id: req.params.id }, res.locals.respond);
});

app.put('/movies/:id', function (req, res) {
    db.movies.update({ _id: req.params.id }, req.body, function (err, num) {
            res.locals.respond(err, { success: num + " records updated" });
        });
});

app.delete('/movies/:id', function (req, res) {
    db.movies.remove({ _id: req.params.id }, res.locals.respond);
});

app.listen(process.argv[2] || 3050);