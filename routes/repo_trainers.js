var express = require('express');
var router = express.Router();

/* GET Trainer metadata */
router.get('/:key', function(req, res, next) {
  res.render('repo_trainerDetail', { title: 'Details' });
});

module.exports = router;
