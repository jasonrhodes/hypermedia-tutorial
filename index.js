var express = require('express');
var app = express();
var Datastore = require('nedb');
var db = {};

var setupResponder = (function (res) {

    return function (err, response) {
        if (err) {
            res.send(JSON.stringify(err));
        } else {
            res.send(JSON.stringify(response));
        }
    };

});

db.movies = new Datastore({ filename: 'db/movies', autoload: true });

app.use(express.bodyParser());
 
app.get('/', function (req, res) {

    res.send('The API is working.');

})
.post('/movies', function (req, res) {
    var body = req.body;
    var respond = setupResponder(res);

    res.set('Content-type', 'application/json');

    switch (body.action) {

        case "viewList":
            db.movies.find({}, respond);
            break;

        case "addNew":
            req.body.title && db.movies.insert({ title: req.body.title }, respond);
            break;            

        default:
            respond({ error: "No action given in request." });
    }
})
.post('/movies/:id', function (req, res) {
    var body = req.body;
    var respond = setupResponder(res);

    switch (body.action) {

        case "view":
            db.movies.find({ _id: req.params.id }, respond);

        case "rate":
            db.movies.update({ _id: req.params.id }, { $set: { rating: body.rating } }, function (err, num) {
                respond(err, { success: num + " record updated" });
            });
            break;

        default:
            respond({ error: "No action given in request." });

    }

})
.post('/rpc', function (req, res) {

    var body = req.body
    var movie;
    var respond = setupResponder(res);
    
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
.listen(process.argv[2] || 3000);