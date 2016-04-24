var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});

router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Home' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/scripts/dmcloud_ui.js', function(req, res, next) {
  res.send("dmcloud_repo_baseModelUrl = \"" + dmcloud.repo.modelUrl + "\"");
});

module.exports = router;
