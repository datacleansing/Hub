var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('repo', { title: 'Repository' });
});

module.exports = router;
