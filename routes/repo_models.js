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

router.all("/:key*", function(req, res, next){
  request(dmcloud.repo.modelUrl + req.params.key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      req.dataObj = JSON.parse(body);
      next();
    }else {
      res.sendStatus(404);
    }
  });
});

router.get('/:key', function(req, res, next) {
  res.render('model/modelDetail',
  {
    title: 'Details for ' + req.dataObj.metadata.name,
    model: req.dataObj
  });
});

router.get('/:key/meta', function(req, res, next) {
  res.render('model/modelMetadataEditor',
  {
    title: 'Edit Metadata of ' + req.dataObj.metadata.name,
    content: JSON.stringify(req.dataObj.metadata)
  });
});

router.get('/:key/editor', function(req, res, next) {
  request(dmcloud.repo.modelUrl + req.params.key + "/content", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var modelData = JSON.parse(body);
      res.render('model/modelEditor',
      {
        "title": 'Designer of ' + req.dataObj.metadata.name,
        "content": JSON.stringify(modelData.content)
      });
    }else {
      res.sendStatus(404);
    }
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
