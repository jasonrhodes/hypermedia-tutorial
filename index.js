var express = require('express');
var app = express();
var Datastore = require('nedb');
var db = {};

db.movies = new Datastore({ filename: 'db/movies', autoload: true });
db.showtimes = new Datastore({ filename: 'db/showtimes', autoload: true });

app.use(express.bodyParser());

app.get('/', function (req, res) {

    res.send('izt workng');

})
.post('/rpc', function (req, res) {

    var body = req.body
    var showtime, movie;

    var respond = function (err, response) {
        if (err) {
            res.send(JSON.stringify(err));
        } else {
            res.send(JSON.stringify(response));
        }
    };
    
    res.set('Content-type', 'application/json');

    switch (body.action) {
        
        case "getMovieShowtimes":
            db.showtimes.find({ date: new RegExp(new Date(body.date).toISOString().slice(0, 10))}, function (err, found) {
                if (!err) {
                    // found.map(function (color)) new Date(found.date)
                }
            });
            break;

        case "addMovieShowtime":
            db.showtimes.insert({ 
                movie: body.movieId,
                date: new Date(body.date + ' ' + body.time).toISOString(),
                tickets: body.tickets
            }, respond);
            break;

        case "getMovie":
            body.id && db.movies.findOne({ id: body.id }, respond);
            body.title && db.movies.find({ title: body.title }, respond);
            break;

        case "getMovies":
            db.movies.find({}, respond);
            break;

        case "addMovie":
            req.body.title && db.movies.insert({ title: req.body.title }, respond);
            break;

        default:
            respond({ error: "No action given in request." });
    }

})
.get('/god', function (req, res) {
    db.movies.remove({ _id: "iEjMIimx0itgh9HQ" });
    // db.movies.remove({ _id: "mRKH8kYhY82gMbHQ" });

    res.send('all dones');
})
.listen(3050);