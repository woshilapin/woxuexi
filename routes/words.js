var express = require('express');
var path = require('path');
var mongo = require('mongoskin');
var router = express.Router();

var wordprojection = {
	_id: 0,
	_date: 0,
	_random: 0
};

router.get('/', function(req, res) {
	var db = req.db;
	var query = {
		$query: {},
		$orderby: {
			"chars.0.pinyin": 1
		}
	};
	db.collection('words').find(query, wordprojection).toArray(function(err, items) {
		if(err === null) {
			for(var index=0; index<items.length; index++) {
				items[index] = items[index];
			}
			res.status(200).json(items);
		} else {
			var message = {msg: err};
			res.status(404).send(message);
		}
	});
});

router.put('/', function(req, res) {
	var db = req.db;
	if(req.body instanceof Array) {
		var counter = 0;
		var sendFinal = function(message) {
			if(message.msg !== "") {
				res.status(403).send(message);
			} else {
				counter++;
				if(counter === req.body.length) {
					res.status(201).send(message);
				}
			}
		};
		req.body.forEach(function(word) {
			word._date = new Date();
			word._random = Math.random();
			var query = {};
			for(var index=0; index<word.chars.length; index++) {
				query["chars."+index+".pinyin"] = word.chars[index].pinyin;
			}
			db.collection('words').update(query, word, function(err, result) {
				if(err === null && result === 1) {
					var message = {msg: ""};
					sendFinal(message);
				} else {
					// If resources doesn't exists create it
					if(err === null && result === 0) {
						db.collection('words').insert(word, function(err, result) {
							if(err === null) {
								var message = {msg: ""};
								sendFinal(message);
							} else {
								var message = {msg: err};
								sendFinal(message);
							}
						});
					} else {
						var message = {msg: err};
						sendFinal(message);
					}
				}
			});
		});
	} else {
		var message = {msg: "The body must be an array."};
		res.status(403).send(message);
	}
});

router.delete('/', function(req, res) {
	var db = req.db;
	var query = {};
	db.collection('words').remove(query, function(err, result) {
		if(err === null) {
			var message = {msg: ""};
			res.status(204).send(message);
		} else {
			var message = {msg: err};
			res.status(403).send(message);
		}
	});
});

router.get('/search', function(req, res) {
	var db = req.db;
	var query = {
		$query: {},
		$orderby: {
			"chars.0.pinyin": 1
		}
	};
	if(req.query.char !== undefined) {
		query.$query["chars.char"] = req.query.char;
	}
	if(req.query.pinyin !== undefined) {
		query.$query["chars.pinyin"] = new RegExp(req.query.pinyin, 'i');
	}
	if(req.query.accent !== undefined) {
		query.$query["chars.accent"] = parseInt(req.query.accent);
	}
	db.collection('words').find(query, wordprojection).toArray(function(err, items) {
		if(err === null) {
			for(var index=0; index<items.length; index++) {
				items[index] = items[index];
			}
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
	db.collection('words').findOne(query, wordprojection, function(err, result) {
		if(err === null && result !== null) {
			result = result;
			res.status(200).json(result);
		} else if(err === null && result === null) {
			query.$query._random = {$lte: random};
			db.collection('words').findOne(query, function(err, result) {
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

router.get('/:word', function(req, res) {
	var db = req.db;
	var query = {
		$query: {
			chars: {
				$size: req.params.word.length
			}
		}
	};
	for(var index=0; index<req.params.word.length; index++) {
		query.$query["chars."+index+".char"] = req.params.word[index];
	}
	db.collection('words').findOne(query, wordprojection, function(err, result) {
		if(err === null) {
			result = result;
			res.status(200).json(result);
		} else {
			var message = {msg: err};
			res.status(404).send(message);
		}
	});
});

router.put('/:word', function(req, res) {
	var db = req.db;
	req.body._date = new Date();
	req.body._random = Math.random();
	var query = {
		chars: {
			$size: req.params.word.length
		}
	};
	for(var index=0; index<req.params.word.length; index++) {
		query["chars."+index+".char"] = req.params.word[index];
	}
	db.collection('words').update(query, req.body, function(err, result) {
		if(err === null && result === 1) {
			var message = {msg: ""};
			res.status(200).send(message);
		} else {
			// If resources doesn't exists create it
			if(err === null && result === 0) {
				db.collection('words').insert(req.body, function(err, result) {
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

router.delete('/:word', function(req, res) {
	var db = req.db;
	var query = {
		chars: {
			$size: req.params.word.length
		}
	};
	for(var index=0; index<req.params.word.length; index++) {
		query["chars."+index+".char"] = req.params.word[index];
	}
	console.log(query);
	db.collection('words').remove(query, function(err, result) {
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
