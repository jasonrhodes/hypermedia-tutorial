module.exports = {
	setup: function (res) {
	    return function (err, response) {
	        if (err) {
	            res.json(err);
	        } else {
	            res.json(response);
	        }
	    };
	}
};