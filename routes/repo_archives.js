var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/model/:key', function(req, res, next) {
  res.render('model/archivedModelDetail', { title: 'Details', modelKey: req.params.key });
});

router.get('/job/:key', function(req, res, next) {
  res.render('job/archivedJobDetail', { title: 'Details', jobKey: req.params.key });
});

router.get('/job/:key/publish', function(req, res, next) {
  res.render('job/publishJob', { title: 'Publish', jobKey: req.params.key });
});

module.exports = router;
