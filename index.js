var express = require('express');
var app = express();
var Datastore = require('nedb');
var db = {};

db.movies = new Datastore({ filename: 'db/movies', autoload: true });

app.use(express.bodyParser());

app.get('/', function (req, res) {

    res.send('The API is working.');

})
.post('/rpc', function (req, res) {

    var body = req.body
    var movie;

    var respond = function (err, response) {
        if (err) {
            res.send(JSON.stringify(err));
        } else {
            res.send(JSON.stringify(response));
        }
    };
    
    res.set('Content-type', 'application/json');

    switch (body.action) {  

        case "getMovies":
            db.movies.find({}, respond);
            break;

        case "addMovie":
            req.body.title && db.movies.insert({ title: req.body.title }, respond);
            break;

        case "rateMovie":
            db.movies.update({ title: body.title }, { $set: { rating: body.rating } }, function (err, num) {
                respond(err, { success: num + " record updated" });
            });
            break;

        default:
            respond({ error: "No action given in request." });
    }

})
.listen(3050);