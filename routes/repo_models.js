var express = require('express');
var router = express.Router();
var request = require('request');

router.get('', function(req, res, next) {
  request(dmcloud.repo.modelUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.render('model/models', { title: 'Models', models: JSON.parse(body).items});
    }else {
      console.log("Failed to fetch job list for " + JSON.stringify(error));
      next();
    }
  });
});

router.get('/new', function(req, res, next) {
  res.render('model/modelMetadataEditor', { title: 'Create Model', modelKey: null });
});

router.get('/:key', function(req, res, next) {
  res.render('model/modelDetail', { title: 'Details', modelKey: req.params.key });
});

router.get('/:key/meta', function(req, res, next) {
  res.render('model/modelMetadataEditor',
  {
    title: 'Edit Metadata',
    modelKey: req.params.key
  });
});


router.get('/:key/editor', function(req, res, next) {
  res.render('model/modelEditor',
  {
    title: 'Designer',
    modelKey: req.params.key
  });
});

router.get('/:key/archives', function(req, res, next) {
  var url = dmcloud.repo.archiveUrl + "?modelId=" + req.params.key;
  request('dmcloud.repo.archiveUrl', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.render('model/modelArchives', { title: 'Archives', items: JSON.parse(body)});
    }else {
      res.sendStatus(500);
    }
  });
});

module.exports = router;
