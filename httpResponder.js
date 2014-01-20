module.exports = {
	setup: function (res) {
	    return function (err, response) {
	        if (err) {
	            res.send(JSON.stringify(err));
	        } else {
	            res.send(JSON.stringify(response));
	        }
	    };
	}
};