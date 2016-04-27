var express = require('express');
var router = express.Router();
var request = require('request');

router.get('', function(req, res, next) {
  var models = [];

  console.log("fetch model list for " + dchub.repo.modelUrl);
  request('http://scnchj:12616/models', function (error, response, body) {
    console.log(body);
  });
  request(dchub.repo.modelUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      models = JSON.parse(body).items
    }else {
      console.log("Failed to fetch job list for " + JSON.stringify(error));
    }
    dchub.render(req, res, 'model/models', { "models": models});
  });
});

router.get('/new', function(req, res, next) {
  dchub.render(req, res, 'model/modelCreator', { modelKey: null });
});

router.all("/:key*", function(req, res, next){
  request(dchub.repo.modelUrl + req.params.key, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      req.dataObj = JSON.parse(body);
      next();
    }else {
      res.sendStatus(404);
    }
  });
});

router.get('/:key', function(req, res, next) {
  dchub.render(req, res, 'model/modelDetailMeta',
  {
    "pageId": "MODEL_META",
    "model": req.dataObj
  });
});

router.get('/:key/meta', function(req, res, next) {
  dchub.render(req, res, 'model/modelMetadataEditor',
  {
    content: JSON.stringify(req.dataObj.metadata)
  });
});

router.get('/:key/editor', function(req, res, next) {
  request(dchub.repo.modelUrl + req.params.key + "/content", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var modelData = JSON.parse(body);
      dchub.render(req, res, 'model/modelEditor',
      {
        "content": JSON.stringify(modelData.content)
      });
    }else {
      res.sendStatus(404);
    }
  });
});

router.get('/:key/archives', function(req, res, next) {
  var url = dchub.repo.archiveUrl + "?modelId=" + req.params.key;
  console.log("Fetch archives for " + url);
  request(url, function (error, response, body) {
    var items = [];
    if (!error && response.statusCode == 200) {
      items = JSON.parse(body);
    }
    dchub.render(req, res, 'model/modelArchives', {
      "pageId": "MODEL_ARCH",
      "model": req.dataObj,
      "items": items
    });
  });
});

module.exports = router;
