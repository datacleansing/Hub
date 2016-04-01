var express = require('express');
var router = express.Router();
var request = require('request');

router.get('', function(req, res, next) {
  res.render('proxy/servicess', { title: 'servicess' });
});


router.get('/:key', function(req, res, next) {
  res.render('proxy/servicesDetails', {
    title: 'Services Details',
    key: req.params.key
  });
});

module.exports = router;
