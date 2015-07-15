var express = require('express');
var router = express.Router();
var request = require('request');

/* GET public repo searcher */
router.get('', function(req, res, next) {
  res.render('repo/dashboard', { title: 'Repository' });
});

module.exports = router;
