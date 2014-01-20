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
    res.set('Content-type', 'application/json');
    next();
});

// Routes
app.get('/', function (req, res) {
    res.send('The API is working.');
});

app.post('/movies', function (req, res) {
    var respond = responder.setup(res);

    switch (req.body.action) {
        case "viewList":
            db.movies.find({}, respond);
            break;

        case "addNew":
            db.movies.insert({ title: req.body.title }, respond);
            break;

        default:
            respond({ error: "No action given in request." });
    }
});

app.post('/movies/:id', function (req, res) {
    var respond = responder.setup(res);

    switch (req.body.action) {
        case "view":
            db.movies.findOne({ _id: req.params.id }, respond);
            break;

        case "rate":
            db.movies.update({ _id: req.params.id }, { $set: { rating: req.body.rating } }, function (err, num) {
                respond(err, { success: num + " records updated" });
            });
            break;
    }
});

app.listen(process.argv[2] || 3050);