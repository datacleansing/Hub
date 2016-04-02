var express = require('express');
var router = express.Router();
var request = require('request');

router.get('', function(req, res, next) {
  request('http://localhost:12616/repo/models', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.render('service/services', { title: 'Services', items: JSON.parse(body)});
    }else {
      next();
    }
  });
});


router.get('/:key', function(req, res, next) {
  res.render('service/serviceDetail', {
    title: 'Service Details',
    key: req.params.key
  });
});

module.exports = router;
