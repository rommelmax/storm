var express = require('express'),
	router = express.Router();

router.get('/', function(req, res, next){
	res.render('./rs/streamingTwitter');
});

module.exports = router;