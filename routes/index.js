var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {title: 'Wǒ xuéxí - 我学习'});
});

module.exports = router;
