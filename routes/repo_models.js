var express = require('express');
var router = express.Router();
var request = require('request');

router.get('', function(req, res, next) {
  request('http://localhost:12616/repo/models', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.render('model/models', { title: 'Models', items: JSON.parse(body)});
    }else {
      console.log("Failed to fetch job list for " + JSON.stringify(error));
      next();
    }
  });
});

router.get('/:key', function(req, res, next) {
  res.render('model/modelDetail', { title: 'Details', modelKey: req.params.key });
});

router.get('/:key/meta', function(req, res, next) {
  res.render('model/modelMetadataEditor',
  {
    title: 'Edit Metadata',
    modelKey: req.params.key,
    data: {
      name: "meta"
    }});
});


router.get('/:key/editor', function(req, res, next) {
  res.render('model/modelEditor', { title: 'Designer', modelKey: req.params.key });
});

router.get('/:key/archives', function(req, res, next) {
  request('http://localhost:12616/repo/models', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.render('model/modelArchives', { title: 'Archives', items: JSON.parse(body)});
    }else {
      next();
    }
  });
});

module.exports = router;
