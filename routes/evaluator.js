var express = require('express');
var router = express.Router();
var request = require('request');

/* GET Evaluation for the processer listing. */
router.get('/dashboard/:svcKey', function(req, res, next) {
  res.render('eva_dashboard', { title:  "Evaluation Dashboard"});
});

/* GET Evaluation for the processer listing. */
router.post('/processer/:svcKey', function(req, res, next) {
    res.render('eva_dashboard', { title:  "Evaluation Dashboard"});
});

/* GET Evaluation listing. */
router.post('/trainer/:svcKey', function(req, res, next) {
    res.render('eva_dashboard', { title:  "Evaluation Dashboard"});
});

module.exports = router;
