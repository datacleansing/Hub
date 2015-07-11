var express = require('express');
var router = express.Router();
var request = require('request');

/* GET model listing. */
router.get('', function(req, res, next) {

  request('http://localhost:12616/repo/models', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.render('repo_models', { title: 'My Services', items: JSON.parse(body)});
    }
    else {
      next();
    }
  });
});

/* GET model detail */
router.get('/:key', function(req, res, next) {
  res.render('repo_modelDetail', { title: 'Details', modelKey: req.params.key });
});

/* GET model Metadata */
router.get('/:key/meta', function(req, res, next) {
  res.render('repo_modelMetadataEditor', { title: 'Edit Metadata', modelKey: req.params.key });
});


/* GET model Metadata */
router.get('/:key/designer', function(req, res, next) {
  res.render('repo_modelEditor', { title: 'Designer', modelKey: req.params.key });
});

module.exports = router;
