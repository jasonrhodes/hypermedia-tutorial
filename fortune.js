var fortune = require("fortune");

var app = fortune({
	db: "./db/hypermovies",
	baseUrl: "http://localhost:4000"
});

app.resource('movie', {
	title: String,
	rating: Number,
	genres: Array,
	director: 'director',
	cast: ['actor']
});

app.resource('director', {
	name: String,
	movies: ['movie']
});

app.resource('actor', {
	name: String,
	movies: ['movie']
});

app.listen(4000);