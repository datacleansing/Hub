var express = require('express');
var router = express.Router();
var request = require('request');

/* GET Evaluation for the processer listing. */
router.get('/dashboard/:catalog/:svcKey', function(req, res, next) {
  res.render(
    'eva/dashboard',
    {
      title:  "Evaluation Dashboard",
      catalog: req.params.catalog,
      svcKey: req.params.svcKey
    });
});

/* GET Evaluation for the processer. */
router.get('/processer/:catalog/:svcKey/:evaKey', function(req, res, next) {
    res.render(
      'eva/processerDetail',
      {
        title:  "Evaluation as a processer",
        catalog: req.params.catalog,
        svcKey: req.params.svcKey,
        evaKey: req.params.evaKey
      });
});

/* GET Evaluation. */
router.get('/trainer/:catalog/:svcKey/:evaKey', function(req, res, next) {
    res.render(
      'eva/trainerDetail',
      {
        title:  "Evaluation as a model trainer",
        catalog: req.params.catalog,
        svcKey: req.params.svcKey,
        evaKey: req.params.evaKey
      });
});

/* GET Evaluation for the processer listing. */
router.get('/processer/:catalog/:svcKey', function(req, res, next) {
    res.render(
      'eva/processerEditor',
      {
        title:  "Create a evaluation as a processer",
        catalog: req.params.catalog,
        svcKey: req.params.svcKey
      });
});

/* GET Evaluation listing. */
router.get('/trainer/:catalog/:svcKey', function(req, res, next) {
    res.render(
      'eva/trainerEditor',
      {
        title:  "Create a evaluation as a model trainer",
        catalog: req.params.catalog,
        svcKey: req.params.svcKey
      });
});

module.exports = router;
