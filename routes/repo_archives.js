var express = require('express');
var router = express.Router();
var request = require('request');

router.get('', function(req, res, next) {
  request('http://localhost:12616/repo/archives/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.render('repo/models', { title: 'My Services', items: JSON.parse(body)});
    }else {
      next();
    }
  });
});

router.get('/model/:key', function(req, res, next) {
  res.render('repo/archivedModelDetail', { title: 'Details', modelKey: req.params.key });
});

router.get('/job/:key', function(req, res, next) {
  res.render('repo/archivedJobDetail', { title: 'Details', jobKey: req.params.key });
});

module.exports = router;
