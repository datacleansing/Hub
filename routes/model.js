var express = require('express');
var router = express.Router();

/* GET Model Metadata */
router.get('/:key', function(req, res, next) {
  res.render('repo_modelDetail', { title: 'Details' });
});

module.exports = router;
