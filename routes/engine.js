var express = require('express');
var router = express.Router();
var request = require('request');

/* GET engine dashboard */
router.get('', function(req, res, next) {
  res.render('engine/dashboard', { title: 'Engine Dashboard' });
});

/* Search flows in whole engine */
router.get('/flows', function(req, res, next) {
  res.render('engine/flows', { title: 'Flows' });
});


/* Search flows in whole engine */
router.get('/flows/:key', function(req, res, next) {
  res.render('engine/flowDetails', {
    title: 'Flows',
    key: req.params.key
  });
});

module.exports = router;
