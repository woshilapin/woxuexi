var express = require('express');
var path = require('path');
var mongo = require('mongoskin');
var router = express.Router();

router.get('/', function(req, res) {
	var db = req.db;
	var query = {
		$query: {},
		$orderby: {
			pinyin: 1
		}
	};
	db.collection('chars').find(query).toArray(function(err, items) {
		if(err === null) {
			res.status(200).json(items);
		} else {
			var message = {msg: err};
			res.status(404).send(message);
		}
	});
});

router.get('/random', function(req, res) {
	var db = req.db;
	var random = Math.random();
	var query = {
		$query: {
			_random: {
				$gte: random
			}
		},
		$orderby: {
			_random: 1
		}
	};
	db.collection('chars').findOne(query, function(err, result) {
		if(err === null && result !== null) {
			res.status(200).json(result);
		} else if(err === null && result === null) {
			query.$query._random = {$lte: random};
			db.collection('chars').findOne(query, function(err, result) {
				if(err === null && result !== null) {
					res.status(200).json(result);
				} else {
					var message = {msg: err};
					res.status(404).send(message);
				}
			});
		}
	});
});

router.get('/:char', function(req, res) {
	var db = req.db;
	var query = {
		$query: {
			char: req.params.char
		}
	};
	db.collection('chars').findOne(query, function(err, result) {
		if(err === null) {
			res.status(200).json(result);
		} else {
			var message = {msg: err};
			res.status(404).send(message);
		}
	});
});

router.put('/:char', function(req, res) {
	var db = req.db;
	req.body._date = new Date();
	req.body._random = Math.random();
	req.body.char = req.params.char;
	var query = {
		char: req.params.char
	};
	db.collection('chars').update(query, req.body, function(err, result) {
		if(err === null && result === 1) {
			var message = {msg: ""};
			res.status(200).send(message);
		} else {
			// If resources doesn't exists create it
			if(err === null && result === 0) {
				db.collection('chars').insert(req.body, function(err, result) {
					if(err === null) {
						var message = {msg: ""};
						res.status(201).send(message);
					} else {
						var message = {msg: err};
						res.status(403).send(message);
					}
				});
			} else {
				var message = {msg: err};
				res.status(403).send(message);
			}
		}
	});
});

router.delete('/:char', function(req, res) {
	var db = req.db;
	var query = {
		char: req.params.char
	};
	db.collection('chars').remove(query, function(err, result) {
		if(result === 1) {
			var message = {msg: ""};
			res.status(204).send(message);
		} else {
			var message = {msg: err};
			res.status(403).send(message);
		}
	});
});

module.exports = router;
