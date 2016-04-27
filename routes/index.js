var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  dchub.render(req, res, 'index');
});

router.get('/login', function(req, res, next) {
  dchub.render(req, res, 'login');
});

module.exports = router;
