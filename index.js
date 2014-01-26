var express = require('express');
var app = express();
var Datastore = require('nedb');
var db = {};
var wrapper = require('./lib/wrapper.js');

var port = process.argv[2] || 3050;
var root = "http://localhost:" + port;

// Connect to an NeDB database
db.movies = new Datastore({ filename: 'db/movies', autoload: true });

// Add an index
db.movies.ensureIndex({ fieldName: 'title', unique: true });

// Necessary for accessing POST data via req.body object
app.use(express.bodyParser());

// Catch-all route to set global values
app.use(function (req, res, next) {
    res.type('application/json');
    res.locals.wrap = wrapper.create({ start: new Date() });
    next();
});

// Routes
app.get('/', function (req, res) {
    res.send('The API is working.');
});

app.get('/movies', function (req, res) {
    db.movies.find({}, function (err, results) {
        if (err) {
            res.json(500, { error: err });
            return;
        }

        // res.json(200, res.locals.wrap(results.map(function (movie) {
        //     movie.links = { self: root + '/movies/' + movie._id };
        //     return movie;
        // }), {
        //     next: root + '/movies?page=2'
        // }));
        
        res.json(200, res.locals.wrap({}, { item: results.map(function (movie) {
            return root + '/movies/' + movie._id;
        })}));
    });
});

app.post('/movies', function (req, res) {

    if (!req.body.title) {
        res.json(400, { error: { message: "A title is required to create a new movie." }});
        return;
    }

    db.movies.insert({ title: req.body.title }, function (err, created) {
        if (err) {
            res.json(500, { error: err });
            return;
        }

        res.set('Location', root + '/movies/' + created._id);
        res.json(201, created);
    });
});

app.get('/movies/:id', function (req, res) {
    db.movies.findOne({ _id: req.params.id }, function (err, result) {
        if (err) {
            res.json(500, { error: err });
            return;
        }

        if (!result) {
            res.json(404, { error: { message: "We did not find a movie with id: " + req.params.id }});
            return;
        }

        res.json(200, res.locals.wrap(result, { self: root + '/movies/' + req.params.id }));
    });
});

app.put('/movies/:id', function (req, res) {
    db.movies.update({ _id: req.params.id }, req.body, { upsert: false }, function (err, num, upsert) {
        
        if (err) {
            res.json(500, { error: err });
            return;
        }

        if (num === 0) {
            res.json(400, { error: { message: "No records were updated." }});
            return;
        }

        res.send(204);
        res.json(200, { success: { message: "Sucessfully updated movie with ID " + req.params.id }});
    });
});

app.delete('/movies/:id', function (req, res) {
    db.movies.remove({ _id: req.params.id }, function (err, num) {
        if (err) {
            res.json(500, { error: err });
            return;
        }

        if (num === 0) {
            res.json(404, { error: { message: "We did not find a movie with id: " + req.params.id }});
            return;
        }

        res.set('Link', root + '/movies; rel="collection"');
        res.send(204);
    });
});

app.listen(port);