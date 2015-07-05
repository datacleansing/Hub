var express = require('express');
var router = express.Router();

/* GET public repo searcher */
router.get('/', function(req, res, next) {
  res.render('repo', { title: 'Repository' });
});
/* GET users listing. */
router.get('/svcs', function(req, res, next) {
  res.render('repo_svcs', { title: 'My Services' });
});
/* GET users listing. */
router.get('/models', function(req, res, next) {
  res.render('repo_models', { title: 'My Models' });
});
/* GET users listing. */
router.get('/trainers', function(req, res, next) {
  res.render('repo_trainers', { title: 'My Trainers' });
});

module.exports = router;
