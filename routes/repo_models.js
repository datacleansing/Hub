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
  res.render('model/modelCreator', { modelKey: null });
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
  res.render('model/modelDetailMeta',
  {
    "pageId": "MODEL_META",
    "model": req.dataObj
  });
});

router.get('/:key/meta', function(req, res, next) {
  res.render('model/modelMetadataEditor',
  {
    content: JSON.stringify(req.dataObj.metadata)
  });
});

router.get('/:key/editor', function(req, res, next) {
  request(dmcloud.repo.modelUrl + req.params.key + "/content", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var modelData = JSON.parse(body);
      res.render('model/modelEditor',
      {
        "content": JSON.stringify(modelData.content)
      });
    }else {
      res.sendStatus(404);
    }
  });
});

router.get('/:key/archives', function(req, res, next) {
  var url = dmcloud.repo.archiveUrl + "?modelId=" + req.params.key;
  console.log("Fetch archives for " + url);
  request(url, function (error, response, body) {
    var items = [];
    if (!error && response.statusCode == 200) {
      items = JSON.parse(body);
    }
    res.render('model/modelArchives', {
      "pageId": "MODEL_ARCH",
      "model": req.dataObj,
      "items": items
    });
  });
});

module.exports = router;
