var express = require('express');
var router = express.Router();
var request = require('request');

router.get('', function(req, res, next) {
  request('http://localhost:12616/repo/models', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.render('flow/flows', { title: 'Flows', items: JSON.parse(body)});
    }else {
      next();
    }
  });
});


router.get('/:key', function(req, res, next) {
  res.render('flow/flowDetail', {
    title: 'Details of flow ' + req.params.key,
    key: req.params.key
  });
});

module.exports = router;
